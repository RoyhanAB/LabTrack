'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle2, XCircle, Hash, ChevronRight, Users, GraduationCap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { validateNIMTeknikIndustri, validatePasswordStrength } from '@/lib/auth';
import { Logo, PulseDot, DISPLAY, BODY, MONO } from '@/components/landing/shared';
import toast from 'react-hot-toast';

const gridBg = {
  backgroundColor: '#1E3A8A',
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(180deg,#0F172A 0%,#1E40AF 100%)',
  backgroundSize: '48px 48px,48px 48px,auto'
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useStore();
  const [formData, setFormData] = useState({ name:'', email:'', nim:'', kelas:'', password:'', confirmPassword:'' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const nimInfo = useMemo(() => {
    if (formData.nim.length < 4 || !/^\d+$/.test(formData.nim)) return null;
    const f = formData.nim.substring(0,2), p = formData.nim.substring(2,4);
    const a = formData.nim.length >= 6 ? formData.nim.substring(4,6) : null;
    const n = formData.nim.length >= 7 ? formData.nim.substring(6) : null;
    return {
      fakultas: { code:f, valid:f==='33', label:f==='33'?'Fakultas Teknik':'Bukan F. Teknik' },
      prodi: { code:p, valid:p==='33', label:p==='33'?'Teknik Industri':'Bukan T. Industri' },
      angkatan: a ? { code:a, valid:true, label:`Angkatan 20${a}` } : null,
      nomorUrut: n ? { code:n.padEnd(4,'_'), valid:n.length<=4, label:`No. Urut ${n}` } : null,
    };
  }, [formData.nim]);

  const kelasOptions = useMemo(() => {
    if (formData.nim.length >= 6) {
      const year = `20${formData.nim.substring(4,6)}`;
      return ['',`TI-A ${year}`,`TI-B ${year}`,`TI-C ${year}`,`TI-D ${year}`];
    }
    return null;
  }, [formData.nim]);

  const passwordStrength = useMemo(() => formData.password ? validatePasswordStrength(formData.password) : null, [formData.password]);
  const passwordMatch = useMemo(() => formData.confirmPassword ? formData.password === formData.confirmPassword : null, [formData.password, formData.confirmPassword]);
  const generatedEmail = useMemo(() => formData.nim.length === 10 ? `${formData.nim.trim()}@untirta.ac.id` : '', [formData.nim]);

  const validateForm = (): boolean => {
    const e: Record<string,string> = {};
    if (!formData.name.trim()) e.name = 'Nama lengkap wajib diisi';
    if (formData.nim.length !== 10) e.nim = 'NIM harus 10 digit';
    if (!formData.nim.trim()) e.nim = 'NIM wajib diisi';
    else { const v = validateNIMTeknikIndustri(formData.nim); if (!v.valid) e.nim = v.error || 'NIM tidak valid'; }
    if (!formData.kelas) e.kelas = 'Kelas wajib dipilih';
    if (!formData.password) e.password = 'Password wajib diisi';
    else { const v = validatePasswordStrength(formData.password); if (!v.valid) e.password = v.error || 'Password tidak valid'; }
    if (!formData.confirmPassword) e.confirmPassword = 'Konfirmasi password wajib diisi';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Password tidak cocok';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await register({
        name:formData.name.trim(),
        email: generatedEmail,
        nim:formData.nim.trim(),
        kelas:formData.kelas||undefined,
        password:formData.password,
      });
      if (result.success) { toast.success('Registrasi berhasil! Silakan login.'); router.push('/login'); }
      else { toast.error(result.error||'Registrasi gagal'); setErrors({general:result.error||'Registrasi gagal'}); }
    } catch { toast.error('Terjadi kesalahan.'); } finally { setLoading(false); }
  };

  const handleChange = (field:string, value:string) => {
    setFormData(prev => ({...prev,[field]:value}));
    if (errors[field]) setErrors(prev => { const n={...prev}; delete n[field]; return n; });
  };

  const handleNIMChange = (value:string) => {
    const d = value.replace(/\D/g,'').slice(0,10);
    handleChange('nim', d);
    if (d.length >= 6) {
      const a = d.substring(4,6);
      const cy = formData.kelas.match(/\d{4}/)?.[0];
      if (cy && cy !== `20${a}`) handleChange('kelas','');
    }
  };

  const sColor = passwordStrength?.strength==='strong'?'bg-[#3B82F6]':passwordStrength?.strength==='medium'?'bg-amber-400':'bg-red-400';
  const sWidth = passwordStrength?.strength==='strong'?'w-full':passwordStrength?.strength==='medium'?'w-2/3':'w-1/3';
  const sLabel = passwordStrength?.strength==='strong'?'Kuat':passwordStrength?.strength==='medium'?'Sedang':'Lemah';

  return (
    <div className="min-h-screen flex">
      {/* Left Dark Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] xl:w-[42%] p-12 relative overflow-hidden" style={gridBg}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 75% 75% at 25% 65%,rgba(29,78,216,0.09) 0%,transparent 65%)'}}/>
        <div className="relative"><Logo size="lg"/></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-6"><PulseDot/><span className="text-[#F8FAFC] text-[11px] tracking-[0.18em] uppercase" style={{fontFamily:MONO}}>REGISTRASI MAHASISWA</span></div>
          <h2 className="text-[44px] xl:text-[52px] font-black text-white leading-[0.9] mb-5 tracking-tight" style={{fontFamily:DISPLAY}}>DAFTAR SEBAGAI<br/>MAHASISWA<br/><span className="text-[#F8FAFC]">TEKNIK INDUSTRI</span></h2>
          <p className="text-[#DBEAFE]/90 max-w-[340px] text-sm leading-relaxed mb-10" style={{fontFamily:BODY}}>Khusus untuk mahasiswa Teknik Industri UNTIRTA dengan NIM format 3333YYXXXX.</p>
          <div className="space-y-3">
            {[{icon:GraduationCap,title:'Email NIM@untirta.ac.id',desc:'Email otomatis dari NIM Anda'},{icon:Users,title:'NIM Teknik Industri',desc:'Format: 3333YYXXXX (contoh: 3333230001)'}].map(({icon:Icon,title,desc})=>(
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1D4ED8]/10 border border-[#1D4ED8]/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Icon className="w-4 h-4 text-[#F8FAFC]"/></div>
                <div><div className="text-white font-semibold text-sm mb-0.5">{title}</div><div className="text-[#BFDBFE]/75 text-[12px]" style={{fontFamily:MONO}}>{desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-[#BFDBFE]/60 text-[11px]" style={{fontFamily:MONO}}>© 2026 LabTrack · UNTIRTA Teknik Industri</p>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/login" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm mb-8 transition-colors" style={{fontFamily:BODY}}><ChevronRight className="w-4 h-4 rotate-180"/>Kembali ke Login</Link>
          <h2 className="text-[32px] font-black text-slate-900 mb-1" style={{fontFamily:DISPLAY}}>BUAT AKUN BARU</h2>
          <p className="text-slate-400 text-sm mb-6" style={{fontFamily:BODY}}>Lengkapi data berikut untuk mendaftar.</p>

          {errors.general && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{errors.general}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5" style={{fontFamily:BODY}}>Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="text" value={formData.name} onChange={e=>handleChange('name',e.target.value)} placeholder="Masukkan nama lengkap" className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name?'border-red-300':'border-slate-200'} bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/25 focus:border-[#1D4ED8] transition-all`} style={{fontFamily:BODY}}/>
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* NIM */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5" style={{fontFamily:BODY}}>NIM</label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="text" value={formData.nim} onChange={e=>handleNIMChange(e.target.value)} placeholder="3333YYXXXX" className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.nim?'border-red-300':'border-slate-200'} bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/25 focus:border-[#1D4ED8] transition-all`} style={{fontFamily:MONO}}/>
              </div>
              {errors.nim && <p className="text-xs text-red-600 mt-1">{errors.nim}</p>}
              {nimInfo && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[nimInfo.fakultas,nimInfo.prodi,nimInfo.angkatan,nimInfo.nomorUrut].filter(Boolean).map((item,i)=>(
                    <span key={i} className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${item!.valid?'bg-[#EFF6FF] text-[#1E3A8A]':'bg-red-50 text-red-500'}`} style={{fontFamily:MONO}}>
                      {item!.valid?<CheckCircle2 className="w-3 h-3"/>:<XCircle className="w-3 h-3"/>}{item!.label} ({item!.code})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Email auto-generated */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5" style={{fontFamily:BODY}}>Email Mahasiswa</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <div className={`w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm ${formData.nim.length===10?'text-slate-900':'text-slate-400'}`} style={{fontFamily:MONO}}>
                  {generatedEmail?<span>{formData.nim}<span className="text-[#1E3A8A] font-semibold">@untirta.ac.id</span></span>:'Isi NIM untuk generate email'}
                </div>
              </div>
              {generatedEmail && <p className="text-xs text-[#1E3A8A] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Email akan digunakan untuk login</p>}
            </div>



            {/* Kelas */}
            {kelasOptions && (
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5" style={{fontFamily:BODY}}>Kelas</label>
                <select value={formData.kelas} onChange={e=>handleChange('kelas',e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${errors.kelas?'border-red-300':'border-slate-200'} bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/25 focus:border-[#1D4ED8] transition-all`} style={{fontFamily:BODY}}>
                  <option value="">Pilih kelas...</option>
                  {kelasOptions.filter(Boolean).map(k=><option key={k} value={k}>{k}</option>)}
                </select>
                {errors.kelas && <p className="text-xs text-red-600 mt-1">{errors.kelas}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5" style={{fontFamily:BODY}}>Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type={showPassword?'text':'password'} value={formData.password} onChange={e=>handleChange('password',e.target.value)} placeholder="Minimal 8 karakter" className={`w-full pl-11 pr-11 py-3 rounded-xl border ${errors.password?'border-red-300':'border-slate-200'} bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/25 focus:border-[#1D4ED8] transition-all`} style={{fontFamily:BODY}}/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-500" style={{fontFamily:MONO}}>Kekuatan Password</span><span className={passwordStrength.strength==='strong'?'text-[#1E3A8A]':passwordStrength.strength==='medium'?'text-amber-500':'text-red-400'} style={{fontFamily:MONO}}>{sLabel}</span></div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-300 ${sColor} ${sWidth}`}/></div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5" style={{fontFamily:BODY}}>Konfirmasi Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type={showConfirmPassword?'text':'password'} value={formData.confirmPassword} onChange={e=>handleChange('confirmPassword',e.target.value)} placeholder="Ulangi password" className={`w-full pl-11 pr-11 py-3 rounded-xl border ${errors.confirmPassword?'border-red-300':passwordMatch===true?'border-[#1D4ED8]':passwordMatch===false?'border-red-300':'border-slate-200'} bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/25 focus:border-[#1D4ED8] transition-all`} style={{fontFamily:BODY}}/>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {passwordMatch!==null && (passwordMatch?<CheckCircle2 className="w-4 h-4 text-[#1E3A8A]"/>:<XCircle className="w-4 h-4 text-red-400"/>)}
                  <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-600">{showConfirmPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
                </div>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
              {passwordMatch===true && <p className="text-xs text-[#1E3A8A] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Password cocok ✓</p>}
            </div>

            <motion.button type="submit" disabled={loading} whileTap={{scale:0.98}} className="w-full py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all hover:shadow-lg disabled:opacity-60 mt-2" style={{fontFamily:BODY}}>
              {loading?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<>Daftar <ArrowRight className="w-4 h-4"/></>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500" style={{fontFamily:BODY}}>Sudah punya akun?{' '}<Link href="/login" className="text-[#1E3A8A] hover:text-[#1E3A8A] font-semibold transition-colors">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
