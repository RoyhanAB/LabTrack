'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/lib/store';
import { Users, UserCheck, Shield, Activity, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { User } from '@/lib/types';
import toast from 'react-hot-toast';

type RoleFilter = User['role'] | 'all';

export default function SuperAdminPage() {
  const router = useRouter();
  const { currentUser, users, getAllUsers, createUser, updateUser, deleteUser, isLoading } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'mahasiswa' as 'mahasiswa' | 'admin' | 'asisten' | 'super_admin',
    nim: '',
    kelas: '',
    password: ''
  });

  useEffect(() => {
    if (!isLoading && (!currentUser || currentUser.role !== 'super_admin')) {
      toast.error('Akses ditolak. Hanya Super Admin yang dapat mengakses halaman ini.');
      router.push('/login');
      return;
    }

    if (currentUser?.role === 'super_admin') {
      getAllUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || currentUser.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-tertiary">
        <div className="w-12 h-12 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      label: 'Mahasiswa',
      value: users.filter(u => u.role === 'mahasiswa').length,
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      label: 'Admin/Asisten',
      value: users.filter(u => u.role === 'admin' || u.role === 'asisten').length,
      icon: Shield,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      label: 'Super Admin',
      value: users.filter(u => u.role === 'super_admin').length,
      icon: Activity,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.nim && user.nim.includes(searchQuery));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      nim: formData.role === 'mahasiswa' ? formData.nim || undefined : undefined,
      kelas: formData.role === 'mahasiswa' ? formData.kelas || undefined : undefined,
      password: formData.password
    });

    if (result.success) {
      toast.success('User berhasil ditambahkan');
      setShowCreateModal(false);
      resetForm();
    } else {
      toast.error(result.error || 'Gagal menambahkan user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updateData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      nim: formData.role === 'mahasiswa' ? formData.nim || undefined : undefined,
      kelas: formData.role === 'mahasiswa' ? formData.kelas || undefined : undefined
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    const result = await updateUser(selectedUser.id, updateData);

    if (result.success) {
      toast.success('User berhasil diupdate');
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
    } else {
      toast.error(result.error || 'Gagal mengupdate user');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.id === currentUser.id) {
      toast.error('Tidak dapat menghapus akun sendiri');
      return;
    }

    if (!confirm(`Yakin ingin menghapus user ${user.name}?`)) {
      return;
    }

    const result = await deleteUser(user.id);

    if (result.success) {
      toast.success('User berhasil dihapus');
    } else {
      toast.error(result.error || 'Gagal menghapus user');
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      nim: user.nim || '',
      kelas: user.kelas || '',
      password: ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'mahasiswa',
      nim: '',
      kelas: '',
      password: ''
    });
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      mahasiswa: 'bg-cyan-100 text-cyan-700',
      admin: 'bg-orange-100 text-orange-700',
      asisten: 'bg-teal-100 text-teal-700',
      super_admin: 'bg-purple-100 text-purple-700'
    };
    const labels = {
      mahasiswa: 'Mahasiswa',
      admin: 'Admin',
      asisten: 'Asisten Lab',
      super_admin: 'Super Admin'
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${badges[role as keyof typeof badges]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-navy-800 font-[family-name:var(--font-heading)]">
            Super Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-1">Kelola semua user dan admin sistem</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-navy-800 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Actions & Filters */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau NIM..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as RoleFilter)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan"
              >
                <option value="all">Semua Role</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="admin">Admin</option>
                <option value="asisten">Asisten Lab</option>
                <option value="super_admin">Super Admin</option>
              </select>

              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-cyan text-white font-semibold hover:bg-accent-cyan-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Tambah User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-navy-700 uppercase tracking-wider">NIM/Kelas</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-navy-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-navy-800">{user.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {user.nim && <div>NIM: {user.nim}</div>}
                        {user.kelas && <div className="text-xs text-slate-500">{user.kelas}</div>}
                        {!user.nim && !user.kelas && <span className="text-slate-500">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg text-accent-cyan hover:bg-cyan-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.id === currentUser.id}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">Tidak ada user ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-navy-800 mb-4">Tambah User Baru</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => {
                    const role = e.target.value as User['role'];
                    setFormData({ ...formData, role, nim: role === 'mahasiswa' ? formData.nim : '', kelas: role === 'mahasiswa' ? formData.kelas : '' });
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="admin">Admin</option>
                  <option value="asisten">Asisten Lab</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {formData.role === 'mahasiswa' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">NIM</label>
                    <input
                      type="text"
                      value={formData.nim}
                      onChange={e => setFormData({ ...formData, nim: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Kelas</label>
                    <input
                      type="text"
                      value={formData.kelas}
                      onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-accent-cyan text-white font-semibold hover:bg-accent-cyan-dark"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-navy-800 mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => {
                    const role = e.target.value as User['role'];
                    setFormData({ ...formData, role, nim: role === 'mahasiswa' ? formData.nim : '', kelas: role === 'mahasiswa' ? formData.kelas : '' });
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="admin">Admin</option>
                  <option value="asisten">Asisten Lab</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {formData.role === 'mahasiswa' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">NIM</label>
                    <input
                      type="text"
                      value={formData.nim}
                      onChange={e => setFormData({ ...formData, nim: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Kelas</label>
                    <input
                      type="text"
                      value={formData.kelas}
                      onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Password Baru (kosongkan jika tidak diubah)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-accent-cyan text-white font-semibold hover:bg-accent-cyan-dark"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
