import 'dotenv/config';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function verifyLogin() {
    console.log('Verifying admin login...');

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, 'admin@sekolah.com'),
        });

        if (!user) {
            console.log('❌ User admin@sekolah.com not found!');
            return;
        }

        console.log('User found:', user.email);

        const isValid = await bcrypt.compare('admin123', user.password);

        if (isValid) {
            console.log('✅ Password "admin123" is CORRECT!');
            console.log('Login should work now.');
        } else {
            console.log('❌ Password "admin123" is INCORRECT.');
            console.log('Current hash in DB:', user.password);
            console.log('Please run the update-passwords.sql script in Supabase SQL Editor.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

verifyLogin();
