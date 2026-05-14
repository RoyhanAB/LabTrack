# ✅ Integration Test Checklist

Gunakan checklist ini untuk memastikan semua fitur terintegrasi dengan baik.

## 🔐 1. Authentication Test

### Test Login Mahasiswa
- [ ] Buka http://localhost:3000/login
- [ ] Pilih tab "Mahasiswa"
- [ ] Input email: `ahmad.fauzan@student.untirta.ac.id`
- [ ] Input password: `mahasiswa123`
- [ ] Klik "Masuk"
- [ ] **Expected**: Redirect ke `/mahasiswa` dashboard
- [ ] **Expected**: Nama "Ahmad Fauzan" muncul di pojok kanan atas

### Test Login Admin
- [ ] Logout dari mahasiswa
- [ ] Login dengan email: `rizky.pratama@untirta.ac.id`
- [ ] Password: `admin123`
- [ ] **Expected**: Redirect ke `/admin` dashboard
- [ ] **Expected**: Nama "Rizky Pratama" muncul di pojok kanan atas

---

## 📦 2. Mahasiswa - Inventaris Test

### View Equipment List
- [ ] Login sebagai mahasiswa
- [ ] Klik "Inventaris Alat" di sidebar
- [ ] **Expected**: Muncul grid cards alat
- [ ] **Expected**: Ada minimal 6 alat
- [ ] **Expected**: Setiap card menampilkan nama, kategori, stok, lab

### Search & Filter
- [ ] Ketik "stopwatch" di search box
- [ ] **Expected**: Hanya muncul alat yang mengandung "stopwatch"
- [ ] Pilih filter "RSK&E" di dropdown lab
- [ ] **Expected**: Hanya muncul alat dari lab RSK&E
- [ ] Clear search dan filter
- [ ] **Expected**: Semua alat muncul kembali

### View Equipment Detail
- [ ] Klik salah satu card alat
- [ ] **Expected**: Redirect ke halaman detail `/mahasiswa/inventaris/[id]`
- [ ] **Expected**: Muncul gambar alat (atau icon fallback)
- [ ] **Expected**: Muncul deskripsi lengkap
- [ ] **Expected**: Muncul spesifikasi teknis
- [ ] **Expected**: Muncul stok tersedia

---

## 📝 3. Mahasiswa - Form Peminjaman Test

### Submit Loan Request
- [ ] Di halaman detail alat, klik "Mulai Pengajuan"
- [ ] **Expected**: Form muncul di sidebar kanan
- [ ] Input jumlah: `1`
- [ ] Pilih tanggal kembali: Besok
- [ ] Input tujuan: `Test peminjaman untuk praktikum`
- [ ] (Optional) Upload file PDF
- [ ] Klik "Kirim Pengajuan"
- [ ] **Expected**: Toast success "Pengajuan berhasil dikirim"
- [ ] **Expected**: Redirect ke `/mahasiswa/status`

### Verify in Console
- [ ] Buka Browser Console (F12)
- [ ] **Expected**: Log `Loan created successfully: loan-xxxxx`
- [ ] **Expected**: Tidak ada error merah

### Verify in Supabase
- [ ] Buka Supabase Dashboard
- [ ] Klik "Table Editor" → "loans"
- [ ] **Expected**: Ada row baru dengan status "menunggu"
- [ ] **Expected**: user_name = "Ahmad Fauzan"
- [ ] **Expected**: equipment_name sesuai alat yang dipilih

---

## 📊 4. Mahasiswa - Status Peminjaman Test

### View Loan Status
- [ ] Klik "Status Peminjaman" di sidebar
- [ ] **Expected**: Muncul card peminjaman yang baru diajukan
- [ ] **Expected**: Status badge "Menunggu" (kuning)
- [ ] **Expected**: Muncul nama alat, jumlah, lab
- [ ] **Expected**: Muncul tanggal pinjam dan kembali
- [ ] **Expected**: Muncul tujuan peminjaman

### Check Progress Bar
- [ ] **Expected**: Ada progress bar (jika status "dipinjam")
- [ ] **Expected**: Ada countdown hari tersisa

---

## 🔔 5. Notification Test

### Check Notification Badge
- [ ] Klik icon 🔔 di pojok kanan atas
- [ ] **Expected**: Dropdown notifikasi muncul
- [ ] **Expected**: Ada notifikasi "Pengajuan Dikirim"
- [ ] **Expected**: Badge merah menunjukkan jumlah unread

### Mark as Read
- [ ] Klik icon ✓ pada notifikasi
- [ ] **Expected**: Notifikasi berubah jadi read (background putih)
- [ ] **Expected**: Badge counter berkurang

---

## 👨‍💼 6. Admin - Verifikasi Test

