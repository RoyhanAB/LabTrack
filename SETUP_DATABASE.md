# 🗄️ Setup Database Supabase - Panduan Lengkap

## ⚠️ PENTING: Ikuti langkah ini dengan teliti!

### Langkah 1: Buat Project Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Sign in atau Sign up
3. Klik **"New Project"**
4. Isi:
   - **Name**: `labtrack` (atau nama lain)
   - **Database Password**: Buat password yang kuat (SIMPAN INI!)
   - **Region**: Pilih yang terdekat (Southeast Asia)
5. Klik **"Create new project"**
6. Tunggu ~2 menit sampai project siap

### Langkah 2: Jalankan Database Schema

1. Di dashboard Supabase, klik **"SQL Editor"** di sidebar kiri
2. Klik **"New query"**
3. Buka file `supabase-schema.sql` di project ini
4. **COPY SEMUA ISI FILE** (Ctrl+A, Ctrl+C)
5. **PASTE** ke SQL Editor di Supabase (Ctrl+V)
6. Klik **"Run"** (atau tekan Ctrl+Enter)
7. Tunggu sampai muncul **"Success. No rows returned"**

### Langkah 3: Verifikasi Tables

1. Klik **"Table Editor"** di sidebar
2. Pastikan ada 5 tables:
   - ✅ `users`
   - ✅ `laboratories`
   - ✅ `equipment`
   - ✅ `loans`
   - ✅ `activity_logs`

3. Klik table `laboratories`, pastikan ada 4 rows (LSIPro, RSK&E, OSI&K, SMI)
4. Klik table `equipment`, pastikan ada 6 rows
5. Klik table `users`, pastikan ada 3 rows

### Langkah 4: Copy API Keys

1. Klik **"Settings"** (ikon gear) di sidebar
2. Klik **"API"** di submenu
3. Copy **"Project URL"** - contoh: `https://abcdefgh.supabase.co`
4. Copy **"anon public"** key - panjang sekali, mulai dengan `eyJ...`

### Langkah 5: Setup Environment Variables

1. Buka file `.env.local` di root project
2. Paste values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **SAVE FILE** (Ctrl+S)

### Langkah 6: Test Connection

