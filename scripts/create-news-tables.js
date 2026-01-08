/**
 * Script untuk create news tables manual
 * Run: node scripts/create-news-tables.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Allow self-signed certificates
    },
});

async function createTables() {
    console.log('🚀 Creating news tables...\n');

    try {
        // Read SQL file
        const sqlFile = path.join(__dirname, 'create-news-tables.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute SQL
        await pool.query(sql);

        console.log('✅ Tables created successfully!\n');

        // Verify tables exist
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('news', 'news_images')
            ORDER BY table_name;
        `);

        console.log('📋 Verified tables:');
        result.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        console.log('\n✨ Done! You can now create news in the CMS.');

    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createTables();
