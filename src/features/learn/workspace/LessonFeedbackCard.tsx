/**
 * Lesson Feedback Card
 * ====================
 * B1.4C — LearningPage decomposition
 *
 * Rating stars + feedback textarea with submit action.
 * Uses AnimatePresence for success state transition.
 */

import { Star, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card } from '@/design-system/components';

interface LessonFeedbackCardProps {
  initialFeedback?: string;
  onSubmit: (rating: number, feedback: string) => void;
}

export function LessonFeedbackCard({ initialFeedback = '', onSubmit }: LessonFeedbackCardProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-reset after success
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
        setFeedback('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit(rating, feedback);
    setIsSubmitted(true);
  };

  return (
    <Card variant="default" padding="lg" className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg text-brand-teal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        Beri Feedback Materi
      </h3>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-emerald-50 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-6 border border-emerald-100"
          >
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/50">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-emerald-900 mb-2">Terima Kasih!</h4>
              <p className="text-emerald-700 font-medium">Feedback kamu sangat berharga untuk peningkatan kualitas belajar kita.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`p-1.5 transition-all hover:scale-125 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                    aria-label={`Beri rating ${s} dari 5`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={s <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 9 14.14 2.81 8.26 6 9.27 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Beri rating video ini</p>
            </div>

            <div className="group relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ada bagian yang kurang jelas? Atau punya saran perbaikan?"
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-brand-teal/5 focus:bg-white focus:border-brand-teal outline-none transition-all min-h-[140px] shadow-inner"
              />
              <button
                type="submit"
                disabled={rating === 0}
                className="absolute bottom-6 right-6 px-4 py-3 bg-brand-teal text-white rounded-xl shadow-xl shadow-brand-teal/20 disabled:opacity-30 disabled:shadow-none transition-all flex items-center gap-2 font-bold text-xs"
              >
                Kirim Feedback
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default LessonFeedbackCard;