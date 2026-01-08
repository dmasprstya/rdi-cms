import { Suspense } from 'react';
import Link from 'next/link';
import { NavbarRDI } from '@/components/rdi/navbar-rdi';
import { Card, CardContent } from '@/components/ui/card';
import { NewsCard } from './news-card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import { news } from '@/db/schema';
import { eq, desc, and, isNotNull } from 'drizzle-orm';


// Use ISR (Incremental Static Regeneration) instead of force-dynamic for better performance
// Pages are pre-generated and revalidated every 60 seconds
export const revalidate = 60; // Revalidate every 60 seconds

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    publishedAt: Date | null;
    category: string | null;
    tags: string[] | null;
    viewCount: number;
    author: {
        id: string;
        name: string;
    } | null;
}

// Direct database query - only runs at runtime, not during build
async function getNews(page: number = 1, category?: string) {
    // During build, return empty data
    if (!process.env.DATABASE_URL) {
        return {
            success: true,
            data: {
                items: [],
                pagination: { totalPages: 0 },
            },
        };
    }

    try {
        const limit = 9;
        const offset = (page - 1) * limit;

        // Build where conditions - only published news
        const conditions = [
            eq(news.status, 'published'),
            isNotNull(news.publishedAt),
        ];

        if (category) {
            conditions.push(eq(news.category, category));
        }

        const whereClause = and(...conditions);

        // Fetch published news with pagination directly from database
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

        return {
            success: true,
            data: {
                items: newsItems,
                pagination: {
                    totalPages: 1, // Simplified for now
                },
            },
        };
    } catch (error) {
        console.error('Error fetching news:', error);
        return {
            success: false,
            data: {
                items: [],
                pagination: { totalPages: 0 },
            },
        };
    }
}

function NewsGridSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <div className="w-full aspect-video bg-muted animate-pulse" />
                    <CardContent className="p-6 space-y-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-20" />
                        <div className="space-y-2">
                            <div className="h-6 bg-muted rounded animate-pulse" />
                            <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                        </div>
                        <div className="h-4 bg-muted rounded animate-pulse w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

async function NewsGrid() {
    const data = await getNews();

    if (!data.success || data.data.items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Belum ada berita yang dipublish.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.data.items.map((news: NewsItem) => (
                    <NewsCard key={news.id} news={news} />
                ))}
            </div>

            {/* TODO: Implement pagination */}
            {data.data.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <p className="text-sm text-muted-foreground">
                        Halaman 1 dari {data.data.pagination.totalPages}
                    </p>
                </div>
            )}
        </>
    );
}

export default function BeritaPage() {
    return (
        <>
            <NavbarRDI />
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl ml-4">
                            <Link href="/">
                                <Button variant="ghost" className="mb-6 -ml-2 hover:bg-primary/10">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Beranda
                                </Button>
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Berita & Kegiatan</h1>
                            <p className="text-lg text-muted-foreground">
                                Ikuti berita terbaru dan kegiatan kami
                            </p>
                        </div>
                    </div>
                </section>

                {/* News Grid */}
                <section className="container mx-auto px-4 py-12 md:py-5">
                    <Suspense fallback={<NewsGridSkeleton />}>
                        <NewsGrid />
                    </Suspense>
                </section>
            </div>
        </>
    );
}