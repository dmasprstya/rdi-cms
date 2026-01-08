import { NavbarRDI } from "@/components/rdi/navbar-rdi";
import { HeroSection } from "@/components/rdi/hero-section";
import { TrustPartnersSection } from "@/components/rdi/trust-partners-section";
import { CorePillarsSection } from "@/components/rdi/core-pillars-section";
import { WhyRDISection } from "@/components/rdi/why-rdi-section";
import { FoundersSection } from "@/components/rdi/founders-section";
import { LatestNewsSection } from "@/components/rdi/latest-news-section";
import { CTASection } from "@/components/rdi/cta-section";
import { FooterRDI } from "@/components/rdi/footer-rdi";
import {
    getHeroContent,
    getHeroImages,
    getTrustPartnersContent,
    getCorePillarsContent,
    fetchRDISection,
    WhyRDIContent,
    FoundersContent,
    CTAContent,
} from "@/lib/rdi-data";


// Use ISR (Incremental Static Regeneration) - homepage cached for 5 minutes
export const revalidate = 300; // 5 minutes

export default async function RDILandingPage() {
    // Fetch section data server-side
    const heroContent = await getHeroContent();
    const heroImages = await getHeroImages(); // Fetch slideshow images
    const trustPartnersContent = await getTrustPartnersContent();

    // Fetch Programs categories for Core Pillars section
    const { getProgramsCategoriesForLanding } = await import('@/lib/program-data');
    const corePillarsContent = await getProgramsCategoriesForLanding();

    // Fetch remaining sections
    const whyRDIContent = await fetchRDISection<WhyRDIContent>('rdi-why-rdi');
    const foundersContent = await fetchRDISection<FoundersContent>('rdi-founders');

    // Fetch latest news from database (not from hardcoded CMS)
    const { getLatestNewsForLanding } = await import('@/lib/rdi-data');
    const latestNewsContent = await getLatestNewsForLanding();

    const ctaContent = await fetchRDISection<CTAContent>('rdi-cta');

    // Provide default fallbacks
    const defaultWhyRDI: WhyRDIContent = {
        title: 'Mengapa Rosman Djohan Institute?',
        subtitle: 'Komitmen kami untuk memberikan pendidikan berkualitas dan pelatihan profesional',
        features: [
            {
                icon: 'Network',
                title: "Jaringan Luas",
                description: "Koneksi langsung ke Universitas & Industri Global serta Lembaga Halal terpercaya.",
            },
            {
                icon: 'Users',
                title: "Didirikan oleh Ahli",
                description: "Dipimpin langsung oleh praktisi berpengalaman di bidang pendidikan internasional dan sertifikasi halal.",
            },
            {
                icon: 'Shield',
                title: "Resmi & Terpercaya",
                description: "Berizin resmi untuk pengiriman siswa ke luar negeri & pelatihan kompetensi profesi halal.",
            },
        ],
    };

    const defaultFounders: FoundersContent = {
        title: "Bertemu Para Pendiri",
        subtitle: "Visi dan dedikasi untuk membentuk masa depan pendidikan Indonesia",
        founders: [
            {
                name: "Rosman Djohan",
                role: "Founder & CEO",
                vision: "Visi Global",
                quote: "Membawa talenta Indonesia ke panggung dunia melalui pendidikan berkualitas.",
                image: "/images/founder-rosman.jpg",
            },
            {
                name: "Co-Founder",
                role: "Director of Operations",
                vision: "Komitmen Kualitas",
                quote: "Menjamin setiap program kami memenuhi standar internasional tertinggi.",
                image: "/images/founder-2.jpg",
            },
        ]
    };

    const defaultCTA: CTAContent = {
        title: 'Mulai Langkah Anda Sekarang',
        subtitle: 'Hubungi kami untuk konsultasi gratis dan dapatkan informasi lengkap tentang program yang Anda minati',
        button1Text: 'Konsultasi Program Luar Negeri',
        button2Text: 'Daftar Training Halal',
        waNumberOverseas: '6281234567890',
        waNumberHaltec: '6281234567891',
        messageOverseas: 'Halo, saya ingin konsultasi tentang Program Luar Negeri',
        messageHaltec: 'Halo, saya ingin mendaftar Training Halal (HALTEC)',
        additionalInfo: '💬 Tim kami siap membantu Anda 24/7',
    };


    return (
        <main className="min-h-screen">
            <NavbarRDI />
            <HeroSection content={heroContent} images={heroImages} newsItems={latestNewsContent.newsItems} />
            <TrustPartnersSection content={trustPartnersContent} />
            <CorePillarsSection content={corePillarsContent} />
            <WhyRDISection content={whyRDIContent || defaultWhyRDI} />
            <FoundersSection content={foundersContent || defaultFounders} />
            <LatestNewsSection content={latestNewsContent} />
            <CTASection content={ctaContent || defaultCTA} />
            <FooterRDI />
        </main>
    );
}
