import 'dotenv/config';
import { db } from '../db';
import { users } from '../db/schema';

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗');

        const result = await db.select().from(users).limit(1);
        console.log('✅ Database connection successful!');
        console.log('Found users:', result.length);

        if (result.length > 0) {
            console.log('First user:', result[0].email, '- Role:', result[0].role);
        }
    } catch (error: any) {
        console.error('❌ Database connection failed:');
        console.error(error.message);
        console.error('\nError code:', error.code);
        console.error('\nFull error:', error);
    }
    process.exit(0);
}

testConnection();
