import 'dotenv/config';
import { db } from '../db';
import { users, teachers } from '../db/schema';
import bcrypt from 'bcryptjs';

async function seedTeachers() {
    try {
        console.log('🌱 Seeding teachers...');

        const teachersData = [
            {
                name: 'Dr. Ahmad Wijaya',
                email: 'ahmad.wijaya@sekolah.com',
                nip: '197801012001121001',
                subject: 'Matematika',
                phone: '081234567801',
                dateOfBirth: new Date('1978-01-01'),
            },
            {
                name: 'Siti Nurhaliza, S.Pd',
                email: 'siti.nurhaliza@sekolah.com',
                nip: '198205152005012002',
                subject: 'Bahasa Indonesia',
                phone: '081234567802',
                dateOfBirth: new Date('1982-05-15'),
            },
            {
                name: 'Budi Santoso, M.Pd',
                email: 'budi.santoso@sekolah.com',
                nip: '198009102006011003',
                subject: 'Fisika',
                phone: '081234567803',
                dateOfBirth: new Date('1980-09-10'),
            },
            {
                name: 'Dewi Lestari, S.Si',
                email: 'dewi.lestari@sekolah.com',
                nip: '198512202009012004',
                subject: 'Kimia',
                phone: '081234567804',
                dateOfBirth: new Date('1985-12-20'),
            },
            {
                name: 'Rudi Hartono, S.Pd',
                email: 'rudi.hartono@sekolah.com',
                nip: '197603252000121005',
                subject: 'Biologi',
                phone: '081234567805',
                dateOfBirth: new Date('1976-03-25'),
            },
            {
                name: 'Rina Wulandari, S.S',
                email: 'rina.wulandari@sekolah.com',
                nip: '198807082010012006',
                subject: 'Bahasa Inggris',
                phone: '081234567806',
                dateOfBirth: new Date('1988-07-08'),
            },
            {
                name: 'Eko Prasetyo, S.Pd',
                email: 'eko.prasetyo@sekolah.com',
                nip: '197911152003121007',
                subject: 'Sejarah',
                phone: '081234567807',
                dateOfBirth: new Date('1979-11-15'),
            },
        ];

        const password = await bcrypt.hash('guru123', 10);

        for (const teacher of teachersData) {
            // Create user
            const [newUser] = await db
                .insert(users)
                .values({
                    name: teacher.name,
                    email: teacher.email,
                    password,
                    role: 'staff',
                })
                .returning();

            // Create teacher
            await db.insert(teachers).values({
                userId: newUser.id,
                nip: teacher.nip,
                subject: teacher.subject,
                phone: teacher.phone,
                dateOfBirth: teacher.dateOfBirth,
            });

            console.log(`✅ Created teacher: ${teacher.name}`);
        }

        console.log('✅ Teachers seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding teachers:', error);
        throw error;
    }
}

// Run the seed
seedTeachers()
    .then(() => {
        console.log('Seed completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    });
