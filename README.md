# LabTrack - Sistem Peminjaman Alat Laboratorium

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase" alt="Supabase" />
</div>

## 📋 Deskripsi

**LabTrack** adalah sistem manajemen peminjaman alat laboratorium berbasis web yang dirancang khusus untuk Laboratorium Teknik Industri Universitas Sultan Ageng Tirtayasa. Sistem ini mempermudah proses peminjaman, monitoring, dan pengelolaan inventaris alat laboratorium secara real-time.

### ✨ Fitur Utama

#### 👨‍🎓 Untuk Mahasiswa
- 🔍 **Pencarian Alat** - Cari dan filter alat berdasarkan laboratorium dan kategori
- 📝 **Pengajuan Peminjaman** - Ajukan peminjaman dengan form lengkap dan upload surat
- 📊 **Status Real-time** - Pantau status pengajuan dan alat yang dipinjam
- 📜 **Riwayat Lengkap** - Lihat riwayat peminjaman yang sudah selesai
- 🔔 **Notifikasi** - Terima notifikasi untuk persetujuan, penolakan, dan pengingat
- ⏰ **Progress Tracker** - Monitor sisa waktu peminjaman dengan visual progress bar

#### 👨‍💼 Untuk Admin/Asisten Lab
- ✅ **Verifikasi Cepat** - Setujui atau tolak pengajuan peminjaman
- 📦 **Manajemen Inventaris** - Tambah, edit, dan hapus data alat
- 🔄 **Proses Pengembalian** - Catat kondisi alat saat dikembalikan
- 📈 **Monitoring Dashboard** - Statistik dan overview aktivitas lab
- 📊 **Export Laporan** - Download laporan dalam format Excel/PDF
- 📝 **Activity Log** - Lacak semua aktivitas sistem
- ⚠️ **Alert Keterlambatan** - Notifikasi otomatis untuk alat yang terlambat

### 🏢 Laboratorium yang Didukung

1. **LSIPro** - Lab. Sistem Informasi & Produktivitas
2. **RSK&E** - Lab. Rekayasa Sistem Kerja & Ergonomi
3. **OSI&K** - Lab. Optimasi Sistem Industri & Kualitas
4. **SMI** - Lab. Sistem Manufaktur Industri

## 🚀 Teknologi

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Validation**: Zod

## 📦 Instalasi

### Prerequisites

- Node.js 18+ atau Bun
- npm/yarn/pnpm/bun
- Akun Supabase (untuk database)

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/labtrack-app.git
cd labtrack-app
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

3. **Setup Environment Variables**

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Setup Database**

Jalankan SQL schema di Supabase SQL Editor:

```bash
# File: supabase-schema.sql
# Copy dan paste isi file ke Supabase SQL Editor
```

5. **Run Development Server**

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🗄️ Database Schema

### Tables

#### `users`
- `id` (UUID, PK)
- `email` (TEXT, UNIQUE)
- `name` (TEXT)
- `role` (TEXT: 'mahasiswa' | 'admin' | 'asisten')
- `nim` (TEXT, nullable)
- `kelas` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)

#### `laboratories`
- `id` (TEXT, PK)
- `name` (TEXT)
- `full_name` (TEXT)
- `description` (TEXT)
- `location` (TEXT)
- `image` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### `equipment`
- `id` (TEXT, PK)
- `name` (TEXT)
- `description` (TEXT)
- `lab_id` (TEXT, FK → laboratories)
- `total_stock` (INTEGER)
- `available_stock` (INTEGER)
- `condition` (TEXT)
- `status` (TEXT: 'tersedia' | 'dipinjam' | 'maintenance')
- `image` (TEXT)
- `category` (TEXT)
- `specifications` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### `loans`
- `id` (TEXT, PK)
- `user_id` (UUID, FK → users)
- `user_name` (TEXT)
- `user_nim` (TEXT)
- `user_kelas` (TEXT)
- `equipment_id` (TEXT, FK → equipment)
- `equipment_name` (TEXT)
- `lab_id` (TEXT, FK → laboratories)
- `lab_name` (TEXT)
- `quantity` (INTEGER)
- `borrow_date` (TIMESTAMPTZ)
- `return_date` (TIMESTAMPTZ)
- `actual_return_date` (TIMESTAMPTZ, nullable)
- `status` (TEXT: 'menunggu' | 'disetujui' | 'ditolak' | 'dipinjam' | 'dikembalikan' | 'terlambat')
- `notes` (TEXT)
- `return_condition` (TEXT)
- `return_notes` (TEXT)
- `created_at` (TIMESTAMPTZ)

