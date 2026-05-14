'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FlaskConical, Menu, X, ArrowRight, Clock, Shield, BarChart3, Users, ChevronRight, Search, ClipboardCheck, PackageCheck, MousePointerClick, Microscope, Cpu, Ruler, Gauge } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Laboratorium', href: '#laboratorium' },
  { label: 'Cara Peminjaman', href: '#cara-peminjaman' },
];

const labs = [
  { name: 'LSIPro', full: 'Lab. Sistem Informasi & Produktivitas', desc: 'Simulasi proses produksi dan analisis produktivitas kerja', icon: Cpu, color: 'from-cyan-500 to-blue-600' },
  { name: 'RSK&E', full: 'Lab. Rekayasa Sistem Kerja & Ergonomi', desc: 'Perancangan sistem kerja dan analisis ergonomi', icon: Users, color: 'from-orange-500 to-amber-600' },
  { name: 'OSI&K', full: 'Lab. Optimasi Sistem Industri & Kualitas', desc: 'Optimasi proses dan pengendalian kualitas', icon: BarChart3, color: 'from-emerald-500 to-teal-600' },
  { name: 'SMI', full: 'Lab. Sistem Manufaktur Industri', desc: 'Sistem manufaktur dan otomasi industri', icon: Gauge, color: 'from-purple-500 to-indigo-600' },
];

const steps = [
  { num: '01', title: 'Login Akun', desc: 'Masuk dengan akun mahasiswa Teknik Industri', icon: MousePointerClick },
  { num: '02', title: 'Pilih Alat', desc: 'Cari dan pilih alat yang tersedia di inventaris', icon: Search },
  { num: '03', title: 'Ajukan Peminjaman', desc: 'Isi form dan upload surat peminjaman', icon: ClipboardCheck },
  { num: '04', title: 'Ambil Alat', desc: 'Setelah disetujui, ambil alat di laboratorium', icon: PackageCheck },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white" id="home">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-navy-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight ${scrolled ? 'text-navy-800' : 'text-white'}`}>
                Lab<span className="text-accent-cyan">Track</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 ${scrolled ? 'text-navy-700 hover:bg-navy-50 hover:text-navy-900' : 'text-white/80 hover:text-white'}`}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${scrolled ? 'bg-navy-800 text-white hover:bg-navy-900 shadow-md hover:shadow-lg' : 'bg-white text-navy-800 hover:bg-white/90 shadow-lg'}`}>
                Login
              </Link>
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-navy-800' : 'text-white'}`}>
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 animate-fade-in-down">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenu(false)} className="block px-4 py-3 rounded-xl text-navy-700 font-medium hover:bg-navy-50 transition-colors">
                  {link.label}
                </a>
              ))}
              <Link href="/login" className="block px-4 py-3 mt-2 rounded-xl bg-navy-800 text-white text-center font-semibold">
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.03] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
              <Microscope className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm text-white/70 font-medium">Teknik Industri — Universitas Sultan Ageng Tirtayasa</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 animate-fade-in-up font-[family-name:var(--font-heading)]">
              Sistem Peminjaman Alat{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-cyan-light">Laboratorium</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl animate-fade-in-up stagger-2">
              Mempermudah peminjaman, monitoring, dan pengelolaan alat laboratorium secara real-time. Sistem terintegrasi untuk mahasiswa dan asisten laboratorium.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-3">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-white font-bold text-base shadow-lg shadow-accent-cyan/25 hover:shadow-xl hover:shadow-accent-cyan/30 hover:-translate-y-0.5 transition-all">
                Pinjam Alat
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/15 backdrop-blur-sm transition-all">
                Lihat Inventaris
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-14 animate-fade-in-up stagger-4">
              {[
                { val: '200+', label: 'Alat Tersedia' },
                { val: '4', label: 'Laboratorium' },
                { val: '500+', label: 'Mahasiswa Terdaftar' },
              ].map(stat => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-[family-name:var(--font-heading)]">{stat.val}</div>
                  <div className="text-xs sm:text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Tentang Section */}
      <section id="tentang" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-cyan/10 text-accent-cyan-dark text-sm font-semibold mb-4">Tentang LabTrack</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 mb-4 font-[family-name:var(--font-heading)]">Kenapa Harus LabTrack?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Sistem manajemen peminjaman alat laboratorium yang dirancang untuk mempermudah dan mempercepat proses peminjaman.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Real-time', desc: 'Status alat dan peminjaman terupdate secara real-time', color: 'bg-cyan-50 text-accent-cyan' },
              { icon: Shield, title: 'Aman & Terstruktur', desc: 'Data peminjaman tersimpan rapi dan terorganisir', color: 'bg-orange-50 text-accent-orange' },
              { icon: BarChart3, title: 'Monitoring', desc: 'Dashboard monitoring untuk tracking alat laboratorium', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Users, title: 'Multi-Role', desc: 'Akses berbeda untuk mahasiswa dan asisten lab', color: 'bg-purple-50 text-purple-600' },
            ].map(item => (
              <div key={item.title} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laboratorium Section */}
      <section id="laboratorium" className="py-24 bg-surface-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-semibold mb-4">Laboratorium</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 mb-4 font-[family-name:var(--font-heading)]">4 Laboratorium Teknik Industri</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Kelola alat dari seluruh laboratorium dalam satu platform terintegrasi.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {labs.map((lab, i) => (
              <div key={lab.name} className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${lab.color} opacity-5 rounded-bl-full`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lab.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <lab.icon className="w-7 h-7 text-white" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600 mb-3">{lab.name}</div>
                <h3 className="text-lg font-bold text-navy-800 mb-2">{lab.full}</h3>
                <p className="text-gray-500 text-sm">{lab.desc}</p>
                <ChevronRight className="absolute bottom-8 right-8 w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Peminjaman */}
      <section id="cara-peminjaman" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-orange/10 text-accent-orange-dark text-sm font-semibold mb-4">Panduan</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 mb-4 font-[family-name:var(--font-heading)]">Cara Meminjam Alat</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Empat langkah mudah untuk meminjam alat laboratorium.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className={`relative p-6 rounded-2xl bg-gradient-to-b from-navy-800 to-navy-900 text-white group hover:-translate-y-2 transition-all duration-300 animate-fade-in-up`} style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="text-5xl font-extrabold text-white/5 absolute top-4 right-6 font-[family-name:var(--font-heading)]">{step.num}</span>
                <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center mb-5 group-hover:bg-accent-cyan/30 transition-colors">
                  <step.icon className="w-6 h-6 text-accent-cyan" />
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 font-[family-name:var(--font-heading)]">
            Mulai Pinjam Alat Sekarang
          </h2>
          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Login dengan akun mahasiswa Anda dan mulai ajukan peminjaman alat laboratorium secara online.
          </p>
          <Link href="/login" className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-navy-800 font-bold text-lg hover:bg-white/90 hover:-translate-y-0.5 shadow-xl transition-all">
            Login Sekarang
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-navy-600 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">Lab<span className="text-accent-cyan">Track</span></span>
            </div>
            <p className="text-sm text-white/30 text-center">
              © 2026 LabTrack — Teknik Industri, Universitas Sultan Ageng Tirtayasa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