### View Pending Loans
- [ ] Logout dari mahasiswa
- [ ] Login sebagai admin
- [ ] Klik "Verifikasi" di sidebar
- [ ] **Expected**: Muncul card pengajuan dari mahasiswa
- [ ] **Expected**: Menampilkan nama mahasiswa, NIM, kelas
- [ ] **Expected**: Menampilkan nama alat, jumlah, lab
- [ ] **Expected**: Menampilkan tanggal pinjam dan kembali
- [ ] **Expected**: Menampilkan tujuan peminjaman

### Approve Loan
- [ ] Klik tombol "✓ Setujui" (hijau)
- [ ] **Expected**: Toast success "Peminjaman disetujui"
- [ ] **Expected**: Card hilang dari list verifikasi
- [ ] **Expected**: Console log `Loan updated successfully`

### Verify in Supabase
- [ ] Buka Supabase → Table Editor → loans
- [ ] **Expected**: Status berubah jadi "dipinjam"
- [ ] **Expected**: approved_by = "Rizky Pratama"
- [ ] **Expected**: approved_at terisi timestamp

### Verify Stock Update
- [ ] Buka Supabase → Table Editor → equipment
- [ ] Cari alat yang dipinjam
- [ ] **Expected**: available_stock berkurang sesuai quantity
- [ ] Contoh: Jika awalnya 10, dipinjam 1, jadi 9

### Verify Notification Sent
- [ ] Logout dari admin
- [ ] Login kembali sebagai mahasiswa
- [ ] Klik icon 🔔
- [ ] **Expected**: Ada notifikasi baru "Peminjaman Disetujui"
- [ ] **Expected**: Badge counter bertambah

---

## 📋 7. Admin - Manajemen Inventaris Test

### View Equipment List
- [ ] Login sebagai admin
- [ ] Klik "Manajemen Inventaris"
- [ ] **Expected**: Muncul table semua alat
- [ ] **Expected**: Ada kolom: Info Alat, Lab, Stok, Status, Aksi

### Add New Equipment
- [ ] Klik tombol "+ Tambah Alat"
- [ ] **Expected**: Modal form muncul
- [ ] Isi form:
  - Nama: `Test Alat Baru`
  - Kategori: `Test Category`
  - Lab: Pilih salah satu
  - Total Stok: `5`
  - Stok Tersedia: `5`
  - Kondisi: `Baik`
  - Status: `tersedia`
  - Deskripsi: `Ini adalah test alat`
- [ ] Klik "Tambah Alat"
- [ ] **Expected**: Toast success "Alat berhasil ditambahkan"
- [ ] **Expected**: Modal tertutup
- [ ] **Expected**: Alat baru muncul di table

### Verify in Supabase
- [ ] Buka Supabase → Table Editor → equipment
- [ ] **Expected**: Ada row baru dengan name "Test Alat Baru"

### Edit Equipment
- [ ] Klik icon ✏️ pada alat yang baru ditambahkan
- [ ] **Expected**: Modal form muncul dengan data terisi
- [ ] Ubah nama jadi: `Test Alat Edited`
- [ ] Klik "Simpan Perubahan"
- [ ] **Expected**: Toast success "Alat berhasil diperbarui"
- [ ] **Expected**: Nama berubah di table

### Delete Equipment
- [ ] Klik icon 🗑️ pada alat test
- [ ] **Expected**: Muncul confirm dialog
- [ ] Klik "OK"
- [ ] **Expected**: Toast success "Alat berhasil dihapus"
- [ ] **Expected**: Alat hilang dari table

---

## 🔄 8. Admin - Pengembalian Test

### View Active Loans
- [ ] Klik "Pengembalian" di sidebar
- [ ] **Expected**: Muncul table peminjaman aktif
- [ ] **Expected**: Ada peminjaman yang statusnya "dipinjam"

### Process Return
- [ ] Klik "Proses Kembali" pada salah satu peminjaman
- [ ] **Expected**: Muncul confirm dialog
- [ ] Klik "OK"
- [ ] **Expected**: Muncul prompt "Masukkan kondisi alat"
- [ ] Input: `Baik`
- [ ] Klik "OK"
- [ ] **Expected**: Toast success "Pengembalian berhasil diproses"
- [ ] **Expected**: Peminjaman hilang dari table

### Verify Stock Restored
- [ ] Klik "Manajemen Inventaris"
- [ ] Cari alat yang dikembalikan
- [ ] **Expected**: Stok tersedia bertambah kembali

### Verify in Supabase
- [ ] Buka Supabase → loans
- [ ] Cari loan yang dikembalikan
- [ ] **Expected**: status = "dikembalikan"
- [ ] **Expected**: actual_return_date terisi
- [ ] **Expected**: return_condition = "Baik"

---

## 📈 9. Admin - Monitoring & Export Test

### View Monitoring
- [ ] Klik "Monitoring" di sidebar
- [ ] **Expected**: Muncul statistik overview
- [ ] **Expected**: Muncul table semua peminjaman
- [ ] **Expected**: Ada filter dan search

