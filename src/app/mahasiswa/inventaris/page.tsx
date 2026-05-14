'use client';
import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { Search, Filter, Package, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InventarisPage() {
  const { equipment, laboratories, isLoading } = useStore();
  const [search, setSearch] = useState('');
  const [selectedLab, setSelectedLab] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredEquipment = useMemo(() => {
    if (isLoading) return [];
    return equipment.filter(eq => {
      const matchSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || 
                          eq.category.toLowerCase().includes(search.toLowerCase());
      const matchLab = selectedLab === 'all' || eq.labId === selectedLab;
      const matchStatus = selectedStatus === 'all' || eq.status === selectedStatus;
      
      return matchSearch && matchLab && matchStatus;
    });
  }, [equipment, search, selectedLab, selectedStatus]);

  return (
    <DashboardLayout role="mahasiswa">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Inventaris Alat</h1>
          <p className="text-gray-500 mt-1">Cari dan pilih alat laboratorium yang ingin Anda pinjam.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-8 animate-fade-in-up stagger-2">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama alat atau kategori..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all" 
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:w-1/2">
            <div className="flex-1">
              <select 
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan appearance-none"
              >
                <option value="all">Semua Laboratorium</option>
                {laboratories.map(lab => (
                  <option key={lab.id} value={lab.id}>{lab.name} - {lab.fullName}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan appearance-none"
              >
                <option value="all">Semua Status</option>
                <option value="tersedia">Tersedia</option>
                <option value="dipinjam">Dipinjam / Habis</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center animate-fade-in-up stagger-3 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Memuat data alat...</p>
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center animate-fade-in-up stagger-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-800 mb-2">Alat tidak ditemukan</h3>
          <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-4 animate-fade-in-up stagger-3">
          {filteredEquipment.map(eq => {
            const lab = laboratories.find(l => l.id === eq.labId);
            return (
              <div key={eq.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-accent-cyan/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                {/* Simulated Image Box */}
                <div className="h-48 bg-navy-50 relative flex items-center justify-center overflow-hidden">
                  {eq.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={eq.image} alt={eq.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package className="w-16 h-16 text-navy-200" />
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`badge shadow-sm ${
                      eq.status === 'tersedia' ? 'badge-success' : 
                      eq.status === 'maintenance' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {eq.status}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-bold text-navy-800 shadow-sm">
                      {lab?.name}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-navy-800 leading-tight">{eq.name}</h3>
                  </div>
                  <div className="text-xs font-medium text-accent-cyan bg-cyan-50 px-2.5 py-1 rounded-md self-start mb-3">
                    {eq.category}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {eq.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-0.5">Stok Tersedia</span>
                      <span className="font-bold text-navy-800">{eq.availableStock} / {eq.totalStock} Unit</span>
                    </div>
                    <Link 
                      href={`/mahasiswa/inventaris/${eq.id}`}
                      className="w-10 h-10 rounded-full bg-navy-50 text-navy-700 flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
                    </Link>
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
