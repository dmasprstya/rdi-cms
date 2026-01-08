import 'dotenv/config';
import { db } from '../db';
import { announcements, users } from '../db/schema';
import { eq } from 'drizzle-orm';

async function seedAnnouncements() {
    try {
        console.log('🌱 Seeding announcements...');

        // Get admin user
        const admins = await db
            .select()
            .from(users)
            .where(eq(users.role, 'admin'))
            .limit(1);

        if (admins.length === 0) {
            console.log('⚠️ No admin user found. Using first user as author.');
            const firstUser = await db.select().from(users).limit(1);
            if (firstUser.length === 0) {
                console.log('❌ No users found in database!');
                return;
            }
        }

        const adminId = admins.length > 0 ? admins[0].id : (await db.select().from(users).limit(1))[0].id;

        const announcementsData = [
            {
                title: 'Libur Semester Genap 2024/2025',
                content: `Pengumuman untuk seluruh siswa dan guru,

Dengan hormat kami sampaikan bahwa libur semester genap tahun ajaran 2024/2025 akan dimulai pada tanggal 15 Juni 2025 dan berakhir pada tanggal 10 Juli 2025.

Kegiatan belajar mengajar semester ganjil 2025/2026 akan dimulai pada tanggal 14 Juli 2025.

Mohon perhatiannya dan terima kasih.`,
                isActive: true,
            },
            {
                title: 'Ujian Akhir Semester (UAS) Semester 1',
                content: `Kepada seluruh siswa,

Ujian Akhir Semester (UAS) untuk semester 1 tahun ajaran 2024/2025 akan dilaksanakan pada:
- Tanggal: 4-11 Desember 2024
- Waktu: 07.30 - selesai
- Tempat: Ruang kelas masing-masing

Pastikan untuk mempersiapkan diri dengan baik dan membawa alat tulis yang diperlukan.

Sukses untuk ujian kalian!`,
                isActive: true,
            },
            {
                title: 'Pendaftaran Ekstrakurikuler Semester 2',
                content: `Pendaftaran kegiatan ekstrakurikuler untuk semester 2 sudah dibuka!

Ekstrakurikuler yang tersedia:
- Pramuka
- Basket
- Futsal
- Paduan Suara
- Robotika
- English Club
- Seni Tari

Pendaftaran dibuka hingga 20 Januari 2025. Silakan daftar di ruang OSIS atau melalui form online yang akan dibagikan oleh wali kelas.`,
                isActive: true,
            },
            {
                title: 'Lomba Karya Ilmiah Remaja Tingkat Nasional',
                content: `Sekolah mengundang siswa yang berminat untuk mengikuti Lomba Karya Ilmiah Remaja tingkat nasional yang akan diadakan pada bulan Maret 2025.

Tema: "Inovasi Teknologi untuk Pembangunan Berkelanjutan"

Bagi yang berminat, silakan mendaftar ke guru pembimbing Ibu Dewi Lestari paling lambat tanggal 30 Januari 2025.

Mari tunjukkan prestasi kalian!`,
                isActive: true,
            },
            {
                title: 'Pemeliharaan Sistem Informasi Sekolah',
                content: `Pemberitahuan pemeliharaan sistem:

Sistem informasi sekolah akan menjalani pemeliharaan pada:
- Tanggal: Sabtu, 25 Januari 2025
- Waktu: 08.00 - 16.00 WIB

Selama periode ini, akses ke sistem mungkin terganggu. Mohon maaf atas ketidaknyamanannya.

Terima kasih atas pengertiannya.`,
                isActive: false,
            },
        ];

        for (const announcement of announcementsData) {
            await db.insert(announcements).values({
                ...announcement,
                authorId: adminId,
            });
            console.log(`✅ Created announcement: ${announcement.title}`);
        }

        console.log('✅ Announcements seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding announcements:', error);
        throw error;
    }
}

// Run the seed
seedAnnouncements()
    .then(() => {
        console.log('Seed completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    });
