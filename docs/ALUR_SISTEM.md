# Alur Sistem LabTrack

Dokumen ini menjelaskan flow utama LabTrack berdasarkan role pengguna: mahasiswa, admin/asisten, dan super admin. Status yang dipakai sistem:

- Status peminjaman: `menunggu`, `dipinjam`, `ditolak`, `dikembalikan`, `terlambat`
- Status alat: `tersedia`, `dipinjam`, `maintenance`
- Role user: `mahasiswa`, `admin`, `asisten`, `super_admin`

Catatan: tipe status `disetujui` masih ada di tipe data lama, tetapi flow persetujuan saat ini langsung mengubah pengajuan dari `menunggu` menjadi `dipinjam`.

## Flow Login Semua Role

1. User membuka halaman login.
2. User memilih tab `Mahasiswa` atau `Admin`.
3. User memasukkan email dan password.
4. Sistem memvalidasi format email:
   - Mahasiswa harus memakai email NIM, contoh `3333230001@untirta.ac.id`.
   - Admin/asisten/super admin memakai email `@untirta.ac.id`, tetapi bukan email NIM mahasiswa.
5. Sistem mencari akun di database.
6. Sistem membandingkan hash password.
7. Jika login berhasil:
   - Mahasiswa diarahkan ke `/mahasiswa`.
   - Admin dan asisten diarahkan ke `/admin`.
   - Super admin diarahkan ke `/super-admin`.
   - Sistem menyimpan user aktif ke localStorage.
   - Sistem mencatat activity log login.
8. Jika login gagal:
   - Email/password salah: tampil pesan gagal.
   - Email tidak sesuai tab role: user diminta memilih tab yang benar.
   - Akun tidak punya password: login ditolak.
   - Data localStorage rusak/lama: data sesi dihapus dan user harus login ulang.

## Flow Register Mahasiswa

1. Mahasiswa membuka halaman register.
2. Mahasiswa mengisi:
   - Nama lengkap
   - NIM 10 digit dengan format Teknik Industri `3333YYXXXX`
   - Kelas
   - Password
   - Konfirmasi password
3. Sistem otomatis membuat email dari NIM:
   - Contoh NIM `3333230001`
   - Email menjadi `3333230001@untirta.ac.id`
4. Mahasiswa klik `Kirim Kode Verifikasi`.
5. Sistem memvalidasi data awal:
   - Nama wajib diisi.
   - NIM wajib 10 digit.
   - NIM harus Teknik Industri.
   - Kelas wajib dipilih.
   - Password wajib kuat.
   - Konfirmasi password harus sama.
   - Email/NIM belum terdaftar.
6. Jika valid, sistem membuat kode 6 digit.
7. Sistem menyimpan hash kode ke tabel `pending_registrations` dengan masa berlaku 10 menit.
8. Sistem mengirim kode ke email mahasiswa via Resend.
9. Mahasiswa memasukkan kode verifikasi.
10. Sistem memvalidasi kode:
   - Kode harus 6 digit.
   - Kode harus cocok.
   - Kode belum expired.
   - Maksimal percobaan salah 5 kali.
11. Jika kode benar, sistem membuat akun mahasiswa di tabel `users`.
12. Sistem mencatat activity log register.
13. Mahasiswa diarahkan ke halaman login.

Kemungkinan gagal:

- NIM bukan Teknik Industri: register ditolak.
- Email/NIM sudah dipakai: register ditolak.
- Kode salah: user diminta input ulang.
- Kode expired: user harus kirim ulang kode.
- Percobaan kode terlalu banyak: user harus kirim ulang kode.
- Resend belum dikonfigurasi di production: pengiriman kode gagal.

## Flow Mahasiswa

### Dashboard Mahasiswa

1. Mahasiswa login.
2. Sistem menampilkan ringkasan:
   - Jumlah alat tersedia.
   - Peminjaman aktif.
   - Peminjaman terlambat.
   - Riwayat selesai.
3. Sistem menampilkan daftar peminjaman aktif mahasiswa.
4. Jika ada peminjaman terlambat, sistem menampilkan peringatan.

### Melihat Inventaris

1. Mahasiswa membuka menu `Inventaris Alat`.
2. Sistem menampilkan alat dari semua laboratorium.
3. Mahasiswa dapat mencari alat berdasarkan nama/kategori.
4. Mahasiswa dapat filter berdasarkan lab.
5. Mahasiswa melihat detail alat:
   - Nama alat
   - Lab
   - Kategori
   - Deskripsi
   - Spesifikasi
   - Stok tersedia/total
   - Kondisi
   - Status

Kemungkinan:

