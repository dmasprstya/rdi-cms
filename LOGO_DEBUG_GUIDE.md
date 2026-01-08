# Logo Editor - Debugging Guide

## ✅ Perbaikan Yang Sudah Dilakukan:

### 1. **API CMS Diperbaiki**
- Response format sekarang konsisten dengan `success` flag
- Error handling lebih detail
- Logging yang lebih baik

### 2. **Halaman Logo Editor Baru**
- Error handling yang robust
- Console logging untuk debugging
- Validasi file yang ketat
- Success/error notifications yang jelas

### 3. **Simplified Implementation**
- Tidak ada dynamic logo di navbar (untuk menghindari kompleksitas)
- Focus pada logo editor yang bekerja dengan baik
- Base64 encoding untuk image storage

## 🔍 Cara Testing & Debugging:

### Step 1: Buka Browser Console
**Penting!** Buka Developer Tools (F12) → Console sebelum testing

### Step 2: Login sebagai Editor
```
1. Login dengan role editor
2. Akses /editor/logo
```

### Step 3: Coba Upload Logo
```
1. Pilih "Custom Image"
2. Upload file PNG/JPG (max 2MB)
3. Klik "Simpan Logo"
4. Lihat Console untuk debugging logs
```

## 📋 Console Logs Yang Akan Muncul:

### Saat Fetch Data:
```javascript
Fetch response: {success: true, data: {...}}
```

### Saat Save:
```javascript
Saving logo data: {logoText: "STS", logoSubText: "System", ...}
Save response: {success: true, data: {...}, message: "..."}
```

## ❌ Troubleshooting:

### Problem: "Failed to fetch content"
**Kemungkinan:**
- Tabel `landing_page_content` belum ada
- Database connection error

**Solusi:**
1. Check terminal server untuk error
2. Verify database connection
3. Check console untuk detail error

### Problem: "Unauthorized"
**Kemungkinan:**
- Belum login
- Login bukan sebagai editor

**Solusi:**
- Pastikan login dengan role `editor` atau `admin`

### Problem: "Gagal menyimpan logo"
**Kemungkinan:**
- Network error
- Database error
- File terlalu besar

**Solusi:**
1. Check console untuk detail error
2. Check terminal server
3. Verify file size < 2MB

### Problem: Logo tidak muncul setelah save
**Note:** Logo saat ini HANYA di-save ke database, tidak otomatis muncul di navbar (implementasi sederhana).

**Untuk implementasi navbar:**
- Perlu update navbar component untuk fetch dari database
- Atau gunakan logo default di navbar

## 🗄️ Database Check:

### Query untuk cek apakah data tersimpan:
```sql
SELECT * FROM landing_page_content WHERE section = 'logo';
```

### Expected Data Format:
```json
{
  "section": "logo",
  "content": {
    "logoText": "STS",
    "logoSubText": "System",  
    "useIcon": true,
    "customImageUrl": "data:image/png;base64,..."
  },
  "isPublished": true
}
```

## 🔧 API Endpoints:

### GET Logo Data:
```
GET /api/cms?section=logo

Response:
{
  "success": true,
  "data": {
    "id": "...",
    "section": "logo",
    "content": {...},
    "isPublished": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Save Logo Data:
```
POST /api/cms
Body: {
  "section": "logo",
  "content": {
    "logoText": "ABC",
    "logoSubText": "School",
    "useIcon": true,
    "customImageUrl": ""
  },
  "isPublished": true
}

Response:
{
  "success": true,
  "data": {...},
  "message": "Content updated successfully"
}
```

## 📸 What To Check:

1. **Browser Console** - Cek error messages  
2. **Network Tab** - Cek API requests/responses  
3. **Terminal Server** - Cek server-side errors  
4. **Database** - Cek apakah data tersimpan  

## 🚀 Expected Flow:

```
1. User buka /editor/logo
   → fetchLogoData() dipanggil
   → Console: "Fetch response: ..."
   → Form terisi dengan data existing atau default

2. User edit/upload logo
   → Data tersimpan di state
   → Preview ter-update

3. User klik "Simpan Logo"
   → handleSave() dipanggil
   → Console: "Saving logo data: ..."
   → POST ke /api/cms
   → Console: "Save response: ..."
   → Success message muncul
   → Page reload setelah 1.5 detik
```

## 📝 Next Steps (Optional):

Jika logo editor sudah berfungsi dengan baik, bisa ditambahkan:
1. Update navbar untuk fetch logo dari database
2. Cache logo data untuk performa
3. Preview changes tanpa save

---

**Catatan Penting:**
- Selalu check console logs untuk debugging
- Jika ada error, screenshot console + terminal dan share
- Test dengan file PNG kecil dulu (< 500KB)

Created: December 2025
