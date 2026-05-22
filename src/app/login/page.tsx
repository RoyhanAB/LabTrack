'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, ShieldCheck, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Logo, PulseDot, DISPLAY, BODY, MONO } from '@/components/landing/shared';
import toast from 'react-hot-toast';

const gridBg = { backgroundColor:'#060D1A', backgroundImage:'linear-gradient(rgba(0,201,173,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,201,173,0.04) 1px,transparent 1px)', backgroundSize:'48px 48px' };

export default function LoginPage() {
  const router = useRouter();
  const { login, logout } = useStore();
  const [role, setRole] = useState<'mahasiswa'|'admin'>('mahasiswa');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Email dan password wajib diisi'); return; }
    const normalizedEmail = email.trim().toLowerCase();
    const mahasiswaEmailPattern = /^3333\d{6}@untirta\.ac\.id$/;
    if (role === 'mahasiswa' && !mahasiswaEmailPattern.test(normalizedEmail)) {
      toast.error('Email mahasiswa harus format NIM@untirta.ac.id');
      return;
    }
    if (role === 'admin' && mahasiswaEmailPattern.test(normalizedEmail)) {
      toast.error('Gunakan tab Mahasiswa untuk akun mahasiswa');
      return;
    }

    setLoading(true);
    try {
      const user = await login(normalizedEmail, password);
      if (user) {
        const roleMatchesSelection = role === 'mahasiswa'
          ? user.role === 'mahasiswa'
          : ['admin', 'asisten', 'super_admin'].includes(user.role);

        if (!roleMatchesSelection) {
          logout();
          toast.error(`Akun ini bukan akun ${role === 'mahasiswa' ? 'mahasiswa' : 'administrasi'}`);
          return;
        }

        toast.success(`Selamat datang, ${user.name}!`);
        const r = user.role;
        router.push(r === 'mahasiswa' ? '/mahasiswa' : r === 'super_admin' ? '/super-admin' : '/admin');
      } else {
        toast.error('Email atau password salah');
      }
    } catch { toast.error('Terjadi kesalahan'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Dark Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] xl:w-[42%] p-12 relative overflow-hidden" style={gridBg}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 75% 75% at 25% 65%,rgba(0,201,173,0.09) 0%,transparent 65%)'}}/>
        <motion.div className="absolute left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(0,201,173,0.4),transparent)'}} animate={{top:['5%','95%']}} transition={{duration:7,repeat:Infinity,ease:'linear',repeatType:'reverse'}}/>
        <div className="relative"><Logo/></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-6"><PulseDot/><span className="text-teal-400 text-[11px] tracking-[0.18em] uppercase" style={{fontFamily:MONO}}>SISTEM AKTIF · 24/7</span></div>
          <h2 className="text-[44px] xl:text-[52px] font-black text-white leading-[0.9] mb-5 tracking-tight" style={{fontFamily:DISPLAY}}>KELOLA PEMINJAMAN<br/>ALAT LAB DENGAN<br/><span className="text-teal-400">MUDAH & CEPAT</span></h2>
          <p className="text-slate-400 max-w-[340px] text-sm leading-relaxed mb-10" style={{fontFamily:BODY}}>Sistem terintegrasi untuk mahasiswa dan asisten laboratorium Teknik Industri UNTIRTA.</p>
          <div className="grid grid-cols-3 gap-3">
            {[{val:'Real-time',label:'Status Alat'},{val:'24/7',label:'Akses Sistem'},{val:'100%',label:'Terdokumentasi'}].map(({val,label})=>(
              <div key={label} className="p-3.5 rounded-lg border border-teal-500/12 bg-teal-500/5">
                <div className="text-teal-400 font-bold text-base mb-0.5" style={{fontFamily:DISPLAY}}>{val}</div>
                <div className="text-slate-600 text-[11px]" style={{fontFamily:BODY}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-slate-700 text-[11px]" style={{fontFamily:MONO}}>© 2026 LabTrack · UNTIRTA Teknik Industri</p>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm mb-10 transition-colors" style={{fontFamily:BODY}}><ChevronRight className="w-4 h-4 rotate-180"/>Kembali ke Beranda</Link>
          <h2 className="text-[36px] font-black text-slate-900 mb-1.5" style={{fontFamily:DISPLAY}}>MASUK KE AKUN</h2>
          <p className="text-slate-400 text-sm mb-8" style={{fontFamily:BODY}}>Pilih role dan masukkan kredensial untuk melanjutkan.</p>

          {/* Role Tabs */}
          <div className="flex rounded-xl border border-slate-200 p-1 mb-7 bg-slate-50">
            {(['mahasiswa','admin'] as const).map(r=>(
              <button key={r} onClick={()=>setRole(r)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role===r?'bg-[#060D1A] text-white shadow-sm':'text-slate-500 hover:text-slate-800'}`} style={{fontFamily:BODY}}>
                {r==='mahasiswa'?<GraduationCap className="w-4 h-4"/>:<ShieldCheck className="w-4 h-4"/>}
                {r==='mahasiswa'?'Mahasiswa':'Administrasi'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5" style={{fontFamily:BODY}}>Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={role==='mahasiswa'?'3333YYXXXX@untirta.ac.id':'nama@untirta.ac.id'} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 transition-all bg-white" style={{fontFamily:BODY}} required/>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700" style={{fontFamily:BODY}}>Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 transition-all bg-white" style={{fontFamily:BODY}} required/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
              </div>
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{scale:0.98}} className="w-full py-3.5 rounded-xl bg-[#060D1A] hover:bg-[#0C1829] text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all hover:shadow-lg disabled:opacity-60 mt-2" style={{fontFamily:BODY}}>
              {loading?<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<>{role==='mahasiswa'?'Masuk ke Dashboard':'Masuk ke Admin Panel'}<ArrowRight className="w-4 h-4"/></>}
            </motion.button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500" style={{fontFamily:BODY}}>Belum punya akun?{' '}<Link href="/register" className="text-teal-500 hover:text-teal-600 font-semibold transition-colors">Daftar Sekarang</Link></p>
        </div>
      </div>
    </div>
  );
}
