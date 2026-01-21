# 📚 Panduan Pengguna Sistem Terintegrasi RDI
## (Rosman Djohan Institute)

---

## 📋 Daftar Isi

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Cara Login](#cara-login)
3. [Dashboard Admin](#dashboard-admin)
4. [Dashboard Guru](#dashboard-guru)
5. [Dashboard Staff](#dashboard-staff)
6. [Portal Siswa](#portal-siswa)
7. [Editor CMS](#editor-cms)
8. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## 1. Pengenalan Sistem

### Tentang Sistem RDI

Sistem Terintegrasi RDI adalah platform manajemen terpadu untuk lembaga pendidikan yang dirancang khusus untuk Rosman Djohan Institute. Sistem ini menyediakan berbagai fitur untuk mendukung operasional sekolah secara digital.

### Fitur Utama
- ✅ Manajemen data siswa, guru, dan staff
- ✅ Sistem penilaian dan akademik
- ✅ Manajemen modul pembelajaran
- ✅ Sistem pengumuman
- ✅ CMS (Content Management System) untuk website
- ✅ Portal siswa untuk melihat nilai dan jadwal
- ✅ Responsive dan dapat diakses melalui berbagai perangkat

### Peran Pengguna (User Roles)

Sistem ini memiliki 5 peran pengguna dengan hak akses yang berbeda:

| Peran | Deskripsi | Akses Utama |
|-------|-----------|-------------|
| **Admin** | Administrator sistem dengan akses penuh | Kelola semua data: siswa, guru, staff, kelas, mata pelajaran |
| **Guru** | Tenaga pengajar | Input nilai, upload modul, buat pengumuman |
| **Staff** | Staff administrasi | Lihat data siswa dan guru, kelola mata pelajaran |
| **Siswa** | Peserta didik | Lihat nilai, jadwal, modul, dan pengumuman |
| **Editor** | Pengelola konten website | Kelola konten landing page dan berita |

---

## 2. Cara Login

### Langkah-langkah Login

1. **Buka Aplikasi**
   - Akses aplikasi melalui browser di alamat: `http://localhost:3000` (development) atau URL production yang diberikan
   - Anda akan diarahkan ke halaman landing page RDI

2. **Menuju Halaman Login**
   - Klik tombol **"Login"** di pojok kanan atas navbar
   - Atau akses langsung ke `/login`

3. **Masukkan Kredensial**
   - **Email**: Gunakan email yang terdaftar di sistem
   - **Password**: Masukkan password Anda
   - Klik tombol **"Sign In"**

4. **Akses Dashboard**
   - Setelah login berhasil, Anda akan diarahkan ke dashboard sesuai peran:
     - Admin → `/dashboard`
     - Guru → `/guru`
     - Staff → `/staff`
     - Siswa → `/student`
     - Editor → `/editor`

### Contoh Kredensial Login (Development)

> **⚠️ PENTING**: Kredensial berikut hanya untuk environment development. Pastikan mengubah password di production!

| Peran | Email | Password |
|-------|-------|----------|
| Admin | admin@sekolah.com | admin123 |
| Guru | guru@sekolah.com | guru123 |
| Staff | staff@sekolah.com | staff123 |
| Siswa | siswa@sekolah.com | siswa123 |
| Editor | editor@sekolah.com | editor123 |

### Lupa Password?

Hubungi administrator sistem untuk reset password.

---

## 3. Dashboard Admin

### Halaman Utama Admin (`/dashboard`)

Dashboard admin menampilkan statistik real-time tentang sistem:
- Total siswa, guru, staff, kelas
- Mata pelajaran, modul pembelajaran, pengumuman
- Ringkasan sistem

### 3.1 Kelola Data Siswa

**Lokasi**: `/dashboard/students`

#### Melihat Daftar Siswa
- Tabel menampilkan semua siswa dengan informasi: Nama, NIS, Email, Kelas, Tanggal Lahir
- Gunakan fitur search untuk mencari siswa tertentu
- Data dapat diurutkan berdasarkan kolom tertentu

#### Menambah Siswa Baru
1. Klik tombol **"Tambah Siswa"**
2. Isi form dengan informasi:
   - **Nama Lengkap** (wajib)
   - **Email** (wajib, harus unik)
   - **Password** (wajib, minimal 6 karakter)
   - **NIS** (Nomor Induk Siswa, wajib, harus unik)
   - **Kelas** (pilih dari dropdown)
   - **Nomor Telepon** (opsional)
   - **Alamat** (opsional)
   - **Tanggal Lahir** (opsional)
   - **Foto URL** (opsional)
3. Klik **"Tambah Siswa"** untuk menyimpan

#### Mengedit Data Siswa
1. Klik ikon **pensil (Edit)** pada baris siswa yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik **"Update Siswa"** untuk menyimpan perubahan

#### Menghapus Siswa
1. Klik ikon **tempat sampah (Delete)** pada baris siswa
2. Konfirmasi penghapusan
3. Data siswa dan semua data terkait (nilai, dll) akan terhapus

> **⚠️ PERHATIAN**: Penghapusan siswa bersifat permanen dan akan menghapus semua nilai dan data terkait!

### 3.2 Kelola Data Guru

**Lokasi**: `/dashboard/teachers`

#### Melihat Daftar Guru
- Tabel menampilkan: Nama, NIP, Email, Mata Pelajaran, Tanggal Lahir
- Fitur pencarian dan pengurutan tersedia

#### Menambah Guru Baru
1. Klik tombol **"Tambah Guru"**
2. Isi form:
   - **Nama Lengkap** (wajib)
   - **Email** (wajib, harus unik)
   - **Password** (wajib, minimal 6 karakter)
   - **NIP** (Nomor Induk Pegawai, wajib, harus unik)
   - **Mata Pelajaran Utama** (opsional)
   - **Nomor Telepon** (opsional)
   - **Tanggal Lahir** (opsional)
3. Klik **"Tambah Guru"**

#### Mengedit & Menghapus Guru
Sama seperti kelola siswa, gunakan ikon Edit atau Delete pada setiap baris.

### 3.3 Kelola Kelas

**Lokasi**: `/dashboard/classes`

#### Melihat Daftar Kelas
- Menampilkan: Nama Kelas, Tahun Ajaran, Jumlah Siswa
- Filter berdasarkan tahun ajaran

#### Menambah Kelas Baru
1. Klik **"Tambah Kelas"**
2. Isi:
   - **Nama Kelas** (contoh: "10 IPA 1", "12 IPS 2")
   - **Tahun Ajaran** (contoh: "2023/2024", "2024/2025")
3. Klik **"Tambah Kelas"**

#### Mengedit & Menghapus Kelas
Gunakan tombol Edit/Delete pada setiap kelas.

> **⚠️ PERHATIAN**: Menghapus kelas akan mempengaruhi data siswa yang terdaftar di kelas tersebut!

### 3.4 Kelola Staff

**Lokasi**: `/dashboard/staff`

#### Mengelola Data Staff
Sama dengan pengelolaan guru dan siswa:
1. Lihat daftar staff
2. Tambah staff baru dengan form
3. Edit atau hapus staff yang ada

#### Informasi Staff
- Nama, Email, Role (staff)
- Nomor Telepon
- Alamat

### 3.5 Kelola Mata Pelajaran

**Lokasi**: `/dashboard/kelas-mata-pelajaran`

#### Fungsi Utama
Halaman ini mengelola hubungan antara **Kelas** dan **Mata Pelajaran**:
- Assign mata pelajaran ke kelas tertentu
- Kelola mata pelajaran yang tersedia
- Lihat mata pelajaran per kelas

#### Menambah Mata Pelajaran Baru
1. Klik **"Tambah Mata Pelajaran"**
2. Isi:
   - **Nama Mata Pelajaran** (contoh: "Matematika", "Bahasa Indonesia")
   - **Kode** (contoh: "MAT", "BIND", harus unik)
   - **Jumlah SKS/Kredit** (default: 2)
   - **Deskripsi** (opsional)
3. Klik **"Simpan"**

#### Assign Mata Pelajaran ke Kelas
1. Pilih kelas dari dropdown
2. Pilih mata pelajaran yang akan di-assign
3. Klik **"Assign ke Kelas"**
4. Mata pelajaran akan tersedia untuk kelas tersebut

### 3.6 Lihat Data Lainnya

Admin juga dapat melihat (read-only):
- **Nilai Siswa** (`/dashboard/grades`)
- **Modul Pembelajaran** (`/dashboard/modules`)
- **Pengumuman** (`/dashboard/announcements`)

---

## 4. Dashboard Guru

### Halaman Utama Guru (`/guru`)

Dashboard guru menampilkan:
- Total kelas yang diajar
- Total modul yang telah dibuat
- Total pengumuman
- Statistik aktivitas guru

### 4.1 Kelola Modul Pembelajaran

**Lokasi**: `/guru/modules`

#### Melihat Daftar Modul
- Tabel menampilkan: Judul, Mata Pelajaran, Kelas, Status Publish, File
- Filter berdasarkan mata pelajaran atau kelas

#### Menambah Modul Baru
1. Klik **"Tambah Modul"**
2. Isi form:
   - **Judul Modul** (wajib)
   - **Deskripsi** (opsional)
   - **Mata Pelajaran** (pilih dari dropdown, hanya mata pelajaran yang Anda ajar)
   - **Kelas** (opsional, kosongkan jika untuk semua kelas)
   - **Konten** (opsional, dapat berupa teks atau HTML)
   - **Upload File PDF** (opsional, untuk materi pembelajaran)
   - **Status Publish** (centang untuk publish, uncheck untuk draft)
3. Klik **"Upload Modul"**

#### Upload File PDF
- Klik area upload atau drag & drop file
- Sistem akan menampilkan nama file dan ukuran
- Format yang didukung: PDF
- Ukuran maksimal: Sesuai konfigurasi server

#### Mengedit Modul
1. Klik ikon **Edit** pada modul
2. Ubah informasi yang diperlukan
3. Ganti file jika perlu
4. Klik **"Update Modul"**

#### Menghapus Modul
1. Klik ikon **Delete**
2. Konfirmasi penghapusan
3. Modul dan file terkait akan dihapus

#### Publish/Unpublish Modul
- Toggle switch **"Published"** untuk mengubah status
- Hanya modul yang published yang dapat dilihat siswa

### 4.2 Input Nilai Siswa

**Lokasi**: `/guru/grades`

#### Proses Input Nilai (Smart Interface)
Sistem menyediakan interface yang efisien untuk input nilai:

1. **Pilih Filter**
   - **Kelas**: Pilih kelas yang Anda ajar
   - **Mata Pelajaran**: Pilih mata pelajaran
   - **Semester**: Pilih semester (1 atau 2)
   - **Tahun Ajaran**: Pilih tahun ajaran

2. **Lihat Daftar Siswa**
   - Setelah memilih filter, tabel siswa akan muncul
   - Tabel menampilkan: Nama Siswa, NIS, Nilai saat ini (jika ada)

3. **Input Nilai**
   - Masukkan nilai (0-100) pada kolom input untuk setiap siswa
   - Tambahkan catatan/remarks jika diperlukan (opsional)

4. **Simpan Nilai**
   - Klik **"Simpan Nilai"** untuk menyimpan semua perubahan
   - Sistem akan memberikan notifikasi sukses atau error

#### Validasi Nilai
- Nilai harus antara 0-100
- Sistem akan menolak input yang tidak valid
- Nilai yang sudah ada dapat di-update

### 4.3 Buat Pengumuman

**Lokasi**: `/guru/announcements`

#### Melihat Daftar Pengumuman
- Menampilkan semua pengumuman yang dibuat
- Status: Aktif atau Non-aktif
- Tanggal pembuatan

#### Membuat Pengumuman Baru
1. Klik **"Buat Pengumuman"**
2. Isi form:
   - **Judul Pengumuman** (wajib, maksimal 255 karakter)
   - **Isi Pengumuman** (wajib, dapat panjang)
   - **Status Aktif** (centang untuk publish)
3. Klik **"Buat Pengumuman"**

#### Mengedit Pengumuman
1. Klik ikon **Edit**
2. Ubah judul atau isi
3. Toggle status aktif/non-aktif
4. Klik **"Update"**

#### Menghapus Pengumuman
Klik ikon **Delete** dan konfirmasi penghapusan.

### 4.4 Lihat Data Siswa

**Lokasi**: `/guru/students`

#### Fungsi
Guru dapat melihat daftar siswa yang berada di kelas yang mereka ajar:
- Nama siswa
- NIS
- Email
- Kelas
- Informasi kontak

> **ℹ️ Catatan**: Guru hanya dapat melihat siswa dari kelas yang mereka ajar, tidak semua siswa.

#### Download PDF
- Klik tombol **"Download PDF"** untuk export data siswa ke PDF
- PDF berisi tabel lengkap siswa dengan informasi detail

### 4.5 Kelola Mata Pelajaran (Guru)

**Lokasi**: `/guru/subjects-management`

Guru dapat melihat mata pelajaran yang mereka ajar dan kelas yang terkait.

---

## 5. Dashboard Staff

### Halaman Utama Staff (`/staff`)

Dashboard staff menampilkan:
- Total siswa di sekolah
- Total guru
- Total mata pelajaran
- Statistik umum

### 5.1 Lihat Data Siswa

**Lokasi**: `/staff/students`

#### Fungsi
Staff dapat melihat semua data siswa di sekolah:
- Tabel lengkap dengan semua siswa
- Informasi: Nama, NIS, Email, Kelas, Telepon, Alamat
- Fitur pencarian dan filter

#### Download PDF Siswa
1. Klik tombol **"Download PDF"**
2. Sistem akan generate PDF dengan semua data siswa
3. PDF siap untuk di-print atau di-share

#### Filter Data
- Filter berdasarkan kelas
- Pencarian berdasarkan nama atau NIS

> **ℹ️ Catatan**: Staff hanya dapat **melihat** data, tidak dapat mengedit atau menghapus.

### 5.2 Lihat Data Guru

**Lokasi**: `/staff/teachers`

#### Fungsi
Staff dapat melihat seluruh data guru:
- Nama, NIP, Email
- Mata pelajaran yang diajar
- Informasi kontak
- Tanggal bergabung

#### Download PDF Guru
Sama seperti data siswa, klik **"Download PDF"** untuk export data guru.

### 5.3 Kelola Mata Pelajaran

**Lokasi**: `/staff` (via menu)

Staff dapat melihat dan mengelola assignment mata pelajaran ke kelas.

---

## 6. Portal Siswa

### Halaman Utama Siswa (`/student`)

Portal siswa menampilkan dashboard dengan:
- Profil siswa
- Rata-rata nilai
- Total modul tersedia
- Total pengumuman aktif

### 6.1 Lihat Profil

**Lokasi**: `/student` (dashboard)

#### Informasi Profil
Siswa dapat melihat informasi pribadi mereka:
- Nama lengkap
- NIS (Nomor Induk Siswa)
- Email
- Kelas
- Nomor telepon
- Alamat
- Foto profil (jika ada)

> **ℹ️ Catatan**: Siswa tidak dapat mengedit profil sendiri. Hubungi admin untuk perubahan data.

### 6.2 Lihat Nilai

**Lokasi**: `/student/grades`

#### Tampilan Nilai
Siswa dapat melihat seluruh nilai akademik mereka:

**Tabel Nilai**
| Mata Pelajaran | Guru | Semester | Tahun Ajaran | Nilai | Catatan |
|----------------|------|----------|--------------|-------|---------|
| Matematika | Pak Budi | 1 | 2023/2024 | 85 | Bagus |
| Bahasa Indonesia | Bu Ani | 1 | 2023/2024 | 90 | Sangat baik |

#### Informasi Tambahan
- **Rata-rata Nilai**: Dihitung otomatis dari semua nilai
- **Filter**: Filter berdasarkan semester atau mata pelajaran
- **Color Coding**: 
  - Hijau: Nilai ≥ 75 (Baik)
  - Kuning: Nilai 60-74 (Cukup)
  - Merah: Nilai < 60 (Perlu perbaikan)

### 6.3 Lihat Jadwal Pelajaran

**Lokasi**: `/student/schedules`

#### Tampilan Jadwal
Jadwal ditampilkan dalam format tabel per hari:

**Contoh Jadwal Senin**
| Waktu | Mata Pelajaran | Guru | Ruangan |
|-------|----------------|------|---------|
| 08:00 - 09:30 | Matematika | Pak Budi | R.101 |
| 09:30 - 11:00 | Bahasa Indonesia | Bu Ani | R.102 |
| 11:00 - 12:30 | Fisika | Pak Joko | Lab Fisika |

#### Fitur Jadwal
- Tampilan per hari (Senin - Sabtu)
- Informasi waktu, mata pelajaran, guru, dan ruangan
- Mudah dibaca dan responsive

### 6.4 Akses Modul Pembelajaran

**Lokasi**: `/student/modules`

#### Melihat Modul
Siswa dapat mengakses modul pembelajaran:
- Daftar semua modul untuk mata pelajaran di kelas mereka
- Informasi: Judul, Mata Pelajaran, Guru Pengajar, Tanggal Upload

#### Download Modul
1. Cari modul yang diinginkan
2. Klik tombol **"Download"** atau ikon PDF
3. File akan terdownload ke perangkat Anda
4. Buka dengan PDF reader

#### Filter Modul
- Filter berdasarkan mata pelajaran
- Pencarian berdasarkan judul modul

### 6.5 Lihat Pengumuman

**Lokasi**: `/student/announcements`

#### Tampilan Pengumuman
- Daftar semua pengumuman aktif dari guru dan admin
- Urutkan berdasarkan tanggal (terbaru di atas)
- Tampilan:
  - **Judul Pengumuman**
  - **Isi Pengumuman**
  - **Penulis** (Nama guru/admin)
  - **Tanggal dibuat**

#### Notifikasi
- Badge atau indikator untuk pengumuman baru
- Update real-time (refresh halaman untuk update)

---

## 7. Editor CMS

### Halaman Utama Editor (`/editor`)

Dashboard editor menampilkan:
- Status konten landing page (published/draft)
- Jumlah berita yang dipublish
- Ringkasan semua section yang dapat diedit

### 7.1 Kelola Landing Page

Editor memiliki kontrol penuh atas semua section di landing page RDI:

#### 7.1.1 Hero Section (`/editor/hero`)

**Fungsi**: Edit section hero (bagian utama landing page)

**Cara Edit**:
1. Akses `/editor/hero`
2. Edit konten:
   - **Heading** (Judul utama)
   - **Subheading** (Subjudul)
   - **Deskripsi**
   - **Button Text** (Teks tombol CTA)
   - **Button Link** (Link tujuan tombol)
3. Upload **Background Images** untuk slideshow
4. Klik **"Simpan Perubahan"**

#### 7.1.2 Navbar Settings (`/editor/navbar`)

**Fungsi**: Kelola menu navigasi

**Edit**:
- Logo text
- Menu items
- Link menu
- Dropdown items

#### 7.1.3 Trust Partners (`/editor/trust-partners`)

**Fungsi**: Kelola logo partner/mitra

**Cara Kerja**:
1. Upload logo partner (format: PNG, JPG)
2. Tambahkan nama partner
3. Logo akan tampil di carousel infinite scroll
4. Atur urutan tampilan

#### 7.1.4 Programs (`/editor/programs`)

**Fungsi**: Edit 2 pilar program (Program Luar Negeri & HALTEC)

**Edit Program Luar Negeri**:
- Heading & Description
- **Sub-Program**:
  - Taiwan (judul, deskripsi, gambar)
  - Jerman (judul, deskripsi, gambar)
  - Jepang (judul, deskripsi, gambar)

**Edit HALTEC**:
- Heading & Description
- Icon dan detail program

#### 7.1.5 Why RDI (`/editor/why-rdi`)

**Fungsi**: Edit section "Mengapa Memilih RDI"

**Konten**:
- Heading utama
- **Features** (maksimal 6 fitur):
  - Judul feature
  - Deskripsi
  - Icon
- Gambar pendukung

#### 7.1.6 Founders (`/editor/founders`)

**Fungsi**: Kelola informasi pendiri RDI

**Edit**:
- Foto pendiri
- Nama
- Jabatan
- Bio/Deskripsi
- Quotes (opsional)

#### 7.1.7 Latest News (`/editor/latest-news`)

**Fungsi**: Konfigurasi section berita di homepage

**Setting**:
- Jumlah berita yang ditampilkan (default: 3)
- Urutan tampilan (terbaru/terpopuler)
- Heading section

> **ℹ️ Catatan**: Konten berita dikelola di `/editor/news` (lihat bagian 7.2)

#### 7.1.8 CTA (Call-to-Action) (`/editor/cta`)

**Fungsi**: Edit banner CTA untuk konversi

**Edit**:
- Heading
- Description
- Button text
- Button link (WhatsApp, form, dll)
- Background color/gradient

#### 7.1.9 Footer (`/editor/footer`)

**Fungsi**: Edit footer website

**Konten**:
- About RDI (deskripsi singkat)
- Kontak: Email, Telepon, Alamat
- Social media links (Instagram, Facebook, Twitter, YouTube)
- Copyright text
- Quick links

#### 7.1.10 Logo Settings (`/editor/logo`)

**Fungsi**: Upload dan ganti logo RDI

**Cara**:
1. Upload logo baru (format: PNG dengan background transparan)
2. Preview logo
3. Simpan

### 7.2 Kelola Berita (News/Artikel)

**Lokasi**: `/editor/news`

#### Melihat Daftar Berita
- Tabel semua berita (published & draft)
- Informasi: Judul, Status, Tanggal Publish, Views, Kategori
- Filter berdasarkan status atau kategori

#### Membuat Berita Baru
1. Klik **"Buat Berita"**
2. Isi form:
   - **Judul Berita** (wajib, maks 255 karakter)
   - **Slug** (auto-generate dari judul, bisa diedit)
   - **Excerpt** (ringkasan, wajib, untuk preview card)
   - **Konten** (wajib, gunakan rich text editor)
   - **Featured Image** (wajib, gambar thumbnail)
   - **Kategori** (opsional: "Berita", "Event", "Pengumuman")
   - **Tags** (opsional, pisahkan dengan koma)
   - **Status** (Draft/Published)
   - **Tanggal Publish** (pilih jadwal publish)
3. Klik **"Simpan Berita"**

#### Rich Text Editor
Editor menyediakan toolbar untuk formatting:
- **Bold**, *Italic*, Underline
- Heading (H1, H2, H3)
- Lists (bullet, numbered)
- Links
- Insert images
- Blockquotes
- Code blocks

#### Upload Gambar Tambahan
1. di editor, klik ikon **"Insert Image"**
2. Upload gambar (PNG, JPG, max 2MB)
3. Gambar akan tersimpan di `/uploads/news/`
4. Auto-insert ke konten

#### Mengedit Berita
1. Klik ikon **Edit** pada baris berita
2. Ubah konten yang diperlukan
3. Klik **"Update Berita"**

#### Menghapus Berita
1. Klik ikon **Delete**
2. Konfirmasi penghapusan
3. Berita dan gambar terkait akan dihapus

#### Publish/Unpublish Berita
- Ubah status dari **Draft** ke **Published**
- Berita published akan tampil di landing page
- Set tanggal publish untuk schedule posting

### 7.3 Kelola Menu Dropdown (Program Pages)

**Lokasi**: `/editor/dropdown-menu`

#### Fungsi
Kelola halaman dinamis untuk program-program spesifik:
- Program Taiwan (`/program/taiwan`)
- Program Jerman (`/program/jerman`)
- Program Jepang (`/program/jepang`)
- HALTEC (`/program/haltec`)

#### Menambah Menu/Halaman Baru
1. Klik **"Tambah Menu"**
2. Isi:
   - **Judul Menu** (contoh: "Program Jerman")
   - **Slug** (URL, contoh: "jerman")
   - **Konten** (JSON atau form builder):
     - Hero section
     - Deskripsi program
     - Benefits
     - Requirements
     - Galeri foto
   - **Order** (urutan di dropdown)
   - **Status Publish**
3. Klik **"Simpan"**

#### Edit Menu yang Ada
1. Pilih menu dari daftar
2. Edit konten menggunakan form builder atau JSON editor
3. Preview perubahan
4. Simpan

#### Content Structure (JSON)
```json
{
  "hero": {
    "title": "Program Jerman",
    "description": "Raih impian studi di Jerman",
    "image": "/uploads/jerman-hero.jpg"
  },
  "sections": [
    {
      "type": "text",
      "heading": "Tentang Program",
      "content": "<p>Deskripsi program...</p>"
    },
    {
      "type": "features",
      "items": [
        {"title": "Biaya Terjangkau", "description": "..."},
        {"title": "Universitas Top", "description": "..."}
      ]
    }
  ]
}
```

### 7.4 Setup & Settings

**Lokasi**: `/editor/setup`

#### Konfigurasi Umum
- Site title & description
- SEO settings
- Analytics codes (Google Analytics, etc.)
- Social media links
- WhatsApp Business number

#### WhatsApp Float Button (`/editor/whatsapp-float`)

**Setting**:
- Nomor WhatsApp (format: +628xxx)
- Pesan default
- Tampilkan/Sembunyikan button
- Posisi button (kanan bawah/kiri bawah)
- Warna button

> **💡 Tips**: Gunakan nomor WhatsApp Business untuk tracking yang lebih baik

---

## 8. FAQ & Troubleshooting

### Pertanyaan Umum (FAQ)

#### Q1: Bagaimana cara reset password?
**A**: Hubungi administrator sistem. Saat ini belum ada fitur reset password otomatis.

#### Q2: Saya tidak bisa login, apa yang harus dilakukan?
**A**: Periksa:
1. Email sudah benar dan terdaftar
2. Password benar (case-sensitive)
3. Akun tidak diblokir
4. Koneksi internet stabil

Jika masih gagal, hubungi admin.

#### Q3: Guru tidak bisa input nilai untuk kelas tertentu
**A**: Pastikan:
1. Guru sudah di-assign ke kelas tersebut (hubungi admin)
2. Mata pelajaran sudah di-assign ke kelas
3. Semester dan tahun ajaran sudah benar

#### Q4: Siswa tidak bisa melihat modul yang di-upload guru
**A**: Cek:
1. Modul sudah di-publish (status Published = ON)
2. Modul di-assign untuk kelas siswa tersebut
3. Refresh browser (Ctrl+F5)

#### Q5: File PDF tidak bisa didownload
**A**: Pastikan:
1. Koneksi internet stabil
2. Browser tidak memblokir download
3. File masih ada di server (cek dengan admin jika error)

#### Q6: Foto/gambar tidak tampil
**A**: 
1. Refresh halaman (Ctrl+F5)
2. Cek format gambar (harus JPG, PNG)
3. Cek URL gambar valid
4. Periksa koneksi internet

#### Q7: Bagaimana cara mengganti foto profil siswa?
**A**: Saat ini hanya admin yang bisa mengedit foto profil. Hubungi admin dengan mengirim foto baru.

### Troubleshooting

#### Masalah: Halaman loading terus / tidak merespon

**Solusi**:
1. Refresh halaman (F5 atau Ctrl+R)
2. Clear cache browser:
   - Chrome: Ctrl+Shift+Delete → Clear cache
   - Firefox: Ctrl+Shift+Delete → Clear cache
3. Coba browser lain
4. Restart browser
5. Periksa koneksi internet

#### Masalah: Data tidak tersimpan

**Solusi**:
1. Pastikan semua field wajib (*) sudah diisi
2. Cek validasi error (notifikasi merah)
3. Cek koneksi internet
4. Logout dan login kembali
5. Hubungi admin jika masih terjadi

#### Masalah: Akses ditolak (403 Forbidden)

**Solusi**:
1. Pastikan Anda login dengan akun yang benar
2. Periksa role/peran Anda sesuai dengan halaman yang diakses
3. Logout dan login kembali
4. Hubungi admin jika role tidak sesuai

#### Masalah: Error 404 - Halaman tidak ditemukan

**Solusi**:
1. Cek URL yang diakses sudah benar
2. Kembali ke dashboard dan navigasi ulang
3. Clear cache browser
4. Hubungi admin jika halaman memang hilang

#### Masalah: Upload file gagal

**Solusi**:
1. Cek ukuran file (maksimal biasanya 5-10 MB)
2. Cek format file (PDF untuk modul, JPG/PNG untuk gambar)
3. Coba compress file jika terlalu besar
4. Gunakan koneksi internet yang stabil
5. Coba ulang beberapa saat kemudian

### Kontak Dukungan

Jika mengalami masalah yang tidak bisa diselesaikan:

- **Email**: support@rdi.ac.id (contoh)
- **WhatsApp**: +62 xxx xxxx xxxx
- **Jam Kerja**: Senin - Jumat, 08:00 - 16:00 WIB

---

## 📝 Catatan Penting

### Keamanan
- ❗ **Jangan share password** Anda kepada siapa pun
- ❗ **Logout** setelah selesai menggunakan, terutama di komputer publik
- ❗ Gunakan password yang kuat (minimal 8 karakter, kombinasi huruf & angka)
- ❗ Ganti password secara berkala (setiap 3-6 bulan)

### Best Practices

#### Untuk Admin
- Backup data secara berkala
- Pantau aktivitas user yang mencurigakan
- Update data siswa dan guru secara teratur
- Validasi data sebelum menghapus

#### Untuk Guru
- Upload modul dengan penamaan file yang jelas
- Berikan catatan pada nilai siswa untuk feedback
- Perbarui pengumuman secara rutin
- Hapus modul lama yang sudah tidak relevan

#### Untuk Staff
- Verifikasi data sebelum export PDF
- Laporkan anomali data ke admin
- Bantu siswa/guru yang kesulitan akses sistem

#### Untuk Siswa
- Cek nilai dan pengumuman secara rutin
- Download modul sebelum ujian
- Laporkan kesalahan data ke wali kelas

#### Untuk Editor
- Preview perubahan sebelum publish
- Gunakan gambar berkualitas tinggi (tapi tidak terlalu besar)
- Optimasi SEO untuk setiap konten
- Backup konten penting sebelum edit
- Schedule berita untuk posting otomatis

### Tips Penggunaan

1. **Gunakan Browser Modern**: Chrome, Firefox, Edge versi terbaru
2. **Koneksi Stabil**: Pastikan koneksi internet stabil saat upload file
3. **Screen Size**: Untuk editing, gunakan layar minimal 1024px (desktop/laptop)
4. **Mobile Access**: Aplikasi fully responsive, akses dari smartphone juga optimal
5. **Bookmark Halaman**: Bookmark halaman yang sering diakses untuk efisiensi

---

## 🎓 Kesimpulan

Sistem Terintegrasi RDI dirancang untuk mempermudah manajemen sekolah dan meningkatkan komunikasi antara admin, guru, staff, dan siswa. 

**Manfaat Utama**:
- ✅ **Efisiensi**: Paperless, semua data digital dan terintegrasi
- ✅ **Transparansi**: Siswa dan orang tua bisa pantau nilai real-time
- ✅ **Aksesibilitas**: Akses dari mana saja, kapan saja
- ✅ **Komunikasi**: Pengumuman dan modul tersebar cepat
- ✅ **Profesional**: Landing page modern untuk branding sekolah

Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi tim dukungan teknis. Selamat menggunakan Sistem Terintegrasi RDI! 🎉

---

**Versi Dokumen**: 1.0  
**Tanggal**: 21 Januari 2026  
**Dibuat oleh**: Tim Pengembang RDI  
**Lisensi**: Internal Use Only

---

Built with ❤️ for Rosman Djohan Institute
