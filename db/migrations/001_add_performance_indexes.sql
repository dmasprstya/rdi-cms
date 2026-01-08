-- Migration: Add performance indexes for frequently queried columns

-- 1. Users Table
-- Used for sorting users by registration date (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
-- Used for login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- Used for filtering by role
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Students Table
-- Used for joining with users table
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
-- Used for filtering students by class
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
-- Used for sorting students
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);
-- Used for searching by NIS
CREATE INDEX IF NOT EXISTS idx_students_nis ON students(nis);

-- 3. Teachers Table
-- Used for joining with users table
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
-- Used for searching by NIP
CREATE INDEX IF NOT EXISTS idx_teachers_nip ON teachers(nip);

-- 4. Grades Table (Critical for performance)
-- Used for fetching a student's grades
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
-- Used for fetching grades for a specific subject
CREATE INDEX IF NOT EXISTS idx_grades_subject_id ON grades(subject_id);
-- Used for sorting grades
CREATE INDEX IF NOT EXISTS idx_grades_created_at ON grades(created_at DESC);
-- Used for filtering by academic year
CREATE INDEX IF NOT EXISTS idx_grades_academic_year ON grades(academic_year);
-- Used for filtering by semester
CREATE INDEX IF NOT EXISTS idx_grades_semester ON grades(semester);
-- Composite index for common query: Get student grades for specific year/semester
CREATE INDEX IF NOT EXISTS idx_grades_student_year_semester ON grades(student_id, academic_year, semester);

-- 5. Schedules Table
-- Used for fetching class schedules
CREATE INDEX IF NOT EXISTS idx_schedules_class_id ON schedules(class_id);
-- Used for fetching teacher schedules
CREATE INDEX IF NOT EXISTS idx_schedules_teacher_id ON schedules(teacher_id);
-- Used for fetching subject schedules
CREATE INDEX IF NOT EXISTS idx_schedules_subject_id ON schedules(subject_id);
-- Used for filtering by day
CREATE INDEX IF NOT EXISTS idx_schedules_day ON schedules(day);

-- 6. Announcements Table
-- Used for sorting announcements
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
-- Used for filtering active announcements
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
-- Partial index for active announcements (common query)
CREATE INDEX IF NOT EXISTS idx_announcements_active_recent ON announcements(created_at DESC) WHERE is_active = true;

-- 7. Classes Table
-- Used for filtering by academic year
CREATE INDEX IF NOT EXISTS idx_classes_academic_year ON classes(academic_year);
-- Used for filtering by grade level
CREATE INDEX IF NOT EXISTS idx_classes_grade ON classes(grade);

-- 8. Subjects Table
-- Used for searching by code
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);

-- Comments
COMMENT ON INDEX idx_users_created_at IS 'Optimizes user list sorting';
COMMENT ON INDEX idx_grades_student_year_semester IS 'Optimizes student report card generation';
COMMENT ON INDEX idx_announcements_active_recent IS 'Optimizes dashboard announcement feed';
