/**
 * Save Website confirmation dialog
 *
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction.
 * Body lifted verbatim from the legacy AdminDashboard monolith; only the
 * state/op references are destructured from the injected Website domain.
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  Save,
} from 'lucide-react';
import type { UseAdminWebsiteDomainResult } from './useAdminWebsiteDomain';

export interface AdminWebsiteSaveConfirmDialogProps {
  domain: UseAdminWebsiteDomainResult;
}

export function AdminWebsiteSaveConfirmDialog({ domain }: AdminWebsiteSaveConfirmDialogProps) {
  const { isSaveWebsiteConfirmOpen, setIsSaveWebsiteConfirmOpen, notify } = domain;
  return (
    <AnimatePresence>
      {isSaveWebsiteConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <motion.div
             initial={{ opacity: 0, scale: 0.96, y: 12 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.96, y: 12 }}
             className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
           >
             <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
               <Save size={28} />
             </div>
             <h3 className="text-2xl font-black text-brand-navy mb-3">Simpan perubahan website?</h3>
             <p className="text-sm text-slate-500 leading-relaxed mb-8">
               Perubahan UI akan disimpan sebagai draft Website Editor. Pilih Iya untuk menyimpan, atau Tidak untuk kembali mengedit tanpa menyimpan.
             </p>
             <div className="grid grid-cols-2 gap-3">
               <button
                 onClick={() => {
                   setIsSaveWebsiteConfirmOpen(false);
                   notify('Perubahan website tidak disimpan.');
                 }}
                 className="btn-secondary py-4"
               >
                 Tidak
               </button>
               <button
                 onClick={() => {
                   setIsSaveWebsiteConfirmOpen(false);
                   notify('Perubahan website berhasil disimpan sebagai draft.');
                 }}
                 className="btn-primary py-4"
               >
                 Iya
               </button>
             </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminWebsiteSaveConfirmDialog;
