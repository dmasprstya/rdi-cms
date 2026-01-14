import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth'; // NextAuth v5
import { db } from '@/db';
import { heroImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { del } from '@vercel/blob';

// DELETE: Remove hero image
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await auth();

    if (!session?.user || !['admin', 'editor'].includes(session.user.role)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { id } = params;

        // Get image info before deleting
        const image = await db.query.heroImages.findFirst({
            where: eq(heroImages.id, id),
        });

        if (!image) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        // Delete from database
        await db.delete(heroImages).where(eq(heroImages.id, id));

        // Delete file from Blob Storage
        try {
            await del(image.imageUrl);
        } catch (fileError) {
            console.warn('[HERO_IMAGE_BLOB_DELETE_WARNING]', {
                message: 'Blob delete failed but database record removed',
                imageUrl: image.imageUrl,
                error: fileError instanceof Error ? fileError.message : 'Unknown error'
            });
        }

        console.log('[HERO_IMAGE_DELETE_SUCCESS]', {
            userId: session.user.id,
            imageId: id,
            imageUrl: image.imageUrl,
            timestamp: new Date().toISOString()
        });

        // Revalidate cache
        revalidateTag('hero-images');
        revalidateTag('rdi-content');

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[HERO_IMAGE_DELETE_ERROR]', {
            error: error instanceof Error ? error.message : 'Unknown error',
            imageId: params.id,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
