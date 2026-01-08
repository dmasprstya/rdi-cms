# Quick Start: Testing Fitur Modul Belajar

## Step 1: Pastikan Database Sudah Siap

Pastikan Anda sudah memiliki:
- ✅ Database connection yang aktif
- ✅ User admin untuk login
- ✅ Data subjects (mata pelajaran)
- ✅ Data classes (kelas)
- ✅ Data teachers (guru)
- ✅ Data students (siswa)

## Step 2: Jalankan Seed Data (Jika Belum Ada)

### 2.1. Seed Subjects (Mata Pelajaran)
```bash
npx tsx scripts/seed-subjects.ts
```

### 2.2. Seed Teachers (Guru)
```bash
npx tsx scripts/seed-teachers.ts
```

**Default password untuk semua guru:** `guru123`

### 2.3. Seed Modules (Modul Belajar) - BARU!
```bash
npx tsx scripts/seed-modules.ts
```

Script ini akan membuat 11 modul dummy untuk testing.

## Step 3: Login dan Test

### Test sebagai Admin

1. **Login ke sistem:**
   - URL: `http://localhost:3000/login`
   - Email: (gunakan admin email Anda)
   - Password: (gunakan admin password Anda)

2. **Navigasi ke Kelola Modul:**
   - Klik menu "Kelola Modul" di dashboard
   - Atau langsung ke: `http://localhost:3000/dashboard/modules`

3. **Test Fitur Admin:**
   - ✅ Lihat daftar modul yang sudah di-seed
   - ✅ Filter berdasarkan mata pelajaran
   - ✅ Filter berdasarkan kelas
   - ✅ Search modul
   - ✅ Tambah modul baru
   - ✅ Edit modul
   - ✅ Hapus modul

### Test sebagai Siswa

1. **Login sebagai siswa:**
   - URL: `http://localhost:3000/login`
   - Email: (gunakan student email)
   - Password: (gunakan student password)

2. **Akses Modul Belajar:**
   - Di dashboard siswa, klik "Modul Belajar"
   - Atau langsung ke: `http://localhost:3000/student/modules`

3. **Test Fitur Siswa:**
   - ✅ Lihat modul sesuai kelas siswa
   - ✅ Lihat modul yang tersedia untuk semua kelas
   - ✅ Search modul
   - ✅ Filter modul
   - ✅ Klik "Unduh Materi" (akan membuka link Google Drive dummy)

## Step 4: Membuat Modul Real (Best Practice)

Untuk membuat modul dengan file real:

### Upload File ke Google Drive

1. **Upload file** (PDF, Word, PPT, dll) ke Google Drive
2. **Klik kanan pada file** > "Get link"
3. **Set permission:** "Anyone with the link" > "Viewer"
4. **Copy link** yang dihasilkan
5. **Paste link** ke form "URL File/Link Download" di admin panel

### Format Link Google Drive

Link Google Drive biasanya seperti:
```
https://drive.google.com/file/d/FILE_ID_HERE/view
```

**Tip:** Untuk direct download, ubah akhiran `view` menjadi `download`:
```
https://drive.google.com/uc?export=download&id=FILE_ID_HERE
```

## Troubleshooting

### Error: "No subjects found"
```bash
# Jalankan seed subjects terlebih dahulu
npx tsx scripts/seed-subjects.ts
```

### Error: "No teachers found"
```bash
# Jalankan seed teachers terlebih dahulu
npx tsx scripts/seed-teachers.ts
```

### Error: "No classes found"
- Buat kelas manual lewat admin panel, atau
- Tambahkan seed script untuk classes (bisa dibuat sendiri)

### Modul tidak muncul untuk siswa
- Pastikan siswa sudah terdaftar di kelas tertentu
- Pastikan modul sudah dipublikasi (isPublished = true)
- Pastikan modul untuk kelas siswa atau untuk semua kelas (classId = null)

### Link download tidak bekerja
- Pastikan link valid dan permission "anyone with the link can view"
- Test link dengan membuka di browser incognito
- Pastikan file tidak dihapus dari Google Drive

## Checklist Testing

### ✅ Admin Panel
- [ ] Bisa melihat semua modul
- [ ] Bisa menambah modul baru
- [ ] Bisa edit modul (title, description, file URL, dll)
- [ ] Bisa menghapus modul
- [ ] Filter mata pelajaran berfungsi
- [ ] Filter kelas berfungsi
- [ ] Search modul berfungsi
- [ ] Status publikasi bisa diubah (Published/Draft)

### ✅ Student Portal
- [ ] Siswa hanya melihat modul untuk kelasnya
- [ ] Siswa bisa melihat modul "Semua Kelas"
- [ ] Siswa TIDAK melihat modul draft (unpublished)
- [ ] Siswa bisa search modul
- [ ] Tombol download membuka link dengan benar
- [ ] UI responsive dan user-friendly

### ✅ API
- [ ] GET /api/modules (admin) return semua modul
- [ ] GET /api/student/modules (student) return modul sesuai kelas
- [ ] POST /api/modules (admin) bisa create modul baru
- [ ] PATCH /api/modules (admin) bisa update modul
- [ ] DELETE /api/modules (admin) bisa hapus modul

## Data Dummy yang Dibuat

Setelah menjalankan seed, Anda akan memiliki:

1. **Modul Matematika** (2 modul)
   - Algoritma Pemrograman - Kelas 10
   - Trigonometri Lanjut - Kelas 11

2. **Modul Bahasa Indonesia** (2 modul)
   - Tata Bahasa - Kelas 10
   - Karya Ilmiah - Semua Kelas ⭐

3. **Modul Fisika** (2 modul)
   - Hukum Newton - Kelas 11
   - Gelombang dan Bunyi - Kelas 12

4. **Modul Kimia** (1 modul)
   - Stoikiometri - Kelas 11

5. **Modul Biologi** (2 modul)
   - Sistem Peredaran Darah - Kelas 11
   - [DRAFT] Ekosistem - Kelas 10 (tidak dipublikasi)

6. **Modul Bahasa Inggris** (1 modul)
   - Grammar Tenses - Kelas 10

7. **Modul Sejarah** (1 modul)
   - Kemerdekaan Indonesia - Kelas 11

**Total:** 11 modul (10 published, 1 draft)

## Screenshot Lokasi

### Admin - Kelola Modul
```
http://localhost:3000/dashboard/modules
```

### Student - Modul Belajar
```
http://localhost:3000/student/modules
```

## Next Steps

1. ✅ Test semua fitur dengan data dummy
2. 📝 Upload file real ke Google Drive
3. 🔄 Replace link dummy dengan link real
4. 👥 Test dengan user siswa dari berbagai kelas
5. 📊 Monitor penggunaan dan feedback

---

**Happy Testing! 🎉**

Jika ada pertanyaan atau masalah, silakan cek dokumentasi lengkap di `docs/FITUR-MODUL-BELAJAR.md`
