'use client';

import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeroContent {
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
}

interface HeroSectionProps {
    content?: HeroContent;
}

interface LogoContent {
    logoText: string;
    logoSubText: string;
    useIcon: boolean;
    customImageUrl?: string;
}

const defaultContent: HeroContent = {
    title: 'Sistem Terintegrasi',
    subtitle: 'Sekolah Modern',
    description: 'Solusi digital terpadu untuk meningkatkan efisiensi manajemen sekolah. Kelola data akademik, siswa, dan staff dengan mudah dalam satu platform.',
    ctaPrimary: 'Hubungi Kami',
    ctaSecondary: 'Pelajari Lebih Lanjut',
};

export function HeroSection({ content }: HeroSectionProps) {
    const data = content || defaultContent;
    const [logoData, setLogoData] = useState<LogoContent>({
        logoText: 'STS',
        logoSubText: 'System',
        useIcon: true,
        customImageUrl: '',
    });

    useEffect(() => {
        // Fetch logo data
        fetch('/api/cms?section=logo')
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    setLogoData(data.data.content as LogoContent);
                }
            })
            .catch((error) => console.error('Error fetching logo:', error));
    }, []);

    return (
        <section id="beranda" className="relative overflow-hidden pt-16">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="text-center space-y-8 relative">
                    <div className="inline-flex items-center justify-center p-3 bg-yellow-400/10 rounded-full mb-4">
                        {logoData.useIcon ? (
                            <GraduationCap className="w-12 h-12 text-yellow-400" />
                        ) : logoData.customImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logoData.customImageUrl}
                                alt="Company Logo"
                                className="w-12 h-12 object-contain"
                            />
                        ) : (
                            <GraduationCap className="w-12 h-12 text-yellow-400" />
                        )}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground">
                        {data.title}
                        <span className="block text-primary mt-2">{data.subtitle}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {data.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link href="#kontak">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8">
                                {data.ctaPrimary}
                            </Button>
                        </Link>
                        <Link href="#layanan">
                            <Button size="lg" variant="outline" className="border-primary text-foreground hover:bg-primary/10 font-semibold text-lg px-8">
                                {data.ctaSecondary}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
