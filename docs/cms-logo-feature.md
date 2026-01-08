# Dokumentasi: Logo Perusahaan yang Dapat Diganti melalui CMS

## Deskripsi Fitur

Logo perusahaan dan nama perusahaan di navbar landing page sekarang dapat diganti melalui halaman CMS Editor. 

### Fitur yang Tersedia:

1. **Default**
   - Icon topi wisuda (GraduationCap icon) dengan warna kuning
   - Teks logo utama yang dapat diganti (contoh: "STS")
   - Teks logo sekunder yang dapat diganti (contoh: "System")

2. **Custom Image**
   - Upload gambar logo custom (PNG, JPG, dll)
   - Ukuran maksimal 2MB
   - Gambar akan ditampilkan bersama dengan teks logo
   - Teks logo utama dan sekunder tetap dapat dikustomisasi
   - Preview untuk light mode dan dark mode

## Cara Menggunakan

### 1. Akses Halaman Editor Logo

1. Login sebagai user dengan role **editor**
2. Buka halaman: `/editor/logo`
3. Atau klik menu **"Logo"** di sidebar CMS Editor

### 2. Pilih Tipe Logo

#### Opsi A: Default
1. Pilih radio button **"Default"**
2. Isi **Teks Logo Utama** (contoh: "STS", "SMK", "Sekolah")
3. Isi **Teks Logo Sekunder** (contoh: "System", "Negeri 1", "Modern")
4. Klik **"Simpan Logo"**

#### Opsi B: Custom Image
1. Pilih radio button **"Custom Image"**
2. Isi **Teks Logo Utama** (contoh: "STS", "SMK", "Sekolah")
3. Isi **Teks Logo Sekunder** (contoh: "System", "Negeri 1", "Modern")
4. Klik area upload atau **"Klik untuk upload"**
5. Pilih file gambar (PNG, JPG, max 2MB)
6. Preview akan muncul untuk light mode dan dark mode
7. Gambar akan ditampilkan di samping teks logo
8. Klik **"Simpan Logo"**

### 3. Preview Logo

Di sebelah kanan halaman editor, Anda dapat melihat preview logo untuk:
- **Light Mode** (background putih)
- **Dark Mode** (background gelap)

### 4. Simpan dan Lihat Hasil

1. Klik tombol **"Simpan Logo"**
2. Tunggu notifikasi sukses
3. Halaman akan refresh otomatis
4. Logo baru akan tampil di:
   - **Navbar** landing page (logo di kiri atas)
   - **Hero Section** landing page (gambar/icon di atas judul utama)

## Sinkronisasi Logo

Logo yang Anda pilih akan otomatis tampil di 2 tempat:

1. **Navbar** - Logo di kiri atas halaman, dengan teks di sampingnya
2. **Hero Section** - Gambar/icon di atas judul utama halaman landing

Kedua tempat ini akan selalu menampilkan logo yang sama sesuai pilihan Anda di CMS Editor.

## Struktur Data

Logo disimpan di database dalam table `landing_page_content` dengan:
- **section**: 'logo'
- **content**: JSON object dengan struktur:
  ```json
  {
    "logoText": "STS",
    "logoSubText": "System",
    "useIcon": true,
    "customImageUrl": ""
  }
  ```

## File yang Dimodifikasi

1. **components/navbar.tsx**
   - Ditambahkan state `logoData` untuk menyimpan data logo
   - Ditambahkan fetch API untuk mengambil data logo dari CMS
   - Diubah tampilan logo untuk mendukung icon+text atau custom image+text

2. **components/landing/hero-section.tsx**
   - Diubah menjadi client component ('use client')
   - Ditambahkan fetch API untuk mengambil data logo dari CMS
   - Gambar/icon di atas judul utama sekarang mengikuti logo yang dipilih di CMS

3. **app/editor/logo/page.tsx** (sudah ada sebelumnya)
   - Halaman editor untuk mengelola logo
   - Form untuk memilih tipe logo dan upload image
   - Preview untuk light dan dark mode
   - Field teks untuk kedua mode (default dan custom image)

4. **app/api/cms/route.ts** (sudah ada sebelumnya)
   - API endpoint untuk GET dan POST data CMS
   - Mendukung section 'logo'

## Tips Penggunaan

1. **Ukuran Logo Optimal**: Tinggi 40-50px untuk tampilan terbaik
2. **Format Gambar**: PNG dengan background transparan lebih baik untuk dark mode
3. **Test Preview**: Selalu test di light & dark mode sebelum save
4. **Cache**: Jika logo tidak berubah, coba refresh browser dengan Ctrl+F5

## Troubleshooting

### Logo tidak muncul setelah save
- Pastikan Anda sudah login sebagai editor
- Coba refresh halaman dengan Ctrl+F5
- Periksa console browser untuk error

### Upload gambar gagal
- Pastikan ukuran file tidak lebih dari 2MB
- Pastikan file adalah format gambar (PNG, JPG, GIF, dll)
- Coba compress gambar terlebih dahulu

### Logo terpotong atau tidak proporsional
- Gunakan gambar dengan aspect ratio yang sesuai
- Tinggi optimal 40-50px
- Untuk logo landscape, lebar maksimal ~200px
