'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { Search, Plus, Edit2, Trash2, Package, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Equipment } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function ManajemenInventarisPage() {
  const { equipment, laboratories, deleteEquipment, currentUser, addActivityLog, isLoading, updateEquipment } = useStore();
  const [search, setSearch] = useState('');
  const [selectedLab, setSelectedLab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    labId: '',
    totalStock: 0,
    availableStock: 0,
    condition: 'Baik',
    status: 'tersedia' as 'tersedia' | 'dipinjam' | 'maintenance',
    category: '',
    specifications: '',
    image: ''
  });

  const filteredEquipment = equipment.filter(eq => {
    const matchSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || 
                        eq.category.toLowerCase().includes(search.toLowerCase());
    const matchLab = selectedLab === 'all' || eq.labId === selectedLab;
    return matchSearch && matchLab;
  });

  const openAddModal = () => {
    setEditingEquipment(null);
    setImageFile(null);
    setFormData({
      name: '',
      description: '',
      labId: laboratories[0]?.id || '',
      totalStock: 0,
      availableStock: 0,
      condition: 'Baik',
      status: 'tersedia',
      category: '',
      specifications: '',
      image: ''
    });
    setShowModal(true);
  };

  const openEditModal = (eq: Equipment) => {
    setEditingEquipment(eq);
    setImageFile(null);
    setFormData({
      name: eq.name,
      description: eq.description,
      labId: eq.labId,
      totalStock: eq.totalStock,
      availableStock: eq.availableStock,
      condition: eq.condition,
      status: eq.status,
      category: eq.category,
      specifications: eq.specifications || '',
      image: eq.image || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('equipment-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('equipment-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      if (editingEquipment) {
        // Update existing equipment
        const dbUpdate: any = {
          name: formData.name,
          description: formData.description,
          lab_id: formData.labId,
          total_stock: formData.totalStock,
          available_stock: formData.availableStock,
          condition: formData.condition,
          status: formData.status,
          category: formData.category,
          specifications: formData.specifications,
          image: imageUrl
        };

        const { error } = await supabase.from('equipment').update(dbUpdate).eq('id', editingEquipment.id);
        if (error) throw error;

        await updateEquipment(editingEquipment.id, {
          ...formData,
          image: imageUrl,
          updatedAt: new Date().toISOString()
        });

        addActivityLog({
          userId: currentUser!.id,
          userName: currentUser!.name,
          userRole: 'admin',
          type: 'edit_alat',
          description: `Mengubah data alat ${formData.name}`
        });

        toast.success('Alat berhasil diperbarui');
      } else {
        // Add new equipment
        const newId = `eq-${Date.now()}`;
        const newEquipment = {
          id: newId,
          name: formData.name,
          description: formData.description,
          lab_id: formData.labId,
          total_stock: formData.totalStock,
          available_stock: formData.availableStock,
          condition: formData.condition,
          status: formData.status,
          category: formData.category,
          specifications: formData.specifications,
          image: imageUrl,
          created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('equipment').insert([newEquipment]);
        if (error) throw error;

        addActivityLog({
          userId: currentUser!.id,
          userName: currentUser!.name,
          userRole: 'admin',
          type: 'tambah_alat',
          description: `Menambahkan alat baru: ${formData.name}`
        });

        toast.success('Alat berhasil ditambahkan');
      }

      setShowModal(false);
      // Data will auto-refresh via realtime subscription
    } catch (error: any) {
      console.error('Error saving equipment:', error);
      toast.error(`Gagal menyimpan: ${error.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      try {
        await deleteEquipment(id);
        addActivityLog({
          userId: currentUser!.id,
          userName: currentUser!.name,
          userRole: 'admin',
          type: 'hapus_alat',
          description: `Menghapus alat ${name} dari inventaris`
        });
        toast.success('Alat berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus alat');
      }
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">Manajemen Inventaris</h1>
          <p className="text-gray-500 mt-1">Kelola data alat laboratorium (Tambah, Edit, Hapus).</p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-cyan text-white font-bold hover:bg-accent-cyan-dark shadow-lg shadow-accent-cyan/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Tambah Alat
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-6 animate-fade-in-up stagger-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari alat..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all" 
            />
          </div>
          <div className="w-full md:w-64">
            <select 
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 appearance-none"
            >
              <option value="all">Semua Laboratorium</option>
              {laboratories.map(lab => (
                <option key={lab.id} value={lab.id}>{lab.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up stagger-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Info Alat</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Laboratorium</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700 text-center">Stok (Tersedia/Total)</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-navy-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Memuat data alat...
                  </td>
                </tr>
              ) : filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    Tidak ada alat ditemukan
                  </td>
                </tr>
              ) : (
                filteredEquipment.map((eq) => {
                  const lab = laboratories.find(l => l.id === eq.labId);
                  return (
                    <tr key={eq.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-navy-800">{eq.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{eq.category}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-bold text-navy-700">
                          {lab?.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-navy-50 border border-navy-100">
                          <span className="font-bold text-navy-800">{eq.availableStock}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-500 text-sm">{eq.totalStock}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select 
                          value={eq.status}
                          onChange={() => toast('Ubah status melalui form edit', { icon: 'ℹ️' })}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full appearance-none outline-none border-2 cursor-pointer ${
                            eq.status === 'tersedia' ? 'bg-success-light text-success-800 border-success/20' : 
                            eq.status === 'maintenance' ? 'bg-warning-light text-warning-800 border-warning/20' : 
                            'bg-info-light text-info-800 border-info/20'
                          }`}
                        >
                          <option value="tersedia">Tersedia</option>
                          <option value="dipinjam">Dipinjam</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(eq)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-info transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(eq.id, eq.name)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-danger transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modal Form Tambah/Edit Alat */}
      {showModal && (
        <div className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-xl font-bold text-navy-800 font-[family-name:var(--font-heading)]">
                {editingEquipment ? 'Edit Alat' : 'Tambah Alat Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Nama Alat *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Contoh: Stopwatch Digital"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Kategori *</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    placeholder="Contoh: Alat Ukur"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Laboratorium *</label>
                  <select 
                    value={formData.labId}
                    onChange={e => setFormData({...formData, labId: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none appearance-none"
                    required
                  >
                    {laboratories.map(lab => (
                      <option key={lab.id} value={lab.id}>{lab.name} - {lab.fullName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Total Stok *</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.totalStock}
                    onChange={e => setFormData({...formData, totalStock: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Stok Tersedia *</label>
                  <input 
                    type="number" 
                    min="0"
                    max={formData.totalStock}
                    value={formData.availableStock}
                    onChange={e => setFormData({...formData, availableStock: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Kondisi *</label>
                  <input 
                    type="text" 
                    value={formData.condition}
                    onChange={e => setFormData({...formData, condition: e.target.value})}
                    placeholder="Contoh: Baik, Rusak Ringan"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Status *</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none appearance-none"
                    required
                  >
                    <option value="tersedia">Tersedia</option>
                    <option value="dipinjam">Dipinjam</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Deskripsi *</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Deskripsi lengkap alat..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none resize-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Spesifikasi Teknis</label>
                  <textarea 
                    rows={3}
                    value={formData.specifications}
                    onChange={e => setFormData({...formData, specifications: e.target.value})}
                    placeholder="Contoh: Range: 0-150mm&#10;Resolusi: 0.01mm"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none resize-none font-mono text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Gambar Alat</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        // Optional: Show preview logic here if needed
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-cyan/10 file:text-accent-cyan hover:file:bg-accent-cyan/20 cursor-pointer"
                  />
                  {formData.image && !imageFile && (
                    <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span>Gambar saat ini tersimpan</span>
                    </div>
                  )}
                  {imageFile && (
                    <div className="mt-3 text-sm text-accent-cyan flex items-center gap-2 font-medium">
                      <span>✓ {imageFile.name} siap diunggah</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3 rounded-xl bg-accent-cyan text-white font-bold hover:bg-accent-cyan-dark shadow-lg shadow-accent-cyan/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingEquipment ? 'Simpan Perubahan' : 'Tambah Alat'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
