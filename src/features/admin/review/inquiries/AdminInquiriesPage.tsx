/**
 * Admin Review / Inquiries page
 * ==============================
 * B1.4D-T6 — Review / Inquiries extraction (`/admin/review/inquiries`)
 *
 * The complete legacy `activeTab === 'inquiries'` surface, moved verbatim out of
 * `AdminDashboard.tsx` except for the accessibility + contrast fixes required by
 * the extraction (labelled + >=44px primary actions, an accessible answer field
 * name, and accessible darker colour tokens on light surfaces).
 *
 * This page is VIEW ONLY: it receives the canonical inquiries domain as a prop
 * and does NOT invoke the hook (single authority — see `useAdminInquiriesDomain`).
 *
 * Note (preserved legacy behaviour): the answer `<textarea>` stays UNCONTROLLED
 * with `id={`answer-${question.id}`}` + `defaultValue`, and Save reads the DOM
 * node locally. B1.4D is decomposition, so that quirk is preserved deliberately.
 */

import {
  MessageSquare,
  RefreshCw,
  Save,
} from 'lucide-react';
import type { UseAdminInquiriesDomainResult } from './useAdminInquiriesDomain';

export interface AdminInquiriesPageProps {
  domain: UseAdminInquiriesDomainResult;
}

export function AdminInquiriesPage({ domain }: AdminInquiriesPageProps) {
  const {
    websiteQuestions,
    inquiryStats,
    saveWebsiteQuestionAnswer,
    openQuestionWhatsapp,
    syncQuestionsFromStorage,
  } = domain;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Pertanyaan dari Website</h2>
          <p className="text-sm text-slate-500">Menampung semua pertanyaan dari form kontak dan tombol WhatsApp, termasuk nomor penanya.</p>
        </div>
        <button
          onClick={syncQuestionsFromStorage}
          className="btn-secondary min-h-[44px] py-2 px-5 flex items-center gap-2"
        >
          <RefreshCw size={18} /> Sync Data
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Total Pertanyaan', value: inquiryStats.total, color: 'text-blue-700' },
          { label: 'Belum Dibalas', value: inquiryStats.unanswered, color: 'text-amber-700' },
          { label: 'Sudah Dibalas', value: inquiryStats.answered, color: 'text-emerald-700' },
        ].map((stat) => (
          <div key={stat.label} className="card-premium p-6">
            <MessageSquare className={`${stat.color} mb-3`} size={22} aria-hidden="true" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-brand-navy mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {websiteQuestions.length === 0 && (
          <div className="card-premium p-10 text-center">
            <p className="font-bold text-brand-navy">Belum ada pertanyaan masuk.</p>
            <p className="text-sm text-slate-500 mt-1">Pertanyaan dari halaman kontak dan direct WhatsApp akan muncul di sini.</p>
          </div>
        )}
        {websiteQuestions.map((question) => (
          <div key={question.id} className="card-premium p-6 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${question.status === 'Dibalas' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{question.status}</span>
                  <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase">{question.source}</span>
                  <span className="text-[10px] text-slate-500 font-bold">{question.createdAt}</span>
                </div>
                <h3 className="text-lg font-black text-brand-navy">{question.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{question.email} - WA: {question.phone || '-'}</p>
                <p className="text-xs font-bold text-blue-700 mt-1">{question.programOfInterest}</p>
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{question.question}</p>
                </div>
              </div>
              <div className="lg:w-[420px] space-y-3">
                <label htmlFor={`answer-${question.id}`} className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Jawaban Admin</label>
                <textarea
                  id={`answer-${question.id}`}
                  aria-label={`Jawaban admin untuk ${question.name}`}
                  defaultValue={question.adminAnswer || `Halo ${question.name}, terima kasih sudah menghubungi The Prams. `}
                  className="w-full h-32 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600"
                />
                {question.answeredAt && <p className="text-[10px] text-slate-500">Terakhir dijawab: {question.answeredAt}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const textarea = document.getElementById(`answer-${question.id}`) as HTMLTextAreaElement | null;
                      saveWebsiteQuestionAnswer(question, textarea?.value || '');
                    }}
                    className="flex-1 btn-primary min-h-[44px] py-2.5"
                  >
                    <Save size={16} aria-hidden="true" /> Simpan Jawaban
                  </button>
                  <button
                    onClick={() => openQuestionWhatsapp(question)}
                    aria-label={`Buka WhatsApp untuk ${question.name}`}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminInquiriesPage;
