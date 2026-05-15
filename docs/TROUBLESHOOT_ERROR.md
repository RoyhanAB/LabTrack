# 🔧 Troubleshooting Error "Gagal Mengirim Pengajuan"

## Error yang Anda Alami:

```
❌ Gagal mengirim pengajuan. Silakan coba lagi.
❌ Gagal membuat peminjaman
```

## Kemungkinan Penyebab & Solusi:

### 1. ⚠️ Database Schema Belum Lengkap

**Penyebab**: Kolom `letter_url`, `approved_by`, `approved_at` belum ada di table `loans`

**Solusi**:
```sql
-- Jalankan di Supabase SQL Editor:
ALTER TABLE public.loans 
ADD COLUMN IF NOT EXISTS approved_by TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS letter_url TEXT;
```

**Atau gunakan file `update-schema.sql`:**
1. Buka Supabase Dashboard
2. Klik "SQL Editor"
3. Copy isi file `update-schema.sql`
4. Paste dan Run

### 2. 🔌 Supabase Connection Error

**Cek di Browser Console (F12)**:

Jika muncul:
```
❌ Supabase connection error: ...
```

**Solusi**:
1. Cek `.env.local` sudah benar
2. Cek Supabase project masih aktif
3. Restart dev server:
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```

### 3. 🔒 RLS Policy Terlalu Ketat

**Penyebab**: Row Level Security menghalangi INSERT

**Solusi**:
```sql
-- Jalankan di Supabase SQL Editor:
DROP POLICY IF EXISTS "Allow public insert" ON public.loans;

CREATE POLICY "Allow public insert" ON public.loans 
FOR INSERT WITH CHECK (true);
```

### 4. 📊 Table Tidak Ada

**Cek di Supabase**:
1. Buka "Table Editor"
2. Pastikan table `loans` ada
3. Jika tidak ada, jalankan `supabase-schema.sql`

### 5. 🌐 Network Error

**Cek**:
- Internet connection
- Firewall tidak block Supabase
- VPN tidak interfere

---

## 🔍 Debug Step-by-Step

### Step 1: Cek Console Log

1. Buka Browser (F12)
2. Tab "Console"
3. Clear console (icon 🚫)
4. Coba ajukan peminjaman lagi
5. Lihat log yang muncul

**Expected (Success)**:
```
✅ Supabase connected successfully
📝 Creating loan: loan-1234567890
📤 Sending to Supabase: {...}
✅ Loan created in database: [...]
✅ Loan created successfully: loan-1234567890
```

**Error (Problem)**:
```
❌ Supabase connection error: ...
❌ Supabase error: column "letter_url" does not exist
❌ Failed to create loan: ...
```

### Step 2: Cek Supabase Table

1. Buka Supabase Dashboard
2. Klik "Table Editor"
3. Pilih table `loans`
4. Klik "..." → "Edit table"
5. Pastikan ada kolom:
   - `id` (text)
   - `user_id` (uuid)
   - `user_name` (text)
   - `user_nim` (text)
   - `user_kelas` (text)
   - `equipment_id` (text)
   - `equipment_name` (text)
   - `lab_id` (text)
   - `lab_name` (text)
   - `quantity` (int4)
   - `borrow_date` (timestamptz)
   - `return_date` (timestamptz)
   - `actual_return_date` (timestamptz)
   - `status` (text)
   - `notes` (text)
   - `return_condition` (text)
   - `return_notes` (text)
   - **`approved_by` (text)** ← HARUS ADA
   - **`approved_at` (timestamptz)** ← HARUS ADA
   - **`letter_url` (text)** ← HARUS ADA
   - `created_at` (timestamptz)

### Step 3: Test Manual Insert

Jalankan di SQL Editor:
```sql
INSERT INTO public.loans (
  id, user_id, user_name, user_nim, user_kelas,
  equipment_id, equipment_name, lab_id, lab_name,
  quantity, borrow_date, return_date, status, notes,
  letter_url, created_at
) VALUES (
  'test-loan-123',
  '00000000-0000-0000-0000-000000000001',
  'Test User',
  '3333210001',
  'TI-6A',
  'eq-1',
  'Test Equipment',
  'lab-1',
  'Test Lab',
  1,
  now(),
  now() + interval '7 days',
  'menunggu',
  'Test notes',
  null,
  now()
);
```

**Jika berhasil**: Schema OK, masalah di code
**Jika error**: Schema belum lengkap, jalankan update-schema.sql

### Step 4: Cek RLS Policies

Jalankan di SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'loans';
```

**Expected**: Harus ada policy untuk INSERT

Jika tidak ada:
```sql
CREATE POLICY "Allow public insert" ON public.loans 
FOR INSERT WITH CHECK (true);
```

---

## 🚀 Quick Fix (Paling Sering Berhasil)

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Jalankan update schema di Supabase SQL Editor
# Copy isi file update-schema.sql dan run

# 3. Clear browser cache
# Ctrl+Shift+Delete → Clear cache

# 4. Restart dev server
npm run dev

# 5. Hard refresh browser
# Ctrl+Shift+R

# 6. Test lagi
```

---

## 📝 Checklist Sebelum Test Lagi

- [ ] File `update-schema.sql` sudah dijalankan di Supabase
- [ ] Table `loans` memiliki semua kolom yang diperlukan
- [ ] RLS policy untuk INSERT sudah ada
- [ ] Dev server sudah direstart
- [ ] Browser cache sudah diclear
- [ ] Console tidak ada error merah saat load page
- [ ] Muncul log "✅ Supabase connected successfully"

---

## 🆘 Masih Error?

### Coba Reset Database

**WARNING**: Ini akan menghapus semua data!

```sql
-- 1. Drop semua table
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS laboratories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Jalankan ulang supabase-schema.sql
-- Copy semua isi file dan run
```

### Atau Buat Project Baru

1. Buat project Supabase baru
2. Jalankan `supabase-schema.sql` (yang sudah update)
3. Copy API keys baru ke `.env.local`
4. Restart dev server

---

## 📞 Kirim Error Log

Jika masih bermasalah, screenshot:
1. Browser console (F12) - semua error merah
2. Supabase Table Editor - struktur table `loans`
3. Supabase SQL Editor - hasil query:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'loans';
   ```

---

<div align="center">
  <p><strong>Good luck! 🍀</strong></p>
  <p>90% masalah solved dengan update-schema.sql</p>
</div>
