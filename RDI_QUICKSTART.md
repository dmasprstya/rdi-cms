# 🚀 Quick Start - RDI Landing Page

## ✅ Apa yang Sudah Dibuat?

### ✨ **3 Halaman Utama**
1. **Landing Page** (`/`)
   - Hero dengan video background
   - Trust partners
   - 2 Kartu program (Overseas & HALTEC)
   - Why RDI
   - Founders section
   - Latest news
   - CTA WhatsApp
   - Footer lengkap

2. **Program Luar Negeri** (`/program/luar-negeri`)
   - Taiwan, Jerman, Jepang
   - Detail program + persyaratan
   - Timeline pendaftaran

3. **Program HALTEC** (`/program/haltec`)
   - Penyelia Halal, JULEHA, Auditor
   - Detail sertifikasi
   - Alur pendaftaran

### 🎨 **9 Komponen RDI** (di `components/rdi/`)
- ✅ `navbar-rdi.tsx` - Navbar dengan dropdown
- ✅ `hero-section.tsx` - Hero dengan video & CTA
- ✅ `trust-partners-section.tsx` - Logo mitra
- ✅ `core-pillars-section.tsx` - 2 kartu program
- ✅ `why-rdi-section.tsx` - 3 value props
- ✅ `founders-section.tsx` - Profil founder
- ✅ `latest-news-section.tsx` - 3 berita terbaru
- ✅ `cta-section.tsx` - Tombol WhatsApp
- ✅ `footer-rdi.tsx` - Footer lengkap

---

## 🎯 Langkah Selanjutnya

### 1️⃣ **Ganti Placeholder Content**

#### Video Hero
```
/public/videos/hero-rdi.mp4
```
Upload video suasana belajar internasional + training halal

#### Logo Mitra
```
/public/logos/goethe.png
/public/logos/chunghua.png
/public/logos/bpjph.png
/public/logos/lsp-halal.png
/public/logos/izumi.png
```

#### Foto Program & Founder
```
/public/images/overseas-students.jpg
/public/images/halal-training.jpg
/public/images/founder-rosman.jpg
/public/images/founder-2.jpg
```

---

### 2️⃣ **Update Nomor WhatsApp**

Edit file: `components/rdi/cta-section.tsx`

```tsx
// Baris 6-7
const waOverseas = "628123456789"; // ← Ganti ini
const waHaltec = "628123456789";   // ← Ganti ini
```

---

### 3️⃣ **Update Info Legalitas & Kontak**

Edit file: `components/rdi/footer-rdi.tsx`

**Legalitas** (baris 62-65):
```tsx
<li>NIB: 1234567890123456</li>       // ← Ganti
<li>Izin LPK: SK/012/2024</li>       // ← Ganti
<li>NPWP: 12.345.678.9-012.000</li>  // ← Ganti
```

**Kontak** (baris 73-82):
```tsx
<span>Jl. Pendidikan No. 123...</span>  // ← Ganti alamat
<a href="mailto:info@rosmandjohan.id">  // ← Ganti email
<a href="tel:+622112345678">            // ← Ganti telepon
```

**Sosial Media** (baris 27-50):
```tsx
<Link href="#">  // ← Ganti dengan URL Facebook asli
<Link href="#">  // ← Instagram
<Link href="#">  // ← YouTube
<Link href="#">  // ← LinkedIn
```

---

## 🌐 Lihat Hasil

### Development
```bash
npm run dev
```
Buka: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

---

## 📋 Routes yang Tersedia

| URL | Halaman |
|-----|---------|
| `/` | Landing page RDI |
| `/program/luar-negeri` | Detail program overseas |
| `/program/haltec` | Detail program HALTEC |

---

## 🎨 Warna yang Digunakan

- **Primary (Kuning):** `#fac031` - Tombol, badge, highlights
- **Dark Navy:** `#0A192F` - Founders section background
- **Blue Gradient:** Untuk card Overseas
- **Green Gradient:** Untuk card HALTEC

Semua warna sudah sesuai dengan sistem warna existing proyek Anda.

---

## ⚡ Fitur Keren yang Sudah Ada

1. ✅ **Navbar sticky** dengan efek scroll (transparan → solid)
2. ✅ **Dropdown menu** untuk Program (responsive)
3. ✅ **Video background** di hero (dengan fallback gradient)
4. ✅ **Hover effects** di semua card & button
5. ✅ **Smooth scroll** untuk navigasi internal
6. ✅ **2 tombol WhatsApp terpisah** (menghindari kebingungan admin)
7. ✅ **Dark mode ready** (menggunakan sistem tema existing)
8. ✅ **Fully responsive** (mobile, tablet, desktop)

---

## 🔧 Troubleshooting

### Build Error?
```bash
# Clear cache & rebuild
rm -rf .next
npm run build
```

### Port 3000 sudah dipakai?
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

### Styles tidak muncul?
Pastikan Tailwind config sudah include:
```ts
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,jsx,ts,tsx}",  // ← Penting!
]
```

---

## 📱 Mobile Responsiveness

Semua section sudah responsive:
- Navbar: Burger menu (TODO: implement mobile menu)
- Hero: Text resize otomatis
- Cards: Stack vertical di mobile
- Footer: 4 kolom → 1 kolom di mobile

---

## 🎓 Next Steps (Opsional)

### Tambah Halaman Berita
```tsx
// app/berita/page.tsx
// app/berita/[slug]/page.tsx
```

### Integrasi CMS
- Setup Strapi / Directus
- Connect ke `latest-news-section.tsx`
- Taxonomy untuk filter Overseas/Halal

### SEO Enhancement
- Meta tags di `layout.tsx`
- OpenGraph images
- Structured data (JSON-LD)

---

## 📞 Need Help?

Dokumentasi lengkap ada di: **`docs/RDI_LANDING_PAGE_DOCS.md`**

---

**🎉 Happy Coding! Landing page RDI sudah siap digunakan!**
