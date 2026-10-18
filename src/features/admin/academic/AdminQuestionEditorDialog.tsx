/**
 * Admin Question Editor Dialog
 * =============================
 * B1.4D-T4 — Academic / Question Bank extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/13-b1.4d-t4-academic.md
 *
 * The complete "Edit Question" modal, extracted out of `AdminDashboard`.
 * Behaviour, fields, copy and the save/cancel semantics are preserved exactly.
 *
 * The dialog is presentational: the in-progress record is owned by the domain
 * hook, so edits are reported through `onChange` and the save through `onSave`.
 *
 * The editor remains a MODAL — no `/admin/questions/:id` route was created.
 *
 * ## Accessibility (T4)
 *
 *  - close button has `aria-label` and a 44px target;
 *  - the correct-answer controls are 44x44 and expose `aria-pressed`;
 *  - the selected correct-answer / selected tag styling uses an accessible dark
 *    emerald instead of white text on the raw brand teal.
 */

import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Save, Tags, X } from 'lucide-react';

import { Button } from '../../../design-system/components';
import type { Question } from '../../../types';

export interface AdminQuestionEditorDialogProps {
  /** The question being edited, or null to render nothing. */
  question: Question | null;
  /** The tag registry offered for this question. */
  availableTags: string[];
  /** Report an updated in-progress record. */
  onChange: (question: Question) => void;
  /** Toggle one tag on/off the in-progress record. */
  onToggleTag: (tag: string) => void;
  /** Register a new tag (if absent) and toggle it on. */
  onAddAndToggleTag: (tag: string) => void;
  /** Close without saving. */
  onClose: () => void;
  /** Persist the (already mutated) record. */
  onSave: (question: Question) => void;
}

export function AdminQuestionEditorDialog({
  question,
  availableTags,
  onChange,
  onToggleTag,
  onAddAndToggleTag,
  onClose,
  onSave,
}: AdminQuestionEditorDialogProps) {
  return (
    <AnimatePresence>
      {question && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <BookOpen size={20} className="text-emerald-300" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold">Edit Question</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Question ID: {question.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup editor soal"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Question Content</label>
                  <textarea
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 h-40 resize-none focus:border-emerald-600 transition-colors"
                    value={question.text}
                    onChange={(e) => onChange({ ...question, text: e.target.value })}
                    placeholder="Enter question text here..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Answer Options</label>
                  <div className="space-y-3">
                    {question.options.map((opt, idx) => (
                      <div key={idx} className="flex gap-3">
                        <button
                          onClick={() => onChange({ ...question, correctOptionId: opt.id })}
                          aria-pressed={question.correctOptionId === opt.id}
                          aria-label={`Jadikan opsi ${opt.id} sebagai jawaban benar`}
                          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-black transition-all ${question.correctOptionId === opt.id ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {opt.id}
                        </button>
                        <input
                          className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium text-slate-600 focus:border-emerald-600 transition-colors"
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...question.options];
                            newOpts[idx] = { ...opt, text: e.target.value };
                            onChange({ ...question, options: newOpts });
                          }}
                          placeholder={`Option ${opt.id}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Subject</label>
                    <select
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-bold text-slate-600"
                      value={question.subject}
                      onChange={(e) => onChange({ ...question, subject: e.target.value as Question['subject'] })}
                    >
                      <option>Penalaran Umum</option>
                      <option>Literasi Bahasa</option>
                      <option>Penalaran Matematika</option>
                      <option>Pengetahuan Umum</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Difficulty</label>
                    <select
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-bold text-slate-600"
                      value={question.difficulty}
                      onChange={(e) => onChange({ ...question, difficulty: e.target.value as Question['difficulty'] })}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Explanation / Discussion</label>
                  <textarea
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 h-32 resize-none focus:border-emerald-600 transition-colors text-sm"
                    value={question.explanation}
                    onChange={(e) => onChange({ ...question, explanation: e.target.value })}
                    placeholder="Explain the correct answer steps..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Organization & Tags</label>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => onToggleTag(tag)}
                          aria-pressed={question.tags?.includes(tag) ?? false}
                          className={`min-h-[36px] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${question.tags?.includes(tag) ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-600'}`}
                        >
                          {tag}
                        </button>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="New tag..."
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 outline-none focus:border-emerald-600 w-24"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val && !availableTags.includes(val)) {
                                onAddAndToggleTag(val);
                                (e.target as HTMLInputElement).value = '';
                              }
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                      <div className="flex gap-2">
                        <Tags size={16} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-widest">
                          Tags help in filtering questions during tryout generation and IRT analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${question.text.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  Text
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${question.options.every((o) => o.text.length > 0) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  Options
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${question.explanation.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  Exp
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => onSave(question)}>
                  <Save size={18} aria-hidden="true" />
                  Save Question
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminQuestionEditorDialog;
