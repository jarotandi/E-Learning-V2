/**
 * Admin Commerce / Lead form dialog ("Add New Lead")
 * =================================================
 * B1.4D-T7A — Commerce Leads extraction (`/admin/commerce/leads`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The COMPLETE legacy "Add New Lead" modal, moved verbatim (every field and
 * option: nama, WhatsApp, email, status pipeline, minat program, sumber lead,
 * catatan awal + the info callout). The only changes are the required
 * accessibility fixes (labelled fields, labelled + >=44px close, >=44px footer
 * actions) and accessible darker tokens. Lead semantics are unchanged.
 *
 * The "Minat Program" options come from the SAME canonical Programs list the
 * rest of the admin consumes (`domain.programsList`).
 */

import { AnimatePresence, motion } from 'motion/react';
import {
  Info,
  Save,
  UserPlus,
  X,
} from 'lucide-react';
import type { Lead } from '../../../../types';
import type { UseAdminLeadsDomainResult } from './useAdminLeadsDomain';

export interface AdminLeadEditorDialogProps {
  domain: UseAdminLeadsDomainResult;
}

export function AdminLeadEditorDialog({ domain }: AdminLeadEditorDialogProps) {
  const { isLeadFormOpen, setIsLeadFormOpen, leadForm, setLeadForm, saveLeadForm, programsList } = domain;

  return (
         <AnimatePresence>
 {isLeadFormOpen && (
   <div className="fixed inset-0 z-[122] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
     <motion.div
       initial={{ opacity: 0, scale: 0.96, y: 12 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       exit={{ opacity: 0, scale: 0.96, y: 12 }}
       className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
     >
       <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
         <div className="flex items-center gap-3">
           <UserPlus size={22} className="text-amber-300" />
           <div>
             <h3 className="font-bold">Add New Lead</h3>
             <p className="text-[10px] text-white/50 uppercase tracking-widest">Input calon siswa baru ke pipeline follow-up</p>
           </div>
         </div>
         <button onClick={() => setIsLeadFormOpen(false)} aria-label="Tutup formulir lead" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full">
           <X size={20} />
         </button>
       </div>

       <div className="p-8 space-y-6">
         <div className="grid md:grid-cols-2 gap-4">
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lead</label>
             <input aria-label="Nama lead" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="Contoh: Rina Wijaya" />
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor WhatsApp</label>
             <input aria-label="Nomor WhatsApp lead" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="0812-xxxx-xxxx" />
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
             <input type="email" aria-label="Email lead" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="nama@email.com" />
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status Pipeline</label>
             <select aria-label="Status pipeline lead" value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value as Lead['status'] })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
               <option value="New">New</option>
               <option value="Contacted">Contacted</option>
               <option value="Qualified">Qualified</option>
               <option value="Converted">Converted</option>
               <option value="Lost">Lost</option>
             </select>
           </div>
         </div>

         <div className="grid md:grid-cols-2 gap-4">
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Minat Program</label>
             <select aria-label="Minat program lead" value={leadForm.programOfInterest} onChange={(e) => setLeadForm({ ...leadForm, programOfInterest: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
               {programsList.map((program) => (
                 <option key={program.id} value={program.title}>{program.title}</option>
               ))}
               <option value="Konsultasi Program">Konsultasi Program</option>
               <option value="Tryout Gratis">Tryout Gratis</option>
             </select>
           </div>
           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sumber Lead</label>
             <select aria-label="Sumber lead" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
               <option>Admin Input</option>
               <option>Form Kontak Website</option>
               <option>Tryout Gratis</option>
               <option>WhatsApp</option>
               <option>Instagram</option>
               <option>Google</option>
               <option>TikTok</option>
               <option>Referral</option>
             </select>
           </div>
         </div>

         <div>
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Awal</label>
           <textarea aria-label="Catatan awal lead" value={leadForm.note || ''} onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })} className="w-full h-28 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" placeholder="Contoh: Tertarik paket premium, minta dihubungi malam hari." />
         </div>

         <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
           <div className="flex items-start gap-3">
             <Info size={18} className="text-blue-700 shrink-0 mt-0.5" />
             <p className="text-xs text-slate-600 leading-relaxed">
               Lead yang ditambahkan di sini belum otomatis menjadi siswa. Gunakan tombol Convert to Student jika calon siswa sudah siap dimasukkan ke daftar user siswa.
             </p>
           </div>
         </div>
       </div>

       <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
         <button onClick={() => setIsLeadFormOpen(false)} className="btn-secondary min-h-[44px] py-3 px-6">
           Batal
         </button>
         <button onClick={saveLeadForm} className="btn-primary min-h-[44px] py-3 px-8">
           <Save size={18} /> Simpan Lead
         </button>
       </div>
     </motion.div>
   </div>
 )}
         </AnimatePresence>
  );
}

export default AdminLeadEditorDialog;
