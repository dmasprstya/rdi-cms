'use server';

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Type mapping for upload directories
const UPLOAD_DIRS = {
    logo: 'logos',
    hero: 'media/hero',
    pillar: 'media/pillars',
    founder: 'media/founders',
    program: 'media/programs',
    news: 'media/news',
    newsContent: 'media/news/content',
} as const;

type UploadType = keyof typeof UPLOAD_DIRS;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const uploadType = (new URL(request.url).searchParams.get('type') || 'logo') as UploadType;

        if (!file) {
            return NextResponse.json({
                success: false,
                error: 'No file uploaded'
            }, { status: 400 });
        }

        // Validate upload type
        if (!UPLOAD_DIRS[uploadType]) {
            return NextResponse.json({
                success: false,
                error: 'Invalid upload type'
            }, { status: 400 });
        }

        // Validate file type - support images and videos
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        if (!isImage && !isVideo) {
            return NextResponse.json({
                success: false,
                error: 'File must be an image or video'
            }, { status: 400 });
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'File size must be less than 5MB'
            }, { status: 400 });
        }

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', UPLOAD_DIRS[uploadType]);
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Use original filename with timestamp to avoid conflicts
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
        const filename = `${timestamp}-${originalName}`;
        const filepath = join(uploadDir, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return the public URL
        const publicUrl = `/${UPLOAD_DIRS[uploadType]}/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: filename,
            type: isVideo ? 'video' : 'image'
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to upload file'
        }, { status: 500 });
    }
}
