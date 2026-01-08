import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { news } from '@/db/schema';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

// GET - Fetch single published news by slug
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const newsItem = await db.query.news.findFirst({
            where: and(
                eq(news.slug, params.slug),
                eq(news.status, 'published'),
                isNotNull(news.publishedAt)
            ),
            with: {
                author: {
                    columns: {
                        id: true,
                        name: true,
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

        // Increment view count
        await db
            .update(news)
            .set({ viewCount: sql`${news.viewCount} + 1` })
            .where(eq(news.id, newsItem.id));

        return NextResponse.json({
            success: true,
            data: {
                ...newsItem,
                viewCount: newsItem.viewCount + 1, // Return incremented count
            },
        });
    } catch (error) {
        console.error('Error fetching news detail:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}
