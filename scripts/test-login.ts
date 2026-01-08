import 'dotenv/config';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function testLogin() {
    console.log('🔐 Testing login credentials...');

    // Test Admin
    console.log('\nTesting Admin (admin@sekolah.com)...');
    const admin = await db.query.users.findFirst({
        where: eq(users.email, 'admin@sekolah.com'),
    });

    if (!admin) {
        console.log('❌ Admin user not found!');
    } else {
        const adminPass = 'admin123';
        const isAdminValid = await bcrypt.compare(adminPass, admin.password);
        console.log(`Password '${adminPass}': ${isAdminValid ? '✅ Valid' : '❌ Invalid'}`);
        if (!isAdminValid) {
            console.log('Stored hash:', admin.password);
            const newHash = await bcrypt.hash(adminPass, 10);
            console.log('Expected hash format:', newHash);
        }
    }

    // Test Student
    console.log('\nTesting Student (siswa@sekolah.com)...');
    const student = await db.query.users.findFirst({
        where: eq(users.email, 'siswa@sekolah.com'),
    });

    if (!student) {
        console.log('❌ Student user not found!');
    } else {
        const studentPass = 'siswa123';
        const isStudentValid = await bcrypt.compare(studentPass, student.password);
        console.log(`Password '${studentPass}': ${isStudentValid ? '✅ Valid' : '❌ Invalid'}`);
    }

    process.exit(0);
}

testLogin();
