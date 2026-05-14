'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { History, Search, ArrowRightLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function PengembalianPage() {
  const { getActiveLoans, updateLoanStatus, currentUser, addActivityLog, getEquipment, updateEquipment, isLoading } = useStore();
  const [search, setSearch] = useState('');
  
  const activeLoans = getActiveLoans().sort((a, b) => new Date(a.borrowDate).getTime() - new Date(b.borrowDate).getTime());
  
  const filteredLoans = activeLoans.filter(l => 
    l.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleReturn = async (loanId: string, equipmentId: string, quantity: number, eqName: string, userName: string) => {
    if (!confirm(`Konfirmasi pengembalian ${eqName} dari ${userName}?`)) return;

    const condition = prompt(`Masukkan kondisi alat saat dikembalikan (Contoh: Baik, Rusak, Hilang 1 unit):`, 'Baik');
    if (condition === null) return; // Cancelled

    try {
      const eq = getEquipment(equipmentId);
      if (eq) {
        await updateEquipment(equipmentId, { 
          availableStock: eq.availableStock + quantity,
          status: 'tersedia'
        });
      }

      await updateLoanStatus(loanId, 'dikembalikan', { 
        actualReturnDate: new Date().toISOString(),
        returnCondition: condition,
        returnNotes: `Diterima oleh ${currentUser!.name}`
      });
      
      addActivityLog({
        userId: currentUser!.id,
        userName: currentUser!.name,
        userRole: 'admin',
        type: 'pengembalian',
        description: `Menerima pengembalian ${eqName} (${quantity} unit) dari ${userName}. Kondisi: ${condition}`
      });

      toast.success('Pengembalian berhasil diproses');
    } catch (error) {
      console.error('Error processing return:', error);
      toast.error('Gagal memproses pengembalian');
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Pengembalian Alat</h1>
          <p className="text-gray-500 mt-1">Proses pengembalian alat dan catat kondisi alat setelah dipinjam.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 animate-fade-in-up stagger-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari ID peminjaman, nama alat, atau nama mahasiswa..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all" 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up stagger-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-semibold text-navy-700 whitespace-nowrap">ID Peminjaman</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Peminjam</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Alat</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Tenggat Waktu</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Memuat data peminjaman...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    Tidak ada peminjaman aktif yang cocok dengan pencarian
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const isLate = loan.status === 'terlambat';
                  return (
                    <tr key={loan.id} className={`hover:bg-gray-50/50 transition-colors ${isLate ? 'bg-red-50/30' : ''}`}>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm font-bold text-gray-600">{loan.id.toUpperCase()}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-navy-800">{loan.userName}</div>
                        <div className="text-xs text-gray-500">{loan.userKelas}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-navy-800">{loan.equipmentName}</div>
                        <div className="text-xs text-gray-500">{loan.quantity} Unit • {loan.labName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ${isLate ? 'text-danger' : 'text-navy-800'}`}>
                          <Calendar className={`w-4 h-4 ${isLate ? 'text-danger' : 'text-gray-400'}`} />
                          {format(new Date(loan.returnDate), 'dd MMM yyyy', { locale: id })}
                        </div>
                        {isLate && <div className="text-xs font-bold text-danger mt-1">Terlambat</div>}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end">
                          <button 
                            onClick={() => handleReturn(loan.id, loan.equipmentId, loan.quantity, loan.equipmentName, loan.userName)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 text-white text-sm font-bold hover:bg-navy-700 shadow-sm transition-colors"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                            Proses Kembali
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
