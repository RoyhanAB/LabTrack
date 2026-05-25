'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu, X, LogOut, Bell,
  LayoutDashboard, PackageSearch, ClipboardList,
  History, Activity, FileText, Check
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Logo } from '@/components/landing/shared';

type DashboardRole = 'mahasiswa' | 'admin' | 'asisten' | 'super_admin';

export default function DashboardLayout({ children, role }: { children: React.ReactNode, role?: DashboardRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout, getUnreadCount, notifications, markNotificationAsRead, isLoading } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Auto-detect role from currentUser if not provided
  const effectiveRole = role || currentUser?.role;
  const dashboardHome = effectiveRole === 'super_admin' ? '/super-admin' : effectiveRole === 'mahasiswa' ? '/mahasiswa' : '/admin';

  useEffect(() => {
    if (isLoading) return;

    const roleAllowed = !role ||
      currentUser?.role === 'super_admin' ||
      currentUser?.role === role ||
      (role === 'admin' && currentUser?.role === 'asisten');

    if (!currentUser || !roleAllowed) {
      router.push('/login');
    }
  }, [currentUser, isLoading, role, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifOpen && !(event.target as Element).closest('.notification-dropdown')) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-surface-tertiary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = effectiveRole === 'mahasiswa' ? [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/mahasiswa' },
    { label: 'Inventaris Alat', icon: PackageSearch, href: '/mahasiswa/inventaris' },
    { label: 'Status Peminjaman', icon: ClipboardList, href: '/mahasiswa/status' },
    { label: 'Riwayat', icon: History, href: '/mahasiswa/riwayat' },
  ] : effectiveRole === 'super_admin' ? [
    { label: 'Dashboard & User', icon: LayoutDashboard, href: '/super-admin' },
    { label: 'Inventaris Alat', icon: PackageSearch, href: '/admin/inventaris' },
    { label: 'Monitoring', icon: Activity, href: '/admin/monitoring' },
    { label: 'Activity Log', icon: FileText, href: '/admin/log' },
  ] : [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Manajemen Inventaris', icon: PackageSearch, href: '/admin/inventaris' },
    { label: 'Verifikasi', icon: ClipboardList, href: '/admin/verifikasi' },
    { label: 'Pengembalian', icon: History, href: '/admin/pengembalian' },
    { label: 'Monitoring', icon: Activity, href: '/admin/monitoring' },
    { label: 'Activity Log', icon: FileText, href: '/admin/log' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const unreadNotifs = getUnreadCount();
  const userNotifications = notifications.filter(n => n.userId === currentUser?.id).slice(0, 5);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    userNotifications.filter(n => !n.read).forEach(n => markNotificationAsRead(n.id));
  };

  return (
    <div className="min-h-screen bg-surface-tertiary flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-navy-900 text-white fixed inset-y-0 z-40 border-r border-white/10">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link href={dashboardHome} className="flex items-center gap-2.5 group">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 px-2">Menu Utama</div>
          {menuItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${active ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 w-full rounded-xl font-medium text-white/60 hover:bg-danger/10 hover:text-danger transition-all">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-navy-900 text-white z-50 transform transition-transform duration-300 lg:hidden flex flex-col border-r border-white/10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href={dashboardHome} className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${active ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 w-full rounded-xl font-medium text-white/60 hover:bg-danger/10 hover:text-danger transition-all">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all">
        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 h-16 lg:h-20 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-navy-700 bg-white shadow-sm border border-gray-100 hover:bg-gray-50">
              <Menu className="w-5 h-5" />
            </button>
            {/* Search bar removed — individual pages have their own search */}
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative notification-dropdown">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-full text-slate-600 hover:bg-white hover:text-navy-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    {unreadNotifs > 9 ? '9+' : unreadNotifs}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-scale-in">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-navy-800">Notifikasi</h3>
                    {unreadNotifs > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-accent-cyan hover:text-accent-cyan-dark font-medium"
                      >
                        Tandai Semua Dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-600">
                        <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm">Tidak ada notifikasi</p>
                      </div>
                    ) : (
                      userNotifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.type === 'success' ? 'bg-success' :
                                notif.type === 'warning' ? 'bg-warning' :
                                  notif.type === 'danger' ? 'bg-danger' : 'bg-info'
                              }`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-navy-800 text-sm">{notif.title}</h4>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                              <p className="text-xs text-slate-500 mt-2">
                                {new Date(notif.createdAt).toLocaleString('id-ID', {
                                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {!notif.read && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="p-1 rounded text-slate-500 hover:text-accent-cyan transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-navy-800">{currentUser.name}</div>
                <div className="text-xs text-slate-600 capitalize">{currentUser.role} {currentUser.kelas ? `- ${currentUser.kelas}` : ''}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-cyan to-navy-600 flex items-center justify-center text-white font-bold shadow-md">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
