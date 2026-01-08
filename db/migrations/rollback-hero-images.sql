-- =====================================================
-- Hero Images Rollback Script
-- Description: Rollback hero_images migration if needed
-- Author: System
-- Date: 2026-01-07
-- WARNING: This will delete all hero images data!
-- =====================================================

-- Step 1: Drop hero_images Table
-- =====================================================
DROP TABLE IF EXISTS hero_images CASCADE;

-- Step 2: Restore Original Hero Content from Backup
-- =====================================================
-- Delete current hero section
DELETE FROM landing_page_content WHERE section = 'rdi-hero';

-- Restore from backup
INSERT INTO landing_page_content (section, content, is_published, last_edited_by, created_at, updated_at)
SELECT section, content, is_published, last_edited_by, created_at, updated_at
FROM hero_backup;

-- Step 3: Verify Restoration
-- =====================================================
-- Verify table is dropped
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_name = 'hero_images';
-- Expected: 0

-- Verify hero content restored
SELECT section, created_at, updated_at
FROM landing_page_content
WHERE section = 'rdi-hero';
-- Expected: 1 row with original data

-- Step 4: Cleanup (Optional)
-- =====================================================
-- Uncomment to drop backup table after verification
-- DROP TABLE IF EXISTS hero_backup;

-- Rollback Complete!
SELECT 'Hero images rollback completed successfully!' as status;
SELECT 'Backup table "hero_backup" is still available for safety.' as note;
SELECT 'Run "DROP TABLE hero_backup;" when ready to cleanup.' as cleanup_instruction;
