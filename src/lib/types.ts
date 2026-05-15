export type UserRole = 'mahasiswa' | 'admin';
export type EquipmentStatus = 'tersedia' | 'dipinjam' | 'maintenance';
export type LoanStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dipinjam' | 'dikembalikan' | 'terlambat';
export type LabName = 'LSIPro' | 'RSK&E' | 'OSI&K' | 'SMI';
export type ActivityType = 'login' | 'peminjaman' | 'pengembalian' | 'approve' | 'reject' | 'tambah_alat' | 'edit_alat' | 'hapus_alat' | 'update_status';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  nim?: string;
  kelas?: string;
  avatar?: string;
  createdAt?: string;
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
  updatedAt: string;
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
