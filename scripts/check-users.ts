import 'dotenv/config';
import { db } from '../db';
import { users } from '../db/schema';

async function checkUsers() {
    console.log('🔍 Checking users in database...');
    try {
        const allUsers = await db.select().from(users);
        console.log(`Found ${allUsers.length} users:`);
        allUsers.forEach(u => {
            console.log(`- ${u.email} (${u.role})`);
        });
    } catch (error) {
        console.error('❌ Failed to query users:', error);
    }
    process.exit(0);
}

checkUsers();
