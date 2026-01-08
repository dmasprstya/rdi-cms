# Dropdown Menu Kemitraan - Implementation Guide

## Overview
Fitur baru yang memungkinkan pengelolaan menu dropdown "Kemitraan" di navbar landing page melalui CMS. Menu dropdown ini berisi link ke halaman-halaman kemitraan (Jerman, Taiwan, Jepang, Haltec) yang dapat dikustomisasi melalui CMS Editor.

## Fitur Utama
- ✅ Dropdown menu dengan hover effect di navbar
- ✅ Halaman dinamis untuk setiap menu kemitraan
- ✅ CRUD operations melalui CMS Editor
- ✅ Published/Draft status
- ✅ Ordering/sequencing menu
- ✅ Dark mode support
- ✅ Responsive design (desktop & mobile)

## Database Schema

### Tabel: `dropdown_menu`
```sql
- id: TEXT (Primary Key)
- title: VARCHAR(100) - Judul menu (contoh: "Jerman")
- slug: VARCHAR(100) UNIQUE - URL slug (contoh: "jerman")
- content: JSONB - Konten halaman (heading, description, features)
- order: INTEGER - Urutan tampilan
- is_published: BOOLEAN - Status publikasi
- last_edited_by: TEXT - Foreign key ke users.id
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Setup & Migration

### 1. Push Schema ke Database
```bash
npm run db:push
```

### 2. Seed Data Awal
Jalankan script seed untuk menambahkan data awal (Jerman, Taiwan, Jepang, Haltec):

```bash
npx tsx db/seed-dropdown.ts
```

Atau jalankan SQL migration secara manual:
```bash
# Buka Drizzle Studio
npm run db:studio

# Jalankan SQL di db/migrations/add-dropdown-menu.sql
```

## Struktur File

### Components
- `components/navbar-dropdown.tsx` - Desktop dropdown dengan hover
- `components/navbar.tsx` - Updated navbar dengan dropdown integration

### Pages
- `app/[slug]/page.tsx` - Dynamic page untuk setiap menu kemitraan
- `app/editor/dropdown-menu/page.tsx` - CMS halaman pengelolaan dropdown menu

### API Routes
- `app/api/dropdown-menu/route.ts` - Public API untuk fetch published items
- `app/api/dropdown-menu/manage/route.ts` - CMS API untuk CRUD operations

### Database
- `db/schema.ts` - Updated schema dengan dropdownMenu table
- `db/seed-dropdown.ts` - Seed script untuk data awal
- `db/migrations/add-dropdown-menu.sql` - SQL migration

## Penggunaan

### Sebagai Editor (CMS)
1. Login dengan role 'editor'
2. Akses menu "Dropdown Menu" di sidebar CMS
3. Klik "Tambah Menu" untuk membuat menu baru
4. Isi form:
   - Judul Menu (ditampilkan di dropdown)
   - Slug (URL path)
   - Heading Halaman
   - Deskripsi
   - Fitur/Keunggulan (dapat menambah multiple items)
   - Urutan Tampilan
   - Status (Published/Draft)
5. Klik "Tambah Menu" atau "Update Menu"

### Sebagai User (Landing Page)
1. Kunjungi landing page
2. Hover pada menu "Kemitraan" di navbar
3. Klik salah satu menu (Jerman, Taiwan, Jepang, Haltec)
4. User akan diarahkan ke halaman detail program kemitraan

## Content Structure (JSONB)

```json
{
  "heading": "Program Kemitraan Jerman",
  "description": "Deskripsi lengkap program kemitraan...",
  "features": [
    "Fitur 1: Pembelajaran intensif",
    "Fitur 2: Kesempatan magang",
    "Fitur 3: Sertifikasi internasional"
  ]
}
```

## API Endpoints

### Public API
**GET** `/api/dropdown-menu`
- Mengambil semua menu yang published
- Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Jerman",
      "slug": "jerman",
      "order": 0
    }
  ]
}
```

### CMS API (Requires Editor Role)

**GET** `/api/dropdown-menu/manage`
- Mengambil semua menu (termasuk draft)

**POST** `/api/dropdown-menu/manage`
- Membuat menu baru
- Body: `{ title, slug, content, order, isPublished }`

**PUT** `/api/dropdown-menu/manage`
- Update menu existing
- Body: `{ id, title, slug, content, order, isPublished }`

**DELETE** `/api/dropdown-menu/manage?id={id}`
- Hapus menu

## Dynamic Routes

- `/{slug}` - Halaman detail kemitraan (contoh: /jerman, /taiwan, /jepang, /haltec)

## Styling & Design
- Menggunakan semantic color tokens untuk dark mode support
- Hover effect dengan smooth transitions
- Responsive design untuk mobile dan desktop
- Premium gradient effects
- Modern card layouts

## Security
- Authentication required untuk CMS operations
- Role-based access control (editor only)
- Published/draft status untuk content moderation
- SQL injection protection melalui Drizzle ORM

## Future Enhancements
- [ ] Rich text editor untuk description
- [ ] Image upload untuk setiap program
- [ ] Reorder via drag & drop
- [ ] Bulk actions (publish/unpublish multiple)
- [ ] Content versioning
- [ ] Preview mode sebelum publish

## Troubleshooting

### Menu tidak muncul di dropdown
- Pastikan status adalah "Published"
- Cek order field tidak duplicate
- Refresh browser cache

### Database error saat push schema
- Pastikan DATABASE_URL sudah benar di .env
- Untuk Supabase, pastikan sudah trust self-signed certificate

### Page 404 saat akses menu
- Pastikan slug sudah benar
- Pastikan status adalah "Published"
- Rebuild aplikasi: `npm run build`

## Maintenance
- Regular backup database
- Monitor published content
- Update konten secara berkala
- Audit user access logs

---

**Created by:** Deepmind Team
**Last Updated:** December 2025
