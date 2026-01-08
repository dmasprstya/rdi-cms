import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { news } from '@/db/schema';
import { eq, desc, like, and, sql, isNotNull } from 'drizzle-orm';

// GET - Fetch published news for public (with pagination and filters)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '9');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const offset = (page - 1) * limit;

        // Build where conditions - only published news
        const conditions = [
            eq(news.status, 'published'),
            isNotNull(news.publishedAt),
        ];

        if (category) {
            conditions.push(eq(news.category, category));
        }

        if (search) {
            conditions.push(
                like(news.title, `%${search}%`)
            );
        }

        const whereClause = and(...conditions);

        // Fetch published news with pagination
        const newsItems = await db.query.news.findMany({
            where: whereClause,
            orderBy: [desc(news.publishedAt)],
            limit,
            offset,
            with: {
                author: {
                    columns: {
                        id: true,
                        name: true,
                    },
                },
            },
            columns: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                featuredImage: true,
                publishedAt: true,
                category: true,
                tags: true,
                viewCount: true,
            },
        });

        // Get total count for pagination
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(news)
            .where(whereClause);
        const total = Number(totalResult[0]?.count || 0);

        // Get all categories for filter
        const categoriesResult = await db
            .selectDistinct({ category: news.category })
            .from(news)
            .where(and(eq(news.status, 'published'), isNotNull(news.category)));

        const categories = categoriesResult
            .map((r) => r.category)
            .filter((c): c is string => c !== null);

        return NextResponse.json({
            success: true,
            data: {
                items: newsItems,
                categories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error fetching public news:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}
