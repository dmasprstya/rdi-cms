/**
 * Server-side data fetching utilities for RDI Program section
 * These functions are used to fetch CMS content from the server using direct database access
 */

import { db } from '@/db';
import { landingPageContent } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

// TypeScript interfaces for Program content
export interface ProgramCategory {
    id: string;
    title: string;
    slug: string;
    description: string;
    badge: string;
    icon: string; // lucide icon name
    gradientFrom: string;
    gradientTo: string;
    order: number;
}

export interface ProgramItem {
    id: string;
    categoryId: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    featuredImage: string;
    keyFeatures: string[];
    ctaButtonText: string;
    ctaButtonLink: string;
    order: number;
    metadata?: {
        duration?: string;
        certification?: string;
        requirements?: string[];
        salary?: string;
        benefits?: string[];
    };
}

export interface ProgramsContent {
    sectionTitle: string;
    sectionSubtitle: string;
    categories: ProgramCategory[];
    items: ProgramItem[];
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .trim();
}

// Default program content
const DEFAULT_PROGRAMS: ProgramsContent = {
    sectionTitle: 'Dua Pilar Keahlian Kami',
    sectionSubtitle: 'Pilih jalur pengembangan diri yang sesuai dengan kebutuhan Anda',
    categories: [
        {
            id: 'pelatihan-kerja',
            title: 'Pelatihan Kerja',
            slug: 'pelatihan-kerja',
            description: 'Program pelatihan kerja profesional ke luar negeri dengan jaminan penempatan',
            badge: 'Global Opportunities',
            icon: 'Globe',
            gradientFrom: 'blue-500',
            gradientTo: 'blue-700',
            order: 1,
        },
        {
            id: 'pelatihan-motivasi',
            title: 'Pelatihan Motivasi & Manager Bisnis',
            slug: 'pelatihan-motivasi',
            description: 'Program pengembangan soft skills dan kepemimpinan untuk meningkatkan kualitas profesional Anda',
            badge: 'Professional Development',
            icon: 'Award',
            gradientFrom: 'purple-500',
            gradientTo: 'purple-700',
            order: 2,
        },
        {
            id: 'kuliah-beasiswa',
            title: 'Kuliah Beasiswa',
            slug: 'kuliah-beasiswa',
            description: 'Program beasiswa kuliah ke luar negeri dengan dukungan penuh dari awal hingga keberangkatan',
            badge: 'Educational Excellence',
            icon: 'GraduationCap',
            gradientFrom: 'green-500',
            gradientTo: 'emerald-700',
            order: 3,
        },
    ],
    items: [
        // PELATIHAN KERJA - Jepang
        {
            id: 'pelatihan-kerja-jepang',
            categoryId: 'pelatihan-kerja',
            title: 'Program Jepang',
            slug: 'jepang',
            shortDescription: 'Program Tokutei Ginou (SSW) - Visa kerja khusus untuk tenaga terampil di Jepang dengan gaji kompetitif',
            fullDescription: 'Program Tokutei Ginou (Specified Skilled Worker) adalah program visa kerja khusus yang diluncurkan pemerintah Jepang untuk menarik tenaga kerja terampil dari luar negeri. Program ini menawarkan kesempatan bekerja di berbagai sektor industri dengan gaji yang kompetitif, fasilitas lengkap, dan peluang pengembangan karir jangka panjang.',
            featuredImage: '/images/programs/japan-work.jpg',
            keyFeatures: [
                'Kontrak kerja resmi 1-5 tahun',
                'Gaji ¥150.000-200.000/bulan (±Rp 20-27 juta)',
                '12 sektor industri tersedia',
                'Fasilitas tempat tinggal disediakan',
                'Jaminan sosial lengkap (asuransi kesehatan & pensiun)',
                'Peluang perpanjangan visa',
            ],
            ctaButtonText: 'Daftar Program Jepang →',
            ctaButtonLink: '/program/pelatihan-kerja/jepang',
            order: 1,
            metadata: {
                duration: '1-5 Tahun',
                requirements: [
                    'Lulusan SMA/SMK/D3/S1',
                    'Usia 18-35 tahun',
                    'Pengalaman kerja (untuk beberapa sektor)',
                    'Lulus tes kemampuan bahasa Jepang (N4)',
                    'Lulus tes keterampilan teknis',
                ],
                salary: '¥150.000-200.000/bulan',
                benefits: [
                    'Asuransi kesehatan penuh',
                    'Asuranasi pensiun',
                    'Tempat tinggal',
                    'Pelatihan bahasa Jepang',
                ],
            },
        },
        // PELATIHAN KERJA - Taiwan
        {
            id: 'pelatihan-kerja-taiwan',
            categoryId: 'pelatihan-kerja',
            title: 'Program Taiwan',
            slug: 'taiwan',
            shortDescription: 'Program pelatihan kerja di Taiwan dengan gaji menarik dan lingkungan kerja yang profesional',
            fullDescription: 'Program pelatihan kerja di Taiwan menawarkan kesempatan untuk bekerja di negara dengan ekonomi maju dan teknologi tinggi. Dengan budaya yang ramah terhadap pekerja asing, kompensasi yang kompetitif, dan peluang pengembangan skill, program ini ideal untuk profesional muda yang ingin mendapatkan pengalaman internasional.',
            featuredImage: '/images/programs/taiwan-work.jpg',
            keyFeatures: [
                'Kontrak kerja 3 tahun (dapat diperpanjang)',
                'Gaji NT$ 25.000-35.000/bulan (±Rp 13-18 juta)',
                'Sektor manufaktur dan teknologi',
                'Overtime dengan bayaran tambahan',
                'Lingkungan kerja modern',
                'Peluang belajar bahasa Mandarin',
            ],
            ctaButtonText: 'Daftar Program Taiwan →',
            ctaButtonLink: '/program/pelatihan-kerja/taiwan',
            order: 2,
            metadata: {
                duration: '3 Tahun',
                requirements: [
                    'Lulusan SMA/SMK sederajat',
                    'Usia maksimal 32 tahun',
                    'Sehat jasmani dan rohani',
                    'Siap mengikuti pelatihan bahasa Mandarin',
                ],
                salary: 'NT$ 25.000-35.000/bulan',
                benefits: [
                    'Asuransi kesehatan',
                    'Asrama pekerja',
                    'Pelatihan bahasa',
                    'Bonus tahunan',
                ],
            },
        },
        // PELATIHAN KERJA - Jerman
        {
            id: 'pelatihan-kerja-jerman',
            categoryId: 'pelatihan-kerja',
            title: 'Program Jerman',
            slug: 'jerman',
            shortDescription: 'Program Ausbildung - Pelatihan kejuruan berbayar dengan standar Eropa dan sertifikat internasional',
            fullDescription: 'Program Ausbildung adalah sistem pendidikan kejuruan Jerman yang menggabungkan pembelajaran di sekolah kejuruan dengan praktik kerja di perusahaan. Peserta akan mendapatkan gaji selama pelatihan, sertifikat profesi yang diakui internasional, dan peluang kerja permanen di Jerman setelah lulus.',
            featuredImage: '/images/programs/germany-ausbildung.jpg',
            keyFeatures: [
                'Pelatihan kerja profesional di Jerman',
                'Gaji training €800-1.200/bulan (±Rp 14-21 juta)',
                'Sertifikat profesi internasional',
                'Peluang kerja permanen di Jerman',
                'Durasi pelatihan 3 tahun',
                'Asuransi kesehatan penuh',
            ],
            ctaButtonText: 'Daftar Program Jerman →',
            ctaButtonLink: '/program/pelatihan-kerja/jerman',
            order: 3,
            metadata: {
                duration: '3 Tahun',
                certification: 'Sertifikat Profesi Jerman (IHK)',
                requirements: [
                    'Lulusan SMA/SMK sederajat',
                    'Usia 18-25 tahun',
                    'Lulus tes kemampuan bahasa Jerman (B1)',
                    'Motivasi tinggi untuk belajar',
                    'Sehat jasmani dan rohani',
                ],
                salary: '€800-1.200/bulan (training)',
                benefits: [
                    'Asuransi kesehatan',
                    'Bantuan tempat tinggal',
                    'Kursus bahasa Jerman',
                    'Peluang kerja permanen',
                ],
            },
        },
        // PELATIHAN MOTIVASI - Service Excellent
        {
            id: 'pelatihan-motivasi-service',
            categoryId: 'pelatihan-motivasi',
            title: 'Service Excellent From Heart',
            slug: 'service-excellent',
            shortDescription: 'Pelatihan pelayanan prima yang berfokus pada pengembangan sikap melayani dari hati',
            fullDescription: 'Program pelatihan Service Excellent From Heart dirancang untuk mengembangkan kemampuan memberikan pelayanan terbaik kepada pelanggan. Dengan pendekatan "from heart", peserta akan belajar bagaimana memberikan layanan yang tulus, empati, dan profesional yang melampaui ekspektasi pelanggan.',
            featuredImage: '/images/programs/service-excellent.jpg',
            keyFeatures: [
                'Pelatihan intensif 2-3 hari',
                'Praktik langsung dengan role play',
                'Sertifikat kehadiran',
                'Materi dari praktisi berpengalaman',
                'Studi kasus nyata dari industri',
            ],
            ctaButtonText: 'Daftar Pelatihan →',
            ctaButtonLink: '/program/pelatihan-motivasi/service-excellent',
            order: 1,
            metadata: {
                duration: '2-3 Hari',
                certification: 'Sertifikat Pelatihan',
            },
        },
        // PELATIHAN MOTIVASI - Communication Excellent
        {
            id: 'pelatihan-motivasi-communication',
            categoryId: 'pelatihan-motivasi',
            title: 'Communication Excellent From Heart',
            slug: 'communication-excellent',
            shortDescription: 'Pelatihan komunikasi efektif untuk meningkatkan kemampuan berinteraksi secara profesional',
            fullDescription: 'Program Communication Excellent From Heart membekali peserta dengan teknik komunikasi yang efektif baik verbal maupun non-verbal. Peserta akan belajar cara menyampaikan pesan dengan jelas, mendengarkan aktif, dan membangun hubungan interpersonal yang kuat dalam lingkungan profesional.',
            featuredImage: '/images/programs/communication-excellent.jpg',
            keyFeatures: [
                'Teknik komunikasi verbal dan non-verbal',
                'Public speaking dan presentasi',
                'Active listening skills',
                'Komunikasi dalam tim',
                'Handling difficult conversations',
            ],
            ctaButtonText: 'Daftar Pelatihan →',
            ctaButtonLink: '/program/pelatihan-motivasi/communication-excellent',
            order: 2,
            metadata: {
                duration: '2-3 Hari',
                certification: 'Sertifikat Pelatihan',
            },
        },
        // PELATIHAN MOTIVASI - Leadership Excellent
        {
            id: 'pelatihan-motivasi-leadership',
            categoryId: 'pelatihan-motivasi',
            title: 'Leadership Excellent From Heart',
            slug: 'leadership-excellent',
            shortDescription: 'Pelatihan kepemimpinan untuk mengembangkan pemimpin yang inspiratif dan efektif',
            fullDescription: 'Program Leadership Excellent From Heart dirancang untuk mengembangkan keterampilan kepemimpinan yang autentik dan inspiratif. Peserta akan belajar berbagai aspek kepemimpinan modern, mulai dari membangun visi, memotivasi tim, hingga mengambil keputusan strategis dengan integritas.',
            featuredImage: '/images/programs/leadership-excellent.jpg',
            keyFeatures: [
                'Leadership styles dan aplikasinya',
                'Team building dan motivasi',
                'Decision making dan problem solving',
                'Emotional intelligence untuk leader',
                'Coaching dan mentoring skills',
            ],
            ctaButtonText: 'Daftar Pelatihan →',
            ctaButtonLink: '/program/pelatihan-motivasi/leadership-excellent',
            order: 3,
            metadata: {
                duration: '2-3 Hari',
                certification: 'Sertifikat Pelatihan',
            },
        },
        // KULIAH BEASISWA - Taiwan
        {
            id: 'kuliah-beasiswa-taiwan',
            categoryId: 'kuliah-beasiswa',
            title: 'Program Taiwan',
            slug: 'taiwan',
            shortDescription: 'Program beasiswa kuliah S1 di Taiwan dengan izin kerja part-time dan peluang beasiswa penuh',
            fullDescription: 'Program beasiswa kuliah di Taiwan memberikan kesempatan untuk mendapatkan gelar sarjana di universitas ternama Taiwan sambil bekerja part-time. Dengan biaya hidup yang terjangkau, budaya yang ramah, dan kualitas pendidikan tinggi, Taiwan menjadi destinasi favorit untuk pendidikan internasional.',
            featuredImage: '/images/programs/taiwan-scholarship.jpg',
            keyFeatures: [
                'Kuliah di universitas ternama Taiwan',
                'Izin kerja part-time 20 jam/minggu',
                'Gaji part-time NT$ 180/jam (±Rp 90.000/jam)',
                'Peluang beasiswa penuh hingga 100%',
                'Durasi kuliah 4 tahun (S1)',
                'Visa pelajar dengan izin kerja',
            ],
            ctaButtonText: 'Daftar Program Beasiswa →',
            ctaButtonLink: '/program/kuliah-beasiswa/taiwan',
            order: 1,
            metadata: {
                duration: '4 Tahun (S1)',
                requirements: [
                    'Lulusan SMA/SMK sederajat',
                    'Usia maksimal 25 tahun',
                    'Nilai rata-rata minimal 7.0',
                    'Lulus tes kemampuan bahasa Mandarin (HSK 4)',
                    'Sehat jasmani dan rohani',
                ],
                benefits: [
                    'Beasiswa hingga 100%',
                    'Izin kerja part-time',
                    'Asrama mahasiswa',
                    'Asuransi kesehatan',
                ],
            },
        },
    ],
};

