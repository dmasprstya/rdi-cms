import { NextRequest, NextResponse } from "next/server";
import { put } from '@vercel/blob';

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

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
        const filename = `${timestamp}-${originalName}`;
        const pathname = `logos/${filename}`;

        // Upload to Vercel Blob
        const blob = await put(pathname, file, {
            access: 'public',
            addRandomSuffix: false,
        });

        console.log(`✓ Logo uploaded to Blob: ${blob.url}`);

        return NextResponse.json({
            success: true,
            url: blob.url,
            filename: filename
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to upload file'
        }, { status: 500 });
    }
}
