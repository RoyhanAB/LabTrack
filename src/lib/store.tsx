'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Equipment, Loan, Laboratory, ActivityLog, Notification } from './types';
import { equipment as initialEquipment, laboratories as initialLaboratories, users as initialUsers } from './data';
import { supabase } from './supabase';
import toast from 'react-hot-toast';

interface StoreContextType {
  currentUser: User | null;
  laboratories: Laboratory[];
  equipment: Equipment[];
  loans: Loan[];
  activityLogs: ActivityLog[];
  isLoading: boolean;

  login: (email: string) => Promise<User | null>;
  logout: () => void;

  getEquipment: (id: string) => Equipment | undefined;
  getLab: (id: string) => Laboratory | undefined;
  getLoansByUser: (userId: string) => Loan[];
  getPendingLoans: () => Loan[];
  getActiveLoans: () => Loan[];
  getUnreadCount: () => number;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;

  createLoan: (loan: Loan) => Promise<any>;
  updateLoanStatus: (loanId: string, status: string, additionalData?: Partial<Loan>) => Promise<void>;
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
            // Validate that the stored user has a proper UUID format
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (parsed.id && uuidRegex.test(parsed.id)) {
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
          const mappedEq = eqRes.data.map(e => ({
            ...e,
            labId: e.lab_id,
            totalStock: e.total_stock,
            availableStock: e.available_stock
          }));
          setEquipment(mappedEq as Equipment[]);
        }
        if (loansRes.data) {
          // Map DB snake_case to camelCase
          const mappedLoans = loansRes.data.map(l => ({
            ...l,
            userId: l.user_id,
            userName: l.user_name,
            userNim: l.user_nim,
            userKelas: l.user_kelas,
            equipmentId: l.equipment_id,
            equipmentName: l.equipment_name,
            labId: l.lab_id,
            labName: l.lab_name,
            borrowDate: l.borrow_date,
            returnDate: l.return_date,
            actualReturnDate: l.actual_return_date,
            returnCondition: l.return_condition,
            returnNotes: l.return_notes,
            createdAt: l.created_at
          }));
          setLoans(mappedLoans as Loan[]);
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

    // Set up realtime subscriptions
    const loansSub = supabase.channel('loans_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loans' }, (payload) => {
        console.log('Loans change detected:', payload);
        // Re-fetch all data on change
        fetchData();
      }).subscribe();

    const eqSub = supabase.channel('equipment_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, (payload) => {
        console.log('Equipment change detected:', payload);
        fetchData();
      }).subscribe();

    return () => {
      supabase.removeChannel(loansSub);
      supabase.removeChannel(eqSub);
    };
  }, []);

  // Check for overdue loans every minute
  useEffect(() => {
    const checkOverdueLoans = () => {
      const now = new Date();
      loans.forEach(loan => {
        if (loan.status === 'dipinjam' && new Date(loan.returnDate) < now) {
          // Update loan status to overdue
          updateLoanStatus(loan.id, 'terlambat');

          // Add notification for student
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

    const interval = setInterval(checkOverdueLoans, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [loans]);

  const login = async (email: string): Promise<User | null> => {
    try {
      // Always try Supabase first to get UUID
      const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
      
      if (data) {
        console.log('✅ User logged in from Supabase:', data.id);
        // Map Supabase data to our User type
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          password: '', // Password not stored in Supabase public table
          role: data.role,
          nim: data.nim || undefined,
          kelas: data.kelas || undefined,
          createdAt: data.created_at || new Date().toISOString(),
        };
        setCurrentUser(user);
        localStorage.setItem('labtrack_user', JSON.stringify(user));
        return user;
      }
      
      if (error) {
        console.log('⚠️ User not found in Supabase, checking local data');
      }

      // Fallback to local users (but these should have UUID format now)
      const localUser = initialUsers.find((u: User) => u.email === email);
      if (localUser) {
        console.log('✅ User logged in from local data:', localUser.id);
        setCurrentUser(localUser);
        localStorage.setItem('labtrack_user', JSON.stringify(localUser));
        return localUser;
      }

      console.log('❌ User not found');
      return null;
    } catch (error) {
      console.error('❌ Login error:', error);
      return null;
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
  const getActiveLoans = () => loans.filter(l => ['dipinjam', 'terlambat', 'disetujui'].includes(l.status));

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
    } catch (error: any) {
      console.error('❌ Failed to create loan:', error);
      toast.error(error.message || 'Gagal membuat peminjaman');
      throw error;
    }
  };

  const updateLoanStatus = async (loanId: string, status: string, additionalData?: Partial<Loan>) => {
    try {
      const dbUpdate: any = { status };
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
      setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: status as any, ...additionalData } : l));

      console.log('Loan updated successfully:', loanId);
    } catch (error) {
      console.error('Failed to update loan:', error);
      toast.error('Gagal mengupdate peminjaman');
      throw error;
    }
  };

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

  const updateEquipment = async (id: string, data: Partial<Equipment>) => {
    try {
      const dbUpdate: any = { ...data };
      if (data.availableStock !== undefined) dbUpdate.available_stock = data.availableStock;
      if (data.totalStock !== undefined) dbUpdate.total_stock = data.totalStock;
      if (data.labId !== undefined) dbUpdate.lab_id = data.labId;

      // Remove camelCase keys
      delete dbUpdate.availableStock;
      delete dbUpdate.totalStock;
      delete dbUpdate.labId;
      delete dbUpdate.createdAt;
      delete dbUpdate.updatedAt;

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

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <StoreContext.Provider value={{
      currentUser, laboratories, equipment, loans, activityLogs, notifications, isLoading,
      login, logout, getEquipment, getLab, getLoansByUser, getPendingLoans, getActiveLoans, getUnreadCount,
      createLoan, updateLoanStatus, deleteEquipment, updateEquipment, addActivityLog,
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