- Alat `tersedia` dan stok tersedia lebih dari 0: mahasiswa dapat mengajukan peminjaman.
- Alat `maintenance`: tombol pengajuan tidak tersedia.
- Alat `dipinjam` atau stok 0: pengajuan tidak bisa dibuat.

### Mengajukan Peminjaman Alat

1. Mahasiswa membuka detail alat.
2. Mahasiswa klik `Mulai Pengajuan`.
3. Mahasiswa mengisi:
   - Jumlah unit
   - Tanggal kembali
   - Tujuan peminjaman
   - Surat peminjaman PDF opsional
4. Sistem memvalidasi:
   - Alat harus berstatus `tersedia`.
   - Jumlah minimal 1.
   - Jumlah tidak boleh melebihi stok tersedia.
   - Tanggal kembali tidak boleh lebih awal dari hari ini.
   - File surat harus PDF dan maksimal 5 MB.
5. Jika valid, sistem membuat data loan dengan status `menunggu`.
6. Sistem menampilkan notifikasi ke mahasiswa bahwa pengajuan dikirim.
7. Sistem mencatat activity log peminjaman.
8. Mahasiswa diarahkan ke halaman `Status Peminjaman`.

Kemungkinan:

- Double submit dicegah dengan loading state.
- Jika stok berubah sebelum submit, sistem menolak jumlah tidak valid.
- Jika alat menjadi maintenance, pengajuan ditolak di sisi UI.

### Memantau Status Peminjaman

1. Mahasiswa membuka menu `Status Peminjaman`.
2. Sistem menampilkan peminjaman dengan status:
   - `menunggu`: pengajuan masih menunggu verifikasi admin/asisten.
   - `dipinjam`: pengajuan disetujui dan alat sedang dipinjam.
   - `terlambat`: alat melewati tanggal kembali.
3. Sistem menghitung sisa hari sampai tanggal kembali.
4. Jika sudah melewati tanggal kembali, status dapat berubah otomatis menjadi `terlambat`.

### Riwayat Mahasiswa

1. Mahasiswa membuka menu `Riwayat`.
2. Sistem menampilkan peminjaman dengan status:
   - `dikembalikan`
   - `ditolak`
3. Mahasiswa dapat mencari riwayat berdasarkan nama alat atau laboratorium.
4. Riwayat menampilkan tanggal pinjam, tanggal kembali aktual, status, dan catatan kondisi pengembalian jika ada.

## Flow Admin dan Asisten

Admin dan asisten memiliki akses panel admin yang sama. Super admin juga dapat mengakses fitur admin.

### Dashboard Admin

1. Admin/asisten login.
2. Sistem menampilkan ringkasan:
   - Total alat.
   - Peminjaman aktif.
   - Pengajuan menunggu verifikasi.
   - Peminjaman terlambat.
3. Sistem menampilkan activity log terbaru.
4. Admin dapat masuk cepat ke verifikasi peminjaman atau manajemen inventaris.

### Manajemen Inventaris

1. Admin membuka menu `Manajemen Inventaris`.
2. Sistem menampilkan semua alat.
3. Admin dapat:
   - Cari alat.
   - Filter berdasarkan lab.
   - Tambah alat.
   - Edit alat.
   - Hapus alat.

Flow tambah alat:

1. Admin klik `Tambah Alat`.
2. Admin mengisi:
   - Nama alat
   - Kategori
   - Laboratorium
   - Total stok
   - Stok tersedia
   - Kondisi
   - Status
   - Deskripsi
   - Spesifikasi opsional
   - Gambar opsional
3. Sistem memvalidasi stok tersedia tidak boleh lebih besar dari total stok.
4. Jika valid, sistem insert alat ke database.
5. State lokal langsung diperbarui supaya alat langsung muncul.
6. Sistem mencatat activity log `tambah_alat`.

Flow edit alat:

1. Admin klik edit pada alat.
2. Sistem membuka form dengan data alat saat ini.
3. Admin mengubah data.
4. Sistem memvalidasi stok tersedia tidak melebihi total stok.
5. Sistem update database.
6. Sistem update state lokal.
7. Sistem mencatat activity log `edit_alat`.

Flow hapus alat:

1. Admin klik hapus.
2. Sistem menampilkan konfirmasi.
3. Jika dikonfirmasi, sistem menghapus alat dari database.
4. Sistem menghapus alat dari state lokal.
5. Sistem mencatat activity log `hapus_alat`.

Kemungkinan:

- Jika alat masih memiliki peminjaman terkait, penghapusan dapat ikut berdampak ke data terkait karena relasi database memakai cascade.
- Jika stok tersedia 0 dan status alat `tersedia`, admin sebaiknya mengubah status menjadi `dipinjam` atau `maintenance`.
- Jika alat rusak, admin dapat mengatur status menjadi `maintenance`.

