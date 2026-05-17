'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { Activity, Download, Search, Calendar as CalendarIcon, User, Package, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function MonitoringPage() {
  const { loans, currentUser, isLoading } = useStore();
  const [search, setSearch] = useState('');
  
  // Sort all loans by date
  const allLoans = [...loans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const filteredLoans = allLoans.filter(l => 
    l.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.labName.toLowerCase().includes(search.toLowerCase()) ||
    l.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = (type: 'pdf' | 'excel') => {
    // Prepare data for export
    const exportData = filteredLoans.map(loan => ({
      'ID Peminjaman': loan.id.toUpperCase(),
      'Tanggal Pengajuan': format(new Date(loan.createdAt), 'dd/MM/yyyy HH:mm', { locale: id }),
      'Nama Mahasiswa': loan.userName,
      'NIM': loan.userNim,
      'Kelas': loan.userKelas,
      'Nama Alat': loan.equipmentName,
      'Jumlah': loan.quantity,
      'Laboratorium': loan.labName,
      'Tanggal Pinjam': format(new Date(loan.borrowDate), 'dd/MM/yyyy', { locale: id }),
      'Tanggal Kembali': format(new Date(loan.returnDate), 'dd/MM/yyyy', { locale: id }),
      'Tanggal Dikembalikan': loan.actualReturnDate ? format(new Date(loan.actualReturnDate), 'dd/MM/yyyy', { locale: id }) : '-',
      'Status': loan.status.toUpperCase(),
      'Kondisi Kembali': loan.returnCondition || '-',
      'Catatan': loan.notes || '-'
    }));

    if (type === 'excel') {
      // Convert to CSV format
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(h => `"${row[h as keyof typeof row]}"`).join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Laporan_Peminjaman_${format(new Date(), 'ddMMyyyy_HHmmss')}.csv`;
      link.click();
      
      toast.success('Laporan Excel berhasil diunduh');
    } else {
      // For PDF, we'll create a simple HTML report and print it
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Laporan Peminjaman Alat Laboratorium</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #1a2332; text-align: center; margin-bottom: 10px; }
              .subtitle { text-align: center; color: #64748b; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #1a2332; color: white; font-weight: bold; }
              tr:nth-child(even) { background-color: #f8fafc; }
              .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 10px; }
              @media print {
                body { padding: 10px; }
                table { font-size: 9px; }
                th, td { padding: 5px; }
              }
            </style>
          </head>
          <body>
            <h1>LAPORAN PEMINJAMAN ALAT LABORATORIUM</h1>
            <div class="subtitle">Teknik Industri - Universitas Sultan Ageng Tirtayasa</div>
            <div class="subtitle">Dicetak pada: ${format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: id })} WIB</div>
            <table>
              <thead>
                <tr>
                  ${Object.keys(exportData[0] || {}).map(h => `<th>${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${exportData.map(row => `
                  <tr>
                    ${Object.values(row).map(v => `<td>${v}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="footer">
              <p>Total: ${exportData.length} peminjaman | Dicetak oleh: ${currentUser?.name}</p>
              <p>LabTrack © 2026 - Sistem Peminjaman Alat Laboratorium</p>
            </div>
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
      
      toast.success('Laporan PDF siap dicetak');
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Monitoring & Laporan</h1>
          <p className="text-gray-500 mt-1">Lacak seluruh aktivitas peminjaman dan export laporan data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExport('excel')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-danger-light text-danger font-bold hover:bg-red-100 transition-colors border border-red-200"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[
          { label: 'Total Peminjaman', value: loans.length, icon: Activity, bg: 'bg-blue-50', color: 'text-info' },
          { label: 'Peminjam Unik', value: new Set(loans.map(l => l.userId)).size, icon: User, bg: 'bg-purple-50', color: 'text-purple-600' },
          { label: 'Alat Paling Sering', value: (() => {
            if (loans.length === 0) return '-';
            const counts: Record<string, number> = {};
            loans.forEach(l => { counts[l.equipmentName] = (counts[l.equipmentName] || 0) + 1; });
            return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
          })(), icon: TrendingUp, bg: 'bg-orange-50', color: 'text-warning' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">{stat.value}</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 animate-fade-in-up stagger-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama, alat, lab, atau status..." 
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
                <th className="py-4 px-6 text-sm font-semibold text-navy-700 whitespace-nowrap">ID / Tanggal</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Peminjam</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Detail Alat</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Memuat data peminjaman...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    Tidak ada data yang cocok dengan pencarian
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs font-bold text-gray-500 mb-1">{loan.id.toUpperCase()}</div>
                      <div className="flex items-center gap-1.5 text-sm text-navy-800 font-medium whitespace-nowrap">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                        {format(new Date(loan.createdAt), 'dd MMM yy', { locale: id })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-800">{loan.userName}</div>
                      <div className="text-xs text-gray-500">{loan.userNim} - {loan.userKelas}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-800">{loan.equipmentName}</div>
                      <div className="text-xs text-gray-500">{loan.quantity} Unit • {loan.labName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${
                        loan.status === 'dikembalikan' ? 'badge-success' : 
                        ['dipinjam', 'disetujui'].includes(loan.status) ? 'badge-info' :
                        loan.status === 'menunggu' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
