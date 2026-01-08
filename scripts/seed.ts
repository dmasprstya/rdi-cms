import { db } from '../db';
import { users, students, classes } from '../db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Starting database seed...');

    try {
        // Create classes first
        const [class10A] = await db
            .insert(classes)
            .values({
                name: 'X-A',
                grade: 10,
                academicYear: '2023/2024',
            })
            .returning();

        console.log('✅ Created class:', class10A.name);

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const [adminUser] = await db
            .insert(users)
            .values({
                name: 'Admin Sekolah',
                email: 'admin@sekolah.com',
                password: adminPassword,
                role: 'admin',
            })
            .returning();

        console.log('✅ Created admin user:', adminUser.email);

        // Create student user
        const studentPassword = await bcrypt.hash('siswa123', 10);
        const [studentUser] = await db
            .insert(users)
            .values({
                name: 'Ahmad Zaki',
                email: 'siswa@sekolah.com',
                password: studentPassword,
                role: 'student',
            })
            .returning();

        console.log('✅ Created student user:', studentUser.email);

        // Create student profile
        const [studentProfile] = await db
            .insert(students)
            .values({
                userId: studentUser.id,
                nis: '2023001',
                classId: class10A.id,
                phone: '081234567890',
                address: 'Jl. Merdeka No. 123, Jakarta',
                dateOfBirth: new Date('2008-05-15'),
            })
            .returning();

        console.log('✅ Created student profile:', studentProfile.nis);

        // Create editor user
        const editorPassword = await bcrypt.hash('editor123', 10);
        const [editorUser] = await db
            .insert(users)
            .values({
                name: 'Editor CMS',
                email: 'editor@sekolah.com',
                password: editorPassword,
                role: 'editor',
            })
            .returning();

        console.log('✅ Created editor user:', editorUser.email);

        console.log('\n✨ Seed completed successfully!');
        console.log('\n📝 Login credentials:');
        console.log('Admin:');
        console.log('  Email: admin@sekolah.com');
        console.log('  Password: admin123');
        console.log('\nStudent:');
        console.log('  Email: siswa@sekolah.com');
        console.log('  Password: siswa123');
        console.log('\nEditor (CMS):');
        console.log('  Email: editor@sekolah.com');
        console.log('  Password: editor123');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        process.exit(0);
    });