/**
 * Fetch programs content directly from database (for server-side use)
 * Cached with revalidation tags for efficient performance
 */
export async function fetchProgramsContent(): Promise<ProgramsContent | null> {
    // Skip during build when DATABASE_URL is not available
    if (!process.env.DATABASE_URL) {
        return null;
    }

    return unstable_cache(
        async () => {
            try {
                const content = await db.query.landingPageContent.findFirst({
                    where: eq(landingPageContent.section, 'rdi-programs'),
                });

                if (content && content.content) {
                    return content.content as ProgramsContent;
                }

                return null;
            } catch (error) {
                console.error('Error fetching programs content:', error);
                return null;
            }
        },
        ["programs-content"],
        {
            tags: ["programs-content", "rdi-content"],
            revalidate: 3600 // Cache for 1 hour - program content rarely changes
        }
    )();
}

/**
 * Get programs content with fallback to defaults
 */
export async function getProgramsContent(): Promise<ProgramsContent> {
    const content = await fetchProgramsContent();
    return content || DEFAULT_PROGRAMS;
}

/**
 * Get a specific program category by slug
 */
export async function getProgramCategory(slug: string): Promise<ProgramCategory | null> {
    const content = await getProgramsContent();
    return content.categories.find(cat => cat.slug === slug) || null;
}

