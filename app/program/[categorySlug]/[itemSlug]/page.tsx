import Link from 'next/link';
import { NavbarRDI } from '@/components/rdi/navbar-rdi';
import { FooterRDI } from '@/components/rdi/footer-rdi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BreadcrumbNav } from '@/components/rdi/breadcrumb-nav';
import { CheckCircle, Clock, Award, Users, DollarSign, ArrowLeft, Download } from 'lucide-react';
import {
    getProgramCategory,
    getProgramItem,
    getProgramsContent,
    getProgramItemsByCategory,
} from '@/lib/program-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';

interface ItemPageProps {
    params: {
        categorySlug: string;
        itemSlug: string;
    };
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
    const item = await getProgramItem(params.categorySlug, params.itemSlug);
    const category = await getProgramCategory(params.categorySlug);

    if (!item || !category) {
        return {
            title: 'Program Not Found - Rosman Djohan Institute',
        };
    }

    return {
        title: `${item.title} - ${category.title} | Rosman Djohan Institute`,
        description: item.shortDescription,
        openGraph: {
            title: `${item.title} - ${category.title} | Rosman Djohan Institute`,
            description: item.shortDescription,
            images: [item.featuredImage],
        },
    };
}

export async function generateStaticParams() {
    const content = await getProgramsContent();
    const params: { categorySlug: string; itemSlug: string }[] = [];

    for (const category of content.categories) {
        const items = await getProgramItemsByCategory(category.slug);
        for (const item of items) {
            params.push({
                categorySlug: category.slug,
                itemSlug: item.slug,
            });
        }
    }

    return params;
}

export default async function ItemPage({ params }: ItemPageProps) {
    const item = await getProgramItem(params.categorySlug, params.itemSlug);
    const category = await getProgramCategory(params.categorySlug);

    if (!item || !category) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background">
            <NavbarRDI />

            <div className="container mx-auto px-4 pt-24 pb-16">
                {/* Back Button */}
                <div className="mb-4 border-b pb-4">
                    <Link href={`/program/${category.slug}`}>
                        <Button variant="ghost" className="hover:bg-primary/10">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke {category.title}
                        </Button>
                    </Link>
                </div>
                {/* Header Section with Featured Image */}
                <section className="mb-12 max-w-6xl mx-auto">
                    <Card className="overflow-hidden border-2">
                        {/* Featured Image */}
                        <div
                            className="relative h-64 md:h-96 overflow-hidden"
                            style={{
                                background: `linear-gradient(to bottom right, var(--${category.gradientFrom}), var(--${category.gradientTo}))`
                            }}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${item.featuredImage}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* Badge */}
                            <div className="absolute top-6 left-6">
                                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                                    {category.badge}
                                </Badge>
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                                    {item.title}
                                </h1>
                                <p className="text-lg md:text-xl text-white/90">
                                    {item.shortDescription}
                                </p>
                            </div>
                        </div>

                        <CardContent className="p-6 md:p-8">
                            {/* Full Description */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-foreground mb-4">Tentang Program</h2>
                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                    {item.fullDescription}
                                </p>
                            </div>

                            {/* Key Features */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                    <CheckCircle className="w-6 h-6 text-primary mr-2" />
                                    Keunggulan Program
                                </h2>
                                <ul className="grid md:grid-cols-2 gap-4">
                                    {item.keyFeatures.map((feature, idx) => (
                                        <li key={idx} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-sm md:text-base text-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Metadata */}
                            {item.metadata && (
                                <div className="mb-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {item.metadata.duration && (
                                        <div className="p-4 bg-blue-500/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    Durasi
                                                </span>
                                            </div>
                                            <p className="text-foreground font-medium">{item.metadata.duration}</p>
                                        </div>
                                    )}

                                    {item.metadata.certification && (
                                        <div className="p-4 bg-green-500/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                    Sertifikasi
                                                </span>
                                            </div>
                                            <p className="text-foreground font-medium text-sm">{item.metadata.certification}</p>
                                        </div>
                                    )}

                                    {item.metadata.salary && (
                                        <div className="p-4 bg-yellow-500/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                                    Gaji/Kompensasi
                                                </span>
                                            </div>
                                            <p className="text-foreground font-medium text-sm">{item.metadata.salary}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Requirements */}
                            {item.metadata?.requirements && item.metadata.requirements.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <Users className="w-6 h-6 text-primary mr-2" />
                                        Persyaratan
                                    </h2>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {item.metadata.requirements.map((req, idx) => (
                                            <li key={idx} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                                                <span className="text-sm md:text-base text-muted-foreground">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Benefits */}
                            {item.metadata?.benefits && item.metadata.benefits.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
                                        <Award className="w-6 h-6 text-primary mr-2" />
                                        Benefit & Fasilitas
                                    </h2>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {item.metadata.benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-sm md:text-base text-muted-foreground">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="pt-6 border-t">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
                                        <a href={item.ctaButtonLinkDetail || item.ctaButtonLink} target={item.ctaButtonLinkDetail?.startsWith('http') ? '_blank' : undefined} rel={item.ctaButtonLinkDetail?.startsWith('http') ? 'noopener noreferrer' : undefined}>
                                            {item.ctaButtonTextDetail || item.ctaButtonText}
                                        </a>
                                    </Button>

                                    {/* Download Button - only show if enabled and has URL */}
                                    {item.downloadButton?.enabled && item.downloadButton?.fileUrl && (
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                                            asChild
                                        >
                                            <a
                                                href={item.downloadButton.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                {item.downloadButton.label || 'Download File'}
                                            </a>
                                        </Button>
                                    )}

                                    <Button size="lg" variant="outline" asChild>
                                        <a href={`/program/${category.slug}`}>
                                            Lihat Program Lainnya
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>

            <FooterRDI />
        </main>
    );
}
