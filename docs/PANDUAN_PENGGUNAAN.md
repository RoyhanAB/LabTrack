# 📖 Panduan Penggunaan LabTrack

## Daftar Isi
1. [Untuk Mahasiswa](#untuk-mahasiswa)
2. [Untuk Admin/Asisten Lab](#untuk-adminasisten-lab)
3. [FAQ](#faq)
4. [Troubleshooting](#troubleshooting)

---

## 👨‍🎓 Untuk Mahasiswa

### 1. Login ke Sistem

1. Buka website LabTrack
2. Klik tombol **"Login"** di pojok kanan atas
3. Pilih tab **"Mahasiswa"**
4. Masukkan email student UNTIRTA Anda (contoh: `nama@student.untirta.ac.id`)
5. Masukkan password
6. Klik **"Masuk"**

> 💡 **Tips**: Centang "Ingat saya" agar tidak perlu login berulang kali

### 2. Mencari Alat Laboratorium

1. Dari dashboard, klik menu **"Inventaris Alat"** di sidebar
2. Gunakan fitur pencarian untuk mencari alat berdasarkan nama atau kategori
3. Filter berdasarkan:
   - **Laboratorium**: LSIPro, RSK&E, OSI&K, atau SMI
   - **Status**: Tersedia, Dipinjam, atau Maintenance
4. Klik card alat untuk melihat detail lengkap

### 3. Mengajukan Peminjaman

#### Langkah-langkah:

1. **Pilih Alat**
   - Klik alat yang ingin dipinjam dari halaman inventaris
   - Pastikan status alat "Tersedia" dan stok mencukupi

2. **Isi Form Peminjaman**
   - Klik tombol **"Mulai Pengajuan"**
   - Isi informasi berikut:
     - **Jumlah**: Berapa unit yang ingin dipinjam (maksimal sesuai stok tersedia)
     - **Tanggal Kembali**: Kapan alat akan dikembalikan
     - **Tujuan Peminjaman**: Jelaskan untuk keperluan apa (contoh: "Praktikum Ergonomi Modul 1")
     - **Surat Peminjaman** (Opsional): Upload file PDF surat peminjaman (maksimal 5MB)

3. **Kirim Pengajuan**
   - Review kembali data yang diisi
   - Klik **"Kirim Pengajuan"**
   - Tunggu notifikasi persetujuan dari admin

#### ⚠️ Catatan Penting:
- Pastikan tanggal kembali realistis sesuai kebutuhan
- Surat peminjaman dapat diupload nanti jika belum siap
- Pengajuan akan masuk ke antrian verifikasi admin

### 4. Memantau Status Peminjaman

1. Klik menu **"Status Peminjaman"** di sidebar
2. Lihat status pengajuan Anda:
   - 🟡 **Menunggu**: Sedang diproses admin
   - ✅ **Disetujui**: Silakan ambil alat di lab
   - 🔵 **Dipinjam**: Alat sedang Anda pinjam
   - 🔴 **Terlambat**: Melewati batas waktu pengembalian
   - ❌ **Ditolak**: Pengajuan tidak disetujui

3. Perhatikan **progress bar** untuk melihat sisa waktu peminjaman

### 5. Mengambil Alat (Setelah Disetujui)

1. Setelah status berubah menjadi **"Disetujui"**, Anda akan menerima notifikasi
2. Datang ke laboratorium yang bersangkutan
3. Tunjukkan ID peminjaman kepada asisten lab
4. Periksa kondisi alat sebelum dibawa
5. Status otomatis berubah menjadi **"Dipinjam"**

### 6. Mengembalikan Alat

1. Bawa alat kembali ke laboratorium sebelum tanggal jatuh tempo
2. Serahkan kepada asisten lab
3. Asisten akan memeriksa kondisi alat
4. Status akan berubah menjadi **"Dikembalikan"**
5. Riwayat peminjaman dapat dilihat di menu **"Riwayat"**

### 7. Melihat Riwayat Peminjaman

1. Klik menu **"Riwayat"** di sidebar
2. Lihat semua peminjaman yang sudah selesai
3. Informasi yang ditampilkan:
   - Nama alat dan laboratorium
   - Tanggal pinjam dan kembali
   - Status akhir (Dikembalikan/Ditolak)
   - Kondisi alat saat dikembalikan

### 8. Notifikasi

Anda akan menerima notifikasi untuk:
- ✅ Pengajuan disetujui
- ❌ Pengajuan ditolak
- ⚠️ Pengingat pengembalian (H-1)
- 🔴 Alat terlambat dikembalikan

**Cara melihat notifikasi:**
- Klik ikon 🔔 di pojok kanan atas
- Badge merah menunjukkan jumlah notifikasi belum dibaca
- Klik notifikasi untuk menandai sudah dibaca

---

## 👨‍💼 Untuk Admin/Asisten Lab

### 1. Login sebagai Admin

1. Buka website LabTrack
2. Klik tombol **"Login"**
3. Pilih tab **"Admin/Asisten"**
4. Masukkan email staff UNTIRTA (contoh: `nama@untirta.ac.id`)
5. Masukkan password
6. Klik **"Masuk"**

### 2. Dashboard Admin

Dashboard menampilkan:
- **Total Alat**: Jumlah total unit alat di semua lab
- **Peminjaman Aktif**: Alat yang sedang dipinjam
- **Menunggu Verifikasi**: Pengajuan yang perlu diproses
- **Terlambat**: Alat yang melewati batas waktu
- **Aktivitas Terbaru**: Log aktivitas sistem
- **Quick Actions**: Shortcut ke menu penting

### 3. Verifikasi Pengajuan Peminjaman

#### Langkah-langkah:

1. **Akses Menu Verifikasi**
   - Klik **"Verifikasi"** di sidebar
   - Atau klik **"Verifikasi Peminjaman"** di Quick Actions

2. **Review Pengajuan**
   - Lihat detail peminjaman:
     - Nama mahasiswa, NIM, dan kelas
     - Alat yang dipinjam dan jumlah
     - Tanggal pinjam dan kembali
     - Tujuan peminjaman
   - Download surat peminjaman jika ada

3. **Setujui atau Tolak**
   - **Setujui**: Klik tombol hijau **"✓ Setujui"**
     - Stok alat otomatis berkurang
     - Mahasiswa menerima notifikasi
   - **Tolak**: Klik tombol merah **"✗ Tolak"**
     - Berikan alasan penolakan
     - Mahasiswa menerima notifikasi

#### ⚠️ Hal yang Perlu Diperhatikan:
- Cek ketersediaan stok sebelum menyetujui
- Pastikan tanggal peminjaman masuk akal
- Verifikasi identitas mahasiswa jika perlu

### 4. Manajemen Inventaris Alat

#### Menambah Alat Baru:

1. Klik **"Manajemen Inventaris"** di sidebar
2. Klik tombol **"+ Tambah Alat"**
3. Isi form:
   - **Nama Alat**: Nama lengkap alat
   - **Kategori**: Jenis/kategori alat
   - **Laboratorium**: Pilih lab pemilik alat
   - **Total Stok**: Jumlah total unit
   - **Stok Tersedia**: Jumlah yang bisa dipinjam
   - **Kondisi**: Kondisi alat (Baik, Rusak Ringan, dll)
   - **Status**: Tersedia, Dipinjam, atau Maintenance
   - **Deskripsi**: Penjelasan lengkap alat
   - **Spesifikasi Teknis**: Detail teknis (opsional)
   - **URL Gambar**: Link gambar alat (opsional)
4. Klik **"Tambah Alat"**

#### Mengedit Alat:

1. Cari alat yang ingin diedit
2. Klik ikon **✏️ Edit**
3. Ubah data yang diperlukan
4. Klik **"Simpan Perubahan"**

#### Menghapus Alat:

1. Klik ikon **🗑️ Hapus** pada alat
2. Konfirmasi penghapusan
3. Alat akan dihapus dari sistem

> ⚠️ **Peringatan**: Penghapusan alat bersifat permanen!

### 5. Proses Pengembalian Alat

1. **Akses Menu Pengembalian**
   - Klik **"Pengembalian"** di sidebar

2. **Cari Peminjaman Aktif**
   - Gunakan search untuk mencari berdasarkan:
     - ID peminjaman
     - Nama mahasiswa
     - Nama alat

3. **Proses Pengembalian**
   - Klik **"Proses Kembali"** pada peminjaman
   - Periksa kondisi alat
   - Input kondisi alat:
     - "Baik" - Alat dalam kondisi sempurna
     - "Rusak Ringan" - Ada kerusakan kecil
     - "Rusak Berat" - Kerusakan signifikan
     - "Hilang X unit" - Ada unit yang hilang
   - Klik **"Konfirmasi"**
   - Stok alat otomatis bertambah

### 6. Monitoring & Laporan

#### Melihat Monitoring:

1. Klik **"Monitoring"** di sidebar
2. Lihat statistik:
   - Total peminjaman
   - Jumlah peminjam unik
   - Alat paling sering dipinjam
3. Filter data berdasarkan:
   - Nama mahasiswa
   - Nama alat
   - Laboratorium
   - Status peminjaman

#### Export Laporan:

1. **Export ke Excel**:
   - Klik tombol **"Excel"**
   - File CSV akan terdownload
   - Buka dengan Microsoft Excel atau Google Sheets

2. **Export ke PDF**:
   - Klik tombol **"PDF"**
   - Jendela print akan terbuka
   - Pilih "Save as PDF" atau langsung print

### 7. Activity Log

1. Klik **"Activity Log"** di sidebar
2. Lihat semua aktivitas sistem:
   - Login user
   - Peminjaman baru
   - Persetujuan/penolakan
   - Pengembalian
   - Perubahan data alat
3. Filter berdasarkan:
   - Nama user
   - Role (Mahasiswa/Admin)
   - Jenis aktivitas

### 8. Mengelola Alat Terlambat

1. Dari dashboard, lihat jumlah alat terlambat
2. Klik **"Tindak Lanjuti"** pada alert keterlambatan
3. Hubungi mahasiswa yang bersangkutan
4. Proses pengembalian dengan sanksi jika perlu

---

## ❓ FAQ (Frequently Asked Questions)

### Untuk Mahasiswa

**Q: Berapa lama proses verifikasi pengajuan?**
A: Biasanya 1-2 hari kerja. Anda akan menerima notifikasi setelah diproses.

**Q: Apakah bisa meminjam alat dari lab yang berbeda sekaligus?**
A: Ya, Anda bisa mengajukan peminjaman dari beberapa lab secara terpisah.

**Q: Bagaimana jika alat rusak saat dipinjam?**
A: Segera laporkan ke asisten lab. Jangan mencoba memperbaiki sendiri.

**Q: Apakah ada sanksi jika terlambat mengembalikan?**
A: Ya, sanksi sesuai peraturan laboratorium. Segera kembalikan untuk menghindari sanksi.

**Q: Bisa memperpanjang waktu peminjaman?**
A: Hubungi asisten lab untuk perpanjangan. Tidak bisa dilakukan melalui sistem.

### Untuk Admin

**Q: Bagaimana cara mengubah stok alat secara manual?**
A: Edit alat melalui menu Manajemen Inventaris, ubah field "Stok Tersedia".

**Q: Apakah bisa membatalkan peminjaman yang sudah disetujui?**
A: Tidak melalui sistem. Hubungi mahasiswa dan proses manual jika diperlukan.

**Q: Bagaimana cara backup data?**
A: Data tersimpan di Supabase dengan backup otomatis. Export laporan untuk backup lokal.

**Q: Bisa menambah admin baru?**
A: Ya, tambahkan user baru dengan role "admin" di database Supabase.

---

## 🔧 Troubleshooting

### Masalah Umum

#### 1. Tidak Bisa Login

**Gejala**: Error "Email atau password salah"

**Solusi**:
- Pastikan email menggunakan domain yang benar:
  - Mahasiswa: `@student.untirta.ac.id`
  - Admin: `@untirta.ac.id`
- Cek caps lock
- Reset password jika lupa
- Hubungi admin jika masih bermasalah

#### 2. Notifikasi Tidak Muncul

**Gejala**: Tidak menerima notifikasi

**Solusi**:
- Refresh halaman (F5)
- Clear browser cache
- Cek koneksi internet
- Pastikan browser mendukung JavaScript

#### 3. Upload File Gagal

**Gejala**: Error saat upload surat peminjaman

**Solusi**:
- Pastikan file format PDF
- Ukuran file maksimal 5MB
- Compress file jika terlalu besar
- Gunakan browser modern (Chrome, Firefox, Edge)

#### 4. Data Tidak Terupdate

**Gejala**: Perubahan tidak terlihat

**Solusi**:
- Refresh halaman
- Logout dan login kembali
- Clear browser cache
- Cek koneksi internet

#### 5. Export Laporan Gagal

**Gejala**: File tidak terdownload

**Solusi**:
- Cek popup blocker browser
- Izinkan download dari website
- Coba browser lain
- Pastikan ada data untuk diexport

### Kontak Support

Jika masalah masih berlanjut, hubungi:

📧 **Email**: support@labtrack.untirta.ac.id
📱 **WhatsApp**: +62 xxx-xxxx-xxxx
🏢 **Lokasi**: Laboratorium Teknik Industri, Gedung F

---

## 📱 Tips & Trik

### Untuk Mahasiswa

1. **Ajukan Peminjaman Lebih Awal**
   - Jangan tunggu H-1 praktikum
   - Berikan waktu untuk proses verifikasi

2. **Cek Stok Sebelum Praktikum**
   - Monitor ketersediaan alat
   - Koordinasi dengan teman sekelas

3. **Set Reminder Pengembalian**
   - Gunakan kalender/alarm
   - Kembalikan 1 hari sebelum deadline

4. **Jaga Kondisi Alat**
   - Gunakan sesuai prosedur
   - Simpan di tempat aman
   - Bersihkan sebelum dikembalikan

### Untuk Admin

1. **Verifikasi Rutin**
   - Cek pengajuan setiap hari
   - Prioritaskan yang urgent

2. **Update Stok Berkala**
   - Audit fisik alat setiap bulan
   - Update kondisi alat di sistem

3. **Monitor Keterlambatan**
   - Follow up mahasiswa yang terlambat
   - Dokumentasikan sanksi

4. **Backup Data**
   - Export laporan setiap bulan
   - Simpan di cloud storage

---

<div align="center">
  <p><strong>Selamat menggunakan LabTrack!</strong></p>
  <p>Untuk pertanyaan lebih lanjut, silakan hubungi tim support.</p>
</div>
