import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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

        // Generate unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop() || '';
        const fileName = `${timestamp}.${fileExt}`;
        const pathname = `${folder}/${fileName}`;

        // Upload to Vercel Blob
        const blob = await put(pathname, file, {
            access: 'public',
            addRandomSuffix: false,
        });

        console.log(`✓ File uploaded to Blob: ${blob.url}`);

        return NextResponse.json({
            success: true,
            url: blob.url,
            filename: fileName,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
