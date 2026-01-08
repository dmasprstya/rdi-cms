-- Quick migration execution script
-- This will be run manually via psql or db tool

-- Step 1: Verify connection
SELECT current_database(), current_user;

-- Step 2: Check if table already exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'hero_images'
) as table_exists;

-- Step 3: If not exists, run the migration
-- Copy and paste content from add-hero-images.sql

-- Step 4: Verify migration success
SELECT 
    COUNT(*) as hero_images_count,
    (SELECT COUNT(*) FROM landing_page_content WHERE section = 'rdi-hero') as hero_content_count
FROM hero_images;
