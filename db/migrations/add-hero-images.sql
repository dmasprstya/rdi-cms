-- =====================================================
-- Hero Images Migration Script
-- Description: Add hero_images table untuk slideshow feature
-- Author: System
-- Date: 2026-01-07
-- =====================================================

-- Step 1: Backup Existing Data
-- =====================================================
CREATE TABLE IF NOT EXISTS hero_backup AS 
SELECT * FROM landing_page_content 
WHERE section = 'rdi-hero';

-- Verify backup
SELECT COUNT(*) as backup_count FROM hero_backup;
-- Expected: 1 row

-- Step 2: Create hero_images Table
-- =====================================================
CREATE TABLE IF NOT EXISTS hero_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    section_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL, -- Required for accessibility
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Step 3: Add Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_hero_images_section ON hero_images(section_id);
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(section_id, "order");

-- Step 4: Add Foreign Key Constraint
-- =====================================================
-- This prevents orphaned images if section is deleted
ALTER TABLE hero_images 
ADD CONSTRAINT fk_hero_section 
FOREIGN KEY (section_id) 
REFERENCES landing_page_content(section)
ON DELETE CASCADE;

-- Step 5: Seed Initial Placeholder Data
-- =====================================================
-- These are placeholder images that will be replaced via CMS
INSERT INTO hero_images (section_id, image_url, alt_text, "order")
VALUES 
    ('rdi-hero', '/images/hero-slide-1.jpg', 'Mahasiswa belajar di luar negeri - Program Go Global', 0),
    ('rdi-hero', '/images/hero-slide-2.jpg', 'Pelatihan sertifikasi halal profesional - HALTEC', 1),
    ('rdi-hero', '/images/hero-slide-3.jpg', 'Institut Rosman Djohan - Pendidikan vokasi terpadu', 2)
ON CONFLICT DO NOTHING;

-- Step 6: Update Hero Content Schema
-- =====================================================
-- Remove videoUrl and add slideshowDuration
UPDATE landing_page_content
SET content = jsonb_set(
    content - 'videoUrl',
    '{slideshowDuration}',
    '6000'::jsonb
)
WHERE section = 'rdi-hero';

-- Step 7: Verification
-- =====================================================
-- Verify table creation
SELECT COUNT(*) as table_exists 
FROM information_schema.tables 
WHERE table_name = 'hero_images';
-- Expected: 1

-- Verify foreign key constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'hero_images' 
  AND constraint_name = 'fk_hero_section';
-- Expected: 1 row with constraint_type = 'FOREIGN KEY'

-- Verify initial data
SELECT COUNT(*) as image_count FROM hero_images WHERE section_id = 'rdi-hero';
-- Expected: 3

-- Verify indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'hero_images';
-- Expected: idx_hero_images_section, idx_hero_images_order

-- Migration Complete!
SELECT 'Hero images migration completed successfully!' as status;
