# 📋 RDI Landing Page - Content Update Checklist

Gunakan checklist ini untuk memastikan semua placeholder sudah diganti dengan konten asli.

---

## 🎬 Media Assets

### Video
- [ ] **Hero Video** - `/public/videos/hero-rdi.mp4`
  - Format: MP4, H.264 codec
  - Resolusi: 1920x1080 minimal
  - Durasi: 15-30 detik (loop)
  - Konten: Gabungan suasana belajar internasional + training halal

### Logo Mitra (5 files)
- [ ] `/public/logos/goethe.png` - Goethe Institut
- [ ] `/public/logos/chunghua.png` - Chunghua University Taiwan
- [ ] `/public/logos/bpjph.png` - BPJPH Indonesia
- [ ] `/public/logos/lsp-halal.png` - LSP Halal
- [ ] `/public/logos/izumi.png` - Izumi Corporation Japan

**Spesifikasi:**
- Format: PNG dengan background transparan
- Ukuran: 300x150px (ratio 2:1)
- File size: < 50KB per logo

### Foto Program (2 files)
- [ ] `/public/images/overseas-students.jpg` - Mahasiswa luar negeri
  - Konten: Mahasiswa Indonesia di kampus/kelas luar negeri
  - Resolusi: 1200x800px minimal
  
- [ ] `/public/images/halal-training.jpg` - Suasana training halal
  - Konten: Instruktur mengajar peserta training halal
  - Resolusi: 1200x800px minimal

### Foto Founder (2 files)
- [ ] `/public/images/founder-rosman.jpg` - Rosman Djohan
  - Portrait professional
  - Resolusi: 800x800px (square)
  
- [ ] `/public/images/founder-2.jpg` - Co-Founder
  - Portrait professional
  - Resolusi: 800x800px (square)

---

## 📞 Contact Information

### WhatsApp Numbers
**File:** `components/rdi/cta-section.tsx` (Line 6-7)

```tsx
// CURRENT (Placeholder):
const waOverseas = "6281234567890";
const waHaltec = "6281234567891";

// UPDATE TO:
const waOverseas = "62___________"; // ← Nomor WA untuk Program Overseas
const waHaltec = "62___________";   // ← Nomor WA untuk Program HALTEC
```

- [ ] Update nomor WhatsApp Overseas
- [ ] Update nomor WhatsApp HALTEC
- [ ] Test keduanya (klik dari browser)

---

## 🏢 Company Information

### Legalitas
**File:** `components/rdi/footer-rdi.tsx` (Around line 62-65)

```tsx
// CURRENT:
<li>NIB: 1234567890123456</li>
<li>Izin LPK: SK/012/2024</li>
<li>NPWP: 12.345.678.9-012.000</li>

// UPDATE TO:
```

- [ ] NIB: ____________________
- [ ] Izin LPK: ____________________
- [ ] NPWP: ____________________

### Kontak
**File:** `components/rdi/footer-rdi.tsx` (Around line 73-82)

- [ ] **Alamat:**
  ```
  Current: Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345
  Update:  _________________________________________________
  ```

- [ ] **Email:**
  ```
  Current: info@rosmandjohan.id
  Update:  _________________________
  ```

- [ ] **Telepon:**
  ```
  Current: +62 21 1234 5678
  Update:  _________________________
  ```

---

## 🌐 Social Media Links

**File:** `components/rdi/footer-rdi.tsx` (Line 27-50)

Replace `#` dengan URL asli:

- [ ] **Facebook:** https://facebook.com/_______________
- [ ] **Instagram:** https://instagram.com/_______________
- [ ] **YouTube:** https://youtube.com/@_______________
- [ ] **LinkedIn:** https://linkedin.com/company/_______________

---

## 👤 Founder Information

**File:** `components/rdi/founders-section.tsx` (Line 4-18)

### Founder 1
- [ ] **Nama:** Rosman Djohan _(sudah benar?)_
- [ ] **Role:** Founder & CEO _(sudah benar?)_
- [ ] **Vision:** Visi Global _(sudah benar?)_
- [ ] **Quote:** 
  ```
  Current: "Membawa talenta Indonesia ke panggung dunia melalui pendidikan berkualitas."
  Update:  ________________________________________________________
  ```

### Founder 2
- [ ] **Nama:** ____________________
- [ ] **Role:** ____________________
- [ ] **Vision:** ____________________
- [ ] **Quote:** ____________________

---

## 📰 News Items (Optional - Untuk Demo)

