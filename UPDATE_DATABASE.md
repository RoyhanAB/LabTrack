# 🚀 CARA UPDATE DATABASE LABTRACK v2.0

## ⚡ LANGKAH CEPAT (5 Menit)

### 1️⃣ Buka Supabase Dashboard

1. Buka browser, pergi ke: **https://supabase.com/dashboard**
2. Login dengan akun Anda
3. Pilih project: **kvycvnbkxcznkobaxbqp** (LabTrack)

### 2️⃣ Buka SQL Editor

1. Di sidebar kiri, klik **"SQL Editor"** (icon database)
2. Klik tombol **"New query"** (tombol + di kanan atas)

### 3️⃣ Copy & Paste SQL

1. Buka file: `database/update-schema-v2.sql` (sudah terbuka di editor Anda)
2. **Select All** (Ctrl + A)
3. **Copy** (Ctrl + C)
4. Kembali ke Supabase SQL Editor
5. **Paste** (Ctrl + V) di editor

### 4️⃣ Run Query

1. Klik tombol **"Run"** (atau tekan Ctrl + Enter)
2. Tunggu 2-3 detik
3. Lihat hasil di bawah:
   - ✅ Jika sukses: "Success. No rows returned"
   - ❌ Jika error: Baca pesan error

### 5️⃣ Verifikasi

Jalankan query ini untuk cek super admin sudah dibuat:

```sql
SELECT id, email, name, role FROM users WHERE role = 'super_admin';
```

**Expected Result:**
```
id: 00000000-0000-0000-0000-000000000099
email: superadmin@untirta.ac.id
name: Super Administrator
role: super_admin
```

---

## 🔑 LOGIN SETELAH UPDATE

### Super Admin (BARU!)
```
Email: superadmin@untirta.ac.id
Password: superadmin123
```

### Mahasiswa
```
Email: ahmad.fauzan@student.untirta.ac.id
Password: password123
```

### Admin
```
Email: rizky.pratama@untirta.ac.id
Password: password123
```

---

## 🎯 TEST FITUR BARU

### 1. Test Login Super Admin
1. Buka: http://localhost:3000/login
2. Pilih tab "Admin/Asisten"
3. Email: `superadmin@untirta.ac.id`
4. Password: `superadmin123`
5. Klik "Masuk"
6. ✅ Harusnya redirect ke `/super-admin`

### 2. Test Registrasi Mahasiswa
1. Buka: http://localhost:3000/register
2. Isi form:
   - Nama: `Test Mahasiswa`
   - Email: `test.mahasiswa@student.untirta.ac.id`
   - NIM: `3333230099` (format Teknik Industri)
   - Kelas: `TI-A 2023` (opsional)
   - Password: `password123`
   - Konfirmasi Password: `password123`
3. Klik "Daftar"
4. ✅ Harusnya redirect ke `/login` dengan pesan sukses

### 3. Test Super Admin Dashboard
1. Login sebagai super admin
2. Di dashboard, Anda bisa:
   - ✅ Lihat statistik user
   - ✅ Search user by nama/email/NIM
   - ✅ Filter by role
   - ✅ Tambah user baru (klik "Tambah User")
   - ✅ Edit user (klik icon pensil)
   - ✅ Hapus user (klik icon trash)

---

## ❌ TROUBLESHOOTING

### Error: "Email atau password salah"

**Penyebab:** Database belum diupdate

**Solusi:**
1. Pastikan sudah run SQL update di Supabase
2. Cek apakah super admin sudah ada:
   ```sql
   SELECT * FROM users WHERE email = 'superadmin@untirta.ac.id';
   ```
3. Jika belum ada, run lagi SQL update

### Error: "column password_hash does not exist"

**Penyebab:** Kolom password_hash belum ditambahkan

**Solusi:**
1. Run SQL ini di Supabase:
   ```sql
   ALTER TABLE public.users 
     ADD COLUMN IF NOT EXISTS password_hash TEXT,
     ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
     ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
   ```

### Error: "constraint users_role_check"

**Penyebab:** Role super_admin belum ditambahkan ke constraint

**Solusi:**
1. Run SQL ini:
   ```sql
   ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
   ALTER TABLE public.users ADD CONSTRAINT users_role_check 
     CHECK (role IN ('mahasiswa', 'admin', 'asisten', 'super_admin'));
   ```

### Error saat registrasi: "NIM tidak valid"

**Penyebab:** NIM tidak sesuai format Teknik Industri

**Solusi:**
- Gunakan format: `3333YYXXXX`
- Contoh valid: `3333230001`, `3333240025`, `3333220100`
- Contoh invalid: `1234567890`, `3332230001`, `333323001`

### Error: "Email harus @student.untirta.ac.id"

**Penyebab:** Email tidak sesuai domain

**Solusi:**
- Untuk mahasiswa: gunakan `@student.untirta.ac.id`
- Untuk admin: gunakan `@untirta.ac.id`

---

## 📊 CEK STATUS DATABASE

### Cek Semua User
```sql
SELECT id, email, name, role, nim, kelas 
FROM users 
ORDER BY created_at DESC;
```

### Cek Password Hash
```sql
SELECT email, 
       CASE 
         WHEN password_hash IS NULL THEN '❌ No Password'
         ELSE '✅ Has Password'
       END as password_status
FROM users;
```

### Cek Super Admin
```sql
SELECT * FROM users WHERE role = 'super_admin';
```

### Cek Mahasiswa Teknik Industri
```sql
SELECT email, nim, name 
FROM users 
WHERE role = 'mahasiswa' 
  AND nim LIKE '3333%';
```

---

## 🔄 RESET DATABASE (Jika Perlu)

Jika ada masalah dan ingin reset:

```sql
-- Hapus semua user kecuali demo
DELETE FROM users 
WHERE id NOT IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000099'
);

-- Update password semua user
UPDATE users 
SET password_hash = '$2a$10$rQZ9vXqK5xJ8YqN5xJ8YqOZJ8YqN5xJ8YqN5xJ8YqN5xJ8YqN5xJ8Y'
WHERE password_hash IS NULL;
```

---

## 📞 BUTUH BANTUAN?

Jika masih ada masalah:

1. **Cek Console Browser**
   - Buka Developer Tools (F12)
   - Lihat tab "Console" untuk error messages

2. **Cek Network Tab**
   - Buka Developer Tools (F12)
   - Tab "Network"
   - Coba login lagi
   - Lihat request yang gagal

3. **Cek Supabase Logs**
   - Di Supabase Dashboard
   - Sidebar kiri: "Logs"
   - Pilih "Postgres Logs"
   - Lihat error messages

---

## ✅ CHECKLIST

Setelah update database, pastikan:

- [ ] Super admin bisa login
- [ ] Mahasiswa bisa registrasi
- [ ] Mahasiswa bisa login dengan password
- [ ] Admin bisa login dengan password
- [ ] Super admin bisa lihat semua user
- [ ] Super admin bisa tambah user
- [ ] Super admin bisa edit user
- [ ] Super admin bisa hapus user
- [ ] Validasi NIM bekerja (hanya 3333YYXXXX)
- [ ] Validasi email bekerja (@student.untirta.ac.id)

---

<div align="center">
  <h2>🎉 Selamat Menggunakan LabTrack v2.0!</h2>
  <p>Jika semua checklist ✅, sistem siap digunakan!</p>
</div>
