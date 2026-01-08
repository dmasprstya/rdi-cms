'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Tag, ArrowRight } from 'lucide-react';

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

export const NewsCard = memo(function NewsCard({ news }: { news: NewsItem }) {
    return (
        <Link href={`/berita/${news.slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group ml-4">
                {/* Featured Image */}
                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                    <Image
                        src={news.featuredImage}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect width="400" height="225" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>

                <CardContent className="p-6 space-y-3">
                    {/* Category Badge */}
                    {news.category && (
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-primary font-medium">{news.category}</span>
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground line-clamp-3">{news.excerpt}</p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{news.publishedAt ? format(news.publishedAt, 'dd MMM yyyy', { locale: id }) : 'N/A'}</span>
                        </div>
                        <span>•</span>
                        <span>{news.viewCount} views</span>
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center gap-2 text-primary font-medium pt-2">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
});