**File:** `components/rdi/latest-news-section.tsx` (Line 6-27)

Update 3 berita dummy dengan berita asli:

### Berita 1
- [ ] Title: ____________________
- [ ] Excerpt: ____________________
- [ ] Category: Overseas / Haltec
- [ ] Date: YYYY-MM-DD
- [ ] Slug: (untuk URL)

### Berita 2
- [ ] Title: ____________________
- [ ] Excerpt: ____________________
- [ ] Category: Overseas / Haltec
- [ ] Date: YYYY-MM-DD
- [ ] Slug: (untuk URL)

### Berita 3
- [ ] Title: ____________________
- [ ] Excerpt: ____________________
- [ ] Category: Overseas / Haltec
- [ ] Date: YYYY-MM-DD
- [ ] Slug: (untuk URL)

---

## 🎓 Program Information Review

### Taiwan Program
**File:** `app/program/luar-negeri/page.tsx` (Line 14-32)

- [ ] Review keuntungan program (6 items)
- [ ] Review persyaratan (5 items)
- [ ] Update gaji jika ada perubahan: NT$ 180/jam
- [ ] Update durasi jika perlu: 4 tahun

### Jerman Program
**File:** `app/program/luar-negeri/page.tsx` (Line 34-52)

- [ ] Review keuntungan program (6 items)
- [ ] Review persyaratan (5 items)
- [ ] Update gaji: €800-1.200/bulan
- [ ] Update durasi: 3 tahun

### Jepang Program
**File:** `app/program/luar-negeri/page.tsx` (Line 54-72)

- [ ] Review keuntungan program (6 items)
- [ ] Review persyaratan (5 items)
- [ ] Update gaji: ¥150.000-200.000/bulan
- [ ] Update durasi: 1-5 tahun

### HALTEC Programs
**File:** `app/program/haltec/page.tsx`

- [ ] Review Penyelia Halal (durasi, materi, target)
- [ ] Review JULEHA (durasi, materi, target)
- [ ] Review Auditor Halal (durasi, materi, target)
- [ ] Update statistik: 500+ peserta, 98% kelulusan

---

## ✅ Testing After Updates

### Functionality Tests
- [ ] Klik semua link di navbar (desktop)
- [ ] Buka mobile menu dan test semua link
- [ ] Test dropdown "Program" (desktop & mobile)
- [ ] Klik 2 tombol WhatsApp dan verifikasi message template
- [ ] Test smooth scroll (anchor links: #berita, #kontak, dll)

### Visual Tests
- [ ] Semua gambar muncul dengan benar
- [ ] Logo mitra tidak pecah/blur
- [ ] Video hero autoplay dengan smooth
- [ ] Foto founder tampil proporsional
- [ ] Tidak ada broken images (404)

### Responsive Tests
- [ ] Buka di mobile (< 768px)
- [ ] Buka di tablet (768-1024px)
- [ ] Buka di desktop (> 1024px)
- [ ] Hamburger menu berfungsi di mobile
- [ ] Cards stack dengan baik di mobile

### Cross-Browser Tests
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (jika ada)
- [ ] Mobile browsers (Chrome, Safari iOS)

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Semua placeholder sudah diganti
- [ ] Build production berhasil: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] No console errors di browser

### Environment Variables
- [ ] Setup `.env.production` jika perlu
- [ ] Database connection (sudah ada)
- [ ] Analytics keys (Google Analytics, dll)

### SEO
- [ ] Update meta tags di `app/layout.tsx`
- [ ] Add OpenGraph images
- [ ] Submit sitemap ke Google Search Console

---

## 📊 Progress Tracking

**Overall Completion:**
```
[  ] Media Assets (0/9)
[  ] Contact Info (0/5)
[  ] Company Info (0/6)
[  ] Social Media (0/4)
[  ] Founder Info (0/2)
[  ] Testing (0/15)
```

**Progress:** ___% Complete

---

## 💡 Tips

1. **Ukuran File:** Compress semua images dengan TinyPNG atau Squoosh
2. **Format Video:** Gunakan Handbrake untuk compress video hero
3. **Testing:** Test di real device, bukan hanya browser DevTools
4. **Backup:** Simpan file original sebelum edit

---

## 📞 Need Help?

Jika ada kendala:
1. Check dokumentasi: `docs/RDI_LANDING_PAGE_DOCS.md`
2. Check quick start: `RDI_QUICKSTART.md`
3. Contact dev team

---

**Happy Updating! 🎉**

_Last Updated: 2025-12-27_
