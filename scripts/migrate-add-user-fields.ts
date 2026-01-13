import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

// Migration script to add phone and address columns to users table
const runMigration = async () => {
    console.log('Starting migration: Adding phone and address to users table...');

    const connectionString = process.env.DATABASE_URL!;

    if (!connectionString) {
        throw new Error('DATABASE_URL is not set');
    }

    // Create postgres client with SSL config
    const sql = postgres(connectionString, {
        ssl: 'require',
        max: 1,
    });

    try {
        // Add phone column
        console.log('Adding phone column...');
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`;

        // Add address column
        console.log('Adding address column...');
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT`;

        console.log('✓ Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await sql.end();
    }
};

runMigration()
    .then(() => {
        console.log('Migration script finished');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration script failed:', error);
        process.exit(1);
    });
