import 'dotenv/config';
import { db } from '../db';
import { subjects } from '../db/schema';

async function seedSubjects() {
    try {
        console.log('🌱 Seeding subjects...');

        const subjectsData = [
            {
                name: 'Matematika',
                code: 'MTK',
                credits: 4,
                description: 'Mata pelajaran matematika untuk SMA',
            },
            {
                name: 'Bahasa Indonesia',
                code: 'BIND',
                credits: 4,
                description: 'Mata pelajaran bahasa Indonesia',
            },
            {
                name: 'Bahasa Inggris',
                code: 'BING',
                credits: 3,
                description: 'Mata pelajaran bahasa Inggris',
            },
            {
                name: 'Fisika',
                code: 'FIS',
                credits: 3,
                description: 'Mata pelajaran fisika',
            },
            {
                name: 'Kimia',
                code: 'KIM',
                credits: 3,
                description: 'Mata pelajaran kimia',
            },
            {
                name: 'Biologi',
                code: 'BIO',
                credits: 3,
                description: 'Mata pelajaran biologi',
            },
            {
                name: 'Sejarah',
                code: 'SEJ',
                credits: 2,
                description: 'Mata pelajaran sejarah Indonesia',
            },
            {
                name: 'Geografi',
                code: 'GEO',
                credits: 2,
                description: 'Mata pelajaran geografi',
            },
            {
                name: 'Ekonomi',
                code: 'EKO',
                credits: 3,
                description: 'Mata pelajaran ekonomi',
            },
            {
                name: 'Sosiologi',
                code: 'SOS',
                credits: 2,
                description: 'Mata pelajaran sosiologi',
            },
            {
                name: 'Pendidikan Agama',
                code: 'PAI',
                credits: 2,
                description: 'Pendidikan agama Islam',
            },
            {
                name: 'Pendidikan Jasmani',
                code: 'PJOK',
                credits: 2,
                description: 'Pendidikan jasmani, olahraga, dan kesehatan',
            },
        ];

        for (const subject of subjectsData) {
            await db.insert(subjects).values(subject);
            console.log(`✅ Created subject: ${subject.name} (${subject.code})`);
        }

        console.log('✅ Subjects seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding subjects:', error);
        throw error;
    }
}

// Run the seed
seedSubjects()
    .then(() => {
        console.log('Seed completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    });
