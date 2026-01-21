import { NextRequest, NextResponse } from "next/server";
import { put } from '@vercel/blob';
import sharp from 'sharp';

// Type mapping for upload directories (used as prefixes in blob storage)
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

// Compression settings based on upload type
const COMPRESSION_SETTINGS = {
    logo: { maxWidth: 400, maxHeight: 400, quality: 85 },
    hero: { maxWidth: 1920, maxHeight: 1080, quality: 82 },
    pillar: { maxWidth: 800, maxHeight: 800, quality: 80 },
    founder: { maxWidth: 600, maxHeight: 600, quality: 80 },
    program: { maxWidth: 1280, maxHeight: 720, quality: 80 },
    news: { maxWidth: 1280, maxHeight: 720, quality: 80 },
    newsContent: { maxWidth: 1280, maxHeight: 1280, quality: 80 },
} as const;

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

        // Validate file size (10MB limit for original, will be compressed)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'File size must be less than 10MB'
            }, { status: 400 });
        }

        // Generate unique filename with path prefix
        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-').toLowerCase().replace(/\.[^/.]+$/, '');

        let uploadBuffer: Buffer;
        let filename: string;
        let contentType: string;

        if (isImage) {
            // Compress image using sharp
            const buffer = Buffer.from(await file.arrayBuffer());
            const settings = COMPRESSION_SETTINGS[uploadType] || COMPRESSION_SETTINGS.news;

            uploadBuffer = await sharp(buffer)
                .resize(settings.maxWidth, settings.maxHeight, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: settings.quality })
                .toBuffer();

            filename = `${timestamp}-${originalName}.webp`;
            contentType = 'image/webp';

            console.log(`✓ Image compressed: ${file.size} bytes → ${uploadBuffer.length} bytes (${Math.round((1 - uploadBuffer.length / file.size) * 100)}% reduction)`);
        } else {
            // Video: no compression, upload as-is
            uploadBuffer = Buffer.from(await file.arrayBuffer());
            const ext = file.name.split('.').pop() || 'mp4';
            filename = `${timestamp}-${originalName}.${ext}`;
            contentType = file.type;
        }

        const pathname = `${UPLOAD_DIRS[uploadType]}/${filename}`;

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
            filename: filename,
            type: isVideo ? 'video' : 'image',
            originalSize: file.size,
            compressedSize: uploadBuffer.length,
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to upload file'
        }, { status: 500 });
    }
}
