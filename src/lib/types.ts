type UserRole = 'mahasiswa' | 'admin' | 'asisten' | 'super_admin';
type EquipmentStatus = 'tersedia' | 'dipinjam' | 'maintenance';
type LoanStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dipinjam' | 'dikembalikan' | 'terlambat';
type LabName = 'LSIPro' | 'RSK&E' | 'OSI&K' | 'SMI';
type ActivityType = 'login' | 'peminjaman' | 'pengembalian' | 'approve' | 'reject' | 'tambah_alat' | 'edit_alat' | 'hapus_alat' | 'update_status' | 'register' | 'tambah_user' | 'hapus_user' | 'edit_user';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  role: UserRole;
  nim?: string;
  kelas?: string;
  avatar?: string;
  emailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  nim: string;
  kelas?: string;
  verificationCode: string;
}

export interface Laboratory {
  id: string;
  name: LabName;
  fullName: string;
  description: string;
  location: string;
  image?: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  labId: string;
  totalStock: number;
  availableStock: number;
  condition: string;
  status: EquipmentStatus;
  image?: string;
  category: string;
  specifications?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Loan {
  id: string;
  userId: string;
  userName: string;
  userNim: string;
  userKelas: string;
  equipmentId: string;
  equipmentName: string;
  labId: string;
  labName: string;
  quantity: number;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: LoanStatus;
  letterUrl?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  returnNotes?: string;
  returnCondition?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  type: ActivityType;
  description: string;
  metadata?: Record<string, string>;
  createdAt: string;
}
