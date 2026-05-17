# Changelog

All notable changes to LabTrack project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-05-17

### 🚀 Added - Security & Super Admin

**Sistem Registrasi Mahasiswa**
- Halaman registrasi di `/register`
- Validasi email domain `@student.untirta.ac.id`
- Validasi NIM Teknik Industri (format: `3333YYXXXX`)
  - `33` = Fakultas Teknik
  - `33` = Teknik Industri
  - `YY` = Tahun angkatan (00-99)
  - `XXXX` = Nomor urut (0001-9999)
- Password hashing dengan SHA-256
- Validasi password strength (weak/medium/strong)
- Real-time form validation
- Error handling yang informatif

**Super Admin Dashboard**
- Role baru: `super_admin`
- Dashboard di `/super-admin`
- Kelola semua user (mahasiswa, admin, super admin)
- CRUD operations untuk user management:
  - Create user baru dengan validasi
  - Read/View semua user dengan pagination
  - Update user data dan password
  - Delete user (dengan proteksi self-delete)
- Search users by nama, email, atau NIM
- Filter users by role
- Statistik user real-time:
  - Total users
  - Total mahasiswa
  - Total admin/asisten
  - Total super admin
- Modal forms untuk create/edit user
- Activity logging untuk semua aksi

**Auth Utilities** (`src/lib/auth.ts`)
- `hashPassword()` - Hash password dengan SHA-256
- `verifyPassword()` - Verifikasi password terhadap hash
- `validateEmailDomain()` - Validasi domain email UNTIRTA
- `validateNIMTeknikIndustri()` - Validasi format NIM dengan error messages
- `validatePasswordStrength()` - Cek kekuatan password
- `parseNIM()` - Extract info dari NIM (fakultas, prodi, angkatan, no urut)
- `generateEmailFromNIM()` - Generate email dari NIM dan nama

**Database Updates**
- Kolom `password_hash` di tabel users
- Kolom `email_verified` di tabel users  
- Kolom `last_login` di tabel users
- Function `validate_nim_teknik_industri()` untuk validasi NIM
- Constraint untuk validasi NIM di database level
- Super admin user default (email: superadmin@untirta.ac.id)
- Indexes untuk performance (email, nim, role)
- Updated RLS policies untuk security

### 🔄 Changed

**Login System**
- Login sekarang membutuhkan email + password (bukan hanya email)
- Hapus tombol "Demo Mahasiswa" dan "Demo Admin" dari UI
- Tambah link "Daftar Sekarang" untuk registrasi
- Redirect super admin ke `/super-admin` setelah login
- Last login tracking otomatis
- Activity log untuk setiap login

**User Type & Interfaces**
- Update `UserRole` type: tambah `'super_admin'`
- Tambah interface `RegisterData` untuk registrasi
- Update `User` interface dengan field baru:
  - `passwordHash?: string`
  - `emailVerified?: boolean`
  - `lastLogin?: string`
- Update `ActivityType` dengan: `'register' | 'tambah_user' | 'hapus_user' | 'edit_user'`

**Store Context** (`src/lib/store.tsx`)
- Update `login()` function dengan parameter password
- Tambah `register()` function untuk registrasi mahasiswa
- Tambah `getAllUsers()` function untuk fetch semua user
- Tambah `createUser()` function untuk super admin
- Tambah `updateUser()` function untuk super admin
- Tambah `deleteUser()` function untuk super admin
- Tambah state `users` untuk menyimpan list user
- Password verification saat login
- Activity logging untuk user management

**Dashboard Layout** (`src/components/layout/DashboardLayout.tsx`)
- Support role `super_admin`
- Auto-detect role dari currentUser
- Menu items untuk super admin:
  - Dashboard
  - Kelola User
  - Activity Log
- Flexible role prop (optional)

**Demo Accounts**
- Update password semua demo accounts
- Tambah super admin account
- Dokumentasi password di README

### 🔒 Security Improvements

- Password hashing untuk semua user (SHA-256)
- Validasi email domain UNTIRTA (mahasiswa & admin)
- Validasi NIM Teknik Industri dengan constraint
- Last login tracking untuk audit
- Activity logging untuk user management
- Protected routes dengan role checking
- Self-delete protection untuk super admin
- Email uniqueness validation
- NIM uniqueness validation

### 📝 Documentation

- Tambah `docs/UPDATE_V2.md` - Dokumentasi lengkap update v2.0
- Update `README.md` dengan:
  - Info registrasi mahasiswa
  - Super admin account
  - Password requirements
  - NIM format explanation
- Update `docs/CHANGELOG.md` dengan semua perubahan v2.0
- Tambah comments di code untuk complex logic
- Database migration guide

### ⚠️ Breaking Changes

