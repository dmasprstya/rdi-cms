# Integrasi CMS dengan RDI Landing Page

## 📋 Overview

Sistem CMS telah berhasil diintegrasikan dengan RDI Landing Page. Semua konten landing page kini dapat dikelola melalui CMS Editor tanpa perlu mengubah kode.

## 🎯 Fitur yang Terintegrasi

### ✅ Hero Section
- **Path**: `/editor/rdi/hero`
- **API Endpoint**: `/api/cms/rdi?section=rdi-hero`
- **Konten yang Dapat Diedit**:
  - Judul utama
  - Sub-judul
  - Text tombol CTA
  - URL video background

### ✅ Founders Section
- **Path**: `/editor/rdi/founders`
- **API Endpoint**: `/api/cms/rdi?section=rdi-founders`
- **Konten yang Dapat Diedit**:
  - Judul section
  - Sub-judul
  - Daftar pendiri (dinamis):
    - Nama
    - Jabatan
    - Label visi
    - Quote
    - URL foto

### 🔄 Section Lainnya (Coming Soon)
- Navbar (logo, menu items)
- Trust Partners (logo partner)
- Core Pillars (program pillars)
- Why RDI (keunggulan)
- Latest News (berita)
- CTA Section (call to action)
- Footer (kontak, sosial media)

## 📁 Struktur File

```
app/
├── api/
│   └── cms/
│       ├── route.ts           # API untuk CMS lama
│       └── rdi/
│           └── route.ts       # API untuk RDI CMS
├── editor/
│   ├── page.tsx              # Dashboard editor utama
│   └── rdi/
│       ├── page.tsx          # Dashboard RDI editor
│       ├── hero/
│       │   └── page.tsx      # Editor hero section
│       └── founders/
│           └── page.tsx      # Editor founders section
components/
└── rdi/
    ├── hero-section.tsx      # Komponen hero (terintegrasi CMS)
    ├── founders-section.tsx  # Komponen founders (terintegrasi CMS)
    └── ... (section lainnya)
```

## 🔌 Cara Kerja Integrasi

### 1. Database Schema
Menggunakan tabel `landing_page_content` yang sudah ada:
```typescript
{
  id: string,
  section: string,           // 'rdi-hero', 'rdi-founders', dll
  content: jsonb,            // Konten dalam format JSON
  isPublished: boolean,
  lastEditedBy: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 2. API Endpoints

**GET** `/api/cms/rdi?section=rdi-hero`
- Mengambil konten untuk section tertentu
- Response: `{ success: true, data: { content: {...} } }`

**GET** `/api/cms/rdi`
- Mengambil semua konten RDI
- Response: `{ success: true, data: [...] }`

**POST** `/api/cms/rdi`
- Menyimpan/update konten section
- Body: `{ section: string, content: object, isPublished: boolean }`
- Hanya role `editor` yang dapat mengakses

### 3. Komponen React

Setiap section komponen RDI:
1. **State Management**: Menggunakan `useState` untuk menyimpan konten
2. **Default Content**: Memiliki konten default jika API gagal
3. **Fetch on Mount**: Mengambil konten dari API saat komponen dimount
4. **Graceful Fallback**: Tetap render dengan konten default jika API error

```tsx
const [content, setContent] = useState(defaultContent);

useEffect(() => {
  const fetchContent = async () => {
    const response = await fetch('/api/cms/rdi?section=rdi-hero');
    const data = await response.json();
    if (data.success && data.data) {
      setContent(data.data.content);
    }
  };
  fetchContent();
}, []);
```

## 🚀 Cara Menggunakan

### Untuk Editor Content

1. **Login** sebagai user dengan role `editor`
2. Buka **Dashboard Editor** di `/editor`
3. Klik **"Buka RDI Editor"** pada card khusus RDI
4. Pilih section yang ingin diedit
5. Edit konten sesuai kebutuhan
6. Klik **"Simpan"**
7. Preview perubahan dengan klik **"Preview"**

### Untuk Developer

**Menambahkan Section Baru:**

1. Tambahkan section ID ke `RDI_SECTIONS` di `app/api/cms/rdi/route.ts`
2. Buat file editor di `app/editor/rdi/[section-name]/page.tsx`
3. Update komponen section untuk fetch dari API
4. Tambahkan card di `app/editor/rdi/page.tsx`

**Format Konten JSON:**

Setiap section memiliki struktur JSON yang berbeda sesuai kebutuhan:

```typescript
// Hero Section
{
  title: string;
  subtitle: string;
  buttonText: string;
  videoUrl: string;
}

// Founders Section
{
  title: string;
  subtitle: string;
  founders: Array<{
    name: string;
    role: string;
    vision: string;
    quote: string;
    image: string;
  }>;
}
```

## 🔒 Keamanan

- Hanya user dengan role `editor` yang dapat mengubah konten
- Validasi section name untuk mencegah injection
- Error handling yang proper untuk semua operasi

## 📊 Status Implementasi

| Section | CMS Editor | API | Komponen | Status |
|---------|-----------|-----|----------|--------|
| Hero | ✅ | ✅ | ✅ | Done |
| Navbar | 📝 | ✅ | ⏳ | Planned |
| Trust Partners | 📝 | ✅ | ⏳ | Planned |
| Core Pillars | 📝 | ✅ | ⏳ | Planned |
| Why RDI | 📝 | ✅ | ⏳ | Planned |
| Founders | ✅ | ✅ | ✅ | Done |
| Latest News | 📝 | ✅ | ⏳ | Planned |
| CTA | 📝 | ✅ | ⏳ | Planned |
| Footer | 📝 | ✅ | ⏳ | Planned |

**Legend:**
- ✅ Done
- ⏳ Planned
- 📝 Not Started

## 🎨 Best Practices

1. **Selalu sediakan konten default** di komponen untuk fallback
2. **Gunakan try-catch** untuk semua API calls
3. **Loading states** untuk UX yang lebih baik
4. **Validasi data** sebelum menyimpan
5. **Preview sebelum publish** untuk memastikan tampilan

## 🐛 Troubleshooting

**Konten tidak muncul:**
- Cek apakah section sudah disimpan di database
- Pastikan `isPublished` bernilai `true`
- Lihat console untuk error API

**Error saat menyimpan:**
- Pastikan user memiliki role `editor`
- Cek validitas format JSON
- Periksa koneksi database

**Komponen tidak update:**
- Hard refresh browser (Ctrl+Shift+R)
- Clear cache
- Restart dev server

## 📝 Next Steps

1. Implementasi editor untuk section yang tersisa
2. Tambah fitur upload image untuk founders
3. Implementasi preview mode sebelum publish
4. Tambah version history untuk rollback
5. Buat UI untuk manage media assets

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository atau hubungi tim development.

---

**Last Updated**: 2025-12-27
**Version**: 1.0.0
