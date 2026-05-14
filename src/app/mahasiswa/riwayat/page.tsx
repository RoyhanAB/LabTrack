'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { History, Search, Filter, Calendar as CalendarIcon, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function RiwayatPage() {
  const { getLoansByUser, currentUser, isLoading } = useStore();
  const [search, setSearch] = useState('');
  
  if (!currentUser) return null;

  if (isLoading) {
    return (
      <DashboardLayout role="mahasiswa">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const historyLoans = getLoansByUser(currentUser.id)
    .filter(l => ['dikembalikan', 'ditolak'].includes(l.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredHistory = historyLoans.filter(l => 
    l.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
    l.labName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="mahasiswa">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Riwayat Peminjaman</h1>
          <p className="text-gray-500 mt-1">Rekam jejak peminjaman alat laboratorium Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 animate-fade-in-up stagger-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama alat atau laboratorium..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all" 
          />
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center animate-fade-in-up stagger-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-navy-800 mb-2">Tidak ada riwayat</h3>
          <p className="text-gray-500">Belum ada riwayat peminjaman yang selesai atau ditolak.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up stagger-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-4 px-6 text-sm font-semibold text-navy-700 whitespace-nowrap">Alat & Lab</th>
                  <th className="py-4 px-6 text-sm font-semibold text-navy-700 whitespace-nowrap">Waktu Pinjam</th>
                  <th className="py-4 px-6 text-sm font-semibold text-navy-700 whitespace-nowrap">Waktu Kembali</th>
                  <th className="py-4 px-6 text-sm font-semibold text-navy-700 whitespace-nowrap">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-navy-700 whitespace-nowrap text-right">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-800">{loan.equipmentName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{loan.quantity} Unit</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{loan.labName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-sm text-navy-800 font-medium whitespace-nowrap">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        {format(new Date(loan.borrowDate), 'dd MMM yyyy', { locale: id })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {loan.actualReturnDate ? (
                        <div className="flex items-center gap-1.5 text-sm text-navy-800 font-medium whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          {format(new Date(loan.actualReturnDate), 'dd MMM yyyy', { locale: id })}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${loan.status === 'dikembalikan' ? 'badge-success' : 'badge-danger'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {loan.returnCondition ? (
                        <div className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                          <FileText className="w-4 h-4 text-gray-500" />
                          {loan.returnCondition}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
