'use server';

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

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

        // Create logos directory if it doesn't exist
        const logosDir = join(process.cwd(), 'public', 'logos');
        if (!existsSync(logosDir)) {
            mkdirSync(logosDir, { recursive: true });
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Use original filename with timestamp to avoid conflicts
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
        const filename = `${timestamp}-${originalName}`;
        const filepath = join(logosDir, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return the public URL
        const publicUrl = `/logos/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
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
