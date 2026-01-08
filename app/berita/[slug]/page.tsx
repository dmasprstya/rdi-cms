import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, User, Eye, ArrowLeft, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NavbarRDI } from '@/components/rdi/navbar-rdi';

interface NewsImage {
    id: string;
    imageUrl: string;
    caption: string | null;
    order: number;
}

interface NewsDetail {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    publishedAt: string;
    category?: string;
    tags?: string[];
    viewCount: number;
    author: {
        id: string;
        name: string;
    };
    images: NewsImage[];
}

async function getNewsDetail(slug: string): Promise<NewsDetail | null> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/news/${slug}`,
        {
            next: { revalidate: 60 }, // Revalidate every minute
        }
    );

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch news');
    }

    const data = await res.json();
    return data.success ? data.data : null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const news = await getNewsDetail(params.slug);

    if (!news) {
        return {
            title: 'Berita Tidak Ditemukan',
        };
    }

    return {
        title: `${news.title} | Berita`,
        description: news.excerpt,
        openGraph: {
            title: news.title,
            description: news.excerpt,
            images: [news.featuredImage],
            type: 'article',
            publishedTime: news.publishedAt,
            authors: [news.author.name],
        },
    };
}

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
    const news = await getNewsDetail(params.slug);

    if (!news) {
        notFound();
    }

    return (
        <>
            <NavbarRDI />
            <div className="min-h-screen">
                {/* Article */}
                <article className="container mx-auto px-4 py-12 max-w-4xl">
                    <div className="pt-8 border-b pb-4">
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar Berita
                        </Link>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 mt-6">{news.title}</h1>

                     {/* Category Badge */}
                    {news.category && (
                        <div className="flex items-center gap-2 mb-4 mt-4">
                            <Tag className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">{news.category}</span>
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{news.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{format(new Date(news.publishedAt), 'dd MMMM yyyy', { locale: id })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{news.viewCount} views</span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden mb-8">
                        <Image
                            src={news.featuredImage}
                            alt={news.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 1024px"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="text-lg text-muted-foreground italic mb-8 pb-8 border-b">
                        {news.excerpt}
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-img:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    {/* Content Images Gallery */}
                    {news.images && news.images.length > 0 && (
                        <div className="mt-12 space-y-4">
                            <h3 className="text-2xl font-bold">Galeri Foto</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {news.images.map((img) => (
                                    <div key={img.id} className="space-y-2">
                                        <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                                            <Image
                                                src={img.imageUrl}
                                                alt={img.caption || 'Gallery image'}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                        {img.caption && (
                                            <p className="text-sm text-muted-foreground text-center italic">
                                                {img.caption}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {news.tags && news.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm font-medium">Tags:</span>
                                {news.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </>
    );
}