- **Login requires password**: Tidak bisa login hanya dengan email
- **Demo buttons removed**: Tombol demo di UI dihapus
- **Database schema update required**: Harus run `database/update-schema-v2.sql`
- **Password field required**: Semua user harus punya password
- **Email validation**: Email harus sesuai domain UNTIRTA
- **NIM validation**: NIM mahasiswa harus format `3333YYXXXX`

### 🐛 Bug Fixes

- Fixed login without password validation
- Fixed role-based routing untuk super admin
- Fixed user creation without email validation
- Fixed NIM format acceptance (sekarang strict)
- Fixed dashboard layout role detection

### 🔧 Technical Improvements

- Better error handling di registrasi
- Improved validation messages
- Cleaner code structure untuk auth
- Type safety untuk RegisterData
- Optimized user queries dengan indexes
- Better state management untuk users list

### 📚 Known Limitations

- Password hashing menggunakan SHA-256 (client-side)
  - Untuk production, sebaiknya gunakan bcrypt (server-side)
- Email verification belum implemented
  - Saat ini auto-verified setelah registrasi
- Password reset belum ada
  - Harus contact super admin untuk reset
- File upload masih simulasi
- Export PDF menggunakan window.print()
- Notifications tidak persist ke database

### 🔮 Planned Features (v2.1.0)

- [ ] Email verification flow
- [ ] Forgot password functionality
- [ ] Password reset via email
- [ ] Bcrypt password hashing (server-side)
- [ ] Two-factor authentication (2FA)
- [ ] Session timeout
- [ ] Password change history
- [ ] Account lockout after failed attempts
- [ ] IP-based access control
- [ ] Audit log untuk security events

---

## [1.0.0] - 2026-05-15

### 🎉 Initial Release

#### ✨ Added - Core Features

**Authentication & Authorization**
- Login system dengan role-based access (Mahasiswa & Admin)
- Session management dengan localStorage
- Protected routes untuk setiap role
- Demo accounts untuk testing

**Mahasiswa Features**
- Dashboard dengan statistik peminjaman
- Pencarian dan filter alat laboratorium
- Detail alat dengan spesifikasi lengkap
- Form pengajuan peminjaman dengan validasi
- Upload surat peminjaman (PDF, max 5MB)
- Status tracking peminjaman real-time
- Progress bar untuk monitoring waktu peminjaman
- Riwayat peminjaman lengkap
- Sistem notifikasi untuk update status

**Admin Features**
- Dashboard dengan overview aktivitas lab
- Manajemen inventaris alat (CRUD operations)
  - Tambah alat baru dengan form lengkap
  - Edit data alat existing
  - Hapus alat dari sistem
- Verifikasi pengajuan peminjaman
  - Approve/Reject dengan notifikasi otomatis
  - View detail pengajuan dan surat
- Proses pengembalian alat
  - Input kondisi alat saat dikembalikan
  - Update stok otomatis
- Monitoring & Laporan
  - Statistik peminjaman
  - Filter dan search advanced
  - Export ke Excel (CSV)
  - Export ke PDF (Print)
- Activity Log sistem
  - Track semua aktivitas user
  - Filter berdasarkan role dan tipe aktivitas

**Database & Backend**
- Supabase PostgreSQL integration
- Real-time subscriptions untuk live updates
- Row Level Security (RLS) policies
- Optimized queries dengan indexing
- Database schema dengan foreign keys
- Activity logging otomatis

**UI/UX**
- Modern glassmorphism design
- Responsive layout (Mobile, Tablet, Desktop)
- Dark navy color scheme dengan accent cyan & orange
- Smooth animations dan transitions
- Loading states untuk semua async operations
- Toast notifications untuk user feedback
- Modal dialogs untuk forms
- Dropdown notifications dengan badge counter
- Progress bars untuk tracking
- Status badges dengan color coding
- Empty states dengan helpful messages

**Technical Features**
- Next.js 16 App Router
- React 19 dengan TypeScript
- Tailwind CSS 4 custom configuration
- Context API untuk state management
- Date handling dengan date-fns
- Form validation dengan Zod
- Icons dari Lucide React
- Charts dengan Recharts (ready for analytics)

#### 🏢 Laboratorium Support

- **LSIPro** - Lab. Sistem Informasi & Produktivitas
- **RSK&E** - Lab. Rekayasa Sistem Kerja & Ergonomi
- **OSI&K** - Lab. Optimasi Sistem Industri & Kualitas
- **SMI** - Lab. Sistem Manufaktur Industri

#### 📊 Data Management

- 16 sample equipment dengan data lengkap
- 6 sample loans dengan berbagai status
- 7 activity logs untuk demo
- 3 demo notifications
- 4 laboratorium dengan detail lengkap

#### 🎨 Design System

