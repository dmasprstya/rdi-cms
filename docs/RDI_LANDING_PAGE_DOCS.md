# 📘 Rosman Djohan Institute - Landing Page Documentation

## 🎯 Overview
Landing page website untuk **Rosman Djohan Institute (RDI)**, lembaga pendidikan vokasi yang menawarkan dua pilar program utama:
1. **Program Luar Negeri** (Jerman, Taiwan, Jepang)
2. **HALTEC** (Halal Training & Certification)

---

## 🌟 Fitur Utama

### 1. **Navbar dengan Dropdown**
- Logo RDI dengan teks "Rosman Djohan Institute"
- Menu navigasi:
  - Beranda
  - **Program** (dengan dropdown):
    - Program Luar Negeri
    - HALTEC
  - Berita
  - Tentang Kami
  - Tombol KONTAK
- Navbar transparan yang berubah solid saat di-scroll
- Responsive untuk mobile & desktop

**Komponen:** `components/rdi/navbar-rdi.tsx`

---

### 2. **Hero Section**
- Video background dengan overlay dark
- Judul besar: "WUJUDKAN MASA DEPAN KOMPETEN DAN MENDUNIA"
- Subtitle menjelaskan value proposition RDI
- CTA button "JELAJAHI PROGRAM KAMI" yang scroll ke section program
- Scroll indicator animasi

**Komponen:** `components/rdi/hero-section.tsx`

**⚠️ Note:** Video placeholder di `/videos/hero-rdi.mp4` - ganti dengan video asli

---

### 3. **Trust Partners Section**
- Menampilkan logo mitra institusi pendidikan & lembaga halal
- Partners: Goethe, Chunghua, BPJPH, LSP Halal, Izumi
- Grayscale dengan hover effect berwarna

**Komponen:** `components/rdi/trust-partners-section.tsx`

**⚠️ Note:** Logo placeholder - ganti dengan logo asli di folder `/public/logos/`

---

### 4. **Core Pillars Section** (Critical Section!)
Bagian paling penting untuk memisahkan traffic ke 2 program:

#### Card 1: GO GLOBAL (Luar Negeri)
- Image background suasana mahasiswa luar negeri
- Fitur: Kuliah+Kerja Taiwan, Ausbildung Jerman, Tokutei Ginou Jepang
- Link ke `/program/luar-negeri`

#### Card 2: HALTEC (Halal Training)
- Image background suasana training halal
- Program: Penyelia Halal, JULEHA, Auditor Halal Internal
- Link ke `/program/haltec`

**Komponen:** `components/rdi/core-pillars-section.tsx`

**⚠️ Note:** Image placeholder - ganti dengan foto asli

---

### 5. **Why RDI Section**
3 value proposition utama:
- **Jaringan Luas** - Koneksi ke universitas & industri global
- **Didirikan oleh Ahli** - Praktisi berpengalaman
- **Resmi & Terpercaya** - Berizin resmi

**Komponen:** `components/rdi/why-rdi-section.tsx`

---

