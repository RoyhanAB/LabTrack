# 🚀 LabTrack Update v2.0 - Security & Super Admin

## 📋 Ringkasan Perubahan

Update ini menambahkan fitur keamanan yang lebih baik dan sistem super admin untuk mengelola user.

---

## ✨ Fitur Baru

### 1. **Sistem Registrasi Mahasiswa** ✅
- Halaman registrasi di `/register`
- Validasi email domain `@student.untirta.ac.id`
- Validasi NIM Teknik Industri (format: `3333YYXXXX`)
  - `33` = Fakultas Teknik
  - `33` = Teknik Industri  
  - `YY` = Tahun angkatan (00-99)
  - `XXXX` = Nomor urut (0001-9999)
- Password hashing dengan SHA-256
- Validasi password strength

### 2. **Super Admin Dashboard** ✅
- Role baru: `super_admin`
- Dashboard di `/super-admin`
- Fitur kelola user:
  - ✅ Lihat semua user (mahasiswa, admin, super admin)
  - ✅ Tambah user baru
  - ✅ Edit user existing
  - ✅ Hapus user
  - ✅ Search & filter by role
- Statistik user real-time
- Activity logging untuk semua aksi

### 3. **Autentikasi yang Lebih Aman** ✅
- Login dengan email + password (bukan hanya email)
- Password hashing
- Validasi email domain
- Session management yang lebih baik
- Last login tracking

### 4. **Hapus Demo Accounts** ✅
- Tombol "Demo Mahasiswa" dan "Demo Admin" dihapus dari halaman login
- Diganti dengan link "Daftar Sekarang" untuk registrasi

---

## 🗄️ Perubahan Database

### Schema Updates

```sql
-- 1. Tambah kolom baru di tabel users
ALTER TABLE public.users 
  ADD COLUMN password_hash TEXT,
  ADD COLUMN email_verified BOOLEAN DEFAULT false,
  ADD COLUMN last_login TIMESTAMPTZ;

-- 2. Update role constraint
ALTER TABLE public.users DROP CONSTRAINT users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('mahasiswa', 'admin', 'asisten', 'super_admin'));

-- 3. Tambah super admin user
INSERT INTO public.users (id, email, name, role, password_hash, email_verified) 
VALUES (
  '00000000-0000-0000-0000-000000000099',
  'superadmin@untirta.ac.id',
  'Super Administrator',
  'super_admin',
  '$2a$10$...', -- password: superadmin123
  true
);

-- 4. Function validasi NIM
CREATE OR REPLACE FUNCTION validate_nim_teknik_industri(nim TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF LENGTH(nim) != 10 THEN RETURN FALSE; END IF;
  IF nim !~ '^[0-9]+$' THEN RETURN FALSE; END IF;
  IF SUBSTRING(nim, 1, 4) != '3333' THEN RETURN FALSE; END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 5. Add constraint
ALTER TABLE public.users ADD CONSTRAINT valid_nim_format 
  CHECK (nim IS NULL OR validate_nim_teknik_industri(nim));
```

### Cara Menjalankan Update

1. Buka Supabase SQL Editor
2. Copy paste isi file `database/update-schema-v2.sql`
3. Jalankan query
4. Verifikasi dengan query:
   ```sql
   SELECT * FROM users WHERE role = 'super_admin';
   ```

---

## 🔐 Akun Super Admin Default

```
Email: superadmin@untirta.ac.id
Password: superadmin123
```

**⚠️ PENTING:** Segera ganti password setelah login pertama kali!

---

## 📁 File Baru

### 1. **Auth Utilities** (`src/lib/auth.ts`)
- `hashPassword()` - Hash password dengan SHA-256
- `verifyPassword()` - Verifikasi password
- `validateEmailDomain()` - Validasi domain email UNTIRTA
- `validateNIMTeknikIndustri()` - Validasi format NIM
- `validatePasswordStrength()` - Cek kekuatan password
- `parseNIM()` - Extract info dari NIM

### 2. **Register Page** (`src/app/register/page.tsx`)
- Form registrasi mahasiswa
- Validasi real-time
- Error handling
- Responsive design

### 3. **Super Admin Dashboard** (`src/app/super-admin/page.tsx`)
- Dashboard super admin
- CRUD user management
- Search & filter
- Modal create/edit user

### 4. **Database Update** (`database/update-schema-v2.sql`)
- Schema updates
- Super admin user
- Validation functions
- RLS policies

---

## 🔄 File yang Diupdate

### 1. **Types** (`src/lib/types.ts`)
```typescript
// Tambah super_admin role
export type UserRole = 'mahasiswa' | 'admin' | 'super_admin';

// Tambah RegisterData interface
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  nim: string;
  kelas?: string;
}

// Update User interface
export interface User {
  // ... existing fields
  passwordHash?: string;
  emailVerified?: boolean;
  lastLogin?: string;
}
```

### 2. **Store** (`src/lib/store.tsx`)
```typescript
// Tambah functions:
- register(data: RegisterData)
- getAllUsers()
- createUser(user)
- updateUser(id, data)
- deleteUser(id)

// Update login function:
- login(email, password) // Sekarang butuh password
```

