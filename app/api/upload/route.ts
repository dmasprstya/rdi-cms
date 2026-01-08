import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const fileExt = path.extname(file.name);
        const fileName = `${timestamp}${fileExt}`;

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', folder);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        // Return public URL
        const publicUrl = `/${folder}/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
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
