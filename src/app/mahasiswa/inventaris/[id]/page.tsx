'use client';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Package, Calendar, Info, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const parseQuantityInput = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export default function DetailAlatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getEquipment, getLab, currentUser, createLoan, addActivityLog, addNotification, isLoading } = useStore();
  
  const eq = getEquipment(resolvedParams.id);
  const lab = eq ? getLab(eq.labId) : null;
  
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [returnDate, setReturnDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmittingLoan, setIsSubmittingLoan] = useState(false);
  
  if (isLoading) {
    return (
      <DashboardLayout role="mahasiswa">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!eq || !lab || !currentUser) {
    return (
      <DashboardLayout role="mahasiswa">
        <div className="text-center py-20">Alat tidak ditemukan.</div>
      </DashboardLayout>
    );
  }

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingLoan) return;
    
    if (eq.status !== 'tersedia') {
      toast.error('Alat belum tersedia untuk dipinjam');
      return;
    }
    if (quantity < 1 || quantity > eq.availableStock) {
      toast.error('Jumlah tidak valid');
      return;
    }
    if (!returnDate) {
      toast.error('Tanggal kembali harus diisi');
      return;
    }
    const selectedReturnDate = new Date(`${returnDate}T23:59:59`);
    if (Number.isNaN(selectedReturnDate.getTime()) || selectedReturnDate < new Date()) {
      toast.error('Tanggal kembali tidak boleh lebih awal dari hari ini');
      return;
    }

    setIsSubmittingLoan(true);
    try {
      const loanId = `loan-${Date.now()}`;
      let letterUrl: string | undefined;

      // Upload surat peminjaman PDF to Supabase Storage if provided
      if (uploadedFile) {
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${loanId}-surat.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('equipment-images') // Reuse existing bucket
          .upload(`letters/${fileName}`, uploadedFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error('Gagal upload surat peminjaman');
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('equipment-images')
            .getPublicUrl(`letters/${fileName}`);
          letterUrl = publicUrl;
        }
      }
      
      // User ID should already be UUID from login
      const userUuid = currentUser.id;
      
      console.log('📝 Creating loan with user ID:', userUuid);
      
      await createLoan({
        id: loanId,
        userId: userUuid,
        userName: currentUser.name,
        userNim: currentUser.nim || '',
        userKelas: currentUser.kelas || '',
        equipmentId: eq.id,
        equipmentName: eq.name,
        labId: lab.id,
        labName: lab.name,
        quantity,
        borrowDate: new Date().toISOString(),
        returnDate: selectedReturnDate.toISOString(),
        status: 'menunggu',
        notes: purpose,
        letterUrl,
        createdAt: new Date().toISOString()
      });

      // Add notification for user
      addNotification({
        userId: userUuid,
        title: 'Pengajuan Dikirim',
        message: `Pengajuan peminjaman ${eq.name} berhasil dikirim. Menunggu persetujuan admin.`,
        type: 'info',
        read: false
      });

      addActivityLog({
        userId: userUuid,
        userName: currentUser.name,
        userRole: 'mahasiswa',
        type: 'peminjaman',
        description: `Mengajukan peminjaman ${eq.name} (${quantity} unit)`
      });

      toast.success('Pengajuan peminjaman berhasil dikirim!');
      
      // Wait a bit for data to sync
      setTimeout(() => {
        router.push('/mahasiswa/status');
      }, 500);
    } catch (error: unknown) {
      console.error('❌ Error creating loan:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal mengirim pengajuan. Silakan coba lagi.');
    } finally {
      setIsSubmittingLoan(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Hanya file PDF yang diperbolehkan');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setUploadedFile(file);
      toast.success(`File ${file.name} siap diupload`);
    }
  };

  return (
    <DashboardLayout role="mahasiswa">
      <Link href="/mahasiswa/inventaris" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-800 mb-6 transition-colors animate-fade-in">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Inventaris
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-fade-in-up">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Image Box */}
              <div className="w-full sm:w-1/3 aspect-square rounded-2xl bg-navy-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                {eq.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-20 h-20 text-navy-200" />
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`badge ${
                    eq.status === 'tersedia' ? 'badge-success' : 
                    eq.status === 'maintenance' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {eq.status}
                  </span>
                  <span className="text-xs font-bold text-accent-cyan bg-cyan-50 px-2.5 py-1 rounded-md">
                    {eq.category}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 mb-2 font-[family-name:var(--font-heading)]">{eq.name}</h1>
                <p className="text-sm text-gray-500 font-medium mb-6">{lab.fullName}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Stok Tersedia</div>
                    <div className="text-2xl font-bold text-navy-800 font-[family-name:var(--font-heading)]">{eq.availableStock} <span className="text-sm font-medium text-gray-400">/ {eq.totalStock}</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Kondisi</div>
                    <div className="text-lg font-bold text-navy-800 mt-1">{eq.condition}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-navy-800 mb-4 font-[family-name:var(--font-heading)]">Deskripsi Alat</h3>
              <p className="text-gray-600 leading-relaxed">{eq.description}</p>
              
              {eq.specifications && (
                <>
                  <h3 className="text-lg font-bold text-navy-800 mt-8 mb-4 font-[family-name:var(--font-heading)]">Spesifikasi Teknis</h3>
                  <div className="p-4 rounded-xl bg-navy-50 text-navy-800 text-sm font-mono whitespace-pre-wrap">
                    {eq.specifications}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Action / Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-navy-900/5 animate-fade-in-up stagger-2 sticky top-24">
            {!isBorrowing ? (
              <>
                <h3 className="text-xl font-bold text-navy-800 mb-6 font-[family-name:var(--font-heading)]">Ajukan Peminjaman</h3>
                
                {eq.availableStock > 0 && eq.status === 'tersedia' ? (
                  <>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6">
                      <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">
                        Pastikan Anda telah membaca syarat dan ketentuan peminjaman di laboratorium {lab.name}.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setIsBorrowing(true)}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 text-white font-bold text-base hover:from-navy-900 hover:to-navy-800 shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      Mulai Pengajuan
                    </button>
                  </>
                ) : (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                    <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900">
                      Maaf, stok alat ini sedang kosong atau dipinjam. Silakan cek kembali nanti.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleBorrow} className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-navy-800 font-[family-name:var(--font-heading)]">Form Peminjaman</h3>
                  <button type="button" onClick={() => setIsBorrowing(false)} className="text-sm text-gray-500 hover:text-navy-800 font-medium">Batal</button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Jumlah (Maks {eq.availableStock})</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={eq.availableStock}
                    value={quantity}
                    onChange={e => setQuantity(Math.min(Math.max(parseQuantityInput(e.target.value), 1), eq.availableStock))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Tanggal Kembali</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Tujuan Peminjaman</label>
                  <textarea 
                    rows={3}
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    placeholder="Contoh: Praktikum Ergonomi Modul 1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan outline-none resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Surat Peminjaman (Opsional)</label>
                  <input 
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="block border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-accent-cyan transition-colors" />
                    {uploadedFile ? (
                      <div>
                        <span className="text-sm text-accent-cyan font-medium block">{uploadedFile.name}</span>
                        <span className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">Klik untuk upload PDF (Maks 5MB)</span>
                    )}
                  </label>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isSubmittingLoan} className="w-full py-3.5 rounded-xl bg-accent-cyan text-white font-bold text-sm hover:bg-accent-cyan-dark shadow-lg shadow-accent-cyan/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmittingLoan ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {isSubmittingLoan ? 'Mengirim...' : 'Kirim Pengajuan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