### 6. **Founders Section**
- Background dark navy (#0A192F)
- 2 founder cards dengan:
  - Foto (placeholder)
  - Nama & role
  - Vision badge
  - Quote inspiratif

**Komponen:** `components/rdi/founders-section.tsx`

**⚠️ Note:** Foto founder placeholder - ganti dengan foto asli di `/public/images/`

---

### 7. **Latest News Section**
- 3 kartu berita terbaru
- Setiap kartu memiliki:
  - Category badge (Overseas / Haltec)
  - Tanggal publikasi
  - Judul & excerpt
  - Link "Baca Selengkapnya"

**Komponen:** `components/rdi/latest-news-section.tsx`

**📌 Dummy Data:** Sudah ada 3 berita contoh. Nanti akan terhubung ke CMS.

---

### 8. **CTA Section**
- Background kuning (primary color)
- **2 tombol WhatsApp terpisah** untuk menghindari kebingungan admin:
  1. **Konsultasi Program Luar Negeri**
  2. **Daftar Training Halal**
- Each button opens WhatsApp dengan message template berbeda

**Komponen:** `components/rdi/cta-section.tsx`

**⚠️ TODO:** Ganti nomor WhatsApp di baris 6-7:
```tsx
const waOverseas = "6281234567890"; // Ganti dengan nomor WA asli
const waHaltec = "6281234567891";   // Ganti dengan nomor WA asli
```

---

### 9. **Footer**
4 kolom informasi:
1. **Logo & Sosial Media** - Links ke Facebook, Instagram, YouTube, LinkedIn
2. **Menu Program** - Links ke semua program
3. **Legalitas** - NIB, Izin LPK, NPWP
4. **Kontak** - Alamat, email, telepon

**Komponen:** `components/rdi/footer-rdi.tsx`

**⚠️ TODO:** Update informasi legalitas & kontak dengan data asli

---

## 📄 Halaman Program

### Program Luar Negeri (`/program/luar-negeri`)

3 program tersedia:

#### 1. **Taiwan - Kuliah + Kerja**
- **Durasi:** 4 tahun (S1)
- **Gaji:** NT$ 180/jam
- **Keuntungan:** Beasiswa hingga 100%, izin kerja part-time
- **Persyaratan:** Lulusan SMA/SMK, max 25 tahun, HSK 4

#### 2. **Jerman - Ausbildung**
- **Durasi:** 3 tahun
- **Gaji:** €800-1.200/bulan
- **Keuntungan:** Sertifikat internasional, asuransi kesehatan
- **Persyaratan:** Usia 18-25 tahun, Bahasa Jerman B1

#### 3. **Jepang - Tokutei Ginou (SSW)**
- **Durasi:** 1-5 tahun
- **Gaji:** ¥150.000-200.000/bulan
- **Keuntungan:** 12 sektor industri, jaminan sosial
- **Persyaratan:** Usia 18-35 tahun, JLPT N4

**Fitur Tambahan:**
- Proses pendaftaran 5 langkah (timeline)
- Scroll navigation dengan ID anchor

**File:** `app/program/luar-negeri/page.tsx`

---

### Program HALTEC (`/program/haltec`)

3 sertifikasi profesi:

#### 1. **Penyelia Halal**
- **Durasi:** 5 hari (40 jam)
- **Sertifikat:** LSP & BPJPH
- **Untuk:** QA/QC industri makanan, manager produksi

#### 2. **Juru Sembelih Halal (JULEHA)**
- **Durasi:** 3 hari (24 jam)
- **Sertifikat:** LSP JULEHA (berlaku 2 tahun)
- **Untuk:** Pekerja RPH, industri daging

#### 3. **Auditor Halal Internal**
- **Durasi:** 7 hari (56 jam)
- **Sertifikat:** Auditor Internal LSP
- **Untuk:** Penyelia halal, konsultan, QA manager

**Fitur Tambahan:**
- Statistik (500+ peserta lulus, tingkat kelulusan 98%)
- "Mengapa Pilih HALTEC?" section
- Alur pendaftaran 6 langkah

**File:** `app/program/haltec/page.tsx`

---

## 🎨 Design System

### Colors
Menggunakan existing color scheme dari proyek:
- **Primary:** Yellow (`hsl(45 93% 58%)`) - #fac031
- **Background:** White (light) / Dark Navy (dark mode)
- **Accent:** Blue untuk overseas, Green untuk halal

### Typography
- Sans-serif clean
- Heading: Bold, ukuran besar untuk H1
- Body: Regular untuk readability

### Components
Menggunakan **Shadcn UI**:
- `Button`
- `Card`
- `Badge`
- `NavigationMenu`

---

## 🔧 Setup & Installation

### 1. Install Dependencies
```bash
npm install @radix-ui/react-navigation-menu
```

### 2. Struktur File
```
app/
├── page.tsx                    # Landing page utama
├── program/
│   ├── luar-negeri/page.tsx   # Halaman program overseas
│   └── haltec/page.tsx         # Halaman program HALTEC

components/
├── rdi/
│   ├── navbar-rdi.tsx          # Navbar dengan dropdown
│   ├── hero-section.tsx        # Hero dengan video
│   ├── trust-partners-section.tsx
│   ├── core-pillars-section.tsx # Split cards (penting!)
│   ├── why-rdi-section.tsx
│   ├── founders-section.tsx
│   ├── latest-news-section.tsx
│   ├── cta-section.tsx         # WhatsApp CTA
│   └── footer-rdi.tsx
│
└── ui/
    ├── badge.tsx               # Shadcn Badge
    └── navigation-menu.tsx     # Shadcn NavigationMenu
```

### 3. Run Development Server
```bash
npm run dev
```
Buka: `http://localhost:3000`

---

## ✅ TODO List

### Konten
- [ ] Ganti video hero (`/public/videos/hero-rdi.mp4`)
- [ ] Upload logo mitra (`/public/logos/`)
- [ ] Upload foto program (`/public/images/`)
- [ ] Upload foto founder (`/public/images/founder-rosman.jpg`, `/public/images/founder-2.jpg`)
- [ ] Update nomor WhatsApp di `cta-section.tsx`
- [ ] Update info legalitas di `footer-rdi.tsx` (NIB, Izin LPK, NPWP)
- [ ] Update alamat & kontak di `footer-rdi.tsx`
- [ ] Update sosial media links di `footer-rdi.tsx`

### CMS Integration (Future)
- [ ] Setup Custom Post Type: **Programs**
- [ ] Taxonomy: `Type` dengan values:
  - `Overseas`
  - `Halal`
- [ ] Connect `latest-news-section.tsx` ke CMS data

### Mobile Optimization
- [ ] Implement mobile menu (hamburger)
- [ ] Test responsiveness di semua breakpoints

---

## 🚀 Build & Deploy

### Build Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## 📱 Responsive Design
- **Mobile (< 768px):** Single column, hamburger menu
- **Tablet (768px - 1024px):** 2 column grid
- **Desktop (> 1024px):** Full layout dengan max-width container

---

## 🎯 SEO Optimization
- Semantic HTML5 (section, header, footer)
- Proper heading hierarchy (H1 > H2 > H3)
- Alt text untuk images (TODO)
- Meta descriptions (TODO di layout.tsx)

---

## 🔗 Routes

| Path | Deskripsi |
|------|-----------|
| `/` | Landing page utama |
| `/program/luar-negeri` | Detail program overseas (Taiwan, Jerman, Jepang) |
| `/program/haltec` | Detail program HALTEC (Penyelia, JULEHA, Auditor) |
| `/#program-pillars` | Scroll ke section program |
| `/#berita` | Scroll ke section berita |
| `/#tentang-kami` | Scroll ke section about |
| `/#kontak` | Scroll ke CTA section |

---

## 💡 Best Practices Yang Diterapkan

1. **Component-based Architecture** - Setiap section adalah komponen terpisah
2. **Client Components** - Gunakan `"use client"` hanya untuk interaktif components
3. **Type Safety** - TypeScript untuk semua components
4. **Accessibility** - Semantic HTML & proper ARIA labels
5. **Performance** - Lazy loading images, optimized builds
6. **Maintainability** - Clean code, clear naming conventions

---

## 📞 Support

Untuk pertanyaan atau issue, hubungi:
- Email: dev@rosmandjohan.id
- Discord: #dev-support

---

**Last Updated:** 2025-12-27  
**Version:** 1.0.0  
**Developer:** Antigravity AI Agent
