'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FlaskConical, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [role, setRole] = useState<'mahasiswa' | 'admin'>('mahasiswa');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = await login(email);
    if (user) {
      if (user.role !== role) {
        setError(`Akun ini terdaftar sebagai ${user.role === 'admin' ? 'Admin/Asisten Lab' : 'Mahasiswa'}`);
        setLoading(false);
        return;
      }
      toast.success(`Selamat datang, ${user.name}!`);
      router.push(user.role === 'admin' ? '/admin' : '/mahasiswa');
    } else {
      setError('Email atau password salah');
      setLoading(false);
    }
  };

  const fillDemo = (r: 'mahasiswa' | 'admin') => {
    setRole(r);
    if (r === 'mahasiswa') {
      setEmail('ahmad.fauzan@student.untirta.ac.id');
      setPassword('mahasiswa123');
    } else {
      setEmail('rizky.pratama@untirta.ac.id');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen flex gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent-cyan/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-accent-orange/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.03] rounded-full" />
      </div>

      {/* Back button */}
      <Link href="/" className="absolute top-4 left-6 z-10 flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 xl:px-24">
        <Link href="/" className="flex items-center gap-2.5 mb-12 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-navy-600 flex items-center justify-center shadow-lg">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
            Lab<span className="text-accent-cyan">Track</span>
          </span>
        </Link>

        <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6 font-[family-name:var(--font-heading)]">
          Kelola Peminjaman<br />
          Alat Lab dengan<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-cyan-light">Mudah & Cepat</span>
        </h1>

        <p className="text-white/40 text-lg leading-relaxed max-w-md mb-10">
          Sistem terintegrasi untuk mahasiswa dan asisten laboratorium Teknik Industri UNTIRTA.
        </p>

        <div className="flex gap-6">
          {[
            { val: 'Real-time', label: 'Status Update' },
            { val: '24/7', label: 'Akses Online' },
            { val: '100%', label: 'Paperless' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-xl font-bold text-accent-cyan">{s.val}</div>
              <div className="text-xs text-white/30 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-navy-600 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
              Lab<span className="text-accent-cyan">Track</span>
            </span>
          </Link>

          <div className="glass rounded-3xl p-8 shadow-2xl animate-scale-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-navy-800 font-[family-name:var(--font-heading)]">Masuk ke Akun</h2>
              <p className="text-gray-500 text-sm mt-2">Pilih role dan masukkan kredensial Anda</p>
            </div>

            {/* Role tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button onClick={() => setRole('mahasiswa')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'mahasiswa' ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <GraduationCap className="w-4 h-4" />
                Mahasiswa
              </button>
              <button onClick={() => setRole('admin')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'admin' ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <ShieldCheck className="w-4 h-4" />
                Admin/Asisten
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={role === 'mahasiswa' ? 'nama@student.untirta.ac.id' : 'nama@untirta.ac.id'} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-navy-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-navy-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan transition-all" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-accent-cyan focus:ring-accent-cyan/30" />
                  <span className="text-sm text-gray-600">Ingat saya</span>
                </label>
                <button type="button" className="text-sm text-accent-cyan hover:text-accent-cyan-dark font-medium">Lupa password?</button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-danger-light border border-red-200 text-red-700 text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-navy-800 to-navy-700 text-white font-bold text-sm hover:from-navy-900 hover:to-navy-800 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Masuk <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Demo akun untuk testing:</p>
              <div className="flex gap-2">
                <button onClick={() => fillDemo('mahasiswa')} className="flex-1 py-2 rounded-lg bg-cyan-50 text-accent-cyan-dark text-xs font-semibold hover:bg-cyan-100 transition-colors">
                  Demo Mahasiswa
                </button>
                <button onClick={() => fillDemo('admin')} className="flex-1 py-2 rounded-lg bg-orange-50 text-accent-orange-dark text-xs font-semibold hover:bg-orange-100 transition-colors">
                  Demo Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
