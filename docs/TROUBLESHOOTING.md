# Fix untuk Error Network Supabase

## Masalah Ditemukan ✅

DNS server Anda hanya mengembalikan **IPv6 address** untuk Supabase, tapi Node.js tidak bisa connect dengan IPv6.

## Solusi 1: Ganti DNS Server (RECOMMENDED) ⭐

### Windows:

1. **Buka Control Panel** → Network and Internet → Network and Sharing Center
2. Klik adapter network Anda (WiFi/Ethernet)
3. Klik **Properties**
4. Pilih **Internet Protocol Version 4 (TCP/IPv4)** → Properties
5. Pilih **"Use the following DNS server addresses"**
6. Isi:
   - **Preferred DNS**: `8.8.8.8` (Google DNS)
   - **Alternate DNS**: `8.8.4.4` (Google DNS backup)
7. Klik OK → OK
8. Restart terminal/PowerShell

### Atau Gunakan Command (Run as Administrator):

```powershell
# Set DNS ke Google DNS
netsh interface ipv4 set dns name="Wi-Fi" static 8.8.8.8
netsh interface ipv4 add dns name="Wi-Fi" 8.8.4.4 index=2

# Ganti "Wi-Fi" dengan nama adapter Anda jika berbeda (bisa "Ethernet", dll)
```

Setelah itu, test lagi:
```bash
nslookup db.fpoegzedcwauekpewkgf.supabase.co
```

Harus ada **IPv4 address** sekarang!

---

## Solusi 2: Force IPv4 di Node.js

Jika tidak bisa ganti DNS, tambahkan ini di file `.env`:

```env
NODE_OPTIONS="--dns-result-order=ipv4first"
```

Lalu jalankan:
```bash
npm run db:push
```

---

## Solusi 3: Gunakan IP Address Langsung

Dapatkan IPv4 address dari Supabase dashboard:
1. Pergi ke Supabase → Settings → Database
2. Cari **"Direct Connection"** atau **IPv4 address**
3. Ganti hostname di connection string dengan IP address

---

## Test Setelah Fix

```bash
# Test DNS
nslookup db.fpoegzedcwauekpewkgf.supabase.co

# Harus muncul IPv4 (contoh: 54.123.45.67)

# Jalankan push
npm run db:push
```

---

Coba **Solusi 1** dulu (ganti DNS), itu yang paling reliable! 👍