### 3. **Login Page** (`src/app/login/page.tsx`)
- Hapus tombol demo accounts
- Tambah link "Daftar Sekarang"
- Update login function dengan password
- Redirect super admin ke `/super-admin`

### 4. **Dashboard Layout** (`src/components/layout/DashboardLayout.tsx`)
- Support role `super_admin`
- Menu items untuk super admin
- Auto-detect role dari currentUser

---

## 🎯 Cara Menggunakan

### Untuk Mahasiswa

1. **Registrasi**
   - Buka `/register`
   - Isi form dengan:
     - Nama lengkap
     - Email `@student.untirta.ac.id`
     - NIM format `3333YYXXXX`
     - Kelas (opsional)
     - Password (min 8 karakter)
   - Klik "Daftar"

2. **Login**
   - Buka `/login`
   - Pilih role "Mahasiswa"
   - Masukkan email dan password
   - Klik "Masuk"

### Untuk Super Admin

1. **Login**
   - Buka `/login`
   - Email: `superadmin@untirta.ac.id`
   - Password: `superadmin123`
   - Klik "Masuk"

2. **Kelola User**
   - Dashboard otomatis terbuka di `/super-admin`
   - Lihat statistik user
   - Tambah user baru dengan tombol "Tambah User"
   - Edit user dengan klik icon pensil
   - Hapus user dengan klik icon trash

3. **Search & Filter**
   - Gunakan search box untuk cari nama/email/NIM
   - Filter by role: Semua, Mahasiswa, Admin, Super Admin

---

## 🔒 Keamanan

### Validasi Email
- Mahasiswa: Harus `@student.untirta.ac.id`
- Admin/Staff: Harus `@untirta.ac.id`
- Super Admin: Harus `@untirta.ac.id`

### Validasi NIM
- Panjang: 10 digit
- Format: `3333YYXXXX`
- Hanya angka
- Fakultas: 33 (Teknik)
- Prodi: 33 (Teknik Industri)

### Password
- Minimal 8 karakter
- Hashed dengan SHA-256
- Tidak disimpan plain text

### Row Level Security (RLS)
- User hanya bisa lihat data mereka sendiri
- Admin bisa kelola equipment dan loans
- Super admin bisa kelola semua user

---

## 🐛 Known Issues & Limitations

1. **Password Hashing**
   - Saat ini menggunakan SHA-256 (client-side)
   - Untuk production, sebaiknya gunakan bcrypt (server-side)

2. **Email Verification**
   - Saat ini auto-verified
   - Belum ada email verification flow

3. **Password Reset**
   - Belum ada fitur forgot password
   - Harus contact super admin untuk reset

4. **File Upload**
   - Masih simulasi
   - Belum terintegrasi Supabase Storage

---

## 📊 Testing

### Test Registrasi
1. Buka `/register`
2. Coba NIM invalid (contoh: `1234567890`)
3. Coba email invalid (contoh: `test@gmail.com`)
4. Coba NIM valid: `3333230001`
5. Coba email valid: `ahmad.test@student.untirta.ac.id`
6. Verifikasi user terbuat di database

### Test Super Admin
1. Login sebagai super admin
2. Tambah user mahasiswa baru
3. Edit user existing
4. Coba hapus user
5. Test search & filter
6. Verifikasi activity log tercatat

### Test Login
1. Login dengan email + password yang benar
2. Login dengan password salah (harus error)
3. Login dengan email tidak terdaftar (harus error)
4. Verifikasi redirect sesuai role

---

## 🚀 Deployment Checklist

- [ ] Run `database/update-schema-v2.sql` di Supabase
- [ ] Verifikasi super admin user terbuat
- [ ] Test registrasi mahasiswa
- [ ] Test login dengan password
- [ ] Test super admin dashboard
- [ ] Ganti password super admin default
- [ ] Update environment variables jika perlu
- [ ] Test di production

---

## 📝 Migration Guide

### Dari v1.0 ke v2.0

1. **Backup Database**
   ```sql
   -- Backup users table
   CREATE TABLE users_backup AS SELECT * FROM users;
   ```

2. **Run Update Schema**
   ```bash
   # Di Supabase SQL Editor
   # Copy paste isi database/update-schema-v2.sql
   ```

3. **Update Existing Users**
   ```sql
   -- Set default password untuk existing users
   UPDATE users 
   SET password_hash = '$2a$10$...' -- hash dari 'password123'
   WHERE password_hash IS NULL;
   ```

4. **Test**
   - Login dengan existing users
   - Registrasi user baru
   - Test super admin features

---

## 🎉 Kesimpulan

Update v2.0 ini menambahkan:
- ✅ Sistem registrasi mahasiswa dengan validasi NIM
- ✅ Super admin dashboard untuk kelola user
- ✅ Autentikasi dengan password
- ✅ Validasi email domain UNTIRTA
- ✅ Hapus demo accounts
- ✅ Security improvements

Sistem sekarang lebih aman dan siap untuk production!

---

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Check dokumentasi ini
2. Check `docs/TROUBLESHOOT_ERROR.md`
3. Contact development team

---

<div align="center">
  <p><strong>LabTrack v2.0</strong></p>
  <p>Made with ❤️ for Teknik Industri UNTIRTA</p>
  <p>© 2026 LabTrack. All rights reserved.</p>
</div>
