'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { Package, AlertTriangle, CheckCircle, ArrowRight, Activity, Calendar, PackageSearch, History } from 'lucide-react';
import Link from 'next/link';

export default function MahasiswaDashboard() {
  const { equipment, getLoansByUser, currentUser, isLoading } = useStore();
  
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

  const myLoans = getLoansByUser(currentUser.id);
  const activeLoans = myLoans.filter(l => ['dipinjam', 'menunggu', 'terlambat'].includes(l.status));
  const lateLoans = myLoans.filter(l => l.status === 'terlambat');
  
  const availableEqCount = equipment.reduce((sum, eq) => sum + eq.availableStock, 0);

  return (
    <DashboardLayout role="mahasiswa">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Dashboard</h1>
        <p className="text-slate-600 mt-1">Selamat datang kembali, {currentUser.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          { label: 'Alat Tersedia', value: availableEqCount, icon: Package, color: 'text-accent-cyan', bg: 'bg-cyan-50' },
          { label: 'Peminjaman Aktif', value: activeLoans.length, icon: Activity, color: 'text-info', bg: 'bg-blue-50' },
          { label: 'Terlambat', value: lateLoans.length, icon: AlertTriangle, color: 'text-danger', bg: 'bg-red-50' },
          { label: 'Selesai', value: myLoans.filter(l => l.status === 'dikembalikan').length, icon: CheckCircle, color: 'text-success', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">{stat.value}</div>
              <div className="text-sm font-medium text-slate-600 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Loans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-navy-800 font-[family-name:var(--font-heading)]">Peminjaman Aktif</h2>
              <Link href="/mahasiswa/status" className="text-sm font-medium text-accent-cyan hover:text-accent-cyan-dark flex items-center gap-1">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {activeLoans.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-xl">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-navy-800 font-bold mb-1">Tidak ada peminjaman aktif</h3>
                <p className="text-sm text-slate-600 mb-4">Anda belum meminjam alat apapun saat ini.</p>
                <Link href="/mahasiswa/inventaris" className="inline-flex px-4 py-2 rounded-lg bg-navy-800 text-white text-sm font-medium hover:bg-navy-700 transition-colors">
                  Cari Alat
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeLoans.slice(0, 3).map(loan => (
                  <div key={loan.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-accent-cyan/30 hover:bg-cyan-50/30 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-navy-500" />
                      </div>
                      <div>
                        <div className="font-bold text-navy-800">{loan.equipmentName}</div>
                        <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">
                          <span>{loan.quantity} Unit</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{loan.labName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="text-sm text-slate-600 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(loan.returnDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className={`badge ${
                        loan.status === 'dipinjam' ? 'badge-info' : 
                        loan.status === 'menunggu' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {loan.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Reminders */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white shadow-lg animate-fade-in-up stagger-5">
            <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)]">Aksi Cepat</h2>
            <div className="space-y-3">
              <Link href="/mahasiswa/inventaris" className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <PackageSearch className="w-5 h-5 text-accent-cyan" />
                  <span className="font-medium">Pinjam Alat Baru</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link href="/mahasiswa/riwayat" className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-accent-orange" />
                  <span className="font-medium">Lihat Riwayat</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {lateLoans.length > 0 && (
            <div className="bg-danger-light rounded-2xl p-6 border border-red-200 animate-fade-in-up stagger-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Perhatian!</h3>
                  <p className="text-sm text-red-800 mb-3">Anda memiliki {lateLoans.length} alat yang melewati batas waktu pengembalian. Segera kembalikan untuk menghindari sanksi.</p>
                  <Link href="/mahasiswa/status" className="text-sm font-bold text-danger hover:underline">
                    Lihat detail alat
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
