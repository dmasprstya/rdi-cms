# Fitur Modul Belajar - Dokumentasi

## Deskripsi
Fitur Modul Belajar memungkinkan admin untuk mengupload dan mengelola modul pembelajaran yang dapat diakses oleh siswa sesuai dengan kelas mereka.

## Komponen yang Dibuat

### 1. API Routes

#### `/api/modules` (Admin)
- **GET**: Mengambil semua modul (hanya admin)
- **POST**: Membuat modul baru
- **PATCH**: Memperbarui modul
- **DELETE**: Menghapus modul

#### `/api/student/modules` (Student)
- **GET**: Mengambil modul yang tersedia untuk siswa berdasarkan kelas mereka

### 2. Halaman Admin

#### `/dashboard/modules`
Halaman untuk mengelola modul pembelajaran dengan fitur:
- Tambah modul baru dengan form lengkap
- Edit modul yang sudah ada
- Hapus modul
- Filter berdasarkan mata pelajaran dan kelas
- Search modul berdasarkan judul atau mata pelajaran
- Status publikasi (Published/Draft)

**Form input modul meliputi:**
- Judul modul (required)
- Deskripsi
- Mata pelajaran (required)
- Kelas (opsional - jika kosong, tersedia untuk semua kelas)
- Guru/Pengupload (required)
- URL File/Link Download (contoh: Google Drive link)
- Konten/Catatan tambahan
- Status publikasi (checkbox)

### 3. Halaman Siswa

#### `/student/modules`
Halaman untuk siswa melihat dan mengunduh modul yang tersedia:
- Menampilkan modul berdasarkan kelas siswa
- Modul tanpa kelas spesifik tersedia untuk semua siswa
- Filter dan search modul
- Download modul langsung dari link yang diberikan

### 4. Database Schema

Tabel `modules` sudah ada di schema dengan struktur:
- `id`: UUID primary key
- `title`: Judul modul
- `description`: Deskripsi modul
- `content`: Konten/catatan tambahan
- `fileUrl`: URL file untuk download
- `subjectId`: Referensi ke mata pelajaran
- `classId`: Referensi ke kelas (nullable - jika null, tersedia untuk semua kelas)
- `teacherId`: Referensi ke guru yang mengupload
- `isPublished`: Status publikasi
- `createdAt`: Timestamp pembuatan
- `updatedAt`: Timestamp update terakhir

## Cara Menggunakan

### Untuk Admin

1. **Login sebagai admin**
2. **Navigasi ke Dashboard > Kelola Modul**
3. **Tambah Modul Baru:**
   - Klik tombol "Tambah Modul"
   - Isi form dengan data modul:
     - Judul modul
     - Deskripsi singkat
     - Pilih mata pelajaran
     - Pilih kelas (opsional)
     - Pilih guru
     - Masukkan URL file (Google Drive, Dropbox, dll)
     - Tambahkan catatan jika perlu
     - Centang "Publikasikan" jika ingin langsung tersedia untuk siswa
   - Klik "Simpan Modul"

4. **Edit Modul:**
   - Klik tombol "Edit" pada modul yang ingin diubah
   - Update data yang diperlukan
   - Klik "Simpan Perubahan"

5. **Hapus Modul:**
   - Klik tombol "Hapus"
   - Konfirmasi penghapusan

### Untuk Siswa

1. **Login sebagai siswa**
2. **Di dashboard siswa, klik menu "Modul Belajar"**
3. **Lihat modul yang tersedia:**
   - Modul yang ditampilkan adalah modul untuk kelas Anda
   - Modul tanpa kelas spesifik juga akan terlihat
   - Gunakan search untuk mencari modul tertentu
4. **Download modul:**
   - Klik tombol "Unduh Materi" pada modul yang diinginkan
   - File akan terbuka di tab baru (sesuai link yang diberikan admin)

## Testing dengan Dummy Data

### Menjalankan Seed Script

1. **Pastikan database sudah ada data subjects, classes, dan teachers:**
   ```bash
   npx tsx scripts/seed-subjects.ts
   npx tsx scripts/seed-teachers.ts
   ```

2. **Jalankan seed untuk modul:**
   ```bash
   npx tsx scripts/seed-modules.ts
   ```

### Data Dummy yang Dibuat

Script `seed-modules.ts` akan membuat 11 modul dummy dengan berbagai konfigurasi:

1. **Pengenalan Algoritma dan Pemrograman Dasar** (Matematika, Kelas 10)
2. **Tata Bahasa Indonesia - Struktur Kalimat** (Bahasa Indonesia, Kelas 10)
3. **Hukum Newton dan Aplikasinya** (Fisika, Kelas 11)
4. **Reaksi Kimia dan Stoikiometri** (Kimia, Kelas 11)
5. **Sistem Peredaran Darah Manusia** (Biologi, Kelas 11)
6. **English Grammar - Tenses** (Bahasa Inggris, Kelas 10)
7. **Sejarah Kemerdekaan Indonesia** (Sejarah, Kelas 11)
8. **Trigonometri Lanjut** (Matematika, Kelas 11)
9. **Panduan Menulis Karya Ilmiah** (Bahasa Indonesia, Semua Kelas)
10. **Gelombang dan Bunyi** (Fisika, Kelas 12)
11. **[DRAFT] Materi Ekosistem** (Biologi, Kelas 10, Tidak dipublikasi)

## Upload File Best Practices

Karena sistem ini menggunakan URL link, berikut rekomendasi untuk upload file:

### Google Drive
1. Upload file ke Google Drive
2. Right-click > Get link
3. Pastikan link sharing: "Anyone with the link can view"
4. Copy link dan paste ke form modul

### Dropbox
1. Upload file ke Dropbox
2. Klik "Share" > "Create a link"
3. Copy link dan paste ke form modul

### Alternatif Lain
- OneDrive
- GitHub (untuk file dokumen/code)
- Cloud storage lainnya yang mendukung public sharing

## Catatan Penting

1. **Link File:** Admin bertanggung jawab untuk memastikan link file valid dan dapat diakses
2. **Kelas Opsional:** Jika tidak memilih kelas, modul akan tersedia untuk semua siswa
3. **Status Publikasi:** Modul dengan status draft tidak akan terlihat oleh siswa
4. **Permission:** Hanya admin yang bisa mengelola modul
5. **Guru Assignment:** Setiap modul harus memiliki guru yang bertanggung jawab

## Troubleshooting

### Modul tidak muncul di halaman siswa
- Pastikan modul sudah dipublikasi (checkbox "Publikasikan" dicentang)
- Periksa apakah modul ditujukan untuk kelas siswa tersebut
- Refresh halaman atau clear cache browser

### Error saat download
- Pastikan link file valid dan masih aktif
- Cek permission sharing file di cloud storage
- Pastikan file tidak dihapus dari cloud storage

### API Error
- Cek role user (admin/student)
- Pastikan koneksi database berjalan
- Cek console browser untuk error detail

## Future Enhancements (Opsional)

1. Upload file langsung ke server (tidak menggunakan external link)
2. Tracking download modul oleh siswa
3. Rating dan review modul oleh siswa
4. Notifikasi email saat modul baru ditambahkan
5. Export/import modul dalam format tertentu
6. Versioning modul (riwayat perubahan)
7. Quiz/kuis yang terintegrasi dengan modul