### Export to Excel
- [ ] Klik tombol "Excel"
- [ ] **Expected**: File CSV terdownload
- [ ] Buka file dengan Excel/Google Sheets
- [ ] **Expected**: Data peminjaman lengkap dalam format table

### Export to PDF
- [ ] Klik tombol "PDF"
- [ ] **Expected**: Jendela print terbuka
- [ ] **Expected**: Muncul laporan formatted dengan header
- [ ] Pilih "Save as PDF" atau langsung print
- [ ] **Expected**: PDF tersimpan/terprint

---

## 📝 10. Admin - Activity Log Test

### View Activity Log
- [ ] Klik "Activity Log" di sidebar
- [ ] **Expected**: Muncul timeline aktivitas
- [ ] **Expected**: Ada log peminjaman, approval, pengembalian
- [ ] **Expected**: Setiap log menampilkan user, role, deskripsi, timestamp

### Filter by Role
- [ ] Pilih filter "Mahasiswa"
- [ ] **Expected**: Hanya muncul aktivitas mahasiswa
- [ ] Pilih filter "Admin"
- [ ] **Expected**: Hanya muncul aktivitas admin

---

## 🔄 11. Real-time Sync Test

### Two Browser Test
- [ ] Buka 2 browser windows (atau incognito)
- [ ] Window 1: Login sebagai mahasiswa
- [ ] Window 2: Login sebagai admin

### Test Real-time Loan Creation
- [ ] Window 1: Ajukan peminjaman baru
- [ ] Window 2: Buka halaman "Verifikasi"
- [ ] **Expected**: Pengajuan baru LANGSUNG muncul (tanpa refresh)
- [ ] **Expected**: Console log "Loans change detected"

### Test Real-time Approval
- [ ] Window 2: Approve pengajuan
- [ ] Window 1: Buka halaman "Status Peminjaman"
- [ ] **Expected**: Status LANGSUNG berubah jadi "Dipinjam"
- [ ] **Expected**: Console log "Loans change detected"

### Test Real-time Stock Update
- [ ] Window 1: Buka halaman "Inventaris Alat"
- [ ] Window 2: Approve peminjaman alat lain
- [ ] Window 1: Lihat stok alat yang diapprove
- [ ] **Expected**: Stok LANGSUNG berkurang (tanpa refresh)
- [ ] **Expected**: Console log "Equipment change detected"

---

## 🎯 12. End-to-End Flow Test

### Complete Loan Cycle
1. **Mahasiswa: Ajukan Peminjaman**
   - [ ] Login sebagai mahasiswa
   - [ ] Pilih alat
   - [ ] Isi form dan submit
   - [ ] Cek status = "menunggu"

2. **Admin: Verifikasi**
   - [ ] Login sebagai admin
   - [ ] Buka verifikasi
   - [ ] Approve pengajuan
   - [ ] Cek stok berkurang

3. **Mahasiswa: Cek Approval**
   - [ ] Login sebagai mahasiswa
   - [ ] Cek status = "dipinjam"
   - [ ] Cek notifikasi approval

4. **Admin: Proses Pengembalian**
   - [ ] Login sebagai admin
   - [ ] Buka pengembalian
   - [ ] Proses return
   - [ ] Cek stok bertambah

5. **Mahasiswa: Cek Riwayat**
   - [ ] Login sebagai mahasiswa
   - [ ] Buka riwayat
   - [ ] Cek peminjaman = "dikembalikan"

---

## ✅ Success Criteria

Semua test di atas harus PASS (✅) untuk memastikan sistem terintegrasi 100%.

### Critical Tests (MUST PASS):
- ✅ Login works for both roles
- ✅ Loan creation saves to database
- ✅ Loan appears in admin verification
- ✅ Approval updates loan status
- ✅ Stock updates after approval
- ✅ Return updates stock back
- ✅ Real-time sync works

### Important Tests (SHOULD PASS):
- ✅ Notifications work
- ✅ Export functions work
- ✅ Activity log records all actions
- ✅ Search and filters work

### Nice-to-Have Tests (CAN PASS):
- ✅ File upload works
- ✅ Progress bars display correctly
- ✅ All animations smooth

---

## 🐛 Common Issues

### Issue: Loan not appearing in admin
**Solution**: Check console for errors, verify database connection

### Issue: Stock not updating
**Solution**: Check equipment update function, verify Supabase permissions

### Issue: Real-time not working
**Solution**: Enable Realtime in Supabase settings, check subscriptions

### Issue: Export not working
**Solution**: Check browser popup blocker, allow downloads

---

## 📞 Report Issues

Jika ada test yang FAIL:
1. Screenshot error di console
2. Screenshot Supabase data
3. Note which test failed
4. Report to development team

---

<div align="center">
  <p><strong>Happy Testing! 🧪</strong></p>
  <p>Pastikan semua test PASS sebelum deployment!</p>
</div>
