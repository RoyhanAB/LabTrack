'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { Package, ClipboardList, AlertTriangle, Activity, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { equipment, loans, activityLogs, currentUser, isLoading } = useStore();
  
  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!currentUser) return null;

  const totalEq = equipment.reduce((sum, eq) => sum + eq.totalStock, 0);
  const activeLoans = loans.filter(l => ['dipinjam', 'terlambat'].includes(l.status));
  const lateLoans = loans.filter(l => l.status === 'terlambat');
  const pendingLoans = loans.filter(l => l.status === 'menunggu');

  return (
    <DashboardLayout role="admin">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas laboratorium dan status inventaris.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[
          { label: 'Total Alat', value: totalEq, icon: Package, color: 'text-navy-600', bg: 'bg-navy-50' },
          { label: 'Peminjaman Aktif', value: activeLoans.length, icon: Activity, color: 'text-info', bg: 'bg-blue-50' },
          { label: 'Menunggu Verifikasi', value: pendingLoans.length, icon: ClipboardList, color: 'text-warning', bg: 'bg-warning-light' },
          { label: 'Terlambat', value: lateLoans.length, icon: AlertTriangle, color: 'text-danger', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-navy-800 font-[family-name:var(--font-heading)]">Aktivitas Terbaru</h2>
            <Link href="/admin/log" className="text-sm font-medium text-accent-cyan hover:text-accent-cyan-dark flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {activityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-navy-700">{log.userName.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm text-gray-800 mb-1">
                    <span className="font-bold text-navy-800">{log.userName}</span>{' '}
                    {log.description}
                  </div>
                  <div className="text-xs font-medium text-gray-400">
                    {new Date(log.createdAt).toLocaleString('id-ID', { 
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 text-white shadow-lg animate-fade-in-up stagger-5">
            <h2 className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)]">Menu Cepat</h2>
            <div className="space-y-3">
              <Link href="/admin/verifikasi" className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-warning" />
                  <span className="font-medium">Verifikasi Peminjaman</span>
                </div>
                <div className="flex items-center gap-2">
                  {pendingLoans.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-warning text-warning-900 text-xs font-bold">
                      {pendingLoans.length}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
              <Link href="/admin/inventaris" className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-accent-cyan" />
                  <span className="font-medium">Kelola Alat</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          {lateLoans.length > 0 && (
            <div className="bg-danger-light rounded-2xl p-6 border border-red-200 animate-fade-in-up stagger-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 mb-1">Peringatan Keterlambatan</h3>
                  <p className="text-sm text-red-800 mb-3">Terdapat {lateLoans.length} alat yang terlambat dikembalikan oleh mahasiswa.</p>
                  <Link href="/admin/monitoring" className="text-sm font-bold text-danger hover:underline">
                    Tindak Lanjuti
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
