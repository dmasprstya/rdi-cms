import Link from 'next/link';
import { NavbarRDI } from '@/components/rdi/navbar-rdi';
import { FooterRDI } from '@/components/rdi/footer-rdi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { getProgramsContent } from '@/lib/program-data';
import { ProgramTabsClient } from './program-tabs-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Program Kami - Rosman Djohan Institute',
    description: 'Pilih program pelatihan kerja, pelatihan motivasi, atau beasiswa kuliah yang sesuai untuk mengembangkan karir dan kompetensi Anda',
    openGraph: {
        title: 'Program Kami - Rosman Djohan Institute',
        description: 'Pilih program pelatihan kerja, pelatihan motivasi, atau beasiswa kuliah yang sesuai untuk mengembangkan karir dan kompetensi Anda',
    },
};

// Use ISR (Incremental Static Regeneration) - cache for 5 minutes like homepage
export const revalidate = 300; // 5 minutes

export default async function ProgramPage() {
    const content = await getProgramsContent();
    const sortedCategories = [...content.categories].sort((a, b) => a.order - b.order);

    return (
        <main className="min-h-screen bg-background">
            <NavbarRDI />

            {/* Header Section */}
            <section className="pt-24 pb-12 md:pb-16 bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
                <div className="container mx-auto px-4">
                    <div className="border-b mb-14">
                        <Link href="/">
                            <Button variant="ghost" className="hover:bg-primary/10">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                        <div className="text-center space-y-4 md:space-y-6">
                            <Badge className="mb-2 md:mb-4" variant="outline">
                                <Briefcase className="w-4 h-4 mr-2" />
                                Program Kami
                            </Badge>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                                Pilih Program yang Sesuai untuk Anda
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                                Rosman Djohan Institute menawarkan berbagai program pelatihan dan pendidikan untuk mengembangkan karir dan kompetensi Anda
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {content.categories.length > 0 ? (
                            <ProgramTabsClient
                                categories={sortedCategories}
                                items={content.items}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    Program sedang dalam persiapan
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <FooterRDI />
        </main>
    );
}
