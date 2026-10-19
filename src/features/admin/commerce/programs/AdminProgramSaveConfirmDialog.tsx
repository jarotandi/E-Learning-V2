/**
 * Admin Commerce / Program Save confirmation dialog
 * =================================================
 * B1.4D-T7A — Commerce Programs extraction (`/admin/commerce/programs`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The legacy "Simpan Perubahan Program?" dialog, moved verbatim: **Tidak** clears
 * the pending save, **Ya, Update** commits it through the canonical
 * `saveProgram`. No new persistence. Accessibility: both actions >=44px, and the
 * small accent text uses an accessible darker token.
 */

import { AnimatePresence, motion } from 'motion/react';
import { Save } from 'lucide-react';
import type { UseAdminProgramsDomainResult } from './useAdminProgramsDomain';

export interface AdminProgramSaveConfirmDialogProps {
  domain: UseAdminProgramsDomainResult;
}

export function AdminProgramSaveConfirmDialog({ domain }: AdminProgramSaveConfirmDialogProps) {
  const { programPendingSave, setProgramPendingSave, saveProgram } = domain;

  return (
         <AnimatePresence>
 {programPendingSave && (
   <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
     <motion.div
       initial={{ opacity: 0, scale: 0.96, y: 12 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       exit={{ opacity: 0, scale: 0.96, y: 12 }}
       className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
     >
       <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
         <Save size={26} />
       </div>
       <h3 className="text-xl font-black text-brand-navy mb-2">Simpan Perubahan Program?</h3>
       <p className="text-sm text-slate-500 leading-relaxed mb-8">
         Perubahan pada <span className="font-bold text-blue-700">{programPendingSave.title}</span> akan tersinkron ke menu program, detail program, form pendaftaran, dan pembayaran.
       </p>
       <div className="grid grid-cols-2 gap-3">
         <button
           type="button"
           onClick={() => setProgramPendingSave(null)}
           className="min-h-[44px] px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-50"
         >
           Tidak
         </button>
         <button
           type="button"
           onClick={() => saveProgram(programPendingSave)}
           className="btn-primary min-h-[44px] py-3 text-xs uppercase tracking-widest font-black"
         >
           Ya, Update
         </button>
       </div>
     </motion.div>
   </div>
 )}
         </AnimatePresence>
  );
}

export default AdminProgramSaveConfirmDialog;
