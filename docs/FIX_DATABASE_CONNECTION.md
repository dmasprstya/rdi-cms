# SOLUSI DATABASE CONNECTION ERROR

## ❌ Masalah
Aplikasi tidak bisa connect ke database karena DNS hanya return IPv6, tapi Node.js butuh IPv4.

Error: `getaddrinfo EAI_AGAIN db.fpoegzedcwauekpewkgf.supabase.co`

## ✅ SOLUSI - Gunakan Supabase Pooler Connection

### Step 1: Dapatkan Connection Pooler URL

1. **Buka Supabase Dashboard** → https://supabase.com
2. Login → Pilih project Anda
3. Pergi ke **Settings** → **Database**
4. Scroll ke **Connection Pooling**
5. Copy **Connection string** dengan mode **"Transaction"**
6. Pastikan menggunakan port **6543** (bukan 5432)

### Step 2: Update File .env

Ganti `DATABASE_URL` di file `.env` Anda dengan connection pooler URL:

**Format yang benar:**
```
DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**ATAU jika masih menggunakan format lama, pastikan port 6543:**
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.com:6543/postgres?sslmode=require
```

### Step 3: Tambahkan SSL Mode (PENTING!)

Pastikan connection string Anda punya `?sslmode=require` atau `?sslmode=prefer` di akhir.

**Contoh lengkap:**
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.fpoegzedcwauekpewkgf.supabase.co:6543/postgres?sslmode=require
```

### Step 4: Test Connection

```bash
npx tsx test-db.ts
```

Harus muncul SUCCESSFUL!, bukan error lagi.

---

## Alternative: Gunakan Supabase API Proxy (Jika masih error)

Jika tetap error, gunakan **supabase-js** client sebagai proxy:

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Update `db/index.ts`

Ganti isi file menjadi:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Config untuk handle IPv6 issue
const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
  ssl: 'require',
  connection: {
    application_name: 'sistem-sekolah',
  },
  // Force IPv4
  host_preference: '4',
});

export const db = drizzle(client, { schema });
```

### 3. Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Cara Paling Mudah: Ganti DNS Windows ke Google DNS

1. **Open Settings** → Network & Internet → Change adapter options
2. Right-click adapter Anda → Properties
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → Properties
4. Pilih **"Use the following DNS server addresses"**:
   - Preferred: `8.8.8.8`
   - Alternate: `8.8.4.4`
5. Click OK → OK
6. **Restart terminal/PowerShell**
7. Test lagi: `npx tsx test-db.ts`

---

**Pilih salah satu solusi di atas dan test database connection!**
