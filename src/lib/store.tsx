'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Equipment, Loan, Laboratory, ActivityLog, Notification, RegisterData } from './types';
// Data is now fetched from Supabase, no static imports needed
import { supabase } from './supabase';
import { hashPassword, validateEmailDomain, validateMahasiswaEmail, validateNIMTeknikIndustri } from './auth';
import toast from 'react-hot-toast';

type DbLoan = {
  id: string;
  user_id: string;
  user_name: string;
  user_nim?: string | null;
  user_kelas?: string | null;
  equipment_id: string;
  equipment_name: string;
  lab_id: string;
  lab_name: string;
  quantity: number;
  borrow_date: string;
  return_date: string;
  actual_return_date?: string | null;
  status: Loan['status'];
  notes?: string | null;
  letter_url?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  return_condition?: string | null;
  return_notes?: string | null;
  created_at?: string | null;
};

type DbEquipment = {
  id: string;
  name: string;
  description: string;
  lab_id: string;
  total_stock: number;
  available_stock: number;
  condition: string;
  status: Equipment['status'];
  image?: string | null;
  category: string;
  specifications?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DbUserUpdate = Partial<{
  name: string;
  email: string;
  role: User['role'];
  nim: string | null;
  kelas: string | null;
  password_hash: string;
}>;

type DbLoanUpdate = Partial<{
  status: Loan['status'];
  actual_return_date: string;
  return_condition: string;
  return_notes: string;
  approved_by: string;
  approved_at: string;
}>;

type DbEquipmentUpdate = Partial<{
  name: string;
  description: string;
  lab_id: string;
  total_stock: number;
  available_stock: number;
  condition: string;
  status: Equipment['status'];
  image: string;
  category: string;
  specifications: string;
}>;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Terjadi kesalahan';

const validRoles: User['role'][] = ['mahasiswa', 'admin', 'asisten', 'super_admin'];

const isStoredUser = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') return false;

  const user = value as Partial<User>;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return (
    typeof user.id === 'string' &&
    uuidRegex.test(user.id) &&
    typeof user.name === 'string' &&
    user.name.trim().length > 0 &&
    typeof user.email === 'string' &&
    user.email.trim().length > 0 &&
    validRoles.includes(user.role as User['role'])
  );
};

const mapLoanFromDb = (loan: DbLoan): Loan => ({
  ...loan,
  userId: loan.user_id,
  userName: loan.user_name,
  userNim: loan.user_nim || '',
  userKelas: loan.user_kelas || '',
  equipmentId: loan.equipment_id,
  equipmentName: loan.equipment_name,
  labId: loan.lab_id,
  labName: loan.lab_name,
  borrowDate: loan.borrow_date,
  returnDate: loan.return_date,
  actualReturnDate: loan.actual_return_date || undefined,
  returnCondition: loan.return_condition || undefined,
  returnNotes: loan.return_notes || undefined,
  letterUrl: loan.letter_url || undefined,
  approvedBy: loan.approved_by || undefined,
  approvedAt: loan.approved_at || undefined,
  notes: loan.notes || undefined,
  createdAt: loan.created_at || new Date().toISOString()
});

const mapEquipmentFromDb = (equipment: DbEquipment): Equipment => ({
  ...equipment,
  labId: equipment.lab_id,
  totalStock: equipment.total_stock,
  availableStock: equipment.available_stock,
  image: equipment.image || undefined,
  specifications: equipment.specifications || undefined,
  createdAt: equipment.created_at || new Date().toISOString(),
  updatedAt: equipment.updated_at || equipment.created_at || new Date().toISOString()
});

