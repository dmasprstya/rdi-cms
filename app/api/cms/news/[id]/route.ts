import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { news, newsImages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { deleteImageFromBlob, isVercelBlobUrl } from '@/lib/blob-cleanup';

// GET - Fetch single news by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const newsItem = await db.query.news.findFirst({
            where: eq(news.id, params.id),
            with: {
                author: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                images: {
                    orderBy: (images, { asc }) => [asc(images.order)],
                },
            },
        });

        if (!newsItem) {
            return NextResponse.json(
                { success: false, error: 'News not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: newsItem,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}

// PUT/PATCH - Update news
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const {
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            status,
            category,
            tags,
            publishedAt,
            images: contentImages,
        } = body;


        // Check if news exists
        const existingNews = await db.query.news.findFirst({
            where: eq(news.id, params.id),
        });

        if (!existingNews) {
            return NextResponse.json(
                { success: false, error: 'News not found' },
                { status: 404 }
            );
        }

        // Check if slug is being changed and if it already exists
        if (slug && slug !== existingNews.slug) {
            const duplicateSlug = await db.query.news.findFirst({
                where: eq(news.slug, slug),
            });

            if (duplicateSlug) {
                return NextResponse.json(
                    { success: false, error: 'Slug already exists' },
                    { status: 400 }
                );
            }
        }

        // Update news
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (title !== undefined) updateData.title = title;
        if (slug !== undefined) updateData.slug = slug;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (content !== undefined) updateData.content = content;
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (status !== undefined) {
            updateData.status = status;
            // Set publishedAt when publishing
            if (status === 'published') {
                // Use provided publishedAt if it's a valid value (not null/undefined)
                // Otherwise use existing publishedAt, or default to now
                if (publishedAt && publishedAt !== null) {
                    // Convert ISO string to Date object if needed
                    updateData.publishedAt = typeof publishedAt === 'string'
                        ? new Date(publishedAt)
                        : publishedAt;
                } else if (existingNews.publishedAt) {
                    updateData.publishedAt = existingNews.publishedAt;
                } else {
                    updateData.publishedAt = new Date();
                }
            } else if (status === 'draft') {
                // When setting back to draft, clear publishedAt to hide from public
                // This ensures draft articles don't appear on the public news page
                updateData.publishedAt = null;
            }
        }
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = tags;

        await db.update(news).set(updateData).where(eq(news.id, params.id));

        // Cleanup old featured image if it was changed
        if (featuredImage !== undefined &&
            existingNews.featuredImage &&
            existingNews.featuredImage !== featuredImage &&
            isVercelBlobUrl(existingNews.featuredImage)) {
            deleteImageFromBlob(existingNews.featuredImage)
                .then(deleted => {
                    if (deleted) {
                        console.log('[NEWS_CLEANUP] Deleted old featured image:', existingNews.featuredImage);
                    }
                })
                .catch(err => console.error('[NEWS_CLEANUP] Failed:', err));
        }

        // Update content images if provided
        if (contentImages !== undefined && Array.isArray(contentImages)) {
            // Get existing images before deleting
            const existingImages = await db.query.newsImages.findMany({
                where: eq(newsImages.newsId, params.id),
            });

            // Delete existing images from database
            await db.delete(newsImages).where(eq(newsImages.newsId, params.id));

            // Cleanup old content images from blob storage
            const newImageUrls = new Set(contentImages.map((img: any) => img.imageUrl));
            for (const oldImg of existingImages) {
                if (!newImageUrls.has(oldImg.imageUrl) && isVercelBlobUrl(oldImg.imageUrl)) {
                    deleteImageFromBlob(oldImg.imageUrl)
                        .then(deleted => {
                            if (deleted) {
                                console.log('[NEWS_CLEANUP] Deleted old content image:', oldImg.imageUrl);
                            }
                        })
                        .catch(err => console.error('[NEWS_CLEANUP] Failed:', err));
                }
            }

            // Insert new images
            if (contentImages.length > 0) {
                const imageValues = contentImages.map((img: any, index: number) => ({
                    newsId: params.id,
                    imageUrl: img.imageUrl,
                    caption: img.caption || null,
                    order: img.order ?? index,
                }));

                await db.insert(newsImages).values(imageValues);
            }
        }

        // Fetch updated news with relations
        const updatedNews = await db.query.news.findFirst({
            where: eq(news.id, params.id),
            with: {
                author: true,
                images: {
                    orderBy: (images, { asc }) => [asc(images.order)],
                },
            },
        });

        // Revalidate news pages to clear cache
        // Wrap in try-catch to prevent revalidation errors from breaking the update
        try {
            // Invalidate unstable_cache for landing page news
            const { revalidateTag } = await import('next/cache');
            revalidateTag('landing-latest-news'); // Used in getLatestNewsForLanding
            revalidateTag('news-content');

            revalidatePath('/', 'page'); // Landing page Latest News section
            revalidatePath('/berita');
            revalidatePath('/api/news');
            // Also revalidate the specific news detail page
            if (updatedNews) {
                revalidatePath(`/berita/${updatedNews.slug}`);
            }
        } catch (revalidationError) {
            // Log but don't fail the request
            console.error('Cache revalidation error:', revalidationError);
        }

        return NextResponse.json({
            success: true,
            data: updatedNews,
            message: 'News updated successfully',
        });
    } catch (error) {
        console.error('Error updating news:', error);
        console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return NextResponse.json(
            { success: false, error: 'Failed to update news' },
            { status: 500 }
        );
    }
}

// DELETE - Delete news
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if news exists
        const existingNews = await db.query.news.findFirst({
            where: eq(news.id, params.id),
        });

        if (!existingNews) {
            return NextResponse.json(
                { success: false, error: 'News not found' },
                { status: 404 }
            );
        }

        // Get all images before deleting for blob cleanup
        const imagesToDelete = await db.query.newsImages.findMany({
            where: eq(newsImages.newsId, params.id),
        });

        // Delete news (cascade will delete related images from DB)
        await db.delete(news).where(eq(news.id, params.id));

        // Cleanup blob storage for all images
        // Featured image
        if (existingNews.featuredImage && isVercelBlobUrl(existingNews.featuredImage)) {
            deleteImageFromBlob(existingNews.featuredImage)
                .catch(err => console.error('[NEWS_DELETE_CLEANUP] Failed:', err));
        }
        // Content images
        for (const img of imagesToDelete) {
            if (isVercelBlobUrl(img.imageUrl)) {
                deleteImageFromBlob(img.imageUrl)
                    .catch(err => console.error('[NEWS_DELETE_CLEANUP] Failed:', err));
            }
        }

        // Revalidate news pages to clear cache
        // Wrap in try-catch to prevent revalidation errors from breaking the delete
        try {
            // Invalidate unstable_cache for landing page news
            const { revalidateTag } = await import('next/cache');
            revalidateTag('landing-latest-news'); // Used in getLatestNewsForLanding
            revalidateTag('news-content');

            revalidatePath('/', 'page'); // Landing page Latest News section
            revalidatePath('/berita');
            revalidatePath('/api/news');
            // Also revalidate the specific news detail page
            revalidatePath(`/berita/${existingNews.slug}`);
        } catch (revalidationError) {
            console.error('Cache revalidation error:', revalidationError);
        }

        return NextResponse.json({
            success: true,
            message: 'News deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting news:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete news' },
            { status: 500 }
        );
    }
}
