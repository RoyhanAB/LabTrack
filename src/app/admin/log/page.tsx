'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { FileText, Search, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ActivityLogPage() {
  const { activityLogs } = useStore();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  const filteredLogs = activityLogs.filter(log => {
    const matchSearch = log.description.toLowerCase().includes(search.toLowerCase()) ||
                        log.userName.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRole === 'all' || log.userRole === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Activity Log</h1>
          <p className="text-slate-600 mt-1">Catatan seluruh aktivitas sistem LabTrack.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 animate-fade-in-up stagger-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau deskripsi aktivitas..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all" 
            />
          </div>
          <div className="w-full md:w-48 relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 appearance-none"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin / Asisten</option>
              <option value="mahasiswa">Mahasiswa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up stagger-3 p-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">Tidak ada log aktivitas ditemukan.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-4 lg:ml-8 space-y-8 py-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative pl-6 sm:pl-8">
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  log.userRole === 'admin' ? 'bg-accent-cyan' : 'bg-accent-orange'
                }`} />
                
                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:bg-white hover:border-gray-200 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-800">{log.userName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        log.userRole === 'admin' ? 'bg-cyan-50 text-cyan-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {log.userRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {log.description}
                  </p>
                  
                  <div className="mt-3 inline-block text-[10px] font-bold text-slate-500 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">
                    ACT: {log.type.replace('_', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
