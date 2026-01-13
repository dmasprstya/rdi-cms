-- Migration: Add file metadata fields to modules table
-- Created: 2026-01-13
-- Description: Adds fileName and fileSize columns to support PDF file uploads

ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_size INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN modules.file_name IS 'Original filename of uploaded PDF';
COMMENT ON COLUMN modules.file_size IS 'File size in bytes';
