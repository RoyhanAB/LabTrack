# 🚀 LabTrack - Quick Start Guide

Panduan cepat untuk menjalankan LabTrack dalam 5 menit!

## ⚡ Quick Setup (5 Minutes)

### 1. Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/yourusername/labtrack-app.git
cd labtrack-app

# Install dependencies
npm install
# atau
bun install
```

### 2. Setup Environment (1 min)

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local dengan credentials Supabase Anda
# Minimal yang diperlukan:
# NEXT_PUBLIC_SUPABASE_URL=your_url_here
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### 3. Setup Database (1 min)

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Buka SQL Editor
4. Copy-paste isi file `supabase-schema.sql`
5. Run query

### 4. Run Development Server (1 min)

```bash
npm run dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 First Steps

### Login sebagai Mahasiswa

1. Klik **"Login"** di pojok kanan atas
2. Pilih tab **"Mahasiswa"**
3. Klik **"Demo Mahasiswa"** untuk auto-fill
4. Klik **"Masuk"**

**Atau manual:**
- Email: `ahmad.fauzan@student.untirta.ac.id`
- Password: `mahasiswa123`

### Login sebagai Admin

1. Klik **"Login"**
2. Pilih tab **"Admin/Asisten"**
3. Klik **"Demo Admin"** untuk auto-fill
4. Klik **"Masuk"**

**Atau manual:**
- Email: `rizky.pratama@untirta.ac.id`
- Password: `admin123`

---

## 📱 Test Features

### Sebagai Mahasiswa

1. **Lihat Inventaris**
   - Klik "Inventaris Alat" di sidebar
   - Coba search dan filter

2. **Ajukan Peminjaman**
   - Klik salah satu alat
   - Klik "Mulai Pengajuan"
   - Isi form dan submit

3. **Cek Status**
   - Klik "Status Peminjaman"
   - Lihat progress bar

4. **Lihat Notifikasi**
   - Klik ikon 🔔 di pojok kanan atas

### Sebagai Admin

1. **Verifikasi Pengajuan**
   - Klik "Verifikasi" di sidebar
   - Approve atau reject pengajuan

2. **Tambah Alat Baru**
   - Klik "Manajemen Inventaris"
   - Klik "+ Tambah Alat"
   - Isi form dan save

3. **Export Laporan**
   - Klik "Monitoring"
   - Klik "Excel" atau "PDF"

4. **Lihat Activity Log**
   - Klik "Activity Log"
   - Lihat semua aktivitas

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# With Bun (faster)
bun dev             # Start dev server
bun run build       # Build for production
bun start           # Start production server
```

---

## 📂 Key Files

```
labtrack-app/
├── src/app/
│   ├── admin/              # Admin pages
│   ├── mahasiswa/          # Student pages
│   ├── login/              # Login page
│   └── page.tsx            # Landing page
├── src/components/
│   └── layout/
│       └── DashboardLayout.tsx  # Main layout
├── src/lib/
│   ├── store.tsx           # Global state
│   ├── types.ts            # TypeScript types
│   └── supabase.ts         # Database client
├── .env.local              # Environment variables
└── supabase-schema.sql     # Database schema
```

---

## 🐛 Troubleshooting

### Port 3000 sudah digunakan?

```bash
# Gunakan port lain
npm run dev -- -p 3001
```

### Database connection error?

1. Cek `.env.local` sudah benar
2. Pastikan Supabase project aktif
3. Cek internet connection
4. Restart dev server

### Build error?

```bash
# Clear cache dan reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### TypeScript errors?

```bash
# Regenerate types
npm run build
```

---

## 📚 Next Steps

1. **Baca Dokumentasi Lengkap**
   - [README.md](./README.md) - Project overview
   - [PANDUAN_PENGGUNAAN.md](./PANDUAN_PENGGUNAAN.md) - User guide

2. **Explore Features**
   - Test semua fitur mahasiswa
   - Test semua fitur admin
   - Coba notifikasi system

3. **Customize**
   - Ubah warna di `globals.css`
   - Tambah data di `data.ts`
   - Modifikasi UI sesuai kebutuhan

4. **Deploy**
   - Push ke GitHub
   - Deploy ke Vercel
   - Setup production database

---

## 🎨 Customization Tips

### Ubah Warna

Edit `src/app/globals.css`:

```css
@theme {
  --color-accent-cyan: #06b6d4;  /* Ubah ini */
  --color-accent-orange: #f97316; /* Dan ini */
}
```

### Tambah Laboratorium

Edit `src/lib/data.ts`:

```typescript
export const laboratories: Laboratory[] = [
  // Tambah lab baru di sini
  { id: 'lab-5', name: 'NewLab', ... }
];
```

### Ubah Logo

Replace file di `public/` atau edit component di `DashboardLayout.tsx`

---

## 💡 Pro Tips

1. **Use Bun for faster installs**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   bun install
   ```

2. **Enable hot reload**
   - Sudah aktif by default
   - Save file untuk auto-refresh

3. **Use VS Code extensions**
   - ESLint
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

4. **Check browser console**
   - F12 untuk open DevTools
   - Lihat errors dan warnings

---

## 🆘 Need Help?

### Documentation
- 📖 [README.md](./README.md)
- 📘 [PANDUAN_PENGGUNAAN.md](./PANDUAN_PENGGUNAAN.md)
- 📝 [CHANGELOG.md](./CHANGELOG.md)
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md)

### Support
- 📧 Email: support@labtrack.untirta.ac.id
- 💬 GitHub Issues
- 🐛 Bug Reports

---

## ✅ Checklist

Sebelum mulai development, pastikan:

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor ready (VS Code recommended)
- [ ] Supabase account created
- [ ] Environment variables configured
- [ ] Database schema executed
- [ ] Dev server running
- [ ] Can login with demo accounts
- [ ] All features working

---

<div align="center">
  <h2>🎉 You're Ready!</h2>
  <p>Selamat coding dengan LabTrack!</p>
  <p>Happy hacking! 🚀</p>
</div>
