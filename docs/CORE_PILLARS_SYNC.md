# Dokumentasi Sinkronisasi Core Pillars & Program Pages

## Ringkasan Perubahan

Dokumentasi ini menjelaskan perbaikan yang telah dilakukan untuk mengatasi 2 masalah utama dalam sistem Core Pillars dan Program Pages.

---

## Masalah 1: Inkonsistensi UI Card saat Menambah/Menghapus Features

### Masalah
Ketika features ditambah atau dihapus di CMS Core Pillars:
- Tinggi card berubah-ubah
- Tombol "Detail Program" bergerak naik/turun
- Penambahan lebih dari 4 features menyebabkan tombol turun ke bawah

### Solusi
**File yang diubah**: `components/rdi/core-pillars-section.tsx`

**Perubahan yang dilakukan**:
1. Mengubah `CardContent` menggunakan **flexbox layout** dengan tinggi tetap (`h-64`)
2. Area features dibuat **scrollable** dengan max height (`max-h-40 overflow-y-auto`)
3. Teks features diperkecil (`text-sm`) untuk memuat lebih banyak item
4. Tombol diposisikan di wrapper terpisah (`<div className="mt-4">`) agar selalu berada di bawah

**Hasil**:
- ✅ Ukuran card konsisten (fixed height 256px / 16rem)
- ✅ Tombol selalu berada di posisi bawah
- ✅ Features yang banyak bisa di-scroll tanpa mengubah layout
- ✅ UI tetap rapi dengan 1-10+ features

---

## Masalah 2: Data Features Tidak Sinkron antara CMS dan Program Pages

### Masalah
- Data features di CMS Core Pillars dan Program Pages (HALTEC & Luar Negeri) tidak tersinkronisasi
- Menghapus features di CMS tidak mempengaruhi tampilan program
- Menambah features di CMS juga tidak terlihat di program pages

### Solusi
**Files yang diubah**:
1. `app/program/haltec/page.tsx`
2. `app/program/luar-negeri/page.tsx`

**Perubahan yang dilakukan**:

#### 1. Convert ke Client Component
```tsx
'use client';
import { useState, useEffect } from "react";
```

#### 2. Tambah Interface & Default Programs
- Program data di-extract ke `defaultPrograms` constant
- Tambah TypeScript interface untuk type safety
- Menggunakan `useState` untuk reactive data

#### 3. Fetch Core Pillars Data dari CMS
Menambahkan `useEffect` hook yang:
- Fetch data dari `/api/cms/rdi?section=rdi-core-pillars`
- Mencari pillar yang sesuai (HALTEC atau GO GLOBAL)
- Extract features dari CMS
- Filter programs based on features yang ada di CMS
- Update state dengan programs yang terfilter

### Cara Kerja Sinkronisasi

#### Untuk HALTEC Page:
```tsx
// Mencari HALTEC pillar dari CMS
const haltecPillar = corePillarsContent.pillars?.find(
    (p: any) => p.title.includes('HALTEC') || p.title.includes('Halal')
);

// Filter programs berdasarkan features di CMS
const updatedPrograms = defaultPrograms.filter(program => {
    return cmsFeatures.some((feature: string) => 
        feature.toLowerCase().includes(program.title.toLowerCase()) ||
        program.title.toLowerCase().includes(feature.toLowerCase())
    );
});
```

#### Untuk Luar Negeri Page:
```tsx
// Mencari GO GLOBAL pillar dari CMS
const globalPillar = corePillarsContent.pillars?.find(
    (p: any) => p.title.includes('GO GLOBAL') || p.title.includes('Luar Negeri')
);

// Filter dengan multiple conditions
const updatedPrograms = defaultPrograms.filter(program => {
    return cmsFeatures.some((feature: string) => {
        const featureLower = feature.toLowerCase();
        const titleLower = program.title.toLowerCase();
        const countryLower = program.country.toLowerCase();
        
        return featureLower.includes(titleLower) || 
               featureLower.includes(countryLower) ||
               titleLower.includes(featureLower) ||
               countryLower.includes(featureLower);
    });
});
```

---

## Contoh Penggunaan

### Scenario 1: Menghapus Feature "JULEHA" dari HALTEC

**Di CMS Core Pillars** (`/editor/core-pillars`):
1. Login sebagai Editor
2. Buka section Core Pillars
3. Di Pillar #2 (HALTEC), hapus feature "Juru Sembelih Halal (JULEHA)"
4. Klik "Simpan"

**Hasil**:
- ✅ Dashboard: Card HALTEC tetap rapi, tombol tetap di bawah
- ✅ Program HALTEC (`/program/haltec`): Program JULEHA **tidak ditampilkan** lagi
- ✅ Hanya program yang ada di CMS features yang ditampilkan

### Scenario 2: Menambah Feature Baru

**Di CMS Core Pillars**:
1. Klik "Add Feature" di HALTEC pillar
2. Tambahkan "Program Supervisor Halal Baru"
3. Klik "Simpan"

**Hasil**:
- ✅ Dashboard: Feature baru muncul di card (dengan scroll jika >4 items)
- ✅ Tombol tetap di posisi bawah
- ⚠️  Note: Program detail harus ditambahkan manual di `defaultPrograms` array untuk tampil di program page

