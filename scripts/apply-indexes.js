#!/usr/bin/env node

/**
 * Script to apply performance indexes to the database
 * Run: node scripts/apply-indexes.js
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function applyIndexes() {
    console.log('🚀 Starting database index migration...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'src', 'db', 'migrations', '001_add_performance_indexes.sql');

    if (!fs.existsSync(migrationPath)) {
        console.error('❌ Migration file not found:', migrationPath);
        process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Check for DATABASE_URL
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found in environment variables');
        console.error('Please set DATABASE_URL in your .env file');
        process.exit(1);
    }

    // Create database client
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        // Connect to database
        console.log('📊 Connecting to database...');
        await client.connect();
        console.log('✅ Connected to database\n');

        // Execute migration
        console.log('⚙️  Applying indexes...');
        await client.query(migrationSQL);
        console.log('✅ Indexes applied successfully!\n');

        // Verify indexes were created
        const result = await client.query(`
            SELECT 
                schemaname,
                tablename,
                indexname
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND indexname LIKE 'idx_%'
            ORDER BY tablename, indexname;
        `);

        console.log('📋 Created indexes:');
        console.log('─'.repeat(80));

        let currentTable = '';
        result.rows.forEach(row => {
            if (row.tablename !== currentTable) {
                currentTable = row.tablename;
                console.log(`\n${row.tablename}:`);
            }
            console.log(`  ✓ ${row.indexname}`);
        });

        console.log('\n' + '─'.repeat(80));
        console.log(`\n✨ Successfully created ${result.rows.length} indexes!\n`);

        // Run ANALYZE on all tables
        console.log('⚡ Running ANALYZE to update statistics...');
        const tables = ['users', 'students', 'teachers', 'grades', 'schedules', 'announcements', 'classes', 'subjects'];

        for (const table of tables) {
            await client.query(`ANALYZE ${table};`);
            console.log(`  ✓ Analyzed ${table}`);
        }

        console.log('\n✅ Database optimization complete!\n');

    } catch (error) {
        console.error('\n❌ Error applying indexes:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);

    } finally {
        await client.end();
        console.log('👋 Disconnected from database');
    }
}

// Run the migration
applyIndexes().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
