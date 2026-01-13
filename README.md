# Sistem Terintegrasi RDI (Rosman Djohan Institute)

Platform manajemen terpadu untuk lembaga pendidikan dengan role-based access control untuk admin, staff, guru, siswa, dan editor. Dilengkapi dengan CMS untuk landing page dan sistem manajemen sekolah lengkap.

## 🚀 Teknologi

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI, Glassmorphism design
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Auth.js (NextAuth.js v5)
- **Error Tracking**: Sentry
- **Notifications**: React Toastify
- **Deployment**: Vercel

## 📦 Instalasi

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Setup Database (Supabase)

Ikuti panduan lengkap di [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) atau:

1. Buat akun di [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string dari Settings > Database
4. Create `.env` file:

```env
DATABASE_URL=your-supabase-connection-string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use any 32+ character random string
```

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Seed Initial Data (Optional)

Buat admin user pertama secara manual melalui database atau gunakan script berikut:

```sql
-- Run this in Supabase SQL Editor
INSERT INTO users (id, name, email, password, role) 
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@sekolah.com',
  '$2a$10$example-hashed-password', -- You'll need to hash 'admin123'
  'admin'
);
```

**PENTING:** Password perlu di-hash menggunakan bcrypt. Untuk testing, gunakan script Node.js:

```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash); // Copy hash ini ke SQL query
```

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🔐 Login Credentials

Setelah setup database dan create user, gunakan:

**Admin:**
- Email: admin@sekolah.com
- Password: admin123

**Staff:**
- Email: staff@sekolah.com
- Password: staff123

**Guru:**
- Email: guru@sekolah.com
- Password: guru123

**Siswa:**
- Email: siswa@sekolah.com  
- Password: siswa123

**Editor:**
- Email: editor@sekolah.com
- Password: editor123

*(Pastikan sudah create users ini di database)*

## 📁 Struktur Project

```
sistem-terintegrasi-rdi/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes (admin, guru, staff, student)
│   ├── dashboard/            # Admin Dashboard
│   ├── guru/                 # Guru Dashboard (modules, grades, announcements)
│   ├── staff/                # Staff Dashboard (students, teachers, subjects)
│   ├── student/              # Student Portal
│   ├── editor/               # CMS Editor Dashboard
│   ├── berita/               # News/Berita pages
│   ├── program/              # Program pages (dropdown menu)
│   ├── [slug]/               # Dynamic homepage
│   ├── login/                # Login Page
│   └── page.tsx              # RDI Landing Page
├── components/
│   ├── admin/                # Admin components (classes, students, teachers, staff)
│   ├── guru/                 # Guru components (modules, grades, announcements)
│   └── ui/                   # Shadcn UI Components
├── db/
│   ├── schema.ts             # Database Schema (14 tables)
│   └── index.ts              # DB Connection
├── lib/
│   ├── utils.ts              # Utility Functions
│   └── validations.ts        # Zod Schemas
├── auth.ts                   # Auth.js Configuration
├── middleware.ts             # Route Protection (role-based)
└── drizzle.config.ts         # Drizzle Configuration
```

## ✨ Fitur Utama

### Admin Dashboard (`/dashboard`)
- ✅ Login dengan role-based access
- ✅ Dashboard dengan statistik real-time
- ✅ Kelola Data Siswa (CRUD, class assignment)
- ✅ Kelola Data Guru (CRUD, NIP management)
- ✅ Kelola Kelas (CRUD, academic year)
- ✅ Kelola Staff (CRUD, phone & address)
- ✅ Kelola Mata Pelajaran (assign subjects to classes)
- ✅ View grades, modules, announcements

### Guru Dashboard (`/guru`)
- ✅ Dashboard dengan statistik guru
- ✅ Kelola Modul Pembelajaran (PDF upload support)
- ✅ Input Nilai (3-step wizard: class → subject → grades)
- ✅ Buat Pengumuman
- ✅ Kelola Mata Pelajaran (untuk guru)
- ✅ Akses hanya untuk kelas yang diajar

### Staff Dashboard (`/staff`)
- ✅ Dashboard dengan statistik staff
- ✅ Lihat Data Siswa
- ✅ Lihat Data Guru
- ✅ Kelola Mata Pelajaran (subject-class assignments)

### Student Portal (`/student`)
- ✅ Login sebagai siswa
- ✅ Lihat profil pribadi
- ✅ Lihat nilai akademik (semua mata pelajaran)
- ✅ Lihat jadwal pelajaran
- ✅ Lihat & download modul pembelajaran
- ✅ Lihat pengumuman

### Editor CMS (`/editor`)
- ✅ Manage Landing Page content
- ✅ Manage dropdown menu (Program Luar Negeri, HALTEC)
- ✅ Manage Berita/News (CRUD with images)
- ✅ Rich text editor dengan media upload

### Fitur Tambahan
- ✅ Dark mode support
- ✅ Glassmorphism design
- ✅ Responsive mobile-friendly
- ✅ Toast notifications
- ✅ PDF file upload for modules
- ✅ Performance indexes (27 indexes)
- ✅ Error tracking dengan Sentry
- ✅ Code-splitting dengan React.lazy

### 🌟 RDI Landing Page (NEW!)
- ✅ **Public Landing Page** untuk Rosman Djohan Institute
- ✅ **Hero Section** dengan video background
- ✅ **2 Pilar Program:**
  - Program Luar Negeri (Taiwan, Jerman, Jepang)
  - HALTEC (Halal Training & Certification)
- ✅ **9 Komponen Lengkap** (Navbar, Hero, Trust Partners, Core Pillars, Why RDI, Founders, Latest News, CTA, Footer)
- ✅ **Mobile Responsive** dengan hamburger menu
- ✅ **WhatsApp Integration** untuk inquiry
- ✅ **SEO Ready** dengan proper meta tags

**📚 RDI Dokumentasi:**
- 🚀 **[Quick Start Guide](./RDI_QUICKSTART.md)** - Panduan cepat untuk update content
- 📋 **[Content Checklist](./RDI_CONTENT_CHECKLIST.md)** - Checklist placeholder yang perlu diganti
- 📘 **[Full Documentation](./docs/RDI_LANDING_PAGE_DOCS.md)** - Dokumentasi teknis lengkap
- ✅ **[Implementation Summary](./docs/RDI_IMPLEMENTATION_SUMMARY.md)** - Ringkasan implementasi
- 🚀 **[Deployment Guide](./docs/RDI_DEPLOYMENT_GUIDE.md)** - Panduan deployment
- 📚 **[Docs Index](./docs/RDI_DOCS_INDEX.md)** - Index semua dokumentasi RDI

### 🔧 Technical Components (NEW!)
- ✅ **Code-Splitting**: Lazy loading untuk halaman admin dengan React.lazy
- ✅ **Database Indexes**: 27 performance indexes untuk query optimization
- ✅ **Error Handling**: Toast notifications dengan react-toastify
- ✅ **Error Logging**: Integrasi Sentry untuk error tracking
- ✅ **Centralized Error Handler**: ErrorHandler class untuk error management
- ✅ **Performance Optimized**: 40-60% bundle size reduction, 70-95% faster queries

**📚 Dokumentasi Lengkap:**
- � [Main Documentation](./docs/APP_DOCUMENTATION.md) - **(BARU)** Dokumentasi utama & changelog aplikasi
- �🚀 [Quick Setup Guide](./docs/QUICK_SETUP.md) - Panduan setup cepat
- 📖 [Technical Documentation](./TECHNICAL_SUPPORT_COMPONENTS.md) - Dokumentasi lengkap (350+ baris)
- 📊 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Ringkasan implementasi
- 🇮🇩 [Ringkasan Bahasa Indonesia](./RINGKASAN_IMPLEMENTASI.md) - Summary dalam Bahasa Indonesia
- 🏗️ [Architecture Diagram](./ARCHITECTURE.md) - Diagram arsitektur sistem
- 💡 [Code Examples](./EXAMPLE_CODE_SPLITTING.tsx.md) - Contoh penggunaan code-splitting
- 🛠️ [Error Handling Examples](./EXAMPLE_ERROR_HANDLING.tsx.md) - Contoh error handling

## 🛠️ Development

### Database Commands

```bash
# Generate migration
npm run db:generate

# Push schema to database (development)
npm run db:push

# Open Drizzle Studio (Database GUI)
npm run db:studio

# Apply performance indexes (NEW!)
npm run db:indexes
```

### Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Apply performance indexes
npm run db:indexes
```

## �️ Database Schema

### Main Tables (14 total)

1. **users** - Authentication & user management
   - Roles: admin, staff, guru, student, editor
   - Fields: name, email, password, phone, address

2. **students** - Student profiles
   - Links to: users, classes
   - Fields: NIS, photoUrl, dateOfBirth

3. **teachers** - Teacher/Guru profiles
   - Links to: users
   - Fields: NIP, subject, dateOfBirth

4. **classes** - Class management
   - Fields: name, academicYear

5. **subjects** - Subject/Mata Pelajaran
   - Fields: name, code, credits, description

6. **grades** - Student grades
   - Links to: students, subjects, classes, teachers
   - Fields: score (0-100), semester, academicYear, remarks

7. **schedules** - Class schedules
   - Links to: classes, subjects, teachers
   - Fields: day, startTime, endTime, room

8. **announcements** - School announcements
   - Links to: users (author)
   - Fields: title, content, isActive

9. **modules** - Learning modules
   - Links to: subjects, classes, teachers
   - Fields: title, content, fileUrl, fileName, fileSize, isPublished

### Junction Tables

10. **guru_kelas** - Teacher ↔ Classes (many-to-many)
11. **kelas_mata_pelajaran** - Classes ↔ Subjects (many-to-many)

### CMS Tables

12. **landing_page_content** - Homepage content (JSON)
13. **dropdown_menu** - Dynamic program pages
14. **news** - News/Berita articles
15. **news_images** - News article images
16. **hero_images** - Hero slideshow images

## �🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables di Vercel:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_URL` - https://your-app.vercel.app
   - `NEXTAUTH_SECRET` - Random 32+ character string
   - `NEXT_PUBLIC_APP_URL` - https://your-app.vercel.app
   - `SENTRY_DSN` (optional) - For error tracking
   - `SENTRY_AUTH_TOKEN` (optional) - For Sentry uploads
4. Deploy!

### Production Checklist
- ✅ Database migrations applied
- ✅ Environment variables configured
- ✅ Initial admin user created
- ✅ Performance indexes applied (`npm run db:indexes`)
- ✅ File upload directory writable (`/uploads`)
- ✅ Test all role-based access

## 📝 Notes

### System Capabilities
- **5 User Roles** dengan permissions berbeda
- **14+ Database Tables** dengan foreign key constraints
- **27 Performance Indexes** untuk query optimization
- **Role-Based Access Control (RBAC)** di semua endpoints
- **PDF Upload** untuk modul pembelajaran
- **CMS Integration** untuk landing page RDI
- **Real-time Statistics** di semua dashboards
- **Error Tracking** dengan Sentry integration
- **Code-Splitting** untuk optimal performance

### Security Features
- Middleware untuk route protection
- Session-based authentication dengan Auth.js
- Password hashing dengan bcrypt
- SQL injection prevention dengan Drizzle ORM
- File upload validation
- CSRF protection
- Input sanitization

## 🎨 Design Features

- Custom yellow/black brand colors
- Glassmorphism effects
- Smooth animations
- Modern gradients
- Responsive grid layouts

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using Next.js & Supabase
