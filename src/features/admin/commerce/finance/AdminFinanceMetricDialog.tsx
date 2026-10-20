/**
 * Admin Commerce / Finance Metric Detail Dialog
 * ============================================
 * B1.4D-T8 — Financial Center extraction (`/admin/commerce/finance`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/19-b1.4d-t8-finance.md
 *
 * The legacy finance metric detail modal, moved verbatim.
 */

import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import type { UseAdminFinanceDomainResult } from './useAdminFinanceDomain';

export interface AdminFinanceMetricDialogProps {
  domain: UseAdminFinanceDomainResult;
}

export function AdminFinanceMetricDialog({ domain }: AdminFinanceMetricDialogProps) {
  const { financeMetricDetail, setFinanceMetricDetail } = domain;

  return (
    <AnimatePresence>
      {financeMetricDetail && (
        <div className="fixed inset-0 z-[135] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Detail Metrik</p>
                <h3 className="text-xl font-black">{financeMetricDetail.title}</h3>
                <p className="text-xs text-white/60 mt-1">{financeMetricDetail.description}</p>
              </div>
              <button onClick={() => setFinanceMetricDetail(null)} aria-label="Tutup detail metrik" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-white/10">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama / Item</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program / Kategori</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financeMetricDetail.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-brand-navy">{row.student || row.label || '-'}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{row.program || row.category || '-'}</td>
                      <td className="px-6 py-4 text-sm font-black text-brand-navy">{typeof row.amount === 'number' ? `Rp ${row.amount.toLocaleString('id-ID')}` : row.amount || '-'}</td>
                      <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{row.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminFinanceMetricDialog;