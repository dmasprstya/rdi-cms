import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth'; // NextAuth v5
import { db } from '@/db';
import { heroImages } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { rateLimit } from '@/lib/rate-limit';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Rate limiter: 10 uploads per minute
const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

// GET: Fetch all hero images
export async function GET() {
    try {
        const images = await db.query.heroImages.findMany({
            where: eq(heroImages.sectionId, 'rdi-hero'),
            orderBy: [asc(heroImages.order)],
        });

        return NextResponse.json({
            success: true,
            data: images
        });
    } catch (error) {
        console.error('[HERO_IMAGES_FETCH_ERROR]', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            { error: 'Failed to fetch images' },
            { status: 500 }
        );
    }
}

// POST: Upload new hero image
export async function POST(request: NextRequest) {
    // Authentication check
    const session = await auth();

    if (!session?.user || !['admin', 'editor'].includes(session.user.role)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Rate limiting
    const identifier = session.user.id;
    try {
        await limiter.check(identifier, 10);
    } catch {
        console.warn('[HERO_UPLOAD_RATE_LIMITED]', {
            userId: identifier,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            { error: 'Too many uploads. Please try again in a minute.' },
            { status: 429 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const altText = formData.get('altText') as string;

        // Validate alt text
        if (!altText || altText.trim().length === 0) {
            return NextResponse.json(
                { error: 'Alt text is required for accessibility' },
                { status: 400 }
            );
        }

        // Validate file exists
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Type validation
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPG, PNG, and WebP allowed.' },
                { status: 400 }
            );
        }

        // Size validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        // Convert to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Get image metadata
        const metadata = await sharp(buffer).metadata();

        // Check current image count (max 5)
        const currentImages = await db.query.heroImages.findMany({
            where: eq(heroImages.sectionId, 'rdi-hero'),
        });

        if (currentImages.length >= 5) {
            return NextResponse.json(
                { error: 'Maximum 5 images allowed. Please delete one before uploading.' },
                { status: 400 }
            );
        }

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'media', 'hero');
        await fs.mkdir(uploadDir, { recursive: true });

        // Compress and resize
        const filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}.webp`;
        const outputPath = path.join(uploadDir, filename);

        await sharp(buffer)
            .resize(1920, 1080, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 85 })
            .toFile(outputPath);

        // Calculate next order
        const maxOrder = currentImages.length > 0
            ? Math.max(...currentImages.map(img => img.order))
            : -1;

        // Insert into database
        const imageUrl = `/media/hero/${filename}`;
        const [newImage] = await db.insert(heroImages).values({
            sectionId: 'rdi-hero',
            imageUrl,
            altText: altText.trim(),
            order: maxOrder + 1
        }).returning();

        // Log successful upload
        console.log('[HERO_UPLOAD_SUCCESS]', {
            userId: session.user.id,
            userEmail: session.user.email,
            filename,
            originalSize: file.size,
            compressedPath: outputPath,
            dimensions: `${metadata.width}x${metadata.height}`,
            imageId: newImage.id,
            timestamp: new Date().toISOString()
        });

        // Revalidate cache
        revalidateTag('hero-images');
        revalidateTag('rdi-content');

        return NextResponse.json({
            success: true,
            data: newImage
        });

    } catch (error) {
        // Log error
        console.error('[HERO_UPLOAD_ERROR]', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            userId: session.user.id,
            userEmail: session.user.email,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            { error: 'Upload failed. Please try again.' },
            { status: 500 }
        );
    }
}

// PUT: Update images order
export async function PUT(request: NextRequest) {
    const session = await auth();

    if (!session?.user || !['admin', 'editor'].includes(session.user.role)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { images } = body as { images: Array<{ id: string; order: number }> };

        if (!images || !Array.isArray(images)) {
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // Update each image's order
        for (const img of images) {
            await db.update(heroImages)
                .set({ order: img.order })
                .where(eq(heroImages.id, img.id));
        }

        console.log('[HERO_IMAGES_REORDER]', {
            userId: session.user.id,
            count: images.length,
            timestamp: new Date().toISOString()
        });

        // Revalidate cache
        revalidateTag('hero-images');
        revalidateTag('rdi-content');

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[HERO_IMAGES_REORDER_ERROR]', {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