**Colors**
- Navy palette (50-950)
- Accent colors (Cyan & Orange)
- Status colors (Success, Warning, Danger, Info)
- Semantic color naming

**Typography**
- Plus Jakarta Sans untuk headings
- Inter untuk body text
- Responsive font sizes
- Proper line heights

**Components**
- Reusable badge components
- Progress bar dengan variants
- Glass morphism cards
- Gradient backgrounds
- Custom scrollbars
- Focus rings untuk accessibility

**Animations**
- Fade in/out
- Slide in (left/right)
- Scale in
- Float effect
- Shimmer loading
- Stagger animations
- Progress stripe animation

#### 🔔 Notification System

- Real-time notifications
- Badge counter untuk unread
- Dropdown dengan list notifikasi
- Mark as read functionality
- Mark all as read
- Auto-notification untuk:
  - Pengajuan dikirim
  - Peminjaman disetujui
  - Peminjaman ditolak
  - Alat terlambat dikembalikan
  - Pengingat pengembalian

#### 🔐 Security Features

- Client-side validation
- SQL injection prevention
- XSS protection
- File upload validation
- Secure password handling (demo)
- Protected API routes (ready)

#### 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly UI elements
- Collapsible sidebar untuk mobile
- Optimized images
- Fast loading times

#### 🚀 Performance

- Code splitting dengan Next.js
- Lazy loading components
- Optimized images
- Minimal bundle size
- Fast page transitions
- Efficient re-renders

#### 📝 Documentation

- Comprehensive README.md
- Detailed PANDUAN_PENGGUNAAN.md
- Database schema documentation
- Code comments untuk complex logic
- TypeScript types untuk semua data
- API documentation (inline)

#### 🧪 Testing Ready

- TypeScript untuk type safety
- Zod schemas untuk validation
- Error boundaries (ready to implement)
- Console logging untuk debugging
- Demo data untuk testing

### 🐛 Bug Fixes

- Fixed hydration mismatch di protected routes
- Fixed notification dropdown close on outside click
- Fixed date formatting untuk timezone Indonesia
- Fixed stok calculation saat approve/return
- Fixed modal scroll behavior
- Fixed mobile sidebar overlay z-index
- Fixed search filter case sensitivity
- Fixed empty state displays

### 🔧 Technical Improvements

- Optimized Supabase queries
- Improved error handling
- Better loading states
- Cleaner code structure
- Consistent naming conventions
- Proper TypeScript types
- Efficient state updates
- Memoized expensive calculations

### 📚 Known Limitations

- File upload hanya simulasi (belum terintegrasi storage)
- Export PDF menggunakan window.print()
- Notifications tidak persist ke database
- Email notifications belum implemented
- Push notifications belum ada
- QR Code scanner belum ada
- Barcode integration belum ada

### 🔮 Planned Features (v1.1.0)

- [ ] Supabase Storage integration untuk file upload
- [ ] Email notifications dengan templates
- [ ] Push notifications dengan service worker
- [ ] Advanced analytics dashboard
- [ ] QR Code untuk scan alat
- [ ] Barcode scanner integration
- [ ] Export PDF dengan library (jsPDF)
- [ ] Multi-language support (ID/EN)
- [ ] Dark mode toggle
- [ ] User profile management
- [ ] Password reset functionality
- [ ] Advanced search dengan filters
- [ ] Bulk operations untuk admin
- [ ] Calendar view untuk peminjaman
- [ ] Reminder system otomatis
- [ ] Rating & review untuk alat
- [ ] Maintenance scheduling
- [ ] Equipment reservation system

### 🎯 Future Roadmap

**v1.2.0 - Mobile App**
- React Native mobile app
- Offline mode support
- Camera integration untuk scan
- Push notifications native

**v1.3.0 - Advanced Features**
- AI-powered recommendations
- Predictive analytics
- Automated reporting
- Integration dengan sistem akademik

**v2.0.0 - Enterprise**
- Multi-tenant support
- Advanced role management
- API untuk integrasi eksternal
- White-label solution

---

## Version History

### [1.0.0] - 2026-05-15
- Initial release dengan semua core features
- Production-ready untuk deployment
- Comprehensive documentation

---

## Contributors

- **Development Team**: Teknik Industri UNTIRTA
- **Design**: Modern UI/UX Team
- **Testing**: QA Team
- **Documentation**: Technical Writers

---

## Support

Untuk bug reports dan feature requests, silakan buat issue di GitHub repository atau hubungi tim development.

**Contact:**
- Email: support@labtrack.untirta.ac.id
- GitHub: [github.com/untirta/labtrack](https://github.com/untirta/labtrack)

---

<div align="center">
  <p><strong>LabTrack v1.0.0</strong></p>
  <p>Made with ❤️ for Teknik Industri UNTIRTA</p>
</div>
