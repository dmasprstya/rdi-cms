import { db } from './index';
import { dropdownMenu } from './schema';

async function seed() {
    console.log('🌱 Seeding dropdown menu...');

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

    try {
        for (const item of menuItems) {
            await db.insert(dropdownMenu).values(item);
            console.log(`✅ Inserted: ${item.title}`);
        }
        console.log('✨ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }

    process.exit(0);
}

seed();