### Verifikasi Peminjaman

1. Admin membuka menu `Verifikasi`.
2. Sistem menampilkan semua loan dengan status `menunggu`.
3. Admin memeriksa:
   - Nama mahasiswa
   - NIM
   - Kelas
   - Nama alat
   - Jumlah
   - Tanggal pinjam/kembali
   - Tujuan
   - Surat peminjaman jika ada
4. Admin memilih `Setujui` atau `Tolak`.

Flow setujui:

1. Sistem memastikan loan masih `menunggu`.
2. Sistem memastikan alat masih ada.
3. Sistem memastikan stok tersedia cukup.
4. Sistem menjalankan transaksi approve:
   - Status loan berubah menjadi `dipinjam`.
   - Field `approved_by` dan `approved_at` diisi.
   - Stok tersedia alat berkurang sesuai jumlah pinjam.
   - Status alat menjadi `dipinjam` jika stok habis.
   - Status alat tetap `tersedia` jika masih ada stok.
5. Sistem mengirim notifikasi ke mahasiswa bahwa peminjaman disetujui.
6. Sistem mencatat activity log `approve`.

Flow tolak:

1. Sistem memastikan loan masih `menunggu`.
2. Sistem mengubah status loan menjadi `ditolak`.
3. Stok alat tidak berubah.
4. Sistem mengirim notifikasi ke mahasiswa bahwa peminjaman ditolak.
5. Sistem mencatat activity log `reject`.

Kemungkinan:

- Loan sudah diproses admin lain: aksi dibatalkan.
- Stok tidak cukup: approve ditolak.
- Alat tidak ditemukan: approve ditolak.
- Double click tombol approve/reject dicegah dengan loading state.

### Pengembalian Alat

1. Admin membuka menu `Pengembalian`.
2. Sistem menampilkan peminjaman aktif dengan status:
   - `dipinjam`
   - `terlambat`
3. Admin memilih peminjaman yang dikembalikan.
4. Admin mengisi kondisi pengembalian:
   - `Baik`
   - `Rusak Ringan`
   - `Rusak Berat`
   - `Hilang`
5. Admin dapat mengisi catatan pengembalian.
6. Sistem memproses pengembalian.

Jika kondisi `Baik`:

1. Loan berubah menjadi `dikembalikan`.
2. `actual_return_date` diisi.
3. `return_condition` dan `return_notes` disimpan.
4. Stok tersedia alat bertambah sesuai jumlah yang dikembalikan.
5. Status alat menjadi `tersedia` jika stok tersedia lebih dari 0.
6. Mahasiswa menerima notifikasi pengembalian berhasil.
7. Activity log `pengembalian` dibuat.

Jika kondisi `Rusak Ringan`, `Rusak Berat`, atau `Hilang`:

1. Loan tetap berubah menjadi `dikembalikan`.
2. `actual_return_date`, `return_condition`, dan `return_notes` disimpan.
3. Stok tersedia tidak bertambah.
4. Barang rusak/hilang tidak masuk ke barang tersedia.
5. Status alat menjadi `maintenance` jika stok tersedia 0.
6. Mahasiswa menerima notifikasi pengembalian berhasil.
7. Activity log `pengembalian` dibuat.

Kemungkinan:

- Double submit pengembalian dicegah dengan loading state.
- Jika alat tidak ditemukan, proses ditolak.
- Jika status loan bukan `dipinjam` atau `terlambat`, loan tidak muncul di pengembalian.

### Monitoring

1. Admin membuka menu `Monitoring`.
2. Sistem menampilkan daftar seluruh peminjaman.
3. Admin dapat melihat status setiap peminjaman:
   - `menunggu`
   - `dipinjam`
   - `terlambat`
   - `dikembalikan`
   - `ditolak`
4. Monitoring digunakan untuk melihat histori operasional dan kondisi peminjaman.

### Activity Log

1. Admin membuka menu `Activity Log`.
2. Sistem menampilkan aktivitas penting:
   - Login
   - Register
   - Peminjaman
   - Approve/reject
   - Pengembalian
   - Tambah/edit/hapus alat
   - Tambah/edit/hapus user
3. Log membantu audit siapa melakukan apa dan kapan.

## Flow Super Admin

Super admin memiliki akses khusus ke manajemen user dan juga dapat mengakses menu admin.

### Dashboard dan Manajemen User

