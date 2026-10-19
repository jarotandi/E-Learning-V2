/**
 * Admin Commerce / Lead Detail dialog
 * ===================================
 * B1.4D-T7A — Commerce Leads extraction (`/admin/commerce/leads`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The COMPLETE legacy "Detail Lead" dialog, moved verbatim: the information
 * cards, the "Interpretasi Lead" callout, the follow-up note + "Simpan Catatan",
 * the status card, the "Update Pipeline" actions, "Hubungi WhatsApp",
 * "Convert to Student" and "Export Detail" — no functionality omitted.
 *
 * The only changes are the required accessibility fixes (labelled + >=44px
 * close, an accessible note-field name, >=44px actions) and accessible darker
 * tokens. `downloadTextFile` is the monolith's shared CSV helper, passed in as a
 * narrow adapter (the Leads domain itself injects only programs/users/persistUsers/
 * notify/recordAudit).
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

export interface AdminLeadDetailDialogProps {
  domain: UseAdminLeadsDomainResult;
  /** Shared CSV download helper from the orchestrator (no new dependency). */
  downloadTextFile: (filename: string, content: string, mime?: string) => void;
}

export function AdminLeadDetailDialog({ domain, downloadTextFile }: AdminLeadDetailDialogProps) {
  const {
    selectedLead,
    setSelectedLead,
    leadNoteDraft,
    setLeadNoteDraft,
    updateLeadStatus,
    openLeadWhatsapp,
    setLeadPendingConvert,
    notify,
  } = domain;

  return (
         <AnimatePresence>
 {selectedLead && (
   <div className="fixed inset-0 z-[123] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
     <motion.div
       initial={{ opacity: 0, scale: 0.96, y: 12 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       exit={{ opacity: 0, scale: 0.96, y: 12 }}
       className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
     >
       <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
         <div className="flex items-center gap-3">
           <UserPlus size={22} className="text-amber-300" />
           <div>
             <h3 className="font-bold">Detail Lead</h3>
             <p className="text-[10px] text-white/50 uppercase tracking-widest">Calon siswa sebelum menjadi user aktif</p>
           </div>
         </div>
         <button onClick={() => setSelectedLead(null)} aria-label="Tutup detail lead" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full">
           <X size={20} />
         </button>
       </div>

       <div className="p-8 grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
           <div className="grid md:grid-cols-2 gap-4">
             {[
               ['Nama', selectedLead.name],
               ['Email', selectedLead.email],
               ['WhatsApp', selectedLead.phone],
               ['Tanggal Masuk', selectedLead.createdAt],
               ['Minat Program', selectedLead.programOfInterest],
               ['Sumber Lead', selectedLead.source],
             ].map(([label, value]) => (
               <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                 <p className="text-sm font-bold text-brand-navy break-words">{value || '-'}</p>
               </div>
             ))}
           </div>

           <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
             <div className="flex items-start gap-3">
               <Info size={18} className="text-blue-700 shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm font-black text-brand-navy mb-1">Interpretasi Lead</p>
                 <p className="text-xs text-slate-600 leading-relaxed">
                   Lead ini adalah calon siswa yang sudah menunjukkan minat, tetapi belum tentu menjadi siswa aktif. Jika sudah siap ikut program, gunakan Convert to Student atau arahkan ke pendaftaran paket.
                 </p>
               </div>
             </div>
           </div>

           <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Follow-up Admin</label>
             <textarea
               value={leadNoteDraft}
               onChange={(event) => setLeadNoteDraft(event.target.value)}
               aria-label="Catatan follow-up lead"
               className="w-full h-32 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600"
               placeholder="Contoh: Sudah dihubungi, tertarik paket premium tetapi menunggu diskusi orang tua."
             />
             <button
               onClick={() => {
                 updateLeadStatus(selectedLead, selectedLead.status, leadNoteDraft);
                 notify('Catatan lead disimpan.');
               }}
               className="mt-3 btn-secondary min-h-[44px] py-2 px-5"
             >
               <Save size={16} /> Simpan Catatan
             </button>
           </div>
         </div>

         <div className="space-y-5">
           <div className="card-premium p-5 bg-white">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Lead</p>
             <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
               selectedLead.status === 'Converted' ? 'bg-emerald-50 text-emerald-700' :
               selectedLead.status === 'Lost' ? 'bg-red-50 text-red-700' :
               selectedLead.status === 'Qualified' ? 'bg-blue-50 text-blue-700' :
               'bg-amber-50 text-amber-700'
             }`}>
               {selectedLead.status}
             </span>
             <p className="text-[10px] text-slate-400 mt-3">Terakhir dihubungi: {selectedLead.lastContactedAt || '-'}</p>
           </div>

           <div className="card-premium p-5 bg-white">
             <p className="text-sm font-black text-brand-navy mb-4">Update Pipeline</p>
             <div className="grid grid-cols-2 gap-2">
               {(['New', 'Contacted', 'Qualified', 'Lost'] as Lead['status'][]).map((status) => (
                 <button
                   key={status}
                   onClick={() => {
                     updateLeadStatus(selectedLead, status, leadNoteDraft);
                     notify(`Status lead menjadi ${status}.`);
                   }}
                   className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedLead.status === status ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                 >
                   {status}
                 </button>
               ))}
             </div>
           </div>

           <div className="card-premium p-5 bg-white space-y-3">
             <button onClick={() => openLeadWhatsapp(selectedLead)} className="w-full min-h-[44px] py-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest">
               Hubungi WhatsApp
             </button>
             <button onClick={() => setLeadPendingConvert(selectedLead)} className="w-full btn-primary min-h-[44px] py-3 text-xs uppercase tracking-widest">
               <UserPlus size={16} /> Convert to Student
             </button>
             <button
               onClick={() => {
                 const csv = [
                   'field,value',
                   `name,"${selectedLead.name}"`,
                   `email,"${selectedLead.email}"`,
                   `phone,"${selectedLead.phone}"`,
                   `program,"${selectedLead.programOfInterest}"`,
                   `source,"${selectedLead.source}"`,
                   `status,"${selectedLead.status}"`,
                   `note,"${leadNoteDraft}"`
                 ].join('\n');
                 downloadTextFile(`lead-${selectedLead.id}.csv`, csv);
               }}
               className="w-full min-h-[44px] py-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest"
             >
               Export Detail
             </button>
           </div>
         </div>
       </div>
     </motion.div>
   </div>
 )}
         </AnimatePresence>
  );
}

export default AdminLeadDetailDialog;
