import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file size (10MB limit for original)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'File size must be less than 10MB' },
                { status: 400 }
            );
        }

        const timestamp = Date.now();
        const isImage = file.type.startsWith('image/');

        let uploadBuffer: Buffer;
        let fileName: string;
        let contentType: string;

        if (isImage) {
            // Compress image: max 1280px, WebP quality 80
            const buffer = Buffer.from(await file.arrayBuffer());
            uploadBuffer = await sharp(buffer)
                .resize(1280, 1280, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: 80 })
                .toBuffer();

            const originalName = file.name.replace(/\s+/g, '-').toLowerCase().replace(/\.[^/.]+$/, '');
            fileName = `${timestamp}-${originalName}.webp`;
            contentType = 'image/webp';

            console.log(`✓ Image compressed: ${file.size} bytes → ${uploadBuffer.length} bytes (${Math.round((1 - uploadBuffer.length / file.size) * 100)}% reduction)`);
        } else {
            // Non-image files: upload as-is
            uploadBuffer = Buffer.from(await file.arrayBuffer());
            const fileExt = file.name.split('.').pop() || '';
            fileName = `${timestamp}.${fileExt}`;
            contentType = file.type;
        }

        const pathname = `${folder}/${fileName}`;

        // Upload to Vercel Blob
        const blob = await put(pathname, uploadBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType,
        });

        console.log(`✓ File uploaded to Blob: ${blob.url}`);

        return NextResponse.json({
            success: true,
            url: blob.url,
            filename: fileName,
            originalSize: file.size,
            compressedSize: uploadBuffer.length,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
