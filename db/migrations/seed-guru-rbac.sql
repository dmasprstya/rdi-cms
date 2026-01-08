-- Seed Data Script for Guru RBAC System
-- Run this after applying the main migration
-- This creates sample data for testing all features

-- ============================================
-- STEP 1: Create a Sample Guru User
-- ============================================

-- Insert guru user (password: guru123)
INSERT INTO users (id, email, password, name, role) VALUES 
('guru-001', 'guru@sekolah.com', '$2a$10$rMdDlQ5Oa135RCiWCuGHDedo/hvsr5Cxh.vtnCkf45Yl3WDk2PGXS', 'Pak Ahmad Guru', 'guru')
ON CONFLICT (id) DO NOTHING;

-- Create teacher profile for guru
INSERT INTO teachers (id, user_id, nip, subject, phone, date_of_birth) VALUES 
('teacher-001', 'guru-001', '198501012010011001', 'Matematika', '08123456789', '1985-01-01')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 2: Sample Classes (if not exist)
-- ============================================

INSERT INTO classes (id, name, grade, academic_year) VALUES 
('class-10a', '10-A', 10, '2024/2025'),
('class-10b', '10-B', 10, '2024/2025'),
('class-11a', '11-A', 11, '2024/2025')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 3: Assign Classes to Guru
-- ============================================

INSERT INTO guru_kelas (id, teacher_id, class_id) VALUES 
(gen_random_uuid()::text, 'teacher-001', 'class-10a'),
(gen_random_uuid()::text, 'teacher-001', 'class-10b')
ON CONFLICT (teacher_id, class_id) DO NOTHING;

-- ============================================
-- STEP 4: Sample Subjects (if not exist)
-- ============================================

INSERT INTO subjects (id, name, code, description) VALUES 
('subject-math', 'Matematika', 'MTK', 'Mata pelajaran Matematika'),
('subject-physics', 'Fisika', 'FIS', 'Mata pelajaran Fisika'),
('subject-chemistry', 'Kimia', 'KIM', 'Mata pelajaran Kimia'),
('subject-biology', 'Biologi', 'BIO', 'Mata pelajaran Biologi'),
('subject-english', 'Bahasa Inggris', 'ENG', 'Mata pelajaran Bahasa Inggris')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: Assign Subjects to Classes
-- ============================================

INSERT INTO kelas_mata_pelajaran (id, class_id, subject_id) VALUES 
(gen_random_uuid()::text, 'class-10a', 'subject-math'),
(gen_random_uuid()::text, 'class-10a', 'subject-physics'),
(gen_random_uuid()::text, 'class-10a', 'subject-english'),
(gen_random_uuid()::text, 'class-10b', 'subject-math'),
(gen_random_uuid()::text, 'class-10b', 'subject-chemistry'),
(gen_random_uuid()::text, 'class-11a', 'subject-math')
ON CONFLICT (class_id, subject_id) DO NOTHING;

-- ============================================
-- STEP 6: Sample Students
-- ============================================

-- Create student users
INSERT INTO users (id, email, password, name, role) VALUES 
('student-001', 'siswa1@sekolah.com', '$2a$10$zHm3sgjofJZre/CtTQ4Dc.2.DtXQD1ybQFMVC/VoMRm0EpsHZtVym', 'Ahmad Rizky', 'student'),
('student-002', 'siswa2@sekolah.com', '$2a$10$zHm3sgjofJZre/CtTQ4Dc.2.DtXQD1ybQFMVC/VoMRm0EpsHZtVym', 'Siti Nurhaliza', 'student'),
('student-003', 'siswa3@sekolah.com', '$2a$10$zHm3sgjofJZre/CtTQ4Dc.2.DtXQD1ybQFMVC/VoMRm0EpsHZtVym', 'Budi Santoso', 'student'),
('student-004', 'siswa4@sekolah.com', '$2a$10$zHm3sgjofJZre/CtTQ4Dc.2.DtXQD1ybQFMVC/VoMRm0EpsHZtVym', 'Dewi Lestari', 'student')
ON CONFLICT (id) DO NOTHING;

