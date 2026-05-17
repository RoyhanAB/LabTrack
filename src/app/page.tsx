'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, BarChart3, Users, ChevronRight, Search, ClipboardList, CheckCircle2, UserCheck, Package, Layers, Eye, Server, Crosshair, Menu, X, Monitor, Wrench, Gauge, Mail, Phone, MapPin, ChevronDown } from 'lucide-react';
import { Logo, PulseDot, Brackets, useCountUp, DISPLAY, BODY, MONO } from '@/components/landing/shared';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';

const gridBg = { backgroundColor:'#060D1A', backgroundImage:'linear-gradient(rgba(0,201,173,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,201,173,0.04) 1px,transparent 1px)', backgroundSize:'48px 48px' };

export default function LandingPage() {
  const { equipment, laboratories, loans } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      setUserCount(count || 0);
    };
    fetchUserCount();
  }, []);

  const totalAlat = equipment.length;
  const totalLabs = laboratories.length;
  
  const alat = useCountUp(totalAlat);
  const labs = useCountUp(totalLabs);
  const users = useCountUp(userCount);

  // Get active loans (pending or dipinjam)
  const activeLoans = loans
    .filter(l => l.status === 'menunggu' || l.status === 'dipinjam')
    .slice(0, 3)
    .map(l => ({
      name: l.equipmentName,
      lab: l.labName,
      user: l.userName.split(' ')[0], // First name only
      ok: l.status === 'dipinjam'
    }));

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#060D1A]/95 backdrop-blur-xl border-b border-teal-500/10 shadow-lg shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            {['Home','Tentang','Laboratorium','Cara Peminjaman'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`} className="text-sm text-slate-400 hover:text-teal-400 transition-colors" style={{fontFamily:BODY}}>{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:flex items-center gap-2 px-5 py-2 rounded bg-teal-500 hover:bg-teal-400 text-[#060D1A] text-sm font-semibold transition-all hover:shadow-[0_0_24px_rgba(0,201,173,0.45)]" style={{fontFamily:BODY}}>Login</Link>
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#0C1829] border-t border-teal-500/10 px-6 py-5 flex flex-col gap-4">
            {['Home','Tentang','Laboratorium','Cara Peminjaman'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`} onClick={() => setMobileMenu(false)} className="text-slate-300 text-sm text-left py-1" style={{fontFamily:BODY}}>{item}</a>
            ))}
            <Link href="/login" className="mt-1 py-2.5 rounded bg-teal-500 text-[#060D1A] text-sm font-semibold text-center" style={{fontFamily:BODY}}>Login</Link>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex flex-col overflow-hidden" style={gridBg}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 65% 55% at 18% 55%,rgba(0,201,173,0.10) 0%,transparent 65%)'}}/>
        <motion.div className="absolute left-0 right-0 h-px pointer-events-none" style={{background:'linear-gradient(90deg,transparent 5%,rgba(0,201,173,0.5) 30%,rgba(0,201,173,0.9) 50%,rgba(0,201,173,0.5) 70%,transparent 95%)'}} animate={{top:['8%','92%']}} transition={{duration:6,repeat:Infinity,ease:'linear',repeatType:'reverse'}}/>
        <div className="relative flex-1 flex items-center max-w-7xl mx-auto px-6 w-full pt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center w-full">
            <div>
              <motion.div initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{delay:0.1}} className="inline-flex items-center gap-2.5 mb-8 px-3.5 py-1.5 rounded border border-teal-500/20 bg-teal-500/5">
                <PulseDot/>
                <span className="text-teal-400 text-[11px] font-medium tracking-[0.14em] uppercase" style={{fontFamily:MONO}}>Teknik Industri · Universitas Sultan Ageng Tirtayasa</span>
              </motion.div>
              <div style={{fontFamily:DISPLAY}} className="leading-[0.9] mb-7">
                {[{text:'SISTEM',delay:0.18},{text:'PEMINJAMAN',delay:0.26},{text:'ALAT',delay:0.34}].map(({text,delay})=>(
                  <motion.div key={text} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay,duration:0.55,ease:[0.22,1,0.36,1]}} className="text-[56px] md:text-[72px] lg:text-[88px] font-black text-white tracking-[-0.01em]">{text}</motion.div>
                ))}
                <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.42,duration:0.55,ease:[0.22,1,0.36,1]}} className="text-[56px] md:text-[72px] lg:text-[88px] font-black text-teal-400 tracking-[-0.01em]">LABORATORIUM</motion.div>
              </div>
              <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.52}} className="text-slate-400 text-[15px] leading-relaxed mb-9 max-w-[480px]" style={{fontFamily:BODY}}>Platform terintegrasi untuk peminjaman, monitoring, dan pengelolaan alat laboratorium secara real-time. Dirancang khusus untuk mahasiswa dan asisten lab Teknik Industri UNTIRTA.</motion.p>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.62}} className="flex items-center gap-4 flex-wrap">
                <Link href="/login" className="group flex items-center gap-2.5 px-7 py-3.5 rounded bg-teal-500 hover:bg-teal-400 text-[#060D1A] font-semibold text-sm transition-all hover:shadow-[0_0_36px_rgba(0,201,173,0.5)]" style={{fontFamily:BODY}}>Pinjam Alat <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></Link>
                <Link href="/login" className="group flex items-center gap-2.5 px-7 py-3.5 rounded border border-slate-700 hover:border-teal-500/40 text-slate-300 hover:text-white font-medium text-sm transition-all" style={{fontFamily:BODY}}><Eye className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors"/>Lihat Inventaris</Link>
              </motion.div>
            </div>
            {/* Live Panel */}
            <motion.div initial={{opacity:0,x:48}} animate={{opacity:1,x:0}} transition={{delay:0.45,duration:0.65}} className="hidden lg:block">
              <div className="relative p-5 rounded-xl border border-teal-500/15 bg-[#0C1829]/90 backdrop-blur-sm shadow-2xl shadow-black/40">
                <Brackets/>
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2"><PulseDot/><span className="text-teal-400 text-[11px] tracking-[0.14em] uppercase" style={{fontFamily:MONO}}>LIVE · SISTEM MONITOR</span></div>
                  <span className="text-slate-600 text-[10px]" style={{fontFamily:MONO}}>SYS_v2.4.1</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[{label:'Total Alat',val:alat,icon:Package,color:'text-teal-400'},{label:'Laboratorium',val:labs,icon:Layers,color:'text-teal-400'},{label:'Pengguna',val:users,icon:Users,color:'text-orange-400'}].map(({label,val,icon:Icon,color})=>(
                    <div key={label} className="p-3 rounded-lg bg-[#060D1A] border border-white/5">
                      <div className="flex items-start justify-between mb-2"><Icon className={`w-3.5 h-3.5 ${color} mt-0.5`}/><span className={`text-2xl font-bold tabular-nums ${color}`} style={{fontFamily:MONO}}>{val}</span></div>
                      <span className="text-slate-600 text-[11px]" style={{fontFamily:BODY}}>{label}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3"><span className="text-slate-500 text-[11px] uppercase tracking-wider" style={{fontFamily:MONO}}>Peminjaman Aktif</span><span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-medium" style={{fontFamily:MONO}}>{activeLoans.length} AKTIF</span></div>
                  <div className="space-y-2">
                    {activeLoans.length > 0 ? activeLoans.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#060D1A] border border-white/5 hover:border-teal-500/15 transition-colors">
                        <div className="min-w-0"><div className="text-white text-[13px] font-medium truncate mb-0.5" style={{fontFamily:BODY}}>{item.name}</div><div className="text-slate-600 text-[11px]" style={{fontFamily:MONO}}>{item.lab} · {item.user}</div></div>
                        <span className={`ml-3 text-[11px] px-2 py-0.5 rounded font-medium flex-shrink-0 ${item.ok?'bg-teal-500/10 text-teal-400':'bg-orange-500/10 text-orange-400'}`} style={{fontFamily:MONO}}>{item.ok?'DIPINJAM':'REVIEW'}</span>
                      </div>
                    )) : (
                      <div className="p-4 text-center border border-white/5 rounded-lg bg-[#060D1A]/50">
                        <span className="text-slate-600 text-[11px]" style={{fontFamily:MONO}}>TIDAK ADA PEMINJAMAN</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Bottom Strip */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.78}} className="relative border-t border-white/5 bg-[#060D1A]/60">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{label:'Status Alat',val:'Real-time',icon:Activity},{label:'Uptime Sistem',val:'24/7',icon:Server},{label:'Akurasi Data',val:'100%',icon:Crosshair},{label:'Role Akses',val:'Multi-Role',icon:Shield}].map(({label,val,icon:Icon})=>(
              <div key={label} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-teal-500/5 border border-teal-500/15 flex items-center justify-center flex-shrink-0 group-hover:border-teal-500/35 transition-colors"><Icon className="w-4 h-4 text-teal-400"/></div>
                <div><div className="text-white font-semibold text-sm" style={{fontFamily:BODY}}>{val}</div><div className="text-slate-600 text-xs" style={{fontFamily:BODY}}>{label}</div></div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="tentang" className="bg-white py-28 relative overflow-hidden">
        <div className="absolute -top-4 right-8 text-[240px] font-black text-slate-50 select-none leading-none pointer-events-none" style={{fontFamily:DISPLAY}}>02</div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-5"><div className="h-px w-10 bg-teal-500"/><span className="text-teal-500 text-[11px] font-medium tracking-[0.22em] uppercase" style={{fontFamily:MONO}}>Tentang LabTrack</span></div>
              <h2 className="text-[48px] md:text-[64px] font-black text-slate-900 leading-[0.92] tracking-tight" style={{fontFamily:DISPLAY}}>KENAPA HARUS<br/><span className="text-teal-500">LABTRACK?</span></h2>
            </div>
            <p className="text-slate-500 max-w-xs text-sm leading-relaxed md:text-right md:pb-2" style={{fontFamily:BODY}}>Sistem manajemen peminjaman alat laboratorium yang dirancang untuk mempermudah dan mempercepat setiap proses.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {icon:Activity,title:'Real-time Monitoring',desc:'Status alat dan peminjaman terupdate secara real-time tanpa perlu refresh manual.',badge:'01',accent:'text-teal-600',bg:'bg-teal-50',bar:'bg-teal-500'},
              {icon:Shield,title:'Aman & Terstruktur',desc:'Data peminjaman tersimpan rapi, teraudit, dan terlindungi dengan sistem validasi berlapis.',badge:'02',accent:'text-blue-600',bg:'bg-blue-50',bar:'bg-blue-500'},
              {icon:BarChart3,title:'Dashboard Monitoring',desc:'Visualisasi data peminjaman, inventaris, dan aktivitas laboratorium dalam satu tampilan.',badge:'03',accent:'text-violet-600',bg:'bg-violet-50',bar:'bg-violet-500'},
              {icon:Users,title:'Multi-Role Access',desc:'Akses berbeda untuk mahasiswa dan asisten lab — setiap peran melihat fungsi yang relevan.',badge:'04',accent:'text-orange-600',bg:'bg-orange-50',bar:'bg-orange-500'},
            ].map((f,i)=>(
              <motion.div key={f.badge} initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{delay:i*0.09,duration:0.5}} whileHover={{y:-5}} className="group relative p-8 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="absolute -bottom-3 -right-2 text-8xl font-black text-slate-50 select-none leading-none" style={{fontFamily:DISPLAY}}>{f.badge}</div>
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${f.bar} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}/>
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-6`}><f.icon className={`w-6 h-6 ${f.accent}`}/></div>
                <h3 className="text-[20px] font-bold text-slate-900 mb-3" style={{fontFamily:DISPLAY}}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10" style={{fontFamily:BODY}}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LABS */}
      <section id="laboratorium" className="bg-slate-50 py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-500 text-[11px] tracking-[0.18em] uppercase" style={{fontFamily:MONO}}>Laboratorium</div>
            <h2 className="text-[48px] md:text-[64px] font-black text-slate-900 leading-[0.92] tracking-tight mb-5" style={{fontFamily:DISPLAY}}>4 LABORATORIUM<br/><span className="text-teal-500">TEKNIK INDUSTRI</span></h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed" style={{fontFamily:BODY}}>Kelola alat dari seluruh laboratorium dalam satu platform terintegrasi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {id:'LSIPro',name:'Lab. Sistem Informasi & Produktivitas',desc:'Simulasi proses produksi dan analisis produktivitas kerja',icon:Monitor,color:'bg-blue-500',count:18,active:true},
              {id:'RSK&E',name:'Lab. Rekayasa Sistem Kerja & Ergonomi',desc:'Perancangan sistem kerja dan analisis ergonomi',icon:Users,color:'bg-orange-500',count:22,active:true},
              {id:'OSI&K',name:'Lab. Optimasi Sistem Industri & Kualitas',desc:'Pengendalian kualitas produk dan optimasi proses industri',icon:Wrench,color:'bg-teal-500',count:15,active:true},
              {id:'SMI',name:'Lab. Sistem Manufaktur & Inovasi',desc:'Proses manufaktur, permesinan, dan fabrikasi material',icon:Gauge,color:'bg-violet-500',count:8,active:false},
            ].map((lab,i)=>(
              <motion.div key={lab.id} initial={{opacity:0,scale:0.96}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*0.08}} whileHover={{y:-4}} className="group relative p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-300/60 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${lab.color} flex items-center justify-center flex-shrink-0 shadow-lg`}><lab.icon className="w-6 h-6 text-white"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-teal-500 uppercase tracking-widest" style={{fontFamily:MONO}}>{lab.id}</span>
                      <div className="flex items-center gap-1.5"><PulseDot active={lab.active}/><span className="text-[11px] text-slate-400" style={{fontFamily:MONO}}>{lab.active?'AKTIF':'MAINTENANCE'}</span></div>
                    </div>
                    <h3 className="text-[17px] font-bold text-slate-900 leading-snug mb-1.5" style={{fontFamily:DISPLAY}}>{lab.name}</h3>
                    <p className="text-slate-500 text-sm mb-4" style={{fontFamily:BODY}}>{lab.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400" style={{fontFamily:MONO}}>{lab.count} alat terdaftar</span>
                      <div className="flex items-center gap-1 text-slate-400 group-hover:text-teal-500 transition-colors"><span className="text-[12px] font-medium" style={{fontFamily:BODY}}>Lihat Alat</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"/></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="cara-peminjaman" className="py-28 relative overflow-hidden" style={gridBg}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 90% 60% at 50% 50%,rgba(0,201,173,0.06) 0%,transparent 70%)'}}/>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-5"><div className="h-px w-12 bg-gradient-to-r from-transparent to-teal-500"/><span className="text-teal-400 text-[11px] tracking-[0.22em] uppercase" style={{fontFamily:MONO}}>Cara Peminjaman</span><div className="h-px w-12 bg-gradient-to-l from-transparent to-teal-500"/></div>
            <h2 className="text-[48px] md:text-[64px] font-black text-white leading-[0.92] tracking-tight" style={{fontFamily:DISPLAY}}>EMPAT LANGKAH<br/><span className="text-teal-400">MUDAH & CEPAT</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
            <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px"><div className="w-full h-full bg-gradient-to-r from-teal-500/20 via-teal-500/40 to-teal-500/20"/></div>
            {[
              {num:'01',title:'Pilih Alat',desc:'Telusuri inventaris dan pilih alat yang ingin dipinjam dari laboratorium.',icon:Search},
              {num:'02',title:'Ajukan Peminjaman',desc:'Isi formulir peminjaman dengan data lengkap dan jadwal penggunaan.',icon:ClipboardList},
              {num:'03',title:'Tunggu Verifikasi',desc:'Asisten lab akan memverifikasi pengajuan dan memberikan konfirmasi.',icon:UserCheck},
              {num:'04',title:'Ambil & Gunakan',desc:'Ambil alat di lab sesuai jadwal dan gunakan dengan bertanggung jawab.',icon:CheckCircle2},
            ].map((step,i)=>(
              <motion.div key={step.num} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.13,duration:0.5}}>
                <div className="group relative p-6 rounded-xl border border-teal-500/15 bg-[#0C1829] hover:border-teal-500/35 transition-all duration-300 h-full">
                  <Brackets/>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors"><step.icon className="w-5 h-5 text-teal-400"/></div>
                    <span className="text-4xl font-black text-teal-500/15 leading-none" style={{fontFamily:DISPLAY}}>{step.num}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-white mb-2.5" style={{fontFamily:DISPLAY}}>{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed" style={{fontFamily:BODY}}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[100px] opacity-60 pointer-events-none"/>
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-[40px] md:text-[56px] font-black text-slate-900 leading-[0.92] tracking-tight mb-4" style={{fontFamily:DISPLAY}}>FAQ</h2>
            <p className="text-slate-500 text-sm" style={{fontFamily:BODY}}>Pertanyaan yang sering diajukan terkait sistem peminjaman LabTrack.</p>
          </div>
          <div className="space-y-4">
            {[
              {q: "Siapa saja yang bisa meminjam alat?", a: "Saat ini, sistem peminjaman hanya diperuntukkan bagi mahasiswa Teknik Industri Universitas Sultan Ageng Tirtayasa yang memiliki akun valid."},
              {q: "Bagaimana cara mendaftar akun?", a: "Anda dapat mendaftar melalui halaman Registrasi dengan menggunakan NIM. Pastikan format NIM Anda sesuai (3333YYXXXX) untuk dapat diverifikasi oleh sistem."},
              {q: "Berapa lama batas waktu peminjaman alat?", a: "Batas waktu peminjaman standar adalah 3 hari kerja. Perpanjangan dapat dilakukan setelah berkonsultasi dengan asisten laboratorium terkait."},
              {q: "Apa yang terjadi jika saya terlambat mengembalikan alat?", a: "Keterlambatan pengembalian akan tercatat di sistem dan dapat mempengaruhi persetujuan peminjaman Anda di masa mendatang."},
              {q: "Bagaimana jika alat yang saya pinjam rusak?", a: "Segala bentuk kerusakan harus segera dilaporkan kepada asisten lab. Peminjam bertanggung jawab atas perbaikan atau penggantian alat sesuai dengan SOP yang berlaku."}
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-14" style={{background:'#060D1A'}}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-5">
          <div>
            <Logo/>
            <p className="text-slate-500 text-sm mt-5 max-w-xs leading-relaxed" style={{fontFamily:BODY}}>Sistem manajemen peminjaman alat laboratorium Teknik Industri UNTIRTA yang terintegrasi, real-time, dan aman.</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-bold mb-5" style={{fontFamily:DISPLAY}}>Hubungi Pengelola</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="text-teal-500 mt-0.5"><Mail className="w-4 h-4"/></div>
                <div><div className="text-slate-400 text-[11px] mb-0.5" style={{fontFamily:MONO}}>EMAIL</div><a href="mailto:3333230025@untirta.ac.id" className="text-slate-300 hover:text-teal-400 transition-colors text-sm font-medium" style={{fontFamily:BODY}}>3333230025@untirta.ac.id</a></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-teal-500 mt-0.5"><Phone className="w-4 h-4"/></div>
                <div><div className="text-slate-400 text-[11px] mb-0.5" style={{fontFamily:MONO}}>WHATSAPP</div><a href="https://wa.me/6283806241350" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-teal-400 transition-colors text-sm font-medium" style={{fontFamily:BODY}}>+62 838-0624-1350</a></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="text-teal-500 mt-0.5"><MapPin className="w-4 h-4"/></div>
                <div><div className="text-slate-400 text-[11px] mb-0.5" style={{fontFamily:MONO}}>LOKASI</div><span className="text-slate-300 text-sm font-medium" style={{fontFamily:BODY}}>Ruang labLSIPro</span></div>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start md:items-end justify-between">
            <div className="flex items-center gap-2"><PulseDot active={true}/><span className="text-teal-400 text-[11px] tracking-widest uppercase" style={{fontFamily:MONO}}>Sistem Online</span></div>
            <p className="text-slate-600 text-sm text-left md:text-right mt-10 md:mt-0" style={{fontFamily:BODY}}>© 2026 LabTrack<br/>Teknik Industri, Universitas Sultan Ageng Tirtayasa</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ question, answer, index }: { question: string, answer: string, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
      >
        <span className="font-bold text-slate-800" style={{fontFamily:DISPLAY}}>{question}</span>
        <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-200 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 text-teal-600" />
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed" style={{fontFamily:BODY}}>
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );
}
