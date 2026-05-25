'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Check, X, ClipboardList, Calendar, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function VerifikasiPage() {
  const { getPendingLoans, updateLoanStatus, currentUser, addActivityLog, getEquipment, updateEquipment, addNotification, loans, isLoading } = useStore();
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const pendingLoans = getPendingLoans().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const isMissingRpcFunction = (error: { code?: string; message?: string }) =>
    error.code === 'PGRST202' || /function .*not found|could not find.*function/i.test(error.message || '');
  
  const handleApprove = async (loanId: string, equipmentId: string, quantity: number, eqName: string, userName: string) => {
    if (processingLoanId) return;
    setProcessingLoanId(loanId);
    try {
      const eq = getEquipment(equipmentId);
      if (!eq) {
        toast.error('Alat tidak ditemukan');
        return;
      }

      if (eq.availableStock < quantity) {
        toast.error(`Stok ${eqName} tidak mencukupi`);
        return;
      }

      const loan = loans.find(l => l.id === loanId);
      if (!loan) {
        toast.error('Peminjaman tidak ditemukan');
        return;
      }
      if (loan.status !== 'menunggu') {
        toast.error('Peminjaman ini sudah diproses');
        return;
      }

      const approvedAt = new Date().toISOString();
      const { error: rpcError } = await supabase.rpc('approve_loan_transaction', {
        p_loan_id: loanId,
        p_equipment_id: equipmentId,
        p_quantity: quantity,
        p_approved_by: currentUser!.name,
        p_approved_at: approvedAt
      });

      if (rpcError) {
        if (!isMissingRpcFunction(rpcError)) {
          throw rpcError;
        }

        await updateEquipment(equipmentId, {
          availableStock: eq.availableStock - quantity,
          status: eq.availableStock - quantity === 0 ? 'dipinjam' : 'tersedia'
        });
        await updateLoanStatus(loanId, 'dipinjam', {
          approvedBy: currentUser!.name,
          approvedAt
        });
      }
      
      // Add notification for student
      addNotification({
        userId: loan.userId,
        title: 'Peminjaman Disetujui',
        message: `Peminjaman ${eqName} Anda telah disetujui. Silakan ambil alat di laboratorium ${loan.labName}.`,
        type: 'success',
        read: false
      });
      
      addActivityLog({
        userId: currentUser!.id,
        userName: currentUser!.name,
        userRole: currentUser!.role,
        type: 'approve',
        description: `Menyetujui peminjaman ${eqName} (${quantity} unit) oleh ${userName}`
      });

      toast.success('Peminjaman disetujui');
    } catch (error) {
      console.error('Error approving loan:', error);
      toast.error('Gagal menyetujui peminjaman');
    } finally {
      setProcessingLoanId(null);
    }
  };

  const handleReject = async (loanId: string, eqName: string, userName: string) => {
    if (processingLoanId) return;
    setProcessingLoanId(loanId);
    try {
      const loan = loans.find(l => l.id === loanId);
      if (!loan) {
        toast.error('Peminjaman tidak ditemukan');
        return;
      }
      if (loan.status !== 'menunggu') {
        toast.error('Peminjaman ini sudah diproses');
        return;
      }

      await updateLoanStatus(loanId, 'ditolak', { 
        approvedBy: currentUser!.name, 
        approvedAt: new Date().toISOString() 
      });
      
      // Add notification for student
      addNotification({
        userId: loan.userId,
        title: 'Peminjaman Ditolak',
        message: `Peminjaman ${eqName} Anda ditolak. Silakan hubungi asisten lab untuk informasi lebih lanjut.`,
        type: 'danger',
        read: false
      });
      
      addActivityLog({
        userId: currentUser!.id,
        userName: currentUser!.name,
        userRole: currentUser!.role,
        type: 'reject',
        description: `Menolak peminjaman ${eqName} oleh ${userName}`
      });

      toast.success('Peminjaman ditolak');
    } catch (error) {
      console.error('Error rejecting loan:', error);
      toast.error('Gagal menolak peminjaman');
    } finally {
      setProcessingLoanId(null);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Verifikasi Peminjaman</h1>
        <p className="text-slate-600 mt-1">Tinjau dan setujui pengajuan peminjaman alat laboratorium.</p>
      </div>

      {pendingLoans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center animate-fade-in-up stagger-2">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-navy-800 mb-2">Semua Beres!</h3>
          <p className="text-slate-600">Tidak ada pengajuan peminjaman baru yang perlu diverifikasi.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {pendingLoans.map((loan, i) => (
            <div key={loan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-navy-800 mb-1">{loan.equipmentName}</h3>
                    <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                      <span>{loan.quantity} Unit</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{loan.labName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-1">Diajukan pada</div>
                    <div className="text-sm font-bold text-navy-800">
                      {format(new Date(loan.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </div>
                  </div>
                </div>

                <div className="bg-navy-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-navy-100">
                    <div className="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold text-sm">
                      {loan.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-navy-800">{loan.userName}</div>
                      <div className="text-xs text-navy-600">{loan.userNim} - {loan.userKelas}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-navy-500 mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Tanggal Pinjam</div>
                      <div className="text-sm font-bold text-navy-800">{format(new Date(loan.borrowDate), 'dd MMM yyyy', { locale: id })}</div>
                    </div>
                    <div>
                      <div className="text-xs text-navy-500 mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Tanggal Kembali</div>
                      <div className="text-sm font-bold text-navy-800">{format(new Date(loan.returnDate), 'dd MMM yyyy', { locale: id })}</div>
                    </div>
                  </div>
                </div>

                {loan.notes && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Tujuan Peminjaman</div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{loan.notes}</p>
                  </div>
                )}

                <button 
                  onClick={() => toast('Mendownload surat peminjaman (Simulasi)', { icon: '📄' })}
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent-cyan hover:text-accent-cyan-dark"
                >
                  <FileText className="w-4 h-4" />
                  Lihat Surat Pengajuan.pdf
                  <Download className="w-3 h-3 ml-1" />
                </button>
              </div>

              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => handleReject(loan.id, loan.equipmentName, loan.userName)}
                  disabled={Boolean(processingLoanId)}
                  className="flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-danger bg-white border border-red-200 font-bold hover:bg-danger-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processingLoanId === loan.id ? <span className="w-5 h-5 border-2 border-danger/30 border-t-danger rounded-full animate-spin" /> : <X className="w-5 h-5" />} Tolak
                </button>
                <button 
                  onClick={() => handleApprove(loan.id, loan.equipmentId, loan.quantity, loan.equipmentName, loan.userName)}
                  disabled={Boolean(processingLoanId)}
                  className="flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-white bg-success font-bold hover:bg-success/90 shadow-md shadow-success/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processingLoanId === loan.id ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />} Setujui
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
