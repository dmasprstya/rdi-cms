-- SQL Script untuk Setup Database Sistem Sekolah
-- Jalankan script ini di Supabase SQL Editor

-- 1. Create ENUMs
CREATE TYPE role AS ENUM ('admin', 'staff', 'student');
CREATE TYPE day AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- 2. Create Tables

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Classes table
CREATE TABLE classes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nis VARCHAR(20) NOT NULL UNIQUE,
    class_id TEXT REFERENCES classes(id) ON DELETE SET NULL,
    photo_url TEXT,
    address TEXT,
    phone VARCHAR(20),
    date_of_birth TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Teachers table
CREATE TABLE teachers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nip VARCHAR(20) NOT NULL UNIQUE,
    subject VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Subjects table
CREATE TABLE subjects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 2,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Grades table
CREATE TABLE grades (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CHECK (score >= 0 AND score <= 100),
    CHECK (semester IN (1, 2))
);

-- Schedules table
CREATE TABLE schedules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    day day NOT NULL,
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    room VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Create Indexes for better performance
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_subject_id ON grades(subject_id);
CREATE INDEX idx_schedules_class_id ON schedules(class_id);
CREATE INDEX idx_announcements_active ON announcements(is_active);

-- 4. Insert sample data
-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin Sekolah', 'admin@sekolah.com', '$2a$10$NLqCFJqZcobMDa8EgJogi.Qsh4rZMRv3SP7G5VQPNFxoixZSa0rsi', 'admin');

-- Sample class
INSERT INTO classes (name, grade, academic_year)
VALUES ('X-A', 10, '2023/2024');

-- Student user (password: siswa123)  
INSERT INTO users (name, email, password, role)
VALUES ('Ahmad Zaki', 'siswa@sekolah.com', '$2a$10$EP6J1ISw/vnCwHR5mnQRtu0XNhChLhQ7uDFbJvkDzRXZkXLQ25aZW', 'student');

-- Student profile (link dengan class pertama yang dibuat)
INSERT INTO students (user_id, nis, class_id, phone, address, date_of_birth)
SELECT 
    u.id,
    '2023001',
    c.id,
    '081234567890',
    'Jl. Merdeka No. 123, Jakarta',
    '2008-05-15'::timestamp
FROM users u
CROSS JOIN classes c
WHERE u.email = 'siswa@sekolah.com' AND c.name = 'X-A'
LIMIT 1;

-- Sample subjects
INSERT INTO subjects (name, code, credits) VALUES
('M atematika', 'MAT', 4),
('Bahasa Indonesia', 'BIND', 3),
('Bahasa Inggris', 'BING', 3),
('Fisika', 'FIS', 4),
('Kimia', 'KIM', 4);

-- Sample grades untuk Ahmad Zaki
INSERT INTO grades (student_id, subject_id, score, semester, academic_year)
SELECT 
    s.id,
    subj.id,
    CASE subj.code
        WHEN 'MAT' THEN 85
        WHEN 'BIND' THEN 90
        WHEN 'BING' THEN 88
        WHEN 'FIS' THEN 82
        WHEN 'KIM' THEN 86
    END,
    1,
    '2023/2024'
FROM students s
CROSS JOIN subjects subj
WHERE s.nis = '2023001';

-- Sample announcement
INSERT INTO announcements (title, content, author_id)
SELECT 
    'Ujian Tengah Semester',
    'Ujian akan dilaksanakan tanggal 15-20 Desember 2025',
    u.id
FROM users u
WHERE u.role = 'admin'
LIMIT 1;

COMMIT;
