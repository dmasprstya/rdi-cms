import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { news, newsImages } from '@/db/schema';
import { eq, desc, like, and, or, sql } from 'drizzle-orm';

// GET - Fetch all news for CMS (with filters and pagination)
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Only editors can access CMS news endpoint
        if (!session || session.user.role !== 'editor') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status'); // 'draft' | 'published' | null (all)
        const search = searchParams.get('search');
        const offset = (page - 1) * limit;

        // Build where conditions
        const conditions = [];
        if (status) {
            conditions.push(eq(news.status, status));
        }
        if (search) {
            conditions.push(
                or(
                    like(news.title, `%${search}%`),
                    like(news.excerpt, `%${search}%`)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Fetch news with pagination
        const newsItems = await db.query.news.findMany({
            where: whereClause,
            orderBy: [desc(news.createdAt)],
            limit,
            offset,
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

        // Get total count for pagination
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(news)
            .where(whereClause);
        const total = Number(totalResult[0]?.count || 0);

        return NextResponse.json({
            success: true,
            data: {
                items: newsItems,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}

// POST - Create new news
export async function POST(request: NextRequest) {
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

        // Validate required fields
        if (!title || !slug || !excerpt || !content || !featuredImage) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: title, slug, excerpt, content, featuredImage',
                },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existingNews = await db.query.news.findFirst({
            where: eq(news.slug, slug),
        });

        if (existingNews) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 400 }
            );
        }

        // Create news
        const [newNews] = await db
            .insert(news)
            .values({
                title,
                slug,
                excerpt,
                content,
                featuredImage,
                status: status || 'draft',
                category: category || null,
                tags: tags || null,
                publishedAt: status === 'published' ? publishedAt || new Date() : null,
                authorId: session.user.id,
            })
            .returning();

        // Create content images if provided
        if (contentImages && Array.isArray(contentImages) && contentImages.length > 0) {
            const imageValues = contentImages.map((img: any, index: number) => ({
                newsId: newNews.id,
                imageUrl: img.imageUrl,
                caption: img.caption || null,
                order: img.order ?? index,
            }));

            await db.insert(newsImages).values(imageValues);
        }

        // Fetch complete news with relations
        const completeNews = await db.query.news.findFirst({
            where: eq(news.id, newNews.id),
            with: {
                author: true,
                images: {
                    orderBy: (images, { asc }) => [asc(images.order)],
                },
            },
        });


        // Revalidate news pages to clear cache
        // Wrap in try-catch to prevent revalidation errors from breaking the create
        try {
            // Invalidate unstable_cache for landing page news
            const { revalidateTag } = await import('next/cache');
            revalidateTag('landing-latest-news'); // Used in getLatestNewsForLanding
            revalidateTag('news-content');

            revalidatePath('/', 'page'); // Landing page Latest News section
            revalidatePath('/berita');
            revalidatePath('/api/news');
        } catch (revalidationError) {
            console.error('Cache revalidation error:', revalidationError);
        }


        return NextResponse.json({
            success: true,
            data: completeNews,
            message: 'News created successfully',
        });
    } catch (error) {
        console.error('Error creating news:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create news' },
            { status: 500 }
        );
    }
}
