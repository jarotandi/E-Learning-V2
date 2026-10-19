/**
 * Admin Commerce / Lead Convert dialog
 * ====================================
 * B1.4D-T7A — Commerce Leads extraction (`/admin/commerce/leads`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The legacy "Convert lead menjadi siswa?" dialog, moved verbatim: it shows the
 * lead's program, email and phone, **Batal** cancels, **Ya, Convert** runs the
 * canonical `convertLeadToStudent` (which persists the Student through the
 * canonical Users domain — no second Users store). Accessibility: both actions
 * >=44px and an accessible darker token on the accent.
 */

import { AnimatePresence, motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import type { UseAdminLeadsDomainResult } from './useAdminLeadsDomain';

export interface AdminLeadConvertDialogProps {
  domain: UseAdminLeadsDomainResult;
}

export function AdminLeadConvertDialog({ domain }: AdminLeadConvertDialogProps) {
  const { leadPendingConvert, setLeadPendingConvert, convertLeadToStudent } = domain;

  return (
         <AnimatePresence>
 {leadPendingConvert && (
   <div className="fixed inset-0 z-[126] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
     <motion.div
       initial={{ opacity: 0, scale: 0.96, y: 12 }}
       animate={{ opacity: 1, scale: 1, y: 0 }}
       exit={{ opacity: 0, scale: 0.96, y: 12 }}
       className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
     >
       <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
         <UserPlus size={26} />
       </div>
       <h3 className="text-xl font-black text-brand-navy mb-2">Convert lead menjadi siswa?</h3>
       <p className="text-sm text-slate-500 leading-relaxed mb-6">
         Lead <span className="font-bold text-brand-navy">{leadPendingConvert.name}</span> akan dibuat sebagai user siswa trial/gratis dan status lead berubah menjadi Converted.
       </p>
       <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
         <p className="text-xs font-bold text-brand-navy">{leadPendingConvert.programOfInterest}</p>
         <p className="text-[10px] text-slate-400 mt-1">{leadPendingConvert.email} - {leadPendingConvert.phone}</p>
       </div>
       <div className="grid grid-cols-2 gap-3">
         <button
           onClick={() => setLeadPendingConvert(null)}
           className="btn-secondary min-h-[44px] py-3"
         >
           Batal
         </button>
         <button
           onClick={() => convertLeadToStudent(leadPendingConvert)}
           className="btn-primary min-h-[44px] py-3"
         >
           Ya, Convert
         </button>
       </div>
     </motion.div>
   </div>
 )}
         </AnimatePresence>
  );
}

export default AdminLeadConvertDialog;
