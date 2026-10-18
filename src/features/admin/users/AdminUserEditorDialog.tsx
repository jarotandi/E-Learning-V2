/**
 * Admin User Editor Dialog
 * =========================
 * B1.4D-T3 — Users domain extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/12-b1.4d-t3-platform-users.md
 *
 * The complete "Add / Edit User" modal, extracted out of `AdminDashboard` so
 * the Users page owns its own editor. Behaviour, fields, copy and the
 * account-type / role coupling are preserved exactly:
 *
 *   - `Admin` is displayed as "Super Admin" and maps to the shell role matrix;
 *   - switching to `Student` coerces a `Staff` account type back to `Free`;
 *   - Student-only fields (tipe siswa / paket / status pembayaran) render only
 *     for `Student`.
 *
 * The dialog is presentational: the in-progress record is owned by the domain
 * hook, so edits are reported through `onChange` and the save through `onSave`.
 *
 * The old shell role switcher (`Super Admin` / `Content Manager` / `Support`)
 * is a DIFFERENT type system from `UserAccount.role`. T3 does not merge them.
 */

import { AnimatePresence, motion } from 'motion/react';
import { Save, Users, X } from 'lucide-react';

import { Button } from '../../../design-system/components';
import type { Program, UserAccount } from '../../../types';
import type { AdminRole, AdminTab } from '../shell/adminWorkspaceModel';

export interface AdminUserEditorDialogProps {
  /** The record being edited, or null to render nothing. */
  user: UserAccount | null;
  /** Program options for the "Program / Scope" select. */
  programs: Program[];
  /** Role -> tab registry used for the "Rincian Akses Role" preview. */
  rolePermissions: Record<AdminRole, AdminTab[]>;
  /** Report an updated in-progress record. */
  onChange: (user: UserAccount) => void;
  /** Close without saving. */
  onClose: () => void;
  /** Persist the (already mutated) record. */
  onSave: (user: UserAccount) => void;
}

export function AdminUserEditorDialog({
  user,
  programs,
  rolePermissions,
  onChange,
  onClose,
  onSave,
}: AdminUserEditorDialogProps) {
  return (
    <AnimatePresence>
      {user && (
        <div className="fixed inset-0 z-[124] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={22} className="text-emerald-300" aria-hidden="true" />
                <div>
                  <h3 className="font-bold">Add / Edit User</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">
                    {user.role === 'Student' ? 'Form khusus user siswa' : 'Form khusus user admin/staff'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup editor pengguna"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-8 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                    <input value={user.name} onChange={(e) => onChange({ ...user, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="Contoh: Budi Santoso" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Login</label>
                    <input type="email" value={user.email} onChange={(e) => onChange({ ...user, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="nama@email.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Role</label>
                    <select
                      value={user.role}
                      onChange={(e) => {
                        const nextRole = e.target.value as UserAccount['role'];
                        onChange({
                          ...user,
                          role: nextRole,
                          accountType: nextRole === 'Student' ? (user.accountType === 'Staff' ? 'Free' : user.accountType || 'Free') : 'Staff',
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                    >
                      {user.role === 'Student' ? (
                        <option value="Student">Student User</option>
                      ) : (
                        <>
                          <option value="Support">Support Staff</option>
                          <option value="Content Manager">Content Manager</option>
                          <option value="Admin">Super Admin</option>
                          <option value="Tutor">Tutor / Educator</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                    <select value={user.status} onChange={(e) => onChange({ ...user, status: e.target.value as UserAccount['status'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Join</label>
                    <input type="date" value={user.joinedAt} onChange={(e) => onChange({ ...user, joinedAt: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program / Scope</label>
                  <select value={user.program || ''} onChange={(e) => onChange({ ...user, program: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                    <option value="">General / Semua Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.title}>{program.title}</option>
                    ))}
                  </select>
                </div>

                {user.role === 'Student' && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipe Siswa</label>
                      <select value={user.accountType || 'Free'} onChange={(e) => onChange({ ...user, accountType: e.target.value as UserAccount['accountType'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        <option value="Free">Gratis</option>
                        <option value="Paid">Berbayar</option>
                        <option value="Scholarship">Beasiswa</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Paket Belajar</label>
                      <input value={user.packageName || ''} onChange={(e) => onChange({ ...user, packageName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="Gratis / Premium / Beasiswa" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status Pembayaran</label>
                      <input value={user.paymentStatus || ''} onChange={(e) => onChange({ ...user, paymentStatus: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="Free Active / Approved" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Avatar URL</label>
                  <input value={user.avatar} onChange={(e) => onChange({ ...user, avatar: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="card-premium p-5 bg-slate-50">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={user.avatar} className="w-12 h-12 rounded-xl object-cover bg-white" alt="" />
                    <div>
                      <p className="text-sm font-black text-brand-navy">{user.name || 'Nama User'}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{user.email || 'email belum diisi'}</p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 rounded-lg bg-blue-50 text-emerald-700 text-[10px] font-black uppercase">{user.role}</span>
                </div>

                <div className="card-premium p-5 bg-white">
                  <h4 className="font-black text-brand-navy mb-3">Rincian Akses Role</h4>
                  <div className="flex flex-wrap gap-2">
                    {(rolePermissions[(user.role as any) === 'Admin' ? 'Super Admin' : (user.role as any) as AdminRole] || ['overview']).map((tab) => (
                      <span key={tab} className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase">{tab}</span>
                    ))}
                    {user.role === 'Student' && <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">student dashboard</span>}
                    {user.role === 'Tutor' && <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase">kelas & materi</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-4">
                    Admin dan Content Manager mendapat akses panel demo sesuai role. Student/Tutor tersimpan sebagai akun operasional dan dapat difilter di tabel user.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                Batal
              </Button>
              <Button variant="primary" onClick={() => onSave(user)}>
                <Save size={18} aria-hidden="true" /> Simpan User
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminUserEditorDialog;
