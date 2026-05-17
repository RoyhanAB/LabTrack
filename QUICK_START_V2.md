# ⚡ QUICK START - LabTrack v2.0

## 🎯 3 LANGKAH SETUP

### 1. Update Database (5 menit)
```
1. Buka: https://supabase.com/dashboard
2. Pilih project LabTrack
3. Klik "SQL Editor" → "New query"
4. Copy paste isi file: database/update-schema-v2.sql
5. Klik "Run"
```

### 2. Login Super Admin
```
URL: http://localhost:3000/login
Email: superadmin@untirta.ac.id
Password: superadmin123
```

### 3. Test Registrasi
```
URL: http://localhost:3000/register
Email: test@student.untirta.ac.id
NIM: 3333230001 (Teknik Industri)
Password: password123
```

---

## 🔑 AKUN DEFAULT

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | superadmin@untirta.ac.id | superadmin123 |
| Mahasiswa | ahmad.fauzan@student.untirta.ac.id | password123 |
| Admin | rizky.pratama@untirta.ac.id | password123 |

---

## 📱 HALAMAN BARU

| URL | Deskripsi |
|-----|-----------|
| `/register` | Registrasi mahasiswa |
| `/super-admin` | Dashboard super admin |
| `/login` | Login (tanpa demo button) |

---

## ✨ FITUR BARU

### 1. Registrasi Mahasiswa
- ✅ Validasi email `@student.untirta.ac.id`
- ✅ Validasi NIM `3333YYXXXX`
- ✅ Password hashing
- ✅ Real-time validation

### 2. Super Admin
- ✅ Kelola semua user
- ✅ Tambah/Edit/Hapus user
- ✅ Search & filter
- ✅ Statistik real-time

### 3. Security
- ✅ Login dengan password
- ✅ Email domain validation
- ✅ NIM format validation
- ✅ Activity logging

---

## 🎨 FORMAT NIM TEKNIK INDUSTRI

```
3333YYXXXX

33   = Fakultas Teknik
33   = Teknik Industri
YY   = Tahun angkatan (23 = 2023)
XXXX = Nomor urut (0001-9999)

✅ Valid:   3333230001, 3333240025, 3333220100
❌ Invalid: 1234567890, 3332230001, 333323001
```

---

## 🐛 TROUBLESHOOTING CEPAT

### Login Gagal?
```sql
-- Cek di Supabase SQL Editor:
SELECT * FROM users WHERE email = 'superadmin@untirta.ac.id';

-- Jika tidak ada, run:
INSERT INTO users (id, email, name, role, password_hash, email_verified) 
VALUES (
  '00000000-0000-0000-0000-000000000099',
  'superadmin@untirta.ac.id',
  'Super Administrator',
  'super_admin',
  '$2a$10$rQZ9vXqK5xJ8YqN5xJ8YqOZJ8YqN5xJ8YqN5xJ8YqN5xJ8YqN5xJ8Y',
  true
);
```

### Registrasi Error?
- Cek format NIM: harus `3333YYXXXX`
- Cek email: harus `@student.untirta.ac.id`
- Cek password: minimal 8 karakter

---

## 📚 DOKUMENTASI LENGKAP

- `UPDATE_DATABASE.md` - Panduan update database
- `docs/UPDATE_V2.md` - Dokumentasi lengkap v2.0
- `docs/SECURITY.md` - Security best practices
- `docs/CHANGELOG.md` - Version history
- `README.md` - Project overview

---

## ✅ CHECKLIST SETELAH SETUP

- [ ] Database sudah diupdate
- [ ] Super admin bisa login
- [ ] Registrasi mahasiswa berfungsi
- [ ] Validasi NIM bekerja
- [ ] Validasi email bekerja
- [ ] Super admin bisa kelola user

---

<div align="center">
  <h2>🚀 Ready to Go!</h2>
  <p>Jika semua checklist ✅, sistem siap digunakan!</p>
</div>