1. Restart development server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. Buka browser: [http://localhost:3000](http://localhost:3000)

3. Login dengan demo account:
   - Email: `ahmad.fauzan@student.untirta.ac.id`
   - Password: `mahasiswa123`

4. Buka **Browser Console** (F12)
5. Lihat apakah ada error merah

### Langkah 7: Test Peminjaman

#### Sebagai Mahasiswa:

1. Login sebagai mahasiswa
2. Klik **"Inventaris Alat"**
3. Pilih alat (contoh: Stopwatch Digital)
4. Klik **"Mulai Pengajuan"**
5. Isi form:
   - Jumlah: 1
   - Tanggal Kembali: Besok
   - Tujuan: "Test peminjaman"
6. Klik **"Kirim Pengajuan"**
7. **CEK CONSOLE** - harus ada log: `Loan created successfully: loan-xxxxx`
8. Klik **"Status Peminjaman"** - harus muncul pengajuan baru

#### Sebagai Admin:

1. Logout (klik nama di pojok kanan atas → Keluar)
2. Login sebagai admin:
   - Email: `rizky.pratama@untirta.ac.id`
   - Password: `admin123`
3. Klik **"Verifikasi"**
4. **HARUS ADA** pengajuan dari mahasiswa tadi
5. Klik **"✓ Setujui"**
6. **CEK CONSOLE** - harus ada log: `Loan updated successfully: loan-xxxxx`
7. Klik **"Monitoring"** - harus muncul peminjaman yang disetujui

### Langkah 8: Verifikasi Real-time

1. Buka 2 browser windows:
   - Window 1: Login sebagai mahasiswa
   - Window 2: Login sebagai admin

2. Di Window 1 (mahasiswa):
   - Ajukan peminjaman baru

3. Di Window 2 (admin):
   - Klik **"Verifikasi"**
   - **HARUS LANGSUNG MUNCUL** pengajuan baru (tanpa refresh)
   - Jika tidak muncul, cek console untuk error

4. Di Window 2 (admin):
   - Approve pengajuan

5. Di Window 1 (mahasiswa):
   - Klik **"Status Peminjaman"**
   - Status **HARUS BERUBAH** menjadi "Dipinjam" (tanpa refresh)

---

## 🔧 Troubleshooting

### Problem 1: "Missing Supabase credentials"

**Solusi:**
1. Cek file `.env.local` ada di root project
2. Pastikan tidak ada typo di nama variable
3. Restart dev server setelah edit `.env.local`

### Problem 2: Pengajuan tidak muncul di admin

**Kemungkinan Penyebab:**
1. **Database belum disetup** - Jalankan `supabase-schema.sql`
2. **RLS Policy salah** - Pastikan semua policy ada
3. **Realtime tidak aktif** - Cek console untuk error

**Solusi:**
```sql
-- Jalankan di SQL Editor untuk reset policies
DROP POLICY IF EXISTS "Allow public read" ON public.loans;
DROP POLICY IF EXISTS "Allow public insert" ON public.loans;
DROP POLICY IF EXISTS "Allow public update" ON public.loans;

CREATE POLICY "Allow public read" ON public.loans FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.loans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.loans FOR UPDATE USING (true);
```

### Problem 3: "Error fetching from Supabase"

**Solusi:**
1. Cek internet connection
2. Cek Supabase project masih aktif
3. Cek API keys masih valid
4. Lihat error detail di console

### Problem 4: Data tidak sync antar tab

**Solusi:**
1. Cek Realtime enabled di Supabase:
   - Settings → API → Realtime → Enable
2. Restart dev server
3. Clear browser cache

### Problem 5: "Stok tidak berkurang"

**Solusi:**
1. Cek console saat approve - harus ada log update
2. Refresh halaman inventaris
3. Cek di Supabase Table Editor apakah `available_stock` berubah

---

## 📊 Cek Data di Supabase

### Cara Lihat Data:

1. Buka Supabase Dashboard
2. Klik **"Table Editor"**
3. Pilih table yang ingin dilihat
4. Lihat semua rows

### Cara Edit Data Manual:

1. Klik row yang ingin diedit
2. Edit value
3. Klik **"Save"**

### Cara Hapus Data:

1. Klik row
2. Klik **"Delete"**
3. Confirm

---

## 🔍 Debug Mode

Untuk melihat semua query dan error:

1. Buka Browser Console (F12)
2. Filter by "Supabase" atau "Loan" atau "Equipment"
3. Lihat semua log merah (error)
4. Copy error message untuk troubleshooting

### Expected Logs (Normal):

```
✅ Loan created successfully: loan-1234567890
✅ Loan updated successfully: loan-1234567890
✅ Equipment updated successfully: eq-1
✅ Loans change detected: {eventType: "INSERT", ...}
✅ Equipment change detected: {eventType: "UPDATE", ...}
```

### Error Logs (Problem):

```
❌ Error creating loan: {...}
❌ Error updating loan: {...}
❌ Failed to fetch from Supabase: {...}
❌ Missing Supabase credentials
```

---

## 🆘 Masih Bermasalah?

### Checklist Terakhir:

- [ ] Supabase project created
- [ ] Database schema executed (all 5 tables exist)
- [ ] Seed data inserted (check Table Editor)
- [ ] API keys copied correctly
- [ ] `.env.local` file exists and correct
- [ ] Dev server restarted after env changes
- [ ] No errors in browser console
- [ ] Can login with demo accounts
- [ ] Can see equipment list
- [ ] Can create loan (check console log)
- [ ] Loan appears in admin verification
- [ ] Can approve loan
- [ ] Stock updates after approval

### Reset Database (Last Resort):

Jika semua gagal, reset database:

```sql
-- Jalankan di SQL Editor
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS laboratories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Kemudian jalankan ulang supabase-schema.sql
```

---

## 📞 Contact Support

Jika masih bermasalah setelah mengikuti semua langkah:

1. Screenshot error di console
2. Screenshot Supabase Table Editor
3. Copy isi `.env.local` (HIDE the keys!)
4. Kirim ke support

---

<div align="center">
  <p><strong>Good luck! 🚀</strong></p>
  <p>Database setup adalah langkah paling penting!</p>
</div>