/**
 * Get all program items for a specific category
 */
export async function getProgramItemsByCategory(categorySlug: string): Promise<ProgramItem[]> {
    const content = await getProgramsContent();
    const category = content.categories.find(cat => cat.slug === categorySlug);

    if (!category) return [];

    return content.items
        .filter(item => item.categoryId === category.id)
        .sort((a, b) => a.order - b.order);
}

/**
 * Get a specific program item by category slug and item slug
 */
export async function getProgramItem(
    categorySlug: string,
    itemSlug: string
): Promise<ProgramItem | null> {
    const items = await getProgramItemsByCategory(categorySlug);
    return items.find(item => item.slug === itemSlug) || null;
}

/**
 * Get all categories with their item counts
 */
export async function getProgramCategoriesWithCounts(): Promise<Array<ProgramCategory & { itemCount: number }>> {
    const content = await getProgramsContent();

    return content.categories.map(category => ({
        ...category,
        itemCount: content.items.filter(item => item.categoryId === category.id).length,
    })).sort((a, b) => a.order - b.order);
}

/**
 * Transform Programs data to CorePillarsContent format for landing page
 * This function fetches Programs categories and items, then transforms them
 * into the format expected by the CorePillarsSection component
 */
export async function getProgramsCategoriesForLanding(): Promise<{
    title: string;
    subtitle: string;
    pillars: Array<{
        badge: string;
        title: string;
        description: string;
        features: Array<{ text: string }>;
        buttonText: string;
        buttonLink: string;
        imageUrl: string;
        gradientFrom: string;
        gradientTo: string;
    }>;
}> {
    const programsContent = await getProgramsContent();

    // Transform categories to pillars
    const pillars = programsContent.categories
        .sort((a, b) => a.order - b.order)
        .map(category => {
            // Get items for this category
            const categoryItems = programsContent.items
                .filter(item => item.categoryId === category.id)
                .sort((a, b) => a.order - b.order);

            // Transform items to features (use item titles from first few items)
            const features: Array<{ text: string }> = categoryItems
                .slice(0, 3) // Take max 3 items to show
                .map(item => ({ text: item.title }));

            // If no items, use placeholder feature
            if (features.length === 0) {
                features.push({ text: 'Coming soon' });
            }

            // Determine button link - go to category page
            const buttonLink = `/program/${category.slug}`;

            return {
                badge: category.badge,
                title: category.title,
                description: category.description,
                features,
                buttonText: `Detail Program →`,
                buttonLink,
                imageUrl: categoryItems[0]?.featuredImage || '/images/programs/placeholder.svg',
                gradientFrom: category.gradientFrom,
                gradientTo: category.gradientTo,
            };
        });

    return {
        title: programsContent.sectionTitle,
        subtitle: programsContent.sectionSubtitle,
        pillars,
    };
}


