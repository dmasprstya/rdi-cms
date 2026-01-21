/**
 * Server-side data fetching utilities for RDI landing page
 * These functions are used to fetch CMS content from the server using direct database access
 */

import { db } from '@/db';
import { landingPageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

// TypeScript interfaces for RDI content
export interface Partner {
    name: string;
    logo: string;
}

export interface TrustPartnersContent {
    tagline: string;
    title: string;
    partners: Partner[];
}

export interface PillarFeature {
    text: string;
}

export interface Pillar {
    badge: string;
    title: string;
    description: string;
    features: PillarFeature[];
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
    gradientFrom: string;
    gradientTo: string;
}

export interface CorePillarsContent {
    title: string;
    subtitle: string;
    pillars: Pillar[];
}

export interface HeroContent {
    title: string;
    subtitle: string;
    buttonText: string;
    displayMode?: 'slideshow' | 'video'; // Mode selection
    videoUrl?: string; // For video mode
    slideshowDuration?: number; // For slideshow mode (ms), default 6000
    enableAutoPlay?: boolean; // Allow disabling for accessibility
    logoUrl?: string;
    aboutTitle?: string; // Title for "Sekilas Tentang" section
    aboutDescription?: string; // Description for "Sekilas Tentang" section
    newsSidebarTitle?: string; // NEW: Title for news sidebar (e.g., "Berita Terbaru", "Latest News")
}

export interface HeroImage {
    id: string;
    sectionId: string;
    imageUrl: string;
    altText: string; // Required for accessibility
    order: number;
    createdAt: Date;
}


export interface MenuItem {
    label: string;
    href: string;
}

export interface ProgramItem {
    title: string;
    description: string;
    href: string;
}

export interface NavbarContent {
    logoText: string;
    logoTextColor?: string;
    logoUrl?: string;
    menuItems: MenuItem[];
    /**
     * @deprecated No longer used. Program dropdown items are now fetched from the programs database.
     * Manage programs via /program admin page instead.
     */
    programItems?: ProgramItem[];
    loginText: string;
    contactText: string;
}

export interface WhyRDIFeature {
    icon: string;
    title: string;
    description: string;
}

export interface WhyRDIContent {
    title: string;
    subtitle: string;
    features: WhyRDIFeature[];
}

export interface Founder {
    name: string;
    role: string;
    vision: string;
    quote: string;
    image: string;
}

export interface FoundersContent {
    title: string;
    subtitle: string;
    founders: Founder[];
}

export interface NewsItem {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    image: string;
    slug: string;
}

export interface LatestNewsContent {
    title: string;
    subtitle: string;
    /**
     * News items are fetched from the news database.
     * Manage news via /berita admin page instead.
     */
    newsItems: NewsItem[];
    viewAllText: string;
    viewAllLink: string;
}

export interface CTAContent {
    title: string;
    subtitle: string;
    button1Text: string;
    button2Text: string;
    waNumberOverseas: string;
    waNumberHaltec: string;
    messageOverseas: string;
    messageHaltec: string;
    additionalInfo: string;
}

export interface SocialMedia {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
}

export interface Legalitas {
    nib: string;
    izinLpk: string;
    npwp: string;
    status: string;
}

export interface Contact {
    address: string;
    email: string;
    phone: string;
}

export interface FooterContent {
    logoText: string;
    logoUrl?: string;
    description: string;
    socialMedia: SocialMedia;
    legalitas: Legalitas;
    contact: Contact;
    copyright: string;
}

export interface WhatsAppFloatContent {
    enabled: boolean;
    phoneNumber: string;
    defaultMessage: string;
    position: 'right' | 'left';
    tooltipText: string;
}

// Default content fallbacks
const DEFAULT_HERO: HeroContent = {
    title: 'WUJUDKAN MASA DEPAN KOMPETEN DAN MENDUNIA',
    subtitle: 'Lembaga pendidikan vokasi terpadu untuk karir internasional dan sertifikasi kompetensi jaminan produk halal.',
    buttonText: 'JELAJAHI PROGRAM KAMI',
    slideshowDuration: 6000, // 6 detik per foto
    logoUrl: '/logos/rdi-logo.png',
    aboutTitle: 'SEKILAS TENTANG ROSMAN DJOHAN INSTITUTE',
    aboutDescription: 'SED UT PERSPICIATIS UNDE OMNIS ISTE NATUS ERROR SIT VOLUPTATEM ACCUSANTIUM DOLOREMQUE LAUDANTIUM, TOTAM REM APERIAM, EAQUE IPSA QUAE AB ILLO INVENTORE VERITATIS ET QUASI ARCHITECTO BEATAE VITAE DICTA SUNT EXPLICABO. NEMO ENIM IPSAM VOLUPTATEM QUIA VOLUPTAS SIT ASPERNATUR AUT ODIT AUT FUGIT, SED QUIA NON NUMQUAM EIUS MODI TEMPORA INCIDUNT UT LABORE ET DOLORE MAGNAM ALIQUAM QUAERAT VOLUPTATEM.',
    newsSidebarTitle: 'Berita Terbaru', // NEW: Default fallback for news sidebar title
};

const DEFAULT_TRUST_PARTNERS: TrustPartnersContent = {
    tagline: 'Dipercaya Oleh',
    title: 'Institusi Pendidikan Internasional & Lembaga Halal Terkemuka',
    partners: [
        { name: 'Goethe Institut', logo: '/logos/goethe.png' },
        { name: 'Chunghua University', logo: '/logos/chunghua.png' },
        { name: 'Izumi Corporation', logo: '/logos/izumi.png' },
    ],
};

const DEFAULT_CORE_PILLARS: CorePillarsContent = {
    title: 'Dua Pilar Keahlian Kami',
    subtitle: 'Pilih jalur pengembangan diri yang sesuai dengan kebutuhan Anda',
    pillars: [
        {
            badge: 'Global Opportunities',
            title: 'GO GLOBAL (Luar Negeri)',
            description: 'Raih pengalaman kerja dan kuliah di Jerman, Taiwan, dan Jepang.',
            features: [
                { text: 'Kuliah + Kerja (Taiwan)' },
                { text: 'Ausbildung (Jerman)' },
                { text: 'Tokutei Ginou (Jepang)' },
            ],
            buttonText: 'Detail Program LN →',
            buttonLink: '/program/luar-negeri',
            imageUrl: '/images/overseas-students.jpg',
            gradientFrom: 'blue-500',
            gradientTo: 'blue-700',
        },
        {
            badge: 'Professional Certification',
            title: 'HALTEC (Halal Training)',
            description: 'Pusat pelatihan & sertifikasi profesi halal untuk industri.',
            features: [
                { text: 'Penyelia Halal' },
                { text: 'Auditor Halal Internal' },
            ],
            buttonText: 'Detail Program Haltec →',
            buttonLink: '/program/haltec',
            imageUrl: '/images/halal-training.jpg',
            gradientFrom: 'green-500',
            gradientTo: 'emerald-700',
        },
    ],
};

const DEFAULT_NAVBAR: NavbarContent = {
    logoText: 'Rosman Djohan Institute',
    logoUrl: '/logos/rdi-logo.png',
    menuItems: [
        { label: 'Beranda', href: '/' },
        { label: 'Berita', href: '/#berita' },
        { label: 'Tentang Kami', href: '/#tentang-kami' },
    ],
    // programItems removed - now fetched from programs database
    loginText: 'LOGIN',
    contactText: 'DAFTAR',
};

/**
 * Fetch a single RDI section directly from database (for server-side use)
 * Cached with revalidation tags for efficient performance
 * @param section - Section name (e.g., 'rdi-hero', 'rdi-trust-partners')
 * @returns Section data or null if not found
 */
export async function fetchRDISection<T>(section: string): Promise<T | null> {
    // Skip during build when DATABASE_URL is not available
    if (!process.env.DATABASE_URL) {
        return null;
    }

    return unstable_cache(
        async () => {
            try {
                const content = await db.query.landingPageContent.findFirst({
                    where: eq(landingPageContent.section, section),
                });

                if (content && content.content) {
                    return content.content as T;
                }

                return null;
            } catch (error) {
                console.error(`Error fetching RDI section ${section}:`, error);
                return null;
            }
        },
        [`rdi-section-${section}`],
        {
            tags: [`rdi-section-${section}`, 'rdi-content'],
            revalidate: false // Only revalidate via tags (on-demand) - prevents cache race conditions
        }
    )();
}

/**
 * Get RDI content with fallback to defaults
 * @param section - Section name
 * @returns Section content (fetched or default)
 */
export async function getRDIContent<T>(
    section: string,
    defaultContent: T
): Promise<T> {
    const content = await fetchRDISection<T>(section);
    return content || defaultContent;
}

// Convenience functions for each section
export async function getHeroContent(): Promise<HeroContent> {
    return getRDIContent('rdi-hero', DEFAULT_HERO);
}

export async function getHeroImages(): Promise<HeroImage[]> {
    // Skip during build
    if (!process.env.DATABASE_URL) {
        return [];
    }

    return unstable_cache(
        async () => {
            try {
                const { heroImages } = await import('@/db/schema');
                const { eq, asc } = await import('drizzle-orm');

                const images = await db.query.heroImages.findMany({
                    where: eq(heroImages.sectionId, 'rdi-hero'),
                    orderBy: [asc(heroImages.order)],
                    limit: 5
                });

                return images.map(img => ({
                    id: img.id,
                    sectionId: img.sectionId,
                    imageUrl: img.imageUrl,
                    altText: img.altText,
                    order: img.order,
                    createdAt: img.createdAt
                }));
            } catch (error) {
                console.error('Error fetching hero images:', error);
                return [];
            }
        },
        ['hero-images'],
        {
            tags: ['hero-images', 'rdi-content'],
            revalidate: false // Only revalidate via tags (on-demand)
        }
    )();
}


export async function getTrustPartnersContent(): Promise<TrustPartnersContent> {
    return getRDIContent('rdi-trust-partners', DEFAULT_TRUST_PARTNERS);
}

export async function getCorePillarsContent(): Promise<CorePillarsContent> {
    return getRDIContent('rdi-core-pillars', DEFAULT_CORE_PILLARS);
}

/**
 * Get navbar content for RDI landing page
 * 
 * DATA FLOW:
 * - Logo, menu items, login/contact text: Fetched from CMS 'rdi-navbar'
 * - Program dropdown items: Dynamically fetched from 'programs' database (see navbar-rdi.tsx)
 * 
 * Note: The 'programItems' field in CMS is NOT used. Programs are managed via /program admin page.
 */
export async function getNavbarContent(): Promise<NavbarContent> {
    // Skip during build
    if (!process.env.DATABASE_URL) {
        return DEFAULT_NAVBAR;
    }

    return unstable_cache(
        async () => {
            const content = await fetchRDISection<NavbarContent>('rdi-navbar');
            return content || DEFAULT_NAVBAR;
        },
        ['navbar-content'],
        {
            tags: ['navbar-content', 'rdi-content'],
            revalidate: false // Only revalidate via tags (on-demand)
        }
    )();
}

/**
 * Get latest published news for landing page
 * 
 * DATA FLOW:
 * - Section header (title, subtitle, viewAllText, viewAllLink): Fetched from CMS 'rdi-latest-news'
 * - News articles: Fetched from 'news' database table (latest 3 published articles)
 * 
 * To edit news content: Use /berita admin page to manage news articles
 * To edit section header: Use CMS editor for 'rdi-latest-news' section
 * 
 * @returns LatestNewsContent with real news from database
 */
/**
 * Get WhatsApp float button configuration
 */
export async function getWhatsAppFloatContent(): Promise<WhatsAppFloatContent> {
    // Skip during build
    if (!process.env.DATABASE_URL) {
        return {
            enabled: true,
            phoneNumber: '6281234567890',
            defaultMessage: 'Halo, saya ingin bertanya tentang program RDI',
            position: 'right' as const,
            tooltipText: 'Chat dengan kami via WhatsApp',
        };
    }

    return unstable_cache(
        async () => {
            const content = await fetchRDISection<WhatsAppFloatContent>('rdi-whatsapp-float');
            return content || {
                enabled: true,
                phoneNumber: '6281234567890',
                defaultMessage: 'Halo, saya ingin bertanya tentang program RDI',
                position: 'right' as const,
                tooltipText: 'Chat dengan kami via WhatsApp',
            };
        },
        ['whatsapp-float-content'],
        {
            tags: ['whatsapp-float-content', 'rdi-content'],
            revalidate: false // Only revalidate via tags (on-demand)
        }
    )();
}

export async function getLatestNewsForLanding(): Promise<LatestNewsContent> {
    // Skip during build
    if (!process.env.DATABASE_URL) {
        return {
            title: 'Update Kegiatan Terbaru',
            subtitle: 'Ikuti perkembangan dan pencapaian terbaru kami',
            newsItems: [],
            viewAllText: 'Lihat Semua Berita',
            viewAllLink: '/berita',
        };
    }

    return unstable_cache(
        async () => {
            try {
                const sectionHeader = await fetchRDISection<Partial<LatestNewsContent>>('rdi-latest-news');

                const { news } = await import('@/db/schema');
                const { eq, desc, and, isNotNull } = await import('drizzle-orm');

                const newsItems = await db.query.news.findMany({
                    where: and(
                        eq(news.status, 'published'),
                        isNotNull(news.publishedAt)
                    ),
                    orderBy: [desc(news.publishedAt)],
                    limit: 3,
                    columns: {
                        id: true,
                        title: true,
                        slug: true,
                        excerpt: true,
                        featuredImage: true,
                        publishedAt: true,
                        category: true,
                    },
                });

                const mappedNews: NewsItem[] = newsItems.map(item => ({
                    title: item.title,
                    excerpt: item.excerpt,
                    category: item.category || 'Seminar',
                    date: item.publishedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                    image: item.featuredImage,
                    slug: item.slug,
                }));

                return {
                    title: sectionHeader?.title || 'Update Kegiatan Terbaru',
                    subtitle: sectionHeader?.subtitle || 'Ikuti perkembangan dan pencapaian terbaru kami',
                    newsItems: mappedNews,
                    viewAllText: sectionHeader?.viewAllText || 'Lihat Semua Berita',
                    viewAllLink: sectionHeader?.viewAllLink || '/berita',
                };
            } catch (error) {
                console.error('Error fetching latest news for landing:', error);

                return {
                    title: 'Update Kegiatan Terbaru',
                    subtitle: 'Ikuti perkembangan dan pencapaian terbaru kami',
                    newsItems: [],
                    viewAllText: 'Lihat Semua Berita',
                    viewAllLink: '/berita',
                };
            }
        },
        ['landing-latest-news'],
        {
            tags: ['landing-latest-news', 'news-content'],
            revalidate: false
        }
    )();
}