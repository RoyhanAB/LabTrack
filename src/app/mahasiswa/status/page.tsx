'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { Package, Clock, CheckCircle2, XCircle, AlertTriangle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

export default function StatusPeminjamanPage() {
  const { getLoansByUser, currentUser, isLoading } = useStore();
  
  if (isLoading) {
    return (
      <DashboardLayout role="mahasiswa">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!currentUser) return null;

  const myLoans = getLoansByUser(currentUser.id).filter(l => ['menunggu', 'disetujui', 'dipinjam', 'terlambat'].includes(l.status));
  
  // Sort by date desc
  myLoans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DashboardLayout role="mahasiswa">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Status Peminjaman</h1>
        <p className="text-slate-600 mt-1">Pantau status pengajuan dan alat yang sedang Anda pinjam.</p>
      </div>

      {myLoans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center animate-fade-in-up stagger-2">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-navy-800 mb-2">Tidak ada status peminjaman</h3>
          <p className="text-slate-600 mb-6">Anda tidak memiliki pengajuan yang sedang diproses atau alat yang sedang dipinjam.</p>
          <Link href="/mahasiswa/inventaris" className="inline-flex px-6 py-3 rounded-xl bg-accent-cyan text-white font-bold hover:bg-accent-cyan-dark transition-colors">
            Cari Alat
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myLoans.map((loan, i) => {
            const isLate = loan.status === 'terlambat';
            const isActive = loan.status === 'dipinjam';
            const returnDate = new Date(loan.returnDate);
            const today = new Date();
            const daysLeft = differenceInDays(returnDate, today);
            const isNearDeadline = isActive && daysLeft <= 1 && daysLeft >= 0;

            // Status Config
            let statusConfig = { icon: Clock, color: 'text-warning', bg: 'bg-warning-light', border: 'border-warning/20', text: 'Menunggu Persetujuan' };
            if (loan.status === 'disetujui') statusConfig = { icon: CheckCircle2, color: 'text-success', bg: 'bg-success-light', border: 'border-success/20', text: 'Disetujui - Segera Ambil' };
            if (loan.status === 'dipinjam') statusConfig = { icon: Package, color: 'text-info', bg: 'bg-info-light', border: 'border-info/20', text: 'Sedang Dipinjam' };
            if (loan.status === 'ditolak') statusConfig = { icon: XCircle, color: 'text-danger', bg: 'bg-danger-light', border: 'border-danger/20', text: 'Ditolak' };
            if (loan.status === 'terlambat') statusConfig = { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger-light', border: 'border-danger/20', text: 'Terlambat Dikembalikan' };

            return (
              <div key={loan.id} className={`bg-white rounded-2xl border ${isLate ? 'border-red-200 shadow-md shadow-red-50' : 'border-gray-100 shadow-sm'} overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`px-6 py-4 border-b ${isLate ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-100'} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.bg}`}>
                      <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
                    </div>
                    <span className={`font-bold ${statusConfig.color}`}>{statusConfig.text}</span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">ID: {loan.id.toUpperCase()}</div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-navy-800 mb-1">{loan.equipmentName}</h3>
                      <div className="text-sm text-slate-600 flex items-center gap-2 mb-4">
                        <span>{loan.quantity} Unit</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{loan.labName}</span>
                      </div>
                      
                      {loan.notes && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
                          <span className="font-semibold text-gray-700 block mb-1">Tujuan:</span>
                          {loan.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 lg:max-w-md lg:border-l lg:border-gray-100 lg:pl-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Tanggal Pinjam</div>
                          <div className="font-medium text-navy-800 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {format(new Date(loan.borrowDate), 'dd MMM yyyy', { locale: id })}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Tanggal Kembali</div>
                          <div className={`font-medium flex items-center gap-1.5 ${isLate || isNearDeadline ? 'text-danger font-bold' : 'text-navy-800'}`}>
                            <Calendar className={`w-3.5 h-3.5 ${isLate || isNearDeadline ? 'text-danger' : 'text-slate-500'}`} />
                            {format(returnDate, 'dd MMM yyyy', { locale: id })}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar (Only for active loans) */}
                      {(isActive || isLate) && (
                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-slate-600">Progress Peminjaman</span>
                            <span className={isLate ? 'text-danger font-bold' : isNearDeadline ? 'text-warning font-bold' : 'text-navy-700 font-medium'}>
                              {isLate ? `Terlambat ${Math.abs(daysLeft)} hari` : daysLeft === 0 ? 'Hari terakhir' : `${daysLeft} hari lagi`}
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className={`progress-bar-fill ${isLate ? 'danger' : isNearDeadline ? 'warning' : ''}`}
                              style={{ width: isLate ? '100%' : `${Math.min(100, Math.max(5, 100 - (daysLeft / 7 * 100)))}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