-- Create student profiles
INSERT INTO students (id, user_id, nis, class_id, phone, address, date_of_birth) VALUES 
('stud-001', 'student-001', '2024001', 'class-10a', '08111111111', 'Jl. Merdeka No. 1', '2008-03-15'),
('stud-002', 'student-002', '2024002', 'class-10a', '08222222222', 'Jl. Sudirman No. 2', '2008-05-20'),
('stud-003', 'student-003', '2024003', 'class-10b', '08333333333', 'Jl. Thamrin No. 3', '2008-07-10'),
('stud-004', 'student-004', '2024004', 'class-10b', '08444444444', 'Jl. Gatot Subroto No. 4', '2008-09-25')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 7: Sample Module
-- ============================================

INSERT INTO modules (id, title, description, content, subject_id, class_id, teacher_id, file_url, is_published) VALUES 
(gen_random_uuid()::text, 
 'Pengenalan Aljabar', 
 'Modul pembelajaran dasar aljabar untuk kelas 10',
 'Dalam modul ini, kita akan mempelajari konsep dasar aljabar termasuk variabel, konstanta, dan persamaan linear.',
 'subject-math',
 'class-10a',
 'teacher-001',
 'https://example.com/modul-aljabar.pdf',
 true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 8: Sample Grades
-- ============================================

INSERT INTO grades (id, student_id, subject_id, class_id, teacher_id, score, semester, academic_year, remarks) VALUES 
(gen_random_uuid()::text, 'stud-001', 'subject-math', 'class-10a', 'teacher-001', 85, 1, '2024/2025', 'Bagus, pertahankan!'),
(gen_random_uuid()::text, 'stud-002', 'subject-math', 'class-10a', 'teacher-001', 90, 1, '2024/2025', 'Excellent!'),
(gen_random_uuid()::text, 'stud-003', 'subject-math', 'class-10b', 'teacher-001', 78, 1, '2024/2025', 'Perlu lebih banyak latihan'),
(gen_random_uuid()::text, 'stud-004', 'subject-math', 'class-10b', 'teacher-001', 82, 1, '2024/2025', 'Cukup baik')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 9: Sample Announcement
-- ============================================

INSERT INTO announcements (id, title, content, author_id, is_active) VALUES 
(gen_random_uuid()::text,
 'Informasi Ujian Tengah Semester',
 'Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Januari 2025. Harap mempersiapkan diri dengan baik.',
 'guru-001',
 true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify the seed data:

-- Check guru user
-- SELECT * FROM users WHERE role = 'guru';

-- Check teacher teaching assignments
-- SELECT t.nip, u.name, c.name as class_name 
-- FROM guru_kelas gk
-- JOIN teachers t ON gk.teacher_id = t.id
-- JOIN users u ON t.user_id = u.id
-- JOIN classes c ON gk.class_id = c.id;

-- Check class-subject assignments
-- SELECT c.name as class_name, s.name as subject_name
-- FROM kelas_mata_pelajaran km
-- JOIN classes c ON km.class_id = c.id
-- JOIN subjects s ON km.subject_id = s.id;

-- Check students
-- SELECT u.name, s.nis, c.name as class_name
-- FROM students s
-- JOIN users u ON s.user_id = u.id
-- LEFT JOIN classes c ON s.class_id = c.id;

-- ============================================
-- CLEANUP (if needed)
-- ============================================

-- Uncomment to remove seed data:
-- DELETE FROM announcements WHERE author_id = 'guru-001';
-- DELETE FROM grades WHERE teacher_id = 'teacher-001';
-- DELETE FROM modules WHERE teacher_id = 'teacher-001';
-- DELETE FROM kelas_mata_pelajaran WHERE class_id IN ('class-10a', 'class-10b', 'class-11a');
-- DELETE FROM guru_kelas WHERE teacher_id = 'teacher-001';
-- DELETE FROM students WHERE id LIKE 'stud-%';
-- DELETE FROM users WHERE id LIKE 'student-%';
-- DELETE FROM subjects WHERE id LIKE 'subject-%';
-- DELETE FROM classes WHERE id LIKE 'class-%';
-- DELETE FROM teachers WHERE id = 'teacher-001';
-- DELETE FROM users WHERE id = 'guru-001';
