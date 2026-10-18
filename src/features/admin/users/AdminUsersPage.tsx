/**
 * Admin Users Page
 * =================
 * B1.4D-T3 — Users domain extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/12-b1.4d-t3-platform-users.md
 *
 * The complete "users" tab content, extracted out of `AdminDashboard`. This
 * page is pure presentation over the users-domain surface passed in as props:
 *
 *   - it owns NO users state (the hook in `AdminDashboard` does), so the data
 *     survives tab navigation and stays the canonical source for Lead
 *     conversion / Finance approval / contextual add;
 *   - its own search affordance (the T2 toolbar's "Search dashboard..." input
 *     was bound to Users filtering only, so the search moves here);
 *   - the "Add / Edit User" editor lives in `AdminUserEditorDialog`.
 *
 * ## UI information, NOT authorization
 *
 * The "Access Level" column and the editor's "Rincian Akses Role" preview read
 * from `ADMIN_ROLE_PERMISSIONS`. That is UI information only. SEC-P1-03
 * ("no admin authentication gate") remains OPEN and is owned by B2.
 */

import {
  Award,
  CheckCircle2,
  Edit2,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';

import { Button, IconButton } from '../../../design-system/components';
import type { Program, UserAccount } from '../../../types';
import type { AdminRole, AdminTab } from '../shell/adminWorkspaceModel';
import { AdminUserEditorDialog } from './AdminUserEditorDialog';
import type { UseAdminUsersDomainResult } from './useAdminUsersDomain';

export interface AdminUsersPageProps {
  /** The canonical Users domain surface owned by `AdminDashboard`. */
  domain: UseAdminUsersDomainResult;
  /** Program options for the editor. */
  programs: Program[];
  /** Role -> tab registry for the "Access Level" display (UI information). */
  rolePermissions: Record<AdminRole, AdminTab[]>;
  /** Toast adapter for Sync / access-summary actions. */
  notify: (message: string) => void;
}

export function AdminUsersPage({
  domain,
  programs,
  rolePermissions,
  notify,
}: AdminUsersPageProps) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">User Management & Permissions</h2>
          <p className="text-sm text-slate-500">Control role assignments and granular access levels</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => domain.setUserDirectoryView('students')}
              aria-pressed={domain.userDirectoryView === 'students'}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${domain.userDirectoryView === 'students' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-500 hover:text-slate-700'}`}
            >
              User Siswa
            </button>
            <button
              onClick={() => domain.setUserDirectoryView('staff')}
              aria-pressed={domain.userDirectoryView === 'staff'}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${domain.userDirectoryView === 'staff' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admin & Staff
            </button>
          </div>
          <Button variant="secondary" onClick={() => domain.openNewUserForm('student')}>
            <Plus size={18} aria-hidden="true" />
            Add User Siswa
          </Button>
          <Button variant="primary" onClick={() => domain.openNewUserForm('staff')}>
            <Plus size={18} aria-hidden="true" />
            Add User Admin
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              domain.syncApprovedStudentsToUsers();
              notify('Daftar siswa disinkronkan dari registrasi, pembayaran approved, dan beasiswa approved.');
            }}
          >
            <RefreshCw size={18} aria-hidden="true" />
            Sync Approved
          </Button>
        </div>
      </div>

      {/* Users-local search. Was the T2 transitional toolbar input, which only
          ever filtered users by name/email. */}
      <div className="mb-6 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 max-w-md w-full">
        <Search size={18} className="text-slate-400" aria-hidden="true" />
        <input
          type="text"
          aria-label="Cari pengguna"
          placeholder="Cari nama atau email pengguna..."
          value={domain.usersSearchTerm}
          onChange={(e) => domain.setUsersSearchTerm(e.target.value)}
          className="bg-transparent border-none text-sm w-full focus:ring-0"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total User', value: domain.users.length, icon: Users, color: 'text-teal-700' },
          { label: 'Student', value: domain.users.filter((item) => item.role === 'Student').length, icon: GraduationCap, color: 'text-emerald-700' },
          { label: 'Gratis', value: domain.users.filter((item) => item.role === 'Student' && item.accountType === 'Free').length, icon: CheckCircle2, color: 'text-emerald-700' },
          { label: 'Berbayar/Beasiswa', value: domain.users.filter((item) => item.role === 'Student' && ['Paid', 'Scholarship'].includes(String(item.accountType))).length, icon: Award, color: 'text-amber-700' },
        ].map((stat) => (
          <div key={stat.label} className="card-premium p-5 bg-white">
            <stat.icon size={20} className={`${stat.color} mb-3`} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-brand-navy mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card-premium overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">System Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Tipe Akun</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Access Level</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {domain.filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{user.name || 'New User'}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{user.email || 'pending email'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    aria-label={`Role sistem ${user.name || 'New User'}`}
                    onChange={(e) => {
                      const nextRole = e.target.value as UserAccount['role'];
                      const updatedUsers = domain.users.map((u) => {
                        const nextAccountType: UserAccount['accountType'] = nextRole === 'Student' ? (u.accountType === 'Staff' ? 'Free' : u.accountType || 'Free') : 'Staff';
                        return u.id === user.id ? { ...u, role: nextRole, accountType: nextAccountType } : u;
                      });
                      domain.persistUsers(updatedUsers);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none border border-transparent transition-all hover:border-slate-200 ${
                      user.role === 'Admin' ? 'bg-purple-50 text-purple-700' :
                      user.role === 'Tutor' || user.role === 'Content Manager' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-emerald-700'
                    }`}
                  >
                    <option value="Admin">Super Admin</option>
                    <option value="Content Manager">Content Manager</option>
                    <option value="Support">Support Staff</option>
                    <option value="Tutor">Educator</option>
                    <option value="Student">Student User</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    user.accountType === 'Scholarship' ? 'bg-indigo-50 text-indigo-600' :
                    user.accountType === 'Paid' ? 'bg-amber-50 text-amber-600' :
                    user.accountType === 'Staff' ? 'bg-slate-100 text-slate-500' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {user.accountType || (user.role === 'Student' ? 'Free' : 'Staff')}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{user.packageName || '-'}</p>
                  <p className="text-[10px] text-slate-400">{user.paymentStatus || user.source || '-'}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {rolePermissions[(user.role as any) === 'Admin' ? 'Super Admin' : (user.role as any)]?.slice(0, 3).map((tab) => (
                      <span key={tab} className="text-[8px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{tab}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <IconButton
                      variant="ghost"
                      aria-label={`Lihat hak akses ${user.name || 'New User'}`}
                      icon={<Shield size={16} />}
                      onClick={() => notify(`Hak akses ${user.name || 'New User'} mengikuti role: ${user.role}.`)}
                    />
                    <IconButton
                      variant="ghost"
                      aria-label={`Edit user ${user.name || 'New User'}`}
                      icon={<Edit2 size={16} />}
                      onClick={() => domain.setEditingUser(user)}
                    />
                    <IconButton
                      variant="danger"
                      aria-label={`Hapus user ${user.name || 'New User'}`}
                      icon={<Trash2 size={16} />}
                      onClick={() => domain.deleteUser(user.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminUserEditorDialog
        user={domain.editingUser}
        programs={programs}
        rolePermissions={rolePermissions}
        onChange={domain.setEditingUser}
        onClose={() => domain.setEditingUser(null)}
        onSave={domain.saveUser}
      />
    </div>
  );
}

export default AdminUsersPage;
