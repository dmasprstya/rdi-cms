import { NextRequest, NextResponse } from "next/server";
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({
                success: false,
                error: 'No file uploaded'
            }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({
                success: false,
                error: 'File must be an image'
            }, { status: 400 });
        }

        // Validate file size (5MB limit for original)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'File size must be less than 5MB'
            }, { status: 400 });
        }

        // Convert to buffer and compress
        const buffer = Buffer.from(await file.arrayBuffer());

        // Compress logo: max 400px, WebP quality 85
        const compressedBuffer = await sharp(buffer)
            .resize(400, 400, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: 85 })
            .toBuffer();

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-').toLowerCase().replace(/\.[^/.]+$/, '');
        const filename = `${timestamp}-${originalName}.webp`;
        const pathname = `logos/${filename}`;

        console.log(`✓ Logo compressed: ${file.size} bytes → ${compressedBuffer.length} bytes (${Math.round((1 - compressedBuffer.length / file.size) * 100)}% reduction)`);

        // Upload to Vercel Blob
        const blob = await put(pathname, compressedBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'image/webp',
        });

        console.log(`✓ Logo uploaded to Blob: ${blob.url}`);

        return NextResponse.json({
            success: true,
            url: blob.url,
            filename: filename,
            originalSize: file.size,
            compressedSize: compressedBuffer.length,
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to upload file'
        }, { status: 500 });
    }
}
