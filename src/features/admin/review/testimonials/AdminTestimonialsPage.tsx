/**
 * Admin Review / Testimonials page
 * ================================
 * B1.4D-T6 — Review / Testimonials extraction (`/admin/review/testimonials`)
 *
 * The complete legacy `activeTab === 'testimonials'` surface, moved verbatim out
 * of `AdminDashboard.tsx` except for the accessibility + contrast fixes required
 * by the extraction:
 *   - filter controls and the Approve / Reject / Delete actions have an
 *     accessible name and a practical >=44px target (they used to rely on
 *     `title` alone and were ~32px);
 *   - the star row exposes an accessible rating summary and the individual
 *     stars are decorative (`aria-hidden`);
 *   - small status/program text uses accessible darker tokens on light surfaces.
 *
 * The `<motion.div layout>` card interaction is PRESERVED (extraction, not a
 * redesign). This page is VIEW ONLY: it receives the canonical testimonials
 * domain as a prop and does NOT invoke the hook.
 */

import { motion } from 'motion/react';
import {
  Check,
  Quote,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import type { UseAdminTestimonialsDomainResult } from './useAdminTestimonialsDomain';

export interface AdminTestimonialsPageProps {
  domain: UseAdminTestimonialsDomainResult;
}

export function AdminTestimonialsPage({ domain }: AdminTestimonialsPageProps) {
  const {
    testimonials,
    testimonialFilter,
    setTestimonialFilter,
    pendingTestimonials,
    approvedTestimonials,
    visibleTestimonials,
    updateTestimonialStatus,
    deleteTestimonial,
  } = domain;

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Testimonials Moderation</h2>
          <p className="text-sm text-slate-500">Manage student feedback and public testimonials</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button onClick={() => setTestimonialFilter('All')} className={`min-h-[44px] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'All' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-500 hover:text-slate-600'}`}>All ({testimonials.length})</button>
          <button onClick={() => setTestimonialFilter('Pending')} className={`min-h-[44px] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'Pending' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-500 hover:text-slate-600'}`}>Pending ({pendingTestimonials.length})</button>
          <button onClick={() => setTestimonialFilter('Approved')} className={`min-h-[44px] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'Approved' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-500 hover:text-slate-600'}`}>Approved ({approvedTestimonials.length})</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTestimonials.map((t) => (
          <motion.div
            layout
            key={t.id}
            className={`card-premium p-6 flex flex-col gap-4 border-l-4 transition-all ${
              t.status === 'Approved' ? 'border-l-emerald-500' :
              t.status === 'Rejected' ? 'border-l-red-500' :
              'border-l-amber-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={t.image} className="w-10 h-10 rounded-xl object-cover" alt="" />
                <div>
                  <p className="text-sm font-bold text-brand-navy">{t.studentName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{t.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5" role="img" aria-label={`${t.rating} dari 5 bintang`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} aria-hidden="true" className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-100 fill-slate-100'} />
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="p-3 bg-slate-50 rounded-xl">
                <Quote size={20} className="text-slate-200 mb-2" aria-hidden="true" />
                <p className="text-xs text-slate-600 italic leading-relaxed">"{t.content}"</p>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Program</p>
                <p className="text-xs font-bold text-blue-700">{t.programId || 'General'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                t.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                t.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                {t.status}
              </span>

              <div className="flex gap-2">
                {t.status !== 'Approved' && (
                  <button
                    onClick={() => updateTestimonialStatus(t.id, 'Approved')}
                    aria-label={`Setujui testimoni ${t.studentName}`}
                    title="Approve"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-700 hover:text-white transition-all shadow-sm shadow-emerald-500/10"
                  >
                    <Check size={16} aria-hidden="true" />
                  </button>
                )}
                {t.status !== 'Rejected' && (
                  <button
                    onClick={() => updateTestimonialStatus(t.id, 'Rejected')}
                    aria-label={`Tolak testimoni ${t.studentName}`}
                    title="Reject"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-red-50 text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-all shadow-sm shadow-red-500/10"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={() => deleteTestimonial(t.id)}
                  aria-label={`Hapus testimoni ${t.studentName}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-200 transition-all"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AdminTestimonialsPage;
