# Setup Database Manual via Supabase

Karena ada masalah network/DNS yang mencegah `drizzle-kit push` bekerja, kita akan setup database secara manual melalui Supabase SQL Editor.

## Langkah-langkah:

### 1. Buka Supabase SQL Editor

1. Buka browser ke https://supabase.com
2. Login dan pilih project Anda
3. Di sidebar kiri, klik **SQL Editor** (icon dengan simbol database/query)

### 2. Jalankan Migration Script

1. Buka file [`supabase-migration.sql`](file:///d:/Project/sistem-terintegrasi/supabase-migration.sql)
2. **Copy semua isi file** (Ctrl+A, Ctrl+C)
3. Di Supabase SQL Editor, **klik "New Query"**
4. **Paste** script yang sudah dicopy (Ctrl+V)
5. **Klik tombol "Run"** atau tekan Ctrl+Enter

Script akan membuat:
- ✅ 2 enum types (role, day)
- ✅ 8 tables (users, students, teachers, classes, subjects, grades, schedules, announcements)
- ✅ Indexes untuk performance
- ✅ Sample data (admin, student, kelas, mata pelajaran, nilai)

### 3. Verifikasi

Setelah script berhasil dijalankan:

1. Klik **Table Editor** di sidebar
2. Anda harus lihat semua tabel:
   - users
   - students
   - teachers
   - classes
   - subjects
   - grades
   - schedules
   - announcements

3. Klik tabel `users` - harus ada 2 rows (admin & siswa)
4. Klik tabel `students` - harus ada 1 row (Ahmad Zaki)

### 4. Test Login

Sekarang database sudah siap! Jalankan aplikasi:

```bash
npm run dev
```

Buka http://localhost:3000 dan login dengan:

**Admin:**
- Email: `admin@sekolah.com`
- Password: `admin123`

**Siswa:**
- Email: `siswa@sekolah.com`
- Password: `siswa123`

---

## Catatan Password

> **PENTING**: Password di script sudah di-hash, tapi jika tidak bisa login, artinya hash bcrypt-nya berbeda. Anda bisa generate hash baru dengan cara:

1. Buka Node.js REPL atau buat file `hash.js`:

```javascript
const bcrypt = require('bcryptjs');
console.log('admin123:', bcrypt.hashSync('admin123', 10));
console.log('siswa123:', bcrypt.hashSync('siswa123', 10));
```

2. Run: `node hash.js`

3. Copy hash yang dihasilkan dan update di tabel `users` via Supabase Table Editor

---

## Jika Ada Error

Jika script error karena tabel sudah ada:

1. Di SQL Editor, jalankan script ini dulu untuk drop semua:

```sql
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS day CASCADE;
DROP TYPE IF EXISTS role CASCADE;
```

2. Lalu jalankan ulang `supabase-migration.sql`

---

✅ **Database setup selesai tanpa perlu `npm run db:push`!**
