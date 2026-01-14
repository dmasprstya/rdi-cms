import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { put } from '@vercel/blob';
import {
    validatePDFBuffer,
} from '@/lib/file-utils';

// Rate limiting storage (in-memory)
// For production with multiple instances, use Redis
const uploadLimits = new Map<string, { count: number; resetAt: Date }>();

function checkRateLimit(userId: string): boolean {
    const now = new Date();
    const limit = uploadLimits.get(userId);

    if (!limit || now > limit.resetAt) {
        // Reset or create new limit
        uploadLimits.set(userId, {
            count: 1,
            resetAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
        });
        return true;
    }

    if (limit.count >= 10) {
        return false; // Rate limit exceeded
    }

    limit.count++;
    return true;
}

export async function POST(req: NextRequest) {
    try {
        // 1. Authentication check
        const session = await auth();
        if (!session || session.user.role !== 'guru') {
            return NextResponse.json(
                { error: 'Unauthorized', code: 'UNAUTHORIZED' },
                { status: 401 }
            );
        }

        // 2. Rate limiting check
        if (!checkRateLimit(session.user.id)) {
            return NextResponse.json(
                {
                    error: 'Terlalu banyak upload. Maksimal 10 file per jam.',
                    code: 'RATE_LIMIT_EXCEEDED',
                },
                { status: 429 }
            );
        }

        // 3. Get file from form data
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'File tidak ditemukan', code: 'NO_FILE' },
                { status: 400 }
            );
        }

        // 4. Validate file type (extension)
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            return NextResponse.json(
                { error: 'Hanya file PDF yang diperbolehkan', code: 'INVALID_TYPE' },
                { status: 400 }
            );
        }

        // 5. Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File terlalu besar (maksimal 10MB)', code: 'FILE_TOO_LARGE' },
                { status: 413 }
            );
        }

        // 6. Validate MIME type
        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Tipe file tidak valid', code: 'INVALID_TYPE' },
                { status: 400 }
            );
        }

        // 7. Validate PDF file signature (magic bytes)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isPDF = await validatePDFBuffer(buffer);
        if (!isPDF) {
            return NextResponse.json(
                {
                    error: 'File bukan PDF yang valid',
                    code: 'INVALID_TYPE',
                },
                { status: 400 }
            );
        }

        // 8. Generate unique filename
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/\s+/g, '-').toLowerCase();
        const uniqueFilename = `${timestamp}-${session.user.id}-${sanitizedName}`;
        const pathname = `uploads/modules/${uniqueFilename}`;

        // 9. Upload to Vercel Blob
        const blob = await put(pathname, file, {
            access: 'public',
            addRandomSuffix: false,
        });

        console.log(`✓ PDF uploaded to Blob: ${blob.url} (${file.size} bytes)`);

        // 10. Return file metadata
        return NextResponse.json(
            {
                fileUrl: blob.url,
                fileName: file.name,
                fileSize: file.size,
                message: 'File berhasil diupload',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Gagal mengupload file', code: 'UPLOAD_FAILED' },
            { status: 500 }
        );
    }
}
