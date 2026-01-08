# Setup Dropdown Menu - Panduan Cepat

## Masalah yang Anda Hadapi
Anda tidak bisa menambahkan menu dropdown karena tabel database belum dibuat.

## Solusi (3 Langkah Mudah)

### 1️⃣ Login sebagai Editor
Pastikan Anda sudah login dengan role **editor** atau **admin**.

### 2️⃣ Akses Halaman Setup
Buka halaman setup database:
```
http://localhost:3000/editor/setup
```

Atau klik link **"Jalankan Setup Database"** pada banner kuning di halaman dropdown menu.

### 3️⃣ Klik "Setup Database"
- Klik tombol **"Setup Database"**
- Tunggu sampai selesai (akan muncul ✅ Setup Berhasil!)
- Klik **"Kelola Dropdown Menu"** untuk mulai menambahkan menu

## Setelah Setup Berhasil

Anda bisa:
1. Menambah menu baru (Tambah Menu)
2. Edit menu existing
3. Hapus menu
4. Publish/Draft menu
5. Atur urutan menu

## Menu Default yang Sudah Ditambahkan

Setelah setup, sistem otomatis menambahkan 4 menu:
- 🇩🇪 **Jerman** - Program kemitraan Jerman
- 🇹🇼 **Taiwan** - Program kemitraan Taiwan  
- 🇯🇵 **Jepang** - Program kemitraan Jepang
- 🏭 **Haltec** - Program kemitraan Haltec

Anda bisa langsung edit atau tambahkan menu baru sesuai kebutuhan!

## Screenshot Flow

```
1. Login → /editor
2. Setup → /editor/setup → Klik "Setup Database"
3. Success → /editor/dropdown-menu
4. Tambah Menu Baru!
```

## Troubleshooting

❌ **Error "Unauthorized"**
→ Pastikan Anda login sebagai editor atau admin

❌ **Error "Table already exists"**
→ Setup sudah dilakukan, langsung ke /editor/dropdown-menu

❌ **Error database connection**
→ Cek DATABASE_URL di file .env

## Butuh Bantuan?

Jika masih ada masalah, cek:
- Console browser (F12 → Console)
- Network tab untuk error API
- Terminal server untuk error log

---

**Catatan:** Setup hanya perlu dilakukan SEKALI saat pertama kali menggunakan fitur ini.
