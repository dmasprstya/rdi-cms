# 🔐 Cara Reset Password Database Supabase

Masalah saat ini adalah **Password Database Salah** (`password authentication failed`). 

Ini **BUKAN** password login akun Supabase Anda, melainkan password khusus untuk database project ini yang Anda buat saat pertama kali create project.

## Langkah-langkah Reset Password:

1. **Buka Supabase Dashboard**
   - Pergi ke https://supabase.com/dashboard/project/_/settings/database
   - Atau: Klik icon **Settings** (Gerigi) di sidebar kiri → Pilih **Database**

2. **Reset Password**
   - Cari bagian **"Database Password"**
   - Klik tombol **"Reset database password"**
   - Masukkan password baru yang mudah diingat tapi aman, contoh: `Sekolah2025!`
   - Klik **"Reset password"**

3. **Update File .env**
   - Buka file `.env` di project Anda
   - Update bagian `DATABASE_URL` dengan password baru:
   
   ```env
   DATABASE_URL=postgresql://postgres.fpoegzedcwauekpewkgf:Sekolah2025!@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
   
   *(Ganti `Sekolah2025!` dengan password yang Anda buat)*

4. **Test Koneksi**
   - Jalankan: `npx tsx test-db.ts`
   - Jika berhasil, akan muncul: `✅ Database connection successful!`

5. **Jalankan Aplikasi**
   - `npm run dev`
   - Login admin: `admin@sekolah.com` / `admin123`

---

**Catatan:** Password database tidak bisa dilihat, jadi jika lupa, satu-satunya cara adalah me-resetnya.