1. Super admin login.
2. Sistem mengarahkan ke `/super-admin`.
3. Sistem menampilkan statistik:
   - Total user
   - Total mahasiswa
   - Total admin/asisten
   - Total super admin
4. Sistem menampilkan daftar user.
5. Super admin dapat:
   - Mencari user berdasarkan nama, email, atau NIM.
   - Filter user berdasarkan role.
   - Tambah user.
   - Edit user.
   - Hapus user.

Flow tambah user:

1. Super admin klik tambah user.
2. Super admin mengisi:
   - Nama
   - Email
   - Role
   - NIM dan kelas jika role mahasiswa
   - Password
3. Sistem memvalidasi:
   - Mahasiswa harus memakai email NIM `3333YYXXXX@untirta.ac.id`.
   - Mahasiswa harus memiliki NIM valid.
   - Admin/asisten/super admin harus memakai email `@untirta.ac.id`.
   - Jika role bukan mahasiswa, NIM dan kelas tidak disimpan.
4. Sistem membuat user.
5. Sistem mencatat activity log `tambah_user`.

Flow edit user:

1. Super admin klik edit user.
2. Super admin mengubah data user.
3. Sistem memvalidasi format email sesuai role.
4. Jika role diubah dari mahasiswa ke role non-mahasiswa, NIM dan kelas dikosongkan.
5. Jika password diisi, password user diperbarui.
6. Sistem mencatat activity log `edit_user`.

Flow hapus user:

1. Super admin klik hapus.
2. Sistem menghapus user dari database.
3. Sistem mencatat activity log `hapus_user`.

Kemungkinan:

- Email sudah dipakai: tambah user gagal.
- NIM sudah dipakai: tambah user mahasiswa gagal.
- Role tidak sesuai email: tambah/edit user gagal.
- Menghapus user dapat berdampak pada data terkait karena relasi database memakai cascade.

## Alur Status Peminjaman

Flow normal:

```text
Mahasiswa mengajukan
  -> menunggu
Admin menyetujui
  -> dipinjam
Mahasiswa mengembalikan alat
  -> dikembalikan
```

Flow ditolak:

```text
Mahasiswa mengajukan
  -> menunggu
Admin menolak
  -> ditolak
```

Flow terlambat:

```text
Mahasiswa mengajukan
  -> menunggu
Admin menyetujui
  -> dipinjam
Tanggal kembali lewat
  -> terlambat
Admin menerima pengembalian
  -> dikembalikan
```

Flow alat rusak/hilang saat kembali:

```text
dipinjam / terlambat
  -> dikembalikan
stok tersedia tidak bertambah
alat bisa menjadi maintenance
```

## Alur Status Alat

Flow stok tersedia:

```text
tersedia
  -> dipinjam jika seluruh stok habis setelah approve
  -> tetap tersedia jika masih ada stok
```

Flow pengembalian kondisi baik:

```text
dipinjam / maintenance
  -> tersedia jika stok tersedia > 0
```

Flow pengembalian rusak/hilang:

```text
dipinjam
  -> maintenance jika tidak ada stok tersedia
  -> stok tersedia tidak bertambah
```

Flow manual admin:

```text
Admin dapat mengubah status alat menjadi:
  - tersedia
  - dipinjam
  - maintenance
```

## Hak Akses Per Role

Mahasiswa:

- Register akun.
- Login.
- Melihat dashboard.
- Melihat inventaris.
- Mengajukan peminjaman.
- Melihat status peminjaman.
- Melihat riwayat peminjaman.
- Melihat notifikasi.
- Logout.

Admin/asisten:

- Login.
- Melihat dashboard admin.
- Mengelola inventaris alat.
- Verifikasi peminjaman.
- Memproses pengembalian.
- Monitoring peminjaman.
- Melihat activity log.
- Melihat notifikasi.
- Logout.

Super admin:

- Login.
- Mengelola user.
- Melihat statistik user.
- Menambah/edit/hapus mahasiswa, admin, asisten, dan super admin.
- Mengakses menu inventaris, monitoring, dan activity log admin.
- Logout.

## Kondisi Sistem yang Perlu Diperhatikan

- Session user disimpan di localStorage dan divalidasi saat refresh.
- Jika halaman direfresh, sistem menunggu data selesai dimuat sebelum redirect.
- Pengajuan peminjaman tidak langsung mengurangi stok; stok berkurang saat admin menyetujui.
- Pengembalian rusak/hilang tidak mengembalikan stok tersedia.
- Peminjaman terlambat dicek otomatis saat aplikasi berjalan.
- Register mahasiswa wajib verifikasi kode email.
- Kode verifikasi register hanya berlaku 10 menit.
- Kode verifikasi maksimal salah 5 kali.