interface StoreContextType {
  currentUser: User | null;
  laboratories: Laboratory[];
  equipment: Equipment[];
  loans: Loan[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  users: User[];

  login: (email: string, password: string) => Promise<User | null>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Super Admin functions
  getAllUsers: () => Promise<User[]>;
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateUser: (id: string, data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  deleteUser: (id: string) => Promise<{ success: boolean; error?: string }>;

  getEquipment: (id: string) => Equipment | undefined;
  getLab: (id: string) => Laboratory | undefined;
  getLoansByUser: (userId: string) => Loan[];
  getPendingLoans: () => Loan[];
  getActiveLoans: () => Loan[];
  getUnreadCount: () => number;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;

  createLoan: (loan: Loan) => Promise<unknown>;
  createEquipment: (equipment: Equipment) => Promise<void>;
  updateLoanStatus: (loanId: string, status: Loan['status'], additionalData?: Partial<Loan>) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
  updateEquipment: (id: string, data: Partial<Equipment>) => Promise<void>;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'createdAt'>) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Load user from local storage to keep session
        const storedUser = localStorage.getItem('labtrack_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (isStoredUser(parsed)) {
              setCurrentUser(parsed);
            } else {
              // Stale data with old format (e.g., 'usr-1'), clear it
              console.log('⚠️ Stale user data found in localStorage, clearing...');
              localStorage.removeItem('labtrack_user');
            }
          } catch {
            localStorage.removeItem('labtrack_user');
          }
        }

        // Fetch data concurrently
        const [labsRes, eqRes, loansRes, logsRes] = await Promise.all([
          supabase.from('laboratories').select('*'),
          supabase.from('equipment').select('*'),
          supabase.from('loans').select('*').order('created_at', { ascending: false }),
          supabase.from('activity_logs').select('*').order('created_at', { ascending: false })
        ]);

        if (labsRes.data) {
          const mappedLabs = labsRes.data.map(l => ({
            ...l,
            fullName: l.full_name || l.fullName,
          }));
          setLaboratories(mappedLabs as Laboratory[]);
        }
        if (eqRes.data) {
          setEquipment((eqRes.data as DbEquipment[]).map(mapEquipmentFromDb));
        }
        if (loansRes.data) {
          setLoans((loansRes.data as DbLoan[]).map(mapLoanFromDb));
        }
        if (logsRes.data) {
          const mappedLogs = logsRes.data.map(l => ({
            ...l,
            userId: l.user_id,
            userName: l.user_name,
            userRole: l.user_role,
            createdAt: l.created_at
          }));
          setActivityLogs(mappedLogs as ActivityLog[]);
        }

        // Add some demo notifications for testing
        const demoNotifications: Notification[] = [
          {
            id: 'notif-demo-1',
            userId: '00000000-0000-0000-0000-000000000001',
            title: 'Peminjaman Disetujui',
            message: 'Peminjaman Stopwatch Digital Pro Anda telah disetujui. Silakan ambil alat di laboratorium RSK&E.',
            type: 'success',
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
          },
          {
            id: 'notif-demo-2',
            userId: '00000000-0000-0000-0000-000000000001',
            title: 'Pengingat Pengembalian',
            message: 'Jangan lupa mengembalikan Stopwatch Digital Pro besok tanggal 16 Mei 2026.',
            type: 'warning',
            read: false,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
          },
          {
            id: 'notif-demo-3',
            userId: '00000000-0000-0000-0000-000000000003',
            title: 'Pengajuan Baru',
            message: 'Ahmad Fauzan mengajukan peminjaman Timbangan Digital Analitik. Silakan verifikasi.',
            type: 'info',
            read: true,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
          }
        ];
        setNotifications(demoNotifications);
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
        toast.error('Gagal memuat data dari database');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscriptions — handle changes granularly instead of re-fetching everything
    const loansSub = supabase.channel('loans_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'loans' }, (payload) => {
        console.log('Loan inserted:', payload.new);
        const newLoan = mapLoanFromDb(payload.new as DbLoan);
        setLoans(prev => [newLoan, ...prev.filter(existing => existing.id !== newLoan.id)]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'loans' }, (payload) => {
        console.log('Loan updated:', payload.new);
        const updatedLoan = mapLoanFromDb(payload.new as DbLoan);
        setLoans(prev => prev.map(loan => loan.id === updatedLoan.id ? updatedLoan : loan));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'loans' }, (payload) => {
        console.log('Loan deleted:', payload.old);
        setLoans(prev => prev.filter(l => l.id !== (payload.old as { id?: string }).id));
      })
      .subscribe();

    const eqSub = supabase.channel('equipment_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'equipment' }, (payload) => {
        console.log('Equipment inserted:', payload.new);
        const newEq = mapEquipmentFromDb(payload.new as DbEquipment);
        setEquipment(prev => [...prev.filter(existing => existing.id !== newEq.id), newEq]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'equipment' }, (payload) => {
        console.log('Equipment updated:', payload.new);
        const updatedEq = mapEquipmentFromDb(payload.new as DbEquipment);
        setEquipment(prev => prev.map(eq => eq.id === updatedEq.id ? updatedEq : eq));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'equipment' }, (payload) => {
        console.log('Equipment deleted:', payload.old);
        setEquipment(prev => prev.filter(e => e.id !== (payload.old as { id?: string }).id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(loansSub);
      supabase.removeChannel(eqSub);
    };
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      console.log('🔐 Login attempt:', { email });
      
      // Try Supabase first
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      console.log('📊 Supabase response:', { data, error });
      
      if (data) {
        console.log('👤 User found:', { 
          id: data.id, 
          email: data.email, 
          role: data.role,
          hasPasswordHash: !!data.password_hash 
        });
        
        // Verify password
        const passwordHash = await hashPassword(password);
        console.log('🔑 Password comparison:', { 
          inputPrefix: passwordHash.substring(0, 20) + '...',
          storedPrefix: data.password_hash ? data.password_hash.substring(0, 20) + '...' : 'null'
        });
        
        // Block login if no password is set
        if (!data.password_hash) {
          console.log('❌ User has no password set — login blocked');
          return null;
        }
        
        if (data.password_hash !== passwordHash) {
          console.log('❌ Password mismatch');
          return null;
        }
        
        console.log('✅ Password verified');
        
        // Map Supabase data to our User type
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          nim: data.nim || undefined,
          kelas: data.kelas || undefined,
          emailVerified: data.email_verified || false,
          lastLogin: new Date().toISOString(),
          createdAt: data.created_at || new Date().toISOString(),
        };
        
        console.log('✅ User logged in:', { id: user.id, role: user.role });
        
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: user.lastLogin })
          .eq('id', user.id);
        
        setCurrentUser(user);
        localStorage.setItem('labtrack_user', JSON.stringify(user));
        
        // Add activity log
        await addActivityLog({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          type: 'login',
          description: `${user.name} login ke sistem`
        });
        
        return user;
      }
      
      console.log('❌ User not found');
      return null;
    } catch (error) {
      console.error('❌ Login error:', error);
      return null;
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate email format (must be NIM@untirta.ac.id)
      const emailValidation = validateMahasiswaEmail(data.email, data.nim);
      if (!emailValidation.valid) {
        return {
          success: false,
          error: emailValidation.error || 'Email tidak valid'
        };
      }

      // Validate NIM
      const nimValidation = validateNIMTeknikIndustri(data.nim);
      if (!nimValidation.valid) {
        return {
          success: false,
          error: nimValidation.error || 'NIM tidak valid'
        };
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: 'Email sudah terdaftar'
        };
      }

      // Check if NIM already exists
      const { data: existingNIM } = await supabase
        .from('users')
        .select('nim')
        .eq('nim', data.nim)
        .single();

      if (existingNIM) {
        return {
          success: false,
          error: 'NIM sudah terdaftar'
        };
      }

      const verificationResponse = await fetch('/api/register/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          nim: data.nim,
          code: data.verificationCode
        })
      });

      const verificationResult = await verificationResponse.json().catch(() => null);
      if (!verificationResponse.ok || !verificationResult?.success) {
        return {
          success: false,
          error: verificationResult?.error || 'Kode verifikasi tidak valid'
        };
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          email: data.email,
          name: data.name,
          nim: data.nim,
          kelas: data.kelas || null,
          role: 'mahasiswa',
          password_hash: passwordHash,
          email_verified: true // Auto verify for demo
        }])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          error: 'Gagal mendaftar. Silakan coba lagi.'
        };
      }

      console.log('✅ User registered:', newUser.id);

      // Add activity log
      await addActivityLog({
        userId: newUser.id,
        userName: newUser.name,
        userRole: 'mahasiswa',
        type: 'register',
        description: `${newUser.name} mendaftar sebagai mahasiswa`
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Terjadi kesalahan. Silakan coba lagi.'
      };
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedUsers = data.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        nim: u.nim || undefined,
        kelas: u.kelas || undefined,
        emailVerified: u.email_verified || false,
        lastLogin: u.last_login || undefined,
        createdAt: u.created_at || undefined
      }));

      setUsers(mappedUsers);
      return mappedUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = user.email.trim().toLowerCase();

      if (user.role === 'mahasiswa') {
        const emailValidation = validateMahasiswaEmail(normalizedEmail, user.nim);
        if (!emailValidation.valid) {
          return {
            success: false,
            error: emailValidation.error || 'Email mahasiswa harus sesuai NIM'
          };
        }
      } else if (!validateEmailDomain(normalizedEmail, user.role)) {
        return {
          success: false,
          error: 'Email admin/asisten harus @untirta.ac.id'
        };
      }

      // Validate NIM for mahasiswa
      if (user.role === 'mahasiswa' && user.nim) {
        const nimValidation = validateNIMTeknikIndustri(user.nim);
        if (!nimValidation.valid) {
          return {
            success: false,
            error: nimValidation.error || 'NIM tidak valid'
          };
        }
      }

      // Hash password if provided
      let passwordHash = undefined;
      if (user.password) {
        passwordHash = await hashPassword(user.password);
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: normalizedEmail,
          name: user.name,
          role: user.role,
          nim: user.nim || null,
          kelas: user.kelas || null,
          password_hash: passwordHash,
          email_verified: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Create user error:', error);
        return {
          success: false,
          error: 'Gagal membuat user. Email atau NIM mungkin sudah terdaftar.'
        };
      }

      // Add activity log
      if (currentUser) {
        await addActivityLog({
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          type: 'tambah_user',
          description: `${currentUser.name} menambahkan user ${data.name}`
        });
      }

      // Refresh users list
      await getAllUsers();

      return { success: true };
    } catch (error) {
      console.error('Create user error:', error);
      return {
        success: false,
        error: 'Terjadi kesalahan. Silakan coba lagi.'
      };
    }
  };

  const updateUser = async (id: string, data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      const existingUser = users.find(u => u.id === id);
      const nextUser = { ...existingUser, ...data };
      if (nextUser.email && nextUser.role) {
        const normalizedEmail = nextUser.email.trim().toLowerCase();
        if (nextUser.role === 'mahasiswa') {
          const emailValidation = validateMahasiswaEmail(normalizedEmail, nextUser.nim);
          if (!emailValidation.valid) {
            return {
              success: false,
              error: emailValidation.error || 'Email mahasiswa harus sesuai NIM'
            };
          }
        } else if (!validateEmailDomain(normalizedEmail, nextUser.role)) {
          return {
            success: false,
            error: 'Email admin/asisten harus @untirta.ac.id'
          };
        }
      }

      const updateData: DbUserUpdate = {};
      
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email.trim().toLowerCase();
      if (data.role) updateData.role = data.role;
      if (data.role && data.role !== 'mahasiswa') {
        updateData.nim = null;
        updateData.kelas = null;
      } else {
        if (data.nim !== undefined) updateData.nim = data.nim;
        if (data.kelas !== undefined) updateData.kelas = data.kelas;
      }
      
      if (data.password) {
        updateData.password_hash = await hashPassword(data.password);
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Update user error:', error);
        return {
          success: false,
          error: 'Gagal mengupdate user.'
        };
      }

      // Add activity log
      if (currentUser) {
        await addActivityLog({
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          type: 'edit_user',
          description: `${currentUser.name} mengupdate data user`
        });
      }

      // Refresh users list
      await getAllUsers();

      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: 'Terjadi kesalahan. Silakan coba lagi.'
      };
    }
  };

  const deleteUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete user error:', error);
        return {
          success: false,
          error: 'Gagal menghapus user.'
        };
      }

      // Add activity log
      if (currentUser) {
        await addActivityLog({
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          type: 'hapus_user',
          description: `${currentUser.name} menghapus user`
        });
      }

      // Refresh users list
      await getAllUsers();

      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        error: 'Terjadi kesalahan. Silakan coba lagi.'
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('labtrack_user');
  };

  const getEquipment = (id: string) => equipment.find(e => e.id === id);
  const getLab = (id: string) => laboratories.find(l => l.id === id);
  const getLoansByUser = (userId: string) => loans.filter(l => l.userId === userId);
  const getPendingLoans = () => loans.filter(l => l.status === 'menunggu');
  const getActiveLoans = () => loans.filter(l => ['dipinjam', 'terlambat'].includes(l.status));

  const createLoan = async (loan: Loan) => {
    try {
      console.log('📝 Creating loan:', loan.id);
      
      // Map camelCase to snake_case for DB
      const dbLoan = {
        id: loan.id,
        user_id: loan.userId,
        user_name: loan.userName,
        user_nim: loan.userNim,
        user_kelas: loan.userKelas,
        equipment_id: loan.equipmentId,
        equipment_name: loan.equipmentName,
        lab_id: loan.labId,
        lab_name: loan.labName,
        quantity: loan.quantity,
        borrow_date: loan.borrowDate,
        return_date: loan.returnDate,
        status: loan.status,
        notes: loan.notes,
        letter_url: loan.letterUrl || null,
        created_at: loan.createdAt
      };

      console.log('📤 Sending to Supabase:', dbLoan);

      const { data, error } = await supabase.from('loans').insert([dbLoan]).select();
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('✅ Loan created in database:', data);
      
      // Update local state immediately
      setLoans(prev => [loan, ...prev]);
      
      console.log('✅ Loan created successfully:', loan.id);
      return data;
    } catch (error: unknown) {
      console.error('❌ Failed to create loan:', error);
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const updateLoanStatus = React.useCallback(async (loanId: string, status: Loan['status'], additionalData?: Partial<Loan>) => {
    try {
      const dbUpdate: DbLoanUpdate = { status };
      if (additionalData?.actualReturnDate) dbUpdate.actual_return_date = additionalData.actualReturnDate;
      if (additionalData?.returnCondition) dbUpdate.return_condition = additionalData.returnCondition;
      if (additionalData?.returnNotes) dbUpdate.return_notes = additionalData.returnNotes;
      if (additionalData?.approvedBy) dbUpdate.approved_by = additionalData.approvedBy;
      if (additionalData?.approvedAt) dbUpdate.approved_at = additionalData.approvedAt;

      const { error } = await supabase.from('loans').update(dbUpdate).eq('id', loanId);
      if (error) {
        console.error('Error updating loan:', error);
        throw error;
      }

      // Update local state immediately
      setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status, ...additionalData } : l));

      console.log('Loan updated successfully:', loanId);
    } catch (error) {
      console.error('Failed to update loan:', error);
      toast.error('Gagal mengupdate peminjaman');
      throw error;
    }
  }, []);

  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase.from('equipment').delete().eq('id', id);
      if (error) {
        console.error('Error deleting equipment:', error);
        throw error;
      }
      setEquipment(prev => prev.filter(e => e.id !== id));
      console.log('Equipment deleted successfully:', id);
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      toast.error('Gagal menghapus alat');
      throw error;
    }
  };

  const createEquipment = async (equipmentData: Equipment) => {
    try {
      const dbEquipment = {
        id: equipmentData.id,
        name: equipmentData.name,
        description: equipmentData.description,
        lab_id: equipmentData.labId,
        total_stock: equipmentData.totalStock,
        available_stock: equipmentData.availableStock,
        condition: equipmentData.condition,
        status: equipmentData.status,
        image: equipmentData.image || null,
        category: equipmentData.category,
        specifications: equipmentData.specifications || null,
        created_at: equipmentData.createdAt,
        updated_at: equipmentData.updatedAt || equipmentData.createdAt
      };

      const { data, error } = await supabase
        .from('equipment')
        .insert([dbEquipment])
        .select()
        .single();

      if (error) {
        console.error('Error creating equipment:', error);
        throw error;
      }

      const createdEquipment = data ? mapEquipmentFromDb(data as DbEquipment) : equipmentData;
      setEquipment(prev => [...prev.filter(e => e.id !== createdEquipment.id), createdEquipment]);
      console.log('Equipment created successfully:', createdEquipment.id);
    } catch (error) {
      console.error('Failed to create equipment:', error);
      toast.error('Gagal menambahkan alat');
      throw error;
    }
  };

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    try {
      const dbUpdate: DbEquipmentUpdate = {};
      if (data.name !== undefined) dbUpdate.name = data.name;
      if (data.description !== undefined) dbUpdate.description = data.description;
      if (data.condition !== undefined) dbUpdate.condition = data.condition;
      if (data.status !== undefined) dbUpdate.status = data.status;
      if (data.image !== undefined) dbUpdate.image = data.image;
      if (data.category !== undefined) dbUpdate.category = data.category;
      if (data.specifications !== undefined) dbUpdate.specifications = data.specifications;
      if (data.availableStock !== undefined) dbUpdate.available_stock = data.availableStock;
      if (data.totalStock !== undefined) dbUpdate.total_stock = data.totalStock;
      if (data.labId !== undefined) dbUpdate.lab_id = data.labId;

      const { error } = await supabase.from('equipment').update(dbUpdate).eq('id', id);
      if (error) {
        console.error('Error updating equipment:', error);
        throw error;
      }

      setEquipment(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
      console.log('Equipment updated successfully:', id);
    } catch (error) {
      console.error('Failed to update equipment:', error);
      toast.error('Gagal mengupdate alat');
      throw error;
    }
  };

  const addActivityLog = async (log: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    try {
      const newLog = {
        id: `log-${Date.now()}`,
        user_id: log.userId,
        user_name: log.userName,
        user_role: log.userRole,
        type: log.type,
        description: log.description,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('activity_logs').insert([newLog]);
      if (error) {
        console.error('Failed to save log:', error);
      }

      setActivityLogs(prev => [{
        id: newLog.id,
        userId: newLog.user_id,
        userName: newLog.user_name,
        userRole: newLog.user_role,
        type: newLog.type,
        description: newLog.description,
        createdAt: newLog.created_at
      }, ...prev]);
    } catch (error) {
      console.error('Error adding activity log:', error);
    }
  };

  const getUnreadCount = () => notifications.filter(n => !n.read && n.userId === currentUser?.id).length;

  const addNotification = React.useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const overdueCheckedRef = React.useRef<Set<string>>(new Set());
  useEffect(() => {
    const checkOverdueLoans = () => {
      const now = new Date();
      loans.forEach(loan => {
        if (loan.status === 'dipinjam' && new Date(loan.returnDate) < now && !overdueCheckedRef.current.has(loan.id)) {
          overdueCheckedRef.current.add(loan.id);
          updateLoanStatus(loan.id, 'terlambat');
          addNotification({
            userId: loan.userId,
            title: 'Alat Terlambat Dikembalikan',
            message: `${loan.equipmentName} sudah melewati batas waktu pengembalian. Segera kembalikan untuk menghindari sanksi.`,
            type: 'warning',
            read: false
          });
        }
      });
    };

    const interval = setInterval(checkOverdueLoans, 60000);
    checkOverdueLoans();
    return () => clearInterval(interval);
  }, [loans, updateLoanStatus, addNotification]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <StoreContext.Provider value={{
      currentUser, laboratories, equipment, loans, activityLogs, notifications, isLoading, users,
      login, register, logout, 
      getAllUsers, createUser, updateUser, deleteUser,
      getEquipment, getLab, getLoansByUser, getPendingLoans, getActiveLoans, getUnreadCount,
      createLoan, createEquipment, updateLoanStatus, deleteEquipment, updateEquipment, addActivityLog,
      addNotification, markNotificationAsRead
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
