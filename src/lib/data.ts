import { Laboratory, User, Equipment, Loan, ActivityLog } from './types';

export const laboratories: Laboratory[] = [
  { id: 'lsi', name: 'LSIPro', fullName: 'Laboratorium Sistem Informasi dan Proses', description: 'Fokus pada pengembangan sistem informasi, pemodelan proses bisnis, dan rekayasa perangkat lunak.', location: 'Lantai 2, Gedung A', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop' },
  { id: 'rske', name: 'RSK&E', fullName: 'Laboratorium Rekayasa Sistem Kerja dan Ergonomi', description: 'Fokus pada perancangan sistem kerja, analisis biomekanika, dan lingkungan kerja fisik.', location: 'Lantai 1, Gedung B', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop' },
  { id: 'osik', name: 'OSI&K', fullName: 'Laboratorium Optimasi Sistem Industri dan Kualitas', description: 'Fokus pada riset operasi, pengendalian kualitas statistik, dan optimasi rantai pasok.', location: 'Lantai 2, Gedung B', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop' },
  { id: 'smi', name: 'SMI', fullName: 'Laboratorium Sistem Manufaktur dan Inovasi', description: 'Fokus pada perancangan produk, proses manufaktur, CNC, dan otomatisasi industri.', location: 'Lantai Dasar, Gedung C', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop' },
];

export const users: User[] = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Ahmad Fauzan', email: 'ahmad.fauzan@student.untirta.ac.id', password: 'mahasiswa123', role: 'mahasiswa', nim: '3333210001', kelas: 'TI-A 2021', createdAt: '2026-01-15T08:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Budi Santoso', email: 'budi.santoso@student.untirta.ac.id', password: 'mahasiswa123', role: 'mahasiswa', nim: '3333210002', kelas: 'TI-B 2021', createdAt: '2026-02-01T08:00:00Z' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Rizky Pratama', email: 'rizky.pratama@untirta.ac.id', password: 'admin123', role: 'admin', createdAt: '2025-08-01T08:00:00Z' },
];

export const equipment: Equipment[] = [
  { id: 'eq-1', name: 'Timbangan Digital Analitik', description: 'Timbangan digital dengan presisi tinggi untuk pengukuran bahan lab.', labId: 'lsi', totalStock: 5, availableStock: 5, condition: 'Baik', status: 'tersedia', image: 'https://images.unsplash.com/photo-1593344685087-c15c884cd9c0?w=800&auto=format&fit=crop', category: 'Alat Ukur', specifications: 'Kapasitas maks: 200g\nAkurasi: 0.0001g', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-10T00:00:00Z' },
  { id: 'eq-2', name: 'Stopwatch Digital Pro', description: 'Stopwatch presisi untuk pengukuran waktu kerja di lab RSK&E.', labId: 'rske', totalStock: 15, availableStock: 12, condition: 'Baik', status: 'tersedia', image: 'https://images.unsplash.com/photo-1499540633125-484965b60031?w=800&auto=format&fit=crop', category: 'Alat Ukur', specifications: 'Presisi: 1/100 detik\nWaterproof: Ya', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-08T00:00:00Z' },
  { id: 'eq-3', name: 'Heart Rate Monitor', description: 'Alat pengukur detak jantung untuk praktikum beban kerja fisik.', labId: 'rske', totalStock: 8, availableStock: 8, condition: 'Baik', status: 'tersedia', image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&auto=format&fit=crop', category: 'Alat Medis', specifications: 'Konektivitas: Bluetooth 5.0\nBaterai: CR2032', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-12T00:00:00Z' },
  { id: 'eq-4', name: 'Jangka Sorong Digital', description: 'Alat ukur dimensi panjang, lebar, dan diameter produk manufaktur.', labId: 'smi', totalStock: 20, availableStock: 20, condition: 'Baik', status: 'tersedia', image: 'https://images.unsplash.com/photo-1620669274291-536afef45ea1?w=800&auto=format&fit=crop', category: 'Alat Ukur', specifications: 'Range: 0-150mm\nResolusi: 0.01mm', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-10T00:00:00Z' },
  { id: 'eq-5', name: 'Mikrometer Sekrup', description: 'Alat ukur presisi untuk ketebalan material yang sangat tipis.', labId: 'smi', totalStock: 10, availableStock: 10, condition: 'Baik', status: 'tersedia', image: 'https://images.unsplash.com/photo-1582216503930-b3e32b4b4eb2?w=800&auto=format&fit=crop', category: 'Alat Ukur', specifications: 'Range: 0-25mm\nResolusi: 0.001mm', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-07T00:00:00Z' },
  { id: 'eq-6', name: 'Lux Meter', description: 'Alat ukur intensitas cahaya untuk praktikum lingkungan kerja.', labId: 'rske', totalStock: 5, availableStock: 0, condition: 'Rusak', status: 'maintenance', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop', category: 'Alat Ukur', specifications: 'Range: 0-50000 Lux', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2026-05-09T00:00:00Z' },
];

const now = new Date().toISOString();
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();
const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
const twoDaysLater = new Date(Date.now() + 2 * 86400000).toISOString();
const fiveDaysLater = new Date(Date.now() + 5 * 86400000).toISOString();
const oneDayLater = new Date(Date.now() + 1 * 86400000).toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();

export const loans: Loan[] = [
  { id: 'loan-1', userId: '00000000-0000-0000-0000-000000000001', userName: 'Ahmad Fauzan', userNim: '3333210001', userKelas: 'TI-A 2021', equipmentId: 'eq-1', equipmentName: 'Stopwatch Digital', labId: 'rske', labName: 'RSK&E', quantity: 3, borrowDate: fiveDaysAgo, returnDate: twoDaysLater, status: 'dipinjam', approvedBy: 'Rizky Pratama', approvedAt: fiveDaysAgo, createdAt: sevenDaysAgo },
  { id: 'loan-2', userId: '00000000-0000-0000-0000-000000000002', userName: 'Budi Santoso', userNim: '3333210002', userKelas: 'TI-B 2021', equipmentId: 'eq-2', equipmentName: 'Stopwatch Digital Pro', labId: 'rske', labName: 'RSK&E', quantity: 2, borrowDate: threeDaysAgo, returnDate: fiveDaysLater, status: 'dipinjam', approvedBy: 'Rizky Pratama', approvedAt: threeDaysAgo, createdAt: fiveDaysAgo },
];

export const activityLogs: ActivityLog[] = [
  { id: 'log-1', userId: '00000000-0000-0000-0000-000000000003', userName: 'Rizky Pratama', userRole: 'admin', type: 'approve', description: 'Menyetujui peminjaman Stopwatch Digital oleh Ahmad Fauzan', createdAt: fiveDaysAgo },
  { id: 'log-2', userId: '00000000-0000-0000-0000-000000000001', userName: 'Ahmad Fauzan', userRole: 'mahasiswa', type: 'peminjaman', description: 'Mengajukan peminjaman Timbangan Digital Analitik (2 unit)', createdAt: now },
  { id: 'log-3', userId: '00000000-0000-0000-0000-000000000003', userName: 'Rizky Pratama', userRole: 'admin', type: 'update_status', description: 'Mengubah status Lux Meter menjadi Maintenance', createdAt: threeDaysAgo },
];
