# Dokumentasi Aplikasi Sistem Terintegrasi Sekolah

Dokumen ini berfungsi sebagai referensi utama dan catatan perubahan (living document) untuk aplikasi Sistem Terintegrasi Sekolah. Dokumen ini harus diperbarui setiap kali ada perubahan signifikan pada proyek.

## 📋 Informasi Proyek

- **Nama Proyek**: Sistem Terintegrasi Sekolah
- **Deskripsi**: Platform manajemen sekolah modern dengan role-based access control untuk admin, staff, editor, dan siswa.
- **Versi Saat Ini**: 1.1.0
- **Terakhir Diperbarui**: 2025-12-12

## 🏗️ Arsitektur & Teknologi

### Stack Utama
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Auth**: Auth.js (NextAuth.js v5)
- **Deployment**: Vercel

### Fitur Teknikal
- **Code-Splitting**: Loading komponen admin secara partial menggunakan React.lazy.
- **Error Handling**: Terpusat menggunakan `ErrorHandler` class dan Sentry untuk tracking.
- **Database Indexing**: Optimasi query untuk performa tinggi.
- **CMS System**: Content Management System untuk mengelola landing page.

## 👥 Role & Akses

Aplikasi ini memiliki 4 role pengguna:

| Role | Akses | Route |
|------|-------|-------|
| **Admin** | Full akses dashboard, manajemen data | `/dashboard` |
| **Staff** | Akses dashboard terbatas | `/dashboard` |
| **Editor** | Akses CMS untuk edit landing page | `/editor` |
| **Student** | Portal siswa (lihat nilai, jadwal) | `/student` |

### Kredensial Default
- **Admin**: `admin@sekolah.com` / `admin123`
- **Siswa**: `siswa@sekolah.com` / `siswa123`
- **Editor**: `editor@sekolah.com` / `editor123`

## 📂 Struktur Proyek

```
sistem-terintegrasi/
├── app/                      # Source code utama (Next.js App Router)
│   ├── api/                  # API endpoints
│   │   └── cms/              # CMS API endpoints
│   ├── dashboard/            # Halaman Admin/Staff
│   ├── editor/               # Halaman CMS Editor (NEW!)
│   │   ├── hero/             # Edit Hero Section
│   │   ├── about/            # Edit About Section
│   │   ├── features/         # Edit Features Section
│   │   ├── testimonials/     # Edit Testimonials
│   │   ├── contact/          # Edit Contact Section
│   │   ├── footer/           # Edit Footer
│   │   └── settings/         # Pengaturan Editor
│   ├── student/              # Halaman Siswa
│   └── login/                # Halaman Login
├── components/               # Komponen UI reusable
│   ├── editor/               # Komponen khusus CMS (sidebar, dll)
│   ├── landing/              # Komponen Landing Page
│   └── ui/                   # Shadcn UI Components
├── db/                       # Konfigurasi Database & Schema (Drizzle)
├── docs/                     # Dokumentasi proyek
├── lib/                      # Utilitas & Helper functions
├── public/                   # Aset statis
└── types/                    # Definisi TypeScript custom
```

## ✅ Status Fitur

### Admin Dashboard
- [x] Login & Autentikasi
- [x] Dashboard Statistik
- [x] Manajemen Siswa (CRUD)
- [ ] Manajemen Guru
- [ ] Manajemen Kelas & Mapel
- [ ] Input Nilai
- [ ] Jadwal Pelajaran
- [ ] Pengumuman

### Student Portal
- [x] Login Siswa
- [x] Lihat Profil
- [x] Lihat Nilai
- [ ] Jadwal Pelajaran
- [x] Pengumuman

### CMS Editor (NEW!)
- [x] Dashboard Editor dengan overview section
- [x] Edit Hero Section (judul, deskripsi, CTA)
- [x] Edit About Section (tentang sekolah)
- [x] Edit Features Section (fitur unggulan)
- [x] Edit Testimonials (testimoni pengguna)
- [x] Edit Contact Section (info kontak)
- [x] Edit Footer (quick links, sosial media)
- [x] Settings (profil editor)
- [ ] Upload gambar untuk banner
- [ ] Preview real-time dengan database
- [ ] Riwayat perubahan (version history)

### Sistem Core
- [x] Role-based Access Control (4 roles)
- [x] Dark Mode
- [x] Responsive Design
- [x] Error Handling & Logging (Sentry + Toast)

## 📝 Catatan Perubahan (Changelog)

### [2025-12-12] - Fitur CMS Editor
- **Tambah role baru**: `editor` untuk mengelola konten landing page
- **Halaman CMS Editor** (`/editor`):
  - Dashboard dengan overview semua section
  - Editor untuk Hero, About, Features, Testimonials, Contact, Footer
  - Halaman Settings untuk profil editor
- **Database**: Tabel baru `landing_page_content` untuk menyimpan konten CMS
- **API**: Endpoint `/api/cms` untuk CRUD konten landing page
- **Middleware**: Update route protection untuk role editor
- **Seed Script**: Tambah user editor default

### [2025-12-12] - Inisialisasi Dokumentasi
- Pembuatan file `docs/APP_DOCUMENTATION.md` sebagai referensi hidup proyek.
- Proyek dalam kondisi stabil dengan fitur dasar Manajemen Siswa dan Dashboard Admin.
- Integrasi Sentry dan Optimasi Database telah diterapkan sebelumnya.

---

*Catatan untuk AI Assistant: Saat melakukan perubahan pada kode, harap perbarui bagian "Status Fitur" atau tambahkan entry baru di "Catatan Perubahan" di atas agar dokumentasi ini selalu sinkron dengan kondisi proyek.*
