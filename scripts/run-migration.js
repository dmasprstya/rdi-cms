/**
 * Run database migration for adding fileName and fileSize columns
 * Usage: node scripts/run-migration.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from environment or .env file
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
}

async function runMigration() {
    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // For self-signed certificates
        }
    });

    try {
        console.log('🔄 Connecting to database...');
        const client = await pool.connect();

        console.log('✅ Connected to database');
        console.log('🔄 Running migration: Add fileName and fileSize columns...');

        // Read migration SQL file
        const migrationPath = path.join(__dirname, '..', 'db', 'migrations', '0001_add_module_file_metadata.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        // Execute migration
        await client.query(migrationSQL);

        console.log('✅ Migration completed successfully!');
        console.log('✅ Columns fileName and fileSize added to modules table');

        client.release();
        await pool.end();

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error('Full error:', error);
        await pool.end();
        process.exit(1);
    }
}

runMigration();