### Scenario 3: Menghapus Semua Features

**Di CMS Core Pillars**:
1. Hapus semua features dari HALTEC pillar (hanya leave 1 minimal)

**Hasil**:
- ✅ Dashboard: Tampil 1 feature dengan card tetap rapi
- ✅ Program page: Menampilkan default programs (fallback)

---

## Mapping Feature Names ke Programs

### HALTEC Programs
CMS Features harus mengandung salah satu keyword ini:

| Program Title | Matching Keywords |
|--------------|-------------------|
| Penyelia Halal | "penyelia", "halal" |
| Juru Sembelih Halal (JULEHA) | "juleha", "sembelih", "juru" |
| Auditor Halal Internal | "auditor", "halal", "internal" |

### GO GLOBAL Programs
CMS Features harus mengandung salah satu keyword ini:

| Program Title | Matching Keywords |
|--------------|-------------------|
| Program Kuliah + Kerja | "taiwan", "kuliah", "kerja" |
| Program Ausbildung | "jerman", "ausbildung" |
| Program Tokutei Ginou | "jepang", "tokutei", "ginou" |

---

## Technical Architecture

```
┌─────────────────────┐
│  CMS Core Pillars   │
│  /editor/core-pillars│
└──────────┬──────────┘
           │ Save to DB
           ▼
┌─────────────────────┐
│ API Route           │
│ /api/cms/rdi        │
│ section: rdi-core-  │
│         pillars     │
└──────────┬──────────┘
           │ Fetch data
           ├──────────────────────┐
           ▼                      ▼
┌─────────────────────┐  ┌──────────────────────┐
│  Dashboard          │  │ Program Pages        │
│  / (Landing)        │  │ /program/haltec      │
│  CorePillarsSection │  │ /program/luar-negeri │
└─────────────────────┘  └──────────────────────┘
   - Fixed height card      - Filtered programs
   - Scrollable features    - Based on CMS features
   - Button always bottom   - Synced with dashboard
```

---

## Best Practices

### Untuk Editor:

1. **Naming Features**: Gunakan nama yang jelas dan mengandung keyword program
   - ✅ Good: "Penyelia Halal", "Juru Sembelih Halal (JULEHA)"
   - ❌ Bad: "Program 1", "Pelatihan A"

2. **Jumlah Features**: Tidak ada batasan, tapi disarankan 3-6 items untuk readability
   - Card akan auto-scroll jika lebih dari 4 items

3. **Konsistensi**: Pastikan features di Core Pillars match dengan program yang tersedia

### Untuk Developer:

1. **Menambah Program Baru**: 
   - Tambahkan ke `defaultPrograms` array di file program page
   - Pastikan `title` atau `id` mengandung keyword yang bisa di-match

2. **Custom Matching Logic**: 
   - Modify fungsi filter di `useEffect` jika perlu matching logic berbeda
   - Perhatikan case-insensitive matching

3. **Error Handling**: 
   - Jika fetch CMS gagal, akan fallback ke `defaultPrograms`
   - Check console untuk error messages

---

## Troubleshooting

### Q: Features dihapus di CMS tapi masih muncul di program page
**A**: Clear browser cache atau hard refresh (Ctrl+Shift+R)

### Q: Program tidak muncul walaupun feature sudah ditambahkan
**A**: Check apakah nama feature mengandung keyword yang match dengan program title/country

### Q: Tombol masih bergerak naik/turun
**A**: Pastikan perubahan di `core-pillars-section.tsx` sudah tersave dan rebuild aplikasi

### Q: Card layout rusak
**A**: Pastikan Tailwind classes (`h-64`, `max-h-40`, `overflow-y-auto`) tidak ter-override

---

## Testing Checklist

- [ ] Login sebagai Editor
- [ ] Buka `/editor/core-pillars`
- [ ] Tambah 1 feature ke HALTEC
- [ ] Verifikasi card di dashboard (`/#program-pillars`) tetap rapi
- [ ] Hapus feature JULEHA dari HALTEC
- [ ] Verifikasi card tetap konsisten (tombol di bawah)
- [ ] Buka `/program/haltec`
- [ ] Verifikasi JULEHA tidak muncul di list programs
- [ ] Tambahkan kembali JULEHA di CMS
- [ ] Refresh `/program/haltec`
- [ ] Verifikasi JULEHA muncul kembali
- [ ] Ulangi test untuk Luar Negeri pillar

---

## Changelog

### Version 1.0 - 2025-12-28
- ✅ Fixed card layout inconsistency in Core Pillars dashboard
- ✅ Implemented data synchronization between CMS and Program Pages
- ✅ Added TypeScript interfaces for type safety
- ✅ Converted program pages to client components with state management
- ✅ Added automatic fallback to default programs on fetch error

---

## Support

Jika ada pertanyaan atau issue:
1. Check console browser untuk error messages
2. Verify API endpoint `/api/cms/rdi?section=rdi-core-pillars` returns data
3. Check database untuk memastikan data tersimpan dengan benar
4. Review code di files yang disebutkan di dokumentasi ini
