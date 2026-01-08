-- Migration: Add Guru Role and Junction Tables
-- Created: 2025-12-24
-- Description: Adds guru role, junction tables for many-to-many relationships, and updates grades table

-- Step 1: Add 'guru' to role enum (if not already exists)
-- Note: This requires recreating the enum in PostgreSQL
DO $$ 
BEGIN
    -- Create new enum with guru (if not exists)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_new') THEN
        CREATE TYPE role_new AS ENUM ('admin', 'staff', 'student', 'editor', 'guru');
    END IF;
    
    -- Drop default value temporarily
    ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
    
    -- Alter table to use new enum
    ALTER TABLE users ALTER COLUMN role TYPE role_new USING role::text::role_new;
    
    -- Restore default value
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'student';
    
    -- Drop old enum and rename new one
    DROP TYPE IF EXISTS role CASCADE;
    ALTER TYPE role_new RENAME TO role;
END $$;

-- Step 2: Add classId and teacherId to grades table (if columns don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grades' AND column_name = 'class_id') THEN
        ALTER TABLE grades ADD COLUMN class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'grades' AND column_name = 'teacher_id') THEN
        ALTER TABLE grades ADD COLUMN teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Step 3: Create guru_kelas junction table (if not exists)
CREATE TABLE IF NOT EXISTS guru_kelas (
    id TEXT PRIMARY KEY,
    teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(teacher_id, class_id)
);

-- Step 4: Create kelas_mata_pelajaran junction table (if not exists)
CREATE TABLE IF NOT EXISTS kelas_mata_pelajaran (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, subject_id)
);

-- Step 5: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_guru_kelas_teacher ON guru_kelas(teacher_id);
CREATE INDEX IF NOT EXISTS idx_guru_kelas_class ON guru_kelas(class_id);
CREATE INDEX IF NOT EXISTS idx_kelas_mata_pelajaran_class ON kelas_mata_pelajaran(class_id);
CREATE INDEX IF NOT EXISTS idx_kelas_mata_pelajaran_subject ON kelas_mata_pelajaran(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_class ON grades(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_teacher ON grades(teacher_id);
CREATE INDEX IF NOT EXISTS idx_modules_teacher ON modules(teacher_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author ON announcements(author_id);

-- Step 6: Add comments for documentation
COMMENT ON TABLE guru_kelas IS 'Junction table for many-to-many relationship between teachers and classes';
COMMENT ON TABLE kelas_mata_pelajaran IS 'Junction table for many-to-many relationship between classes and subjects';
COMMENT ON COLUMN grades.class_id IS 'Reference to the class where the grade was given';
COMMENT ON COLUMN grades.teacher_id IS 'Reference to the teacher who input the grade';

-- Rollback script (commented out, use if needed):
-- DROP TABLE IF EXISTS kelas_mata_pelajaran CASCADE;
-- DROP TABLE IF EXISTS guru_kelas CASCADE;
-- ALTER TABLE grades DROP COLUMN IF EXISTS class_id;
-- ALTER TABLE grades DROP COLUMN IF EXISTS teacher_id;
