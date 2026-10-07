/**
 * Lesson Feedback Dialog
 * ======================
 * B1.4C — LearningPage decomposition
 *
 * Accessible feedback/rating dialog (was "Mentor Modal").
 * Uses disclosure pattern, not role="menu".
 */

import { Star, Send, CheckCircle2, X, Monitor, Star as StarIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card } from '@/design-system/components';

interface LessonFeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  onSubmit: (rating: number, question: string) => void;
}

export function LessonFeedbackDialog({
  isOpen,
  onClose,
  lessonTitle,
  onSubmit,
}: LessonFeedbackDialogProps) {
  const [rating, setRating] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [isQuestionSent, setIsQuestionSent] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, questionText);
    setQuestionText('');
    setRating(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative z-10 pointer-events-auto"
        >
          <div className="p-8 bg-brand-navy text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 9 14.14 2.81 8.26 6 9.27 12 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none mb-1">Feedback Pelajaran</h3>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Bantu kami meningkatkan materi ini</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors min-w-11 min-h-11"
              aria-label="Tutup dialog feedback"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="p-10 space-y-8">
            <AnimatePresence mode="wait">
              {isQuestionSent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="bg-emerald-50 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-6 border border-emerald-100"
                >
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-900 mb-2">Terima Kasih!</h4>
                  <p className="text-emerald-700 font-medium">Feedback kamu telah kami simpan untuk pengembangan selanjutnya.</p>
                  <button
                    onClick={onClose}
                    className="mt-4 btn-secondary"
                  >
                    Tutup
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={(e) => { e.preventDefault(); if (rating === 0) return; }}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-4">
                    <p className="text-sm font-bold text-slate-500">Beri rating untuk materi "<span className="text-brand-teal">{lessonTitle}</span>"</p>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className={`p-2 transition-all hover:scale-125 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                          aria-label={`Beri rating ${s} dari 5`}
                        >
                          <svg width="36" height="36" viewBox="0 0 24 24" fill={s <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 9 14.14 2.81 8.26 6 9.27 12 2" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Apa pendapatmu tentang video ini? (Opsional)"
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl min-h-[140px] outline-none focus:ring-4 focus:ring-brand-teal/5 focus:border-brand-teal transition-all font-medium text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (rating === 0) return;
                      setIsQuestionSent(true);
                      setTimeout(() => {
                        setIsQuestionSent(false);
                        setRating(0);
                        setQuestionText('');
                        onClose();
                      }, 2000);
                    }}
                    disabled={rating === 0}
                    className="w-full btn-orange py-5 rounded-[1.5rem] shadow-xl shadow-brand-orange/20 disabled:opacity-50 disabled:shadow-none"
                  >
                    Bagikan Feedback
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default LessonFeedbackDialog;