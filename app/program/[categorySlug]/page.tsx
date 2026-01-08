import Link from 'next/link';
import { NavbarRDI } from '@/components/rdi/navbar-rdi';
import { FooterRDI } from '@/components/rdi/footer-rdi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/rdi/breadcrumb-nav';
import { ArrowLeft } from 'lucide-react';
import { ProgramItemCard } from '@/components/rdi/program-item-card';
import { getProgramCategory, getProgramItemsByCategory, getProgramsContent } from '@/lib/program-data';
import { notFound } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { Metadata } from 'next';

interface CategoryPageProps {
    params: {
        categorySlug: string;
    };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const category = await getProgramCategory(params.categorySlug);

    if (!category) {
        return {
            title: 'Category Not Found - Rosman Djohan Institute',
        };
    }

    return {
        title: `${category.title} - Rosman Djohan Institute`,
        description: category.description,
        openGraph: {
            title: `${category.title} - Rosman Djohan Institute`,
            description: category.description,
        },
    };
}

export async function generateStaticParams() {
    const content = await getProgramsContent();
    return content.categories.map((category) => ({
        categorySlug: category.slug,
    }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const category = await getProgramCategory(params.categorySlug);

    if (!category) {
        notFound();
    }

    const items = await getProgramItemsByCategory(params.categorySlug);
    const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Briefcase;

    return (
        <main className="min-h-screen bg-background">
            <NavbarRDI />

            <div className="container mx-auto px-4 pt-24 pb-16">
                {/* Back Button */}
                <div className="mb-4 border-b-t pb-4">
                    <Link href="/program">
                        <Button variant="ghost" className="hover:bg-primary/10">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Program
                        </Button>
                    </Link>
                </div>
                {/* Header Section */}
                <section className="mb-16 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">{category.badge}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                        {category.title}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground">
                        {category.description}
                    </p>
                </section>

                {/* Programs Grid */}
                <section className="max-w-6xl mx-auto">
                    {items.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            {items.map((item) => (
                                <ProgramItemCard
                                    key={item.id}
                                    item={item}
                                    category={category}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Belum ada program dalam kategori ini
                            </p>
                            <Button asChild className="mt-6">
                                <a href="/program">Lihat Program Lainnya</a>
                            </Button>
                        </div>
                    )}
                </section>
            </div>

            <FooterRDI />
        </main>
    );
}
