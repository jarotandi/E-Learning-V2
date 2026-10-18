/**
 * Admin Question Tags Dialog
 * ===========================
 * B1.4D-T4 — Academic / Question Bank extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/13-b1.4d-t4-academic.md
 *
 * The "Manage Question Categories" modal, extracted out of `AdminDashboard`.
 * The tag registry is owned by the domain hook; this dialog is presentational.
 *
 * No tag persistence is invented — the registry stays in memory, exactly as
 * before.
 *
 * ## Accessibility (T4)
 *
 *  - close button has `aria-label` and a 44px target;
 *  - each tag delete control has a descriptive `aria-label`.
 */

import { AnimatePresence, motion } from 'motion/react';
import { Info, Tags, X } from 'lucide-react';

import { Button } from '../../../design-system/components';

export interface AdminQuestionTagsDialogProps {
  /** Whether the dialog is open. */
  isOpen: boolean;
  /** The current new-tag draft. */
  newTagInput: string;
  /** The tag registry. */
  availableTags: string[];
  /** Update the new-tag draft. */
  onNewTagInputChange: (value: string) => void;
  /** Register a tag (only added when absent). */
  onAddTag: (tag: string) => void;
  /** Remove a tag from the registry. */
  onRemoveTag: (tag: string) => void;
  /** Close the dialog. */
  onClose: () => void;
}

export function AdminQuestionTagsDialog({
  isOpen,
  newTagInput,
  availableTags,
  onNewTagInputChange,
  onAddTag,
  onRemoveTag,
  onClose,
}: AdminQuestionTagsDialogProps) {
  const submit = () => {
    if (newTagInput.trim()) {
      onAddTag(newTagInput.trim());
      onNewTagInputChange('');
    }
  };

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
                <Tags size={24} className="text-emerald-300" aria-hidden="true" />
                <h3 className="font-bold">Manage Question Categories</h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup kategori soal"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add new category/tag..."
                    value={newTagInput}
                    onChange={(e) => onNewTagInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submit();
                    }}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                  />
                  <Button variant="primary" onClick={submit}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl group hover:border-emerald-600 transition-all">
                      <span className="text-xs font-bold text-brand-navy">{tag}</span>
                      <button
                        onClick={() => onRemoveTag(tag)}
                        aria-label={`Hapus tag ${tag}`}
                        className="min-w-[32px] min-h-[32px] flex items-center justify-center p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all rounded-lg"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>

                {availableTags.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Tags size={32} className="text-slate-200" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No categories defined yet.</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl flex items-start gap-3">
                <Info size={20} className="text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">Semantic Tagging</h5>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Use consistent tags for better reporting. Suggestions: IRT-Stable, High-Discrimination, or sub-topics.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminQuestionTagsDialog;
