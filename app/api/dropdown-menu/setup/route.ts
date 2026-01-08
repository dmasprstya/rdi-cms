import { NextResponse } from 'next/server';
import { db } from '@/db';
import { dropdownMenu } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// Setup endpoint - hanya untuk development/first setup
export async function POST() {
    try {
        const session = await auth();

        // Only allow admin or editor
        if (!session || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if table exists
        let tableExists = false;
        try {
            await db.select().from(dropdownMenu).limit(1);
            tableExists = true;
        } catch (error) {
            // Table doesn't exist
        }

        if (tableExists) {
            return NextResponse.json({
                success: false,
                error: 'Table already exists. Use /api/dropdown-menu/manage for CRUD operations',
            });
        }

        // Create table using raw SQL (Supabase compatible)
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS dropdown_menu (
                id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
                title VARCHAR(100) NOT NULL,
                slug VARCHAR(100) NOT NULL UNIQUE,
                content JSONB NOT NULL,
                "order" INTEGER NOT NULL DEFAULT 0,
                is_published BOOLEAN NOT NULL DEFAULT true,
                last_edited_by TEXT REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        `);

        // Insert initial data
        const menuItems = [
            {
                title: 'Jerman',
                slug: 'jerman',
                content: {
                    heading: 'Program Kemitraan Jerman',
                    description: 'Bergabunglah dengan program kemitraan kami dengan sekolah-sekolah terkemuka di Jerman. Program ini menawarkan kesempatan bagi siswa untuk mengembangkan keterampilan teknis dan bahasa Jerman, serta mempersiapkan karir internasional di industri manufaktur dan teknologi.',
                    features: [
                        'Pembelajaran bahasa Jerman intensif dengan native speaker',
                        'Kesempatan magang di perusahaan-perusahaan terkemuka di Jerman',
                        'Sertifikasi internasional yang diakui di Eropa',
                        'Peluang beasiswa untuk melanjutkan studi di universitas Jerman',
                        'Pendampingan karir dan networking dengan profesional global',
                        'Program pertukaran pelajar selama 6-12 bulan',
                    ],
                },
                order: 0,
                isPublished: true,
            },
            {
                title: 'Taiwan',
                slug: 'taiwan',
                content: {
                    heading: 'Program Kemitraan Taiwan',
                    description: 'Kemitraan dengan institusi pendidikan di Taiwan membuka akses ke teknologi canggih dan pengalaman belajar di salah satu negara paling inovatif di Asia. Siswa akan mendapatkan exposure terhadap industri teknologi tinggi dan manufaktur presisi.',
                    features: [
                        'Pembelajaran Bahasa Mandarin untuk komunikasi bisnis',
                        'Akses ke laboratorium teknologi terkini',
                        'Magang di perusahaan teknologi dan manufaktur Taiwan',
                        'Sertifikasi keterampilan teknis internasional',
                        'Beasiswa penuh untuk siswa berprestasi',
                        'Pelatihan industri 4.0 dan otomasi',
                    ],
                },
                order: 1,
                isPublished: true,
            },
            {
                title: 'Jepang',
                slug: 'jepang',
                content: {
                    heading: 'Program Kemitraan Jepang',
                    description: 'Program kemitraan dengan Jepang menawarkan pengalaman belajar dengan standar kualitas tertinggi. Siswa akan dilatih dengan metode Kaizen dan filosofi kerja Jepang yang terkenal di seluruh dunia, membuka peluang karir di perusahaan multinasional.',
                    features: [
                        'Pembelajaran Bahasa Jepang dan budaya kerja Jepang',
                        'Program magang di perusahaan manufaktur terkemuka Jepang',
                        'Pelatihan 5S dan Total Quality Management',
                        'Sertifikasi kompetensi standar Jepang',
                        'Kesempatan bekerja di Jepang setelah lulus',
                        'Mentoring dari profesional Jepang berpengalaman',
                    ],
                },
                order: 2,
                isPublished: true,
            },
            {
                title: 'Haltec',
                slug: 'haltec',
                content: {
                    heading: 'Program Kemitraan Haltec',
                    description: 'Kemitraan strategis dengan Haltec membawa standar pendidikan vokasi berkelas dunia ke Indonesia. Program ini dirancang untuk menghasilkan lulusan yang siap kerja dengan kompetensi teknis tinggi dan sertifikasi internasional yang diakui industri.',
                    features: [
                        'Kurikulum berbasis industri yang up-to-date',
                        'Fasilitas workshop dan laboratorium berstandar internasional',
                        'Guru tamu dari praktisi industri',
                        'Program sertifikasi kompetensi terakreditasi',
                        'Job placement assistance setelah lulus',
                        'Pelatihan soft skills dan leadership',
                    ],
                },
                order: 3,
                isPublished: true,
            },
        ];

        for (const item of menuItems) {
            await db.insert(dropdownMenu).values(item);
        }

        return NextResponse.json({
            success: true,
            message: 'Dropdown menu table created and seeded successfully',
            data: {
                itemsInserted: menuItems.length,
            },
        });
    } catch (error) {
        console.error('Error setting up dropdown menu:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to setup dropdown menu',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
