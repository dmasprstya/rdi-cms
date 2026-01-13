import * as dotenv from 'dotenv';

// Load .env file FIRST before any other imports
dotenv.config();

import { db } from '@/db';
import { users, teachers, students, classes, subjects, modules, grades, announcements, guruKelas, kelasMataPelajaran } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seedGuruRBAC() {
    try {
        console.log('🌱 Starting GURU RBAC seed...\n');

        // Hash passwords
        const guruPasswordHash = await bcrypt.hash('guru123', 10);
        const studentPasswordHash = await bcrypt.hash('student123', 10);

        console.log('1️⃣  Creating Guru user...');
        // Insert guru user
        await db.insert(users).values({
            id: 'guru-001',
            email: 'guru@sekolah.com',
            password: guruPasswordHash,
            name: 'Pak Ahmad Guru',
            role: 'guru',
        }).onConflictDoNothing();

        // Create teacher profile for guru
        await db.insert(teachers).values({
            id: 'teacher-001',
            userId: 'guru-001',
            nip: '198501012010011001',
            subject: 'Matematika',
            phone: '08123456789',
            dateOfBirth: new Date('1985-01-01'),
        }).onConflictDoNothing();

        console.log('2️⃣  Creating classes...');
        // Insert classes
        await db.insert(classes).values([
            { id: 'class-10a', name: '10-A', academicYear: '2024/2025' },
            { id: 'class-10b', name: '10-B', academicYear: '2024/2025' },
            { id: 'class-11a', name: '11-A', academicYear: '2024/2025' },
        ]).onConflictDoNothing();

        console.log('3️⃣  Assigning classes to guru...');
        // Assign classes to guru
        await db.insert(guruKelas).values([
            { teacherId: 'teacher-001', classId: 'class-10a' },
            { teacherId: 'teacher-001', classId: 'class-10b' },
        ]).onConflictDoNothing();

        console.log('4️⃣  Creating subjects...');
        // Insert subjects
        await db.insert(subjects).values([
            { id: 'subject-math', name: 'Matematika', code: 'MTK', description: 'Mata pelajaran Matematika' },
            { id: 'subject-physics', name: 'Fisika', code: 'FIS', description: 'Mata pelajaran Fisika' },
            { id: 'subject-chemistry', name: 'Kimia', code: 'KIM', description: 'Mata pelajaran Kimia' },
            { id: 'subject-biology', name: 'Biologi', code: 'BIO', description: 'Mata pelajaran Biologi' },
            { id: 'subject-english', name: 'Bahasa Inggris', code: 'ENG', description: 'Mata pelajaran Bahasa Inggris' },
        ]).onConflictDoNothing();

        console.log('5️⃣  Assigning subjects to classes...');
        // Assign subjects to classes
        await db.insert(kelasMataPelajaran).values([
            { classId: 'class-10a', subjectId: 'subject-math' },
            { classId: 'class-10a', subjectId: 'subject-physics' },
            { classId: 'class-10a', subjectId: 'subject-english' },
            { classId: 'class-10b', subjectId: 'subject-math' },
            { classId: 'class-10b', subjectId: 'subject-chemistry' },
            { classId: 'class-11a', subjectId: 'subject-math' },
        ]).onConflictDoNothing();

        console.log('6️⃣  Creating students...');
        // Create student users
        await db.insert(users).values([
            { id: 'student-001', email: 'siswa1@sekolah.com', password: studentPasswordHash, name: 'Ahmad Rizky', role: 'student' },
            { id: 'student-002', email: 'siswa2@sekolah.com', password: studentPasswordHash, name: 'Siti Nurhaliza', role: 'student' },
            { id: 'student-003', email: 'siswa3@sekolah.com', password: studentPasswordHash, name: 'Budi Santoso', role: 'student' },
            { id: 'student-004', email: 'siswa4@sekolah.com', password: studentPasswordHash, name: 'Dewi Lestari', role: 'student' },
        ]).onConflictDoNothing();

        // Create student profiles
        await db.insert(students).values([
            { id: 'stud-001', userId: 'student-001', nis: '2024001', classId: 'class-10a', phone: '08111111111', address: 'Jl. Merdeka No. 1', dateOfBirth: new Date('2008-03-15') },
            { id: 'stud-002', userId: 'student-002', nis: '2024002', classId: 'class-10a', phone: '08222222222', address: 'Jl. Sudirman No. 2', dateOfBirth: new Date('2008-05-20') },
            { id: 'stud-003', userId: 'student-003', nis: '2024003', classId: 'class-10b', phone: '08333333333', address: 'Jl. Thamrin No. 3', dateOfBirth: new Date('2008-07-10') },
            { id: 'stud-004', userId: 'student-004', nis: '2024004', classId: 'class-10b', phone: '08444444444', address: 'Jl. Gatot Subroto No. 4', dateOfBirth: new Date('2008-09-25') },
        ]).onConflictDoNothing();

        console.log('7️⃣  Creating sample module...');
        // Insert sample module
        await db.insert(modules).values({
            title: 'Pengenalan Aljabar',
            description: 'Modul pembelajaran dasar aljabar untuk kelas 10',
            content: 'Dalam modul ini, kita akan mempelajari konsep dasar aljabar termasuk variabel, konstanta, dan persamaan linear.',
            subjectId: 'subject-math',
            classId: 'class-10a',
            teacherId: 'teacher-001',
            fileUrl: 'https://example.com/modul-aljabar.pdf',
            isPublished: true,
        }).onConflictDoNothing();

        console.log('8️⃣  Creating sample grades...');
        // Insert sample grades
        await db.insert(grades).values([
            { studentId: 'stud-001', subjectId: 'subject-math', classId: 'class-10a', teacherId: 'teacher-001', score: 85, semester: 1, academicYear: '2024/2025', remarks: 'Bagus, pertahankan!' },
            { studentId: 'stud-002', subjectId: 'subject-math', classId: 'class-10a', teacherId: 'teacher-001', score: 90, semester: 1, academicYear: '2024/2025', remarks: 'Excellent!' },
            { studentId: 'stud-003', subjectId: 'subject-math', classId: 'class-10b', teacherId: 'teacher-001', score: 78, semester: 1, academicYear: '2024/2025', remarks: 'Perlu lebih banyak latihan' },
            { studentId: 'stud-004', subjectId: 'subject-math', classId: 'class-10b', teacherId: 'teacher-001', score: 82, semester: 1, academicYear: '2024/2025', remarks: 'Cukup baik' },
        ]).onConflictDoNothing();

        console.log('9️⃣  Creating sample announcement...');
        // Insert sample announcement
        await db.insert(announcements).values({
            title: 'Informasi Ujian Tengah Semester',
            content: 'Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Januari 2025. Harap mempersiapkan diri dengan baik.',
            authorId: 'guru-001',
            isActive: true,
        }).onConflictDoNothing();

        console.log('\n✨ Seed completed successfully!');
        console.log('\n📋 Test credentials:');
        console.log('   Guru: guru@sekolah.com / guru123');
        console.log('   Student 1: siswa1@sekolah.com / student123');
        console.log('   Student 2: siswa2@sekolah.com / student123');
        console.log('   Student 3: siswa3@sekolah.com / student123');
        console.log('   Student 4: siswa4@sekolah.com / student123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seedGuruRBAC();
