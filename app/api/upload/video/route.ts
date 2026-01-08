import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Video upload endpoint
export async function POST(request: NextRequest) {
    try {
        // Authentication check
        const session = await auth();

        if (!session?.user || !['admin', 'editor'].includes(session.user.role)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({
                error: 'No file uploaded'
            }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('video/')) {
            return NextResponse.json({
                error: 'File must be a video (MP4, WebM)'
            }, { status: 400 });
        }

        // Validate file size (50MB limit for videos)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File size must be less than 50MB'
            }, { status: 400 });
        }

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'videos');
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const ext = file.name.split('.').pop() || 'mp4';
        const filename = `hero-${timestamp}.${ext}`;
        const filepath = join(uploadDir, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return the public URL
        const publicUrl = `/videos/${filename}`;

        console.log('[VIDEO_UPLOAD_SUCCESS]', {
            userId: session.user.id,
            filename,
            size: file.size,
            type: file.type,
            url: publicUrl,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename
        });

    } catch (error) {
        console.error('[VIDEO_UPLOAD_ERROR]', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({
            error: 'Failed to upload video'
        }, { status: 500 });
    }
}
