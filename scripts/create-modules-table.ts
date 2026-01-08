import 'dotenv/config';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function createModulesTable() {
    try {
        console.log('📋 Creating modules table...');

        // Read the SQL file
        const sqlFilePath = path.join(__dirname, 'create-modules-table.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

        // Execute the SQL
        await db.execute(sql.raw(sqlContent));

        console.log('✅ Modules table created successfully!');
    } catch (error) {
        console.error('❌ Error creating modules table:', error);
        throw error;
    }
}

// Run the script
createModulesTable()
    .then(() => {
        console.log('Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
