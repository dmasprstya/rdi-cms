import { notFound } from 'next/navigation';
import { db } from '@/db';
import { dropdownMenu } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CheckCircle2 } from 'lucide-react';

interface PageProps {
    params: {
        slug: string;
    };
}

async function getMenuData(slug: string) {
    const menu = await db.query.dropdownMenu.findFirst({
        where: eq(dropdownMenu.slug, slug),
    });

    if (!menu || !menu.isPublished) {
        return null;
    }

    return menu;
}

export default async function PartnershipPage({ params }: PageProps) {
    const { slug } = params;
    const menuData = await getMenuData(slug);

    if (!menuData) {
        notFound();
    }

    const content = menuData.content as {
        heading: string;
        description: string;
        features: string[];
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            {content.heading}
                        </h1>
                        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {content.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            {content.features && content.features.length > 0 && (
                <section className="pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                            Keunggulan Program
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {content.features.filter(f => f).map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-foreground font-medium leading-relaxed">
                                                {feature}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border rounded-2xl p-8 sm:p-12 text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Tertarik dengan Program Ini?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Hubungi kami untuk informasi lebih lanjut mengenai program kemitraan {menuData.title}
                        </p>
                        <a
                            href="/#kontak"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Generate static params for all published menu items
export async function generateStaticParams() {
    try {
        const menus = await db
            .select({ slug: dropdownMenu.slug })
            .from(dropdownMenu)
            .where(eq(dropdownMenu.isPublished, true));

        return menus.map((menu) => ({
            slug: menu.slug,
        }));
    } catch (error) {
        // Table might not exist yet during build
        console.warn('Dropdown menu table not found, skipping static params generation');
        return [];
    }
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps) {
    const { slug } = params;
    const menuData = await getMenuData(slug);

    if (!menuData) {
        return {
            title: 'Not Found',
        };
    }

    const content = menuData.content as {
        heading: string;
        description: string;
    };

    return {
        title: `${content.heading} | STS System`,
        description: content.description,
    };
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;
