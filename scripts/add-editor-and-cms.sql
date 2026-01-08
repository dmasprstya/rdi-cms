-- =====================================================
-- SQL Migration: Tambah Role Editor & Tabel CMS
-- Dijalankan di Supabase SQL Editor
-- Tanggal: 2025-12-12
-- =====================================================

-- LANGKAH 1: Tambah nilai 'editor' ke enum role
-- (Jalankan ini dulu, jika ada error silakan lanjut ke langkah 2)
ALTER TYPE role ADD VALUE IF NOT EXISTS 'editor';

-- LANGKAH 2: Buat tabel untuk konten landing page CMS
CREATE TABLE IF NOT EXISTS landing_page_content (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    section VARCHAR(50) NOT NULL UNIQUE,
    content JSONB NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    last_edited_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_landing_page_section ON landing_page_content(section);
CREATE INDEX IF NOT EXISTS idx_landing_page_published ON landing_page_content(is_published);

-- LANGKAH 3: Insert user Editor
-- Password: editor123 (sudah di-hash dengan bcrypt)
INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES (
    gen_random_uuid()::TEXT,
    'Editor CMS',
    'editor@sekolah.com',
    '$2a$10$gUgvyzqwESYIpOT9YjVxa.FG8f5AEhenHrDmBzncml8DM6Ky7SnAW',
    'editor',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO NOTHING;

-- LANGKAH 4: Seed default content untuk CMS (opsional)
-- Hero Section
INSERT INTO landing_page_content (section, content, is_published)
VALUES (
    'hero',
    '{
        "title": "Sistem Terintegrasi",
        "subtitle": "Sekolah Modern",
        "description": "Solusi digital terpadu untuk meningkatkan efisiensi manajemen sekolah. Kelola data akademik, siswa, dan staff dengan mudah dalam satu platform.",
        "ctaPrimary": "Hubungi Kami",
        "ctaSecondary": "Pelajari Lebih Lanjut"
    }'::JSONB,
    TRUE
)
ON CONFLICT (section) DO NOTHING;

-- About Section
INSERT INTO landing_page_content (section, content, is_published)
VALUES (
    'about',
    '{
        "sectionTitle": "Tentang Sistem Kami",
        "paragraph1": "Sistem Terintegrasi Sekolah (STS) adalah platform manajemen sekolah yang dikembangkan dengan teknologi modern untuk membantu institusi pendidikan mengelola operasional sehari-hari dengan lebih efisien dan terorganisir.",
        "paragraph2": "Dengan antarmuka yang intuitif dan fitur yang komprehensif, STS memungkinkan admin, staff, dan siswa untuk berkolaborasi dalam satu ekosistem digital yang terintegrasi."
    }'::JSONB,
    TRUE
)
ON CONFLICT (section) DO NOTHING;

-- Features Section
INSERT INTO landing_page_content (section, content, is_published)
VALUES (
    'features',
    '{
        "sectionTitle": "Fitur Unggulan",
        "sectionSubtitle": "Dirancang untuk memenuhi kebutuhan sekolah modern dengan teknologi terkini",
        "features": [
            {"id": "1", "icon": "Users", "title": "Manajemen Siswa", "description": "Kelola data siswa dengan mudah"},
            {"id": "2", "icon": "BookOpen", "title": "Nilai & Jadwal", "description": "Catat nilai akademik dan atur jadwal pelajaran"},
            {"id": "3", "icon": "BarChart3", "title": "Dashboard Analytics", "description": "Visualisasi data dengan grafik informatif"},
            {"id": "4", "icon": "Shield", "title": "Role-Based Access", "description": "Keamanan berlapis dengan akses berbasis peran"}
        ]
    }'::JSONB,
    TRUE
)
ON CONFLICT (section) DO NOTHING;

-- Testimonials Section
INSERT INTO landing_page_content (section, content, is_published)
VALUES (
    'testimonials',
    '{
        "sectionTitle": "Testimoni Pengguna",
        "sectionSubtitle": "Apa yang mereka katakan tentang sistem kami",
        "testimonials": [
            {"id": "1", "quote": "Sistem ini sangat membantu dalam mengelola data siswa dan nilai.", "name": "Budi Santoso", "role": "Kepala Sekolah", "school": "SMA Negeri 1"},
            {"id": "2", "quote": "Fitur analytics dan reporting sangat powerful.", "name": "Siti Nurhaliza", "role": "Staff Admin", "school": "SMP Islam Al-Azhar"},
            {"id": "3", "quote": "Sebagai guru, saya terbantu dengan fitur manajemen nilai.", "name": "Ahmad Dhani", "role": "Guru Matematika", "school": "SMK Teknologi 45"}
        ]
    }'::JSONB,
    TRUE
)
ON CONFLICT (section) DO NOTHING;

-- Contact Section
INSERT INTO landing_page_content (section, content, is_published)
VALUES (
    'contact',
    '{
        "sectionTitle": "Hubungi Kami",
        "sectionSubtitle": "Ada pertanyaan atau ingin mencoba sistem kami? Isi form dan tim kami akan segera menghubungi Anda.",
        "email": "info@sts-system.com",
        "phone": "+62 812-3456-7890",
        "alternativeText": "Atau hubungi kami langsung"
    }'::JSONB,
    TRUE
)
ON CONFLICT (section) DO NOTHING;

-- Footer Section
INSERT INTO landing_page_content (section, content, is_published)
VALUES (
    'footer',
    '{
        "brandDescription": "Platform manajemen sekolah modern untuk meningkatkan efisiensi dan produktivitas institusi pendidikan.",
        "quickLinksTitle": "Tautan Cepat",
        "quickLinks": [
            {"id": "1", "label": "Beranda", "href": "#beranda"},
            {"id": "2", "label": "Layanan", "href": "#layanan"},
            {"id": "3", "label": "Tentang", "href": "#tentang"}
        ],
        "contactTitle": "Kontak & Media Sosial",
        "email": "info@sts-system.com",
        "phone": "+62 812-3456-7890",
        "socialLinks": [
            {"id": "1", "platform": "facebook", "url": "#"},
            {"id": "2", "platform": "twitter", "url": "#"},
            {"id": "3", "platform": "instagram", "url": "#"}
        ],
        "copyrightText": "Sistem Terintegrasi Sekolah. All rights reserved."
    }'::JSONB,
    TRUE
)
ON CONFLICT (section) DO NOTHING;

-- =====================================================
-- SELESAI! 
-- Setelah menjalankan script ini, Anda bisa login dengan:
-- Email: editor@sekolah.com
-- Password: editor123
-- =====================================================