#### `activity_logs`
- `id` (TEXT, PK)
- `user_id` (UUID, FK → users)
- `user_name` (TEXT)
- `user_role` (TEXT)
- `type` (TEXT)
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ)

## 🎨 Design System

### Color Palette

```css
/* Navy & Professional */
--navy-800: #1a2332
--navy-900: #111827

/* Accent Colors */
--accent-cyan: #06b6d4
--accent-orange: #f97316

/* Status Colors */
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--info: #3b82f6
```

### Typography

- **Heading**: Plus Jakarta Sans
- **Body**: Inter

## 👥 Demo Accounts

### Mahasiswa
- **Email**: `ahmad.fauzan@student.untirta.ac.id`
- **Password**: `mahasiswa123`

### Admin/Asisten Lab
- **Email**: `rizky.pratama@untirta.ac.id`
- **Password**: `admin123`

## 📱 Struktur Halaman

### Public Routes
- `/` - Landing page
- `/login` - Halaman login

### Mahasiswa Routes
- `/mahasiswa` - Dashboard mahasiswa
- `/mahasiswa/inventaris` - Daftar alat tersedia
- `/mahasiswa/inventaris/[id]` - Detail alat & form peminjaman
- `/mahasiswa/status` - Status peminjaman aktif
- `/mahasiswa/riwayat` - Riwayat peminjaman

### Admin Routes
- `/admin` - Dashboard admin
- `/admin/inventaris` - Manajemen inventaris alat
- `/admin/verifikasi` - Verifikasi pengajuan peminjaman
- `/admin/pengembalian` - Proses pengembalian alat
- `/admin/monitoring` - Monitoring & laporan
- `/admin/log` - Activity log sistem

## 🔧 Konfigurasi

### Tailwind CSS

Project ini menggunakan Tailwind CSS v4 dengan konfigurasi custom di `globals.css`:

```css
@import "tailwindcss";
@theme {
  /* Custom theme configuration */
}
```

### Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  // Configuration here
};
```

## 📊 Fitur Real-time

Sistem menggunakan Supabase Realtime untuk update otomatis:

- ✅ Status peminjaman berubah secara real-time
- ✅ Stok alat terupdate otomatis
- ✅ Notifikasi muncul instant
- ✅ Activity log tersinkronisasi

## 🔐 Security

- ✅ Row Level Security (RLS) di Supabase
- ✅ Client-side validation dengan Zod
- ✅ Protected routes dengan middleware
- ✅ Secure file upload validation
- ✅ SQL injection prevention

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Manual Deployment

```bash
# Build production
npm run build

# Start production server
npm start
```

## 📝 Development Guidelines

### Code Style

- Use TypeScript untuk type safety
- Follow React best practices
- Use functional components dengan hooks
- Implement proper error handling
- Write meaningful commit messages

### Component Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
│   └── layout/      # Layout components
├── lib/             # Utilities & helpers
│   ├── data.ts      # Demo data
│   ├── store.tsx    # Global state management
│   ├── supabase.ts  # Supabase client
│   └── types.ts     # TypeScript types
└── ...
```

## 🐛 Known Issues & Limitations

- File upload saat ini hanya simulasi (belum terintegrasi dengan storage)
- Export PDF menggunakan window.print() (perlu library PDF generator untuk production)
- Notifikasi disimpan di state (belum persist ke database)

## 🔮 Future Enhancements

- [ ] Integrasi dengan Supabase Storage untuk upload file
- [ ] Push notifications dengan service worker
- [ ] QR Code untuk scan alat
- [ ] Mobile app dengan React Native
- [ ] Email notifications
- [ ] Advanced analytics & reporting
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Barcode scanner integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Teknik Industri - Universitas Sultan Ageng Tirtayasa**

## 🙏 Acknowledgments

- Next.js Team
- Supabase Team
- Vercel
- Tailwind CSS Team
- All contributors

---

<div align="center">
  <p>Made with ❤️ for Teknik Industri UNTIRTA</p>
  <p>© 2026 LabTrack. All rights reserved.</p>
</div>
