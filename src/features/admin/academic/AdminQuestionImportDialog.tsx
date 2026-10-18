/**
 * Admin Question Import Dialog
 * =============================
 * B1.4D-T4 — Academic / Question Bank extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/13-b1.4d-t4-academic.md
 *
 * The "Batch Question Import" modal, extracted out of `AdminDashboard`.
 *
 * ## Demo simulation — NOT a real CSV parser
 *
 * The source does not parse CSV. Selecting a file only flips through
 * `idle -> processing -> done` and appends two fixed demo questions. T4
 * preserves that exactly and does NOT add a parser dependency. The `.csv`
 * selection is a "file presence" trigger only.
 *
 * ## Template download stays owned by AdminDashboard
 *
 * The template button calls the business `downloadTextFile(...)` helper through
 * the narrow `onDownloadTemplate` callback — the generic download helper is NOT
 * moved into the academic domain.
 *
 * ## Accessibility (T4)
 *
 * The close button has `aria-label` and a 44px target.
 */

import { AnimatePresence, motion } from 'motion/react';
import { Check, FileUp, Upload, X } from 'lucide-react';

import type { ChangeEvent } from 'react';

import type { QuestionImportStatus } from './useAdminQuestionsDomain';

export interface AdminQuestionImportDialogProps {
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** The simulated import state. */
  importStatus: QuestionImportStatus;
  /** File-selection handler (demo: only checks file presence). */
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Download the CSV template via the business helper. */
  onDownloadTemplate: () => void;
  /** Close the dialog. */
  onClose: () => void;
}

export function AdminQuestionImportDialog({
  isOpen,
  importStatus,
  onFileChange,
  onDownloadTemplate,
  onClose,
}: AdminQuestionImportDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp size={24} className="text-amber-300" aria-hidden="true" />
                <h3 className="font-bold">Batch Question Import</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup import soal"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-emerald-600 transition-colors relative">
                {importStatus === 'idle' ? (
                  <>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                      <Upload size={32} className="text-slate-400 group-hover:text-emerald-700" aria-hidden="true" />
                    </div>
                    <h4 className="font-bold text-brand-navy mb-1">Click or drag CSV file</h4>
                    <p className="text-xs text-slate-400 mb-6">Compatible with standard The Prams mapping</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={onFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase">.CSV</span>
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase">Max 5MB</span>
                    </div>
                  </>
                ) : importStatus === 'processing' ? (
                  <div className="py-8 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-emerald-700/20 border-t-emerald-700 rounded-full animate-spin mb-4" />
                    <h4 className="font-bold text-brand-navy mb-1">Processing Questions...</h4>
                    <p className="text-xs text-slate-400">Mapping fields and verifying structure</p>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                      <Check size={32} className="text-emerald-600" aria-hidden="true" />
                    </div>
                    <h4 className="font-bold text-brand-navy mb-1">Import Successful!</h4>
                    <p className="text-xs text-slate-400">Questions have been added to your bank</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CSV Mapping Guide</h5>
                <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold">
                  <div className="text-slate-500">text</div>
                  <div className="text-brand-navy text-right">Question Payload</div>
                  <div className="text-slate-500">option_a, b, c...</div>
                  <div className="text-brand-navy text-right">Choices Array</div>
                  <div className="text-slate-500">correct_ans</div>
                  <div className="text-brand-navy text-right">Key (A-E)</div>
                  <div className="text-slate-500">tags</div>
                  <div className="text-brand-navy text-right">Comma separated</div>
                </div>
                <button
                  onClick={onDownloadTemplate}
                  className="min-h-[44px] w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-700 transition-all"
                >
                  Download CSV Template
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminQuestionImportDialog;
