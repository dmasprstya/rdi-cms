import 'dotenv/config';
import { db } from '../db';
import { modules, subjects, classes, teachers } from '../db/schema';
import { eq } from 'drizzle-orm';

async function seedModules() {
    try {
        console.log('🌱 Seeding modules...');

        // Get existing subjects, classes, and teachers to reference
        const allSubjects = await db.select().from(subjects);
        const allClasses = await db.select().from(classes);
        const allTeachers = await db.select().from(teachers);

        if (allSubjects.length === 0) {
            console.log('⚠️ No subjects found. Please run seed-subjects.ts first.');
            return;
        }

        if (allClasses.length === 0) {
            console.log('⚠️ No classes found. Please ensure you have classes in the database.');
            return;
        }

        if (allTeachers.length === 0) {
            console.log('⚠️ No teachers found. Please run seed-teachers.ts first.');
            return;
        }

        console.log(`📚 Found ${allSubjects.length} subjects, ${allClasses.length} classes, ${allTeachers.length} teachers`);

        // Sample modules data with various configurations
        const modulesData = [
            {
                title: 'Pengenalan Algoritma dan Pemrograman Dasar',
                description: 'Modul ini membahas konsep dasar algoritma dan pemrograman menggunakan bahasa Python. Cocok untuk pemula yang ingin belajar coding.',
                content: 'Di modul ini, Anda akan mempelajari:\n1. Konsep dasar pemrograman\n2. Variabel dan tipe data\n3. Struktur kontrol (if-else, loop)\n4. Fungsi dan prosedur\n5. Array dan list',
                fileUrl: 'https://drive.google.com/file/d/1example-algoritma-python/view',
                subjectCode: 'MTK', // Matematika
                classGrade: 10, // For specific class
                isPublished: true,
            },
            {
                title: 'Tata Bahasa Indonesia - Struktur Kalimat',
                description: 'Panduan lengkap memahami struktur kalimat dalam Bahasa Indonesia yang baik dan benar.',
                content: 'Materi yang akan dipelajari:\n- Subjek, Predikat, Objek, dan Keterangan\n- Kalimat Aktif dan Pasif\n- Kalimat Efektif\n- Contoh soal dan latihan',
                fileUrl: 'https://drive.google.com/file/d/1example-bahasa-indonesia/view',
                subjectCode: 'BIND', // Bahasa Indonesia
                classGrade: 10,
                isPublished: true,
            },
            {
                title: 'Hukum Newton dan Aplikasinya',
                description: 'Modul pembelajaran tentang Hukum Newton I, II, dan III beserta aplikasinya dalam kehidupan sehari-hari.',
                content: 'Topik pembahasan:\n1. Hukum Newton I (Hukum Kelembaman)\n2. Hukum Newton II (F = ma)\n3. Hukum Newton III (Aksi-Reaksi)\n4. Soal-soal latihan dan pembahasan',
                fileUrl: 'https://drive.google.com/file/d/1example-fisika-newton/view',
                subjectCode: 'FIS', // Fisika
                classGrade: 11,
                isPublished: true,
            },
            {
                title: 'Reaksi Kimia dan Stoikiometri',
                description: 'Materi lengkap tentang reaksi kimia, persamaan kimia, dan perhitungan stoikiometri.',
                content: 'Bab yang dibahas:\n- Jenis-jenis reaksi kimia\n- Menyetarakan persamaan reaksi\n- Konsep mol dan massa molar\n- Perhitungan stoikiometri\n- Latihan soal',
                fileUrl: 'https://drive.google.com/file/d/1example-kimia-stoikiometri/view',
                subjectCode: 'KIM', // Kimia
                classGrade: 11,
                isPublished: true,
            },
            {
                title: 'Sistem Peredaran Darah Manusia',
                description: 'Modul tentang anatomi dan fisiologi sistem peredaran darah pada manusia.',
                content: 'Isi modul:\n- Organ-organ sistem peredaran darah\n- Jantung dan fungsinya\n- Pembuluh darah (arteri, vena, kapiler)\n- Peredaran darah besar dan kecil\n- Gangguan sistem peredaran darah',
                fileUrl: 'https://drive.google.com/file/d/1example-biologi-peredaran-darah/view',
                subjectCode: 'BIO', // Biologi
                classGrade: 11,
                isPublished: true,
            },
            {
                title: 'English Grammar - Tenses (Present & Past)',
                description: 'Comprehensive guide to understanding Present and Past tenses in English grammar.',
                content: 'Contents:\n- Simple Present Tense\n- Present Continuous Tense\n- Present Perfect Tense\n- Simple Past Tense\n- Past Continuous Tense\n- Exercises and practice',
                fileUrl: 'https://drive.google.com/file/d/1example-english-tenses/view',
                subjectCode: 'BING', // Bahasa Inggris
                classGrade: 10,
                isPublished: true,
            },
            {
                title: 'Sejarah Kemerdekaan Indonesia',
                description: 'Modul pembelajaran tentang perjuangan kemerdekaan Indonesia dari masa kolonial hingga proklamasi.',
                content: 'Pembahasan:\n1. Masa penjajahan Belanda dan Jepang\n2. Organisasi pergerakan nasional\n3. Peristiga Rengasdengklok\n4. Proklamasi 17 Agustus 1945\n5. Tokoh-tokoh pejuang kemerdekaan',
                fileUrl: 'https://drive.google.com/file/d/1example-sejarah-kemerdekaan/view',
                subjectCode: 'SEJ', // Sejarah
                classGrade: 11,
                isPublished: true,
            },
            {
                title: 'Trigonometri Lanjut - Sudut Istimewa',
                description: 'Materi trigonometri untuk kelas 11, mencakup sudut istimewa dan identitas trigonometri.',
                content: 'Materi:\n- Sudut istimewa (30°, 45°, 60°)\n- Identitas trigonometri\n- Rumus jumlah dan selisih sudut\n- Aplikasi trigonometri\n- Soal-soal latihan',
                fileUrl: 'https://drive.google.com/file/d/1example-trigonometri/view',
                subjectCode: 'MTK', // Matematika
                classGrade: 11,
                isPublished: true,
            },
            {
                title: 'Panduan Menulis Karya Ilmiah',
                description: 'Modul untuk semua kelas tentang cara menulis karya ilmiah yang baik dan benar.',
                content: 'Panduan meliputi:\n- Struktur karya ilmiah\n- Cara mencari referensi\n- Teknik sitasi dan daftar pustaka\n- Tips menulis abstrak\n- Contoh karya ilmiah',
                fileUrl: 'https://drive.google.com/file/d/1example-karya-ilmiah/view',
                subjectCode: 'BIND', // Bahasa Indonesia
                classGrade: null, // Available for all classes
                isPublished: true,
            },
            {
                title: 'Gelombang dan Bunyi',
                description: 'Modul pembelajaran tentang gelombang mekanik dan bunyi.',
                content: 'Topik bahasan:\n- Jenis-jenis gelombang\n- Sifat-sifat gelombang\n- Gelombang bunyi\n- Resonansi dan interferensi\n- Efek Doppler',
                fileUrl: 'https://drive.google.com/file/d/1example-gelombang-bunyi/view',
                subjectCode: 'FIS', // Fisika
                classGrade: 12,
                isPublished: true,
            },
            {
                title: '[DRAFT] Materi Ekosistem - Coming Soon',
                description: 'Modul tentang ekosistem dan keseimbangan lingkungan. Masih dalam tahap penyusunan.',
                content: 'Modul ini sedang dalam proses penyusunan dan akan segera tersedia.',
                fileUrl: null,
                subjectCode: 'BIO', // Biologi
                classGrade: 10,
                isPublished: false, // Not published yet
            },
        ];

        // Insert modules
        let successCount = 0;
        let skipCount = 0;

        for (const moduleData of modulesData) {
            try {
                // Find subject by code
                const subject = allSubjects.find(s => s.code === moduleData.subjectCode);
                if (!subject) {
                    console.log(`⚠️ Skipping module "${moduleData.title}" - subject ${moduleData.subjectCode} not found`);
                    skipCount++;
                    continue;
                }

                // Find class by grade (if specified)
                let targetClass = null;
                if (moduleData.classGrade !== null) {
                    targetClass = allClasses.find(c => c.grade === moduleData.classGrade);
                    if (!targetClass) {
                        console.log(`⚠️ Skipping module "${moduleData.title}" - class grade ${moduleData.classGrade} not found`);
                        skipCount++;
                        continue;
                    }
                }

                // Pick a random teacher (in real scenario, you'd match teacher to subject)
                const randomTeacher = allTeachers[Math.floor(Math.random() * allTeachers.length)];

                await db.insert(modules).values({
                    title: moduleData.title,
                    description: moduleData.description,
                    content: moduleData.content,
                    fileUrl: moduleData.fileUrl,
                    subjectId: subject.id,
                    classId: targetClass ? targetClass.id : null,
                    teacherId: randomTeacher.id,
                    isPublished: moduleData.isPublished,
                });

                console.log(`✅ Created module: ${moduleData.title} (${subject.name}, ${targetClass ? targetClass.name : 'All classes'})`);
                successCount++;
            } catch (error) {
                console.error(`❌ Error creating module "${moduleData.title}":`, error);
                skipCount++;
            }
        }

        console.log(`\n✅ Modules seeding completed!`);
        console.log(`   - Successfully created: ${successCount} modules`);
        console.log(`   - Skipped: ${skipCount} modules`);
    } catch (error) {
        console.error('❌ Error seeding modules:', error);
        throw error;
    }
}

// Run the seed
seedModules()
    .then(() => {
        console.log('Seed completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    });
