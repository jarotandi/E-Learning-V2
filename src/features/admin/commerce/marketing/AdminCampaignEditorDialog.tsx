/**
 * Admin Commerce / Campaign Editor dialog
 * =======================================
 * B1.4D-T7B — Commerce Marketing extraction (`/admin/commerce/marketing`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/18-b1.4d-t7b-commerce-marketing.md
 *
 * The COMPLETE legacy Campaign Editor modal, moved verbatim out of
 * `AdminDashboard.tsx` (every field: name, objective, channel, landing page,
 * audience, currency, total budget, daily budget, start date, end date, note).
 * The only changes are the required accessibility + contrast fixes (labelled +
 * >=44px close, >=44px footer actions, accessible darker tokens).
 *
 * Rendered by the orchestrator as a sibling of the tab conditionals, so an
 * in-progress campaign draft survives client-side tab changes.
 */

import { AnimatePresence, motion } from 'motion/react';
import {
  Save,
  Wallet,
  X,
} from 'lucide-react';
import type { CurrencyOption, CampaignForm } from './adminMarketingData';
import type { UseAdminMarketingDomainResult } from './useAdminMarketingDomain';

export interface AdminCampaignEditorDialogProps {
  domain: UseAdminMarketingDomainResult;
}

export function AdminCampaignEditorDialog({ domain }: AdminCampaignEditorDialogProps) {
  const {
    isCampaignEditorOpen,
    campaignForm,
    setCampaignForm,
    closeCampaignEditor,
    saveCampaignDraft,
    currencyOptions,
    formatCurrencyAmount,
    campaignTotalBudget,
    campaignDailyBudget,
    campaignEstimatedDays,
  } = domain;

  return (
    <AnimatePresence>
      {isCampaignEditorOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold">New Campaign</h3>
                <p className="text-xs text-white/60 mt-1">Buat campaign digital marketing dengan budget fleksibel sesuai mata uang default.</p>
              </div>
              <button
                onClick={closeCampaignEditor}
                aria-label="Tutup editor campaign"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto grid lg:grid-cols-[1fr_300px] gap-8">
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="campaign-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Campaign</label>
                    <input
                      id="campaign-name"
                      aria-label="Nama campaign"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="campaign-objective" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Objective</label>
                    <select
                      id="campaign-objective"
                      aria-label="Objective campaign"
                      value={campaignForm.objective}
                      onChange={(e) => setCampaignForm({ ...campaignForm, objective: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                    >
                      {['Lead Generation', 'Traffic', 'Conversion', 'Brand Awareness', 'Retargeting'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="campaign-channel" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Channel</label>
                    <select
                      id="campaign-channel"
                      aria-label="Channel campaign"
                      value={campaignForm.channel}
                      onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                    >
                      {['Meta Ads', 'Google Ads', 'TikTok Ads', 'Instagram Organic', 'WhatsApp Broadcast', 'Email Campaign'].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="campaign-landing" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Landing Page</label>
                    <input
                      id="campaign-landing"
                      aria-label="Landing page campaign"
                      value={campaignForm.landingPage}
                      onChange={(e) => setCampaignForm({ ...campaignForm, landingPage: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="campaign-audience" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Audience</label>
                  <input
                    id="campaign-audience"
                    aria-label="Audience campaign"
                    value={campaignForm.audience}
                    onChange={(e) => setCampaignForm({ ...campaignForm, audience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"
                    placeholder="Contoh: siswa kelas 12, gap year, calon CPNS"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Wallet size={18} className="text-blue-700" />
                    <div>
                      <p className="text-sm font-black text-brand-navy">Budget Campaign</p>
                      <p className="text-xs text-slate-500">Isi angka bebas. Format tampilan mengikuti mata uang yang dipilih.</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="campaign-currency" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mata Uang Default</label>
                      <select
                        id="campaign-currency"
                        aria-label="Mata uang default campaign"
                        value={campaignForm.currency}
                        onChange={(e) => setCampaignForm({ ...campaignForm, currency: e.target.value as 'IDR' | 'USD' | 'SGD' | 'MYR' })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 text-sm font-bold outline-none"
                      >
                        {currencyOptions.map((currency) => (
                          <option key={currency.code} value={currency.code}>{currency.code} - {currency.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="campaign-total-budget" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Total Budget</label>
                      <input
                        id="campaign-total-budget"
                        aria-label="Total budget campaign"
                        inputMode="numeric"
                        value={campaignForm.totalBudget}
                        onChange={(e) => setCampaignForm({ ...campaignForm, totalBudget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 text-sm font-bold outline-none"
                        placeholder="5000000"
                      />
                      <p className="text-[10px] text-blue-700 font-black mt-1">{formatCurrencyAmount(campaignForm.totalBudget, campaignForm.currency)}</p>
                    </div>
                    <div>
                      <label htmlFor="campaign-daily-budget" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Budget Harian</label>
                      <input
                        id="campaign-daily-budget"
                        aria-label="Budget harian campaign"
                        inputMode="numeric"
                        value={campaignForm.dailyBudget}
                        onChange={(e) => setCampaignForm({ ...campaignForm, dailyBudget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-blue-100 text-sm font-bold outline-none"
                        placeholder="250000"
                      />
                      <p className="text-[10px] text-blue-700 font-black mt-1">{formatCurrencyAmount(campaignForm.dailyBudget, campaignForm.currency)} / hari</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="campaign-start" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Start Date</label>
                    <input
                      id="campaign-start"
                      type="date"
                      aria-label="Tanggal mulai campaign"
                      value={campaignForm.startDate}
                      onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="campaign-end" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">End Date Opsional</label>
                    <input
                      id="campaign-end"
                      type="date"
                      aria-label="Tanggal akhir campaign (opsional)"
                      value={campaignForm.endDate}
                      onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="campaign-note" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Campaign</label>
                  <textarea
                    id="campaign-note"
                    aria-label="Catatan campaign"
                    value={campaignForm.note}
                    onChange={(e) => setCampaignForm({ ...campaignForm, note: e.target.value })}
                    className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Preview Budget</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Total Budget</p>
                      <p className="text-2xl font-black text-brand-navy">{formatCurrencyAmount(campaignTotalBudget, campaignForm.currency)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Budget Harian</p>
                      <p className="text-xl font-black text-blue-700">{formatCurrencyAmount(campaignDailyBudget, campaignForm.currency)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-slate-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimasi Durasi</p>
                      <p className="text-lg font-black text-brand-navy mt-1">{campaignEstimatedDays || '-'} hari</p>
                      <p className="text-[10px] text-slate-500 mt-1">Dihitung dari total budget / budget harian.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Rincian Draft</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Channel</span><span className="font-black text-brand-navy text-right">{campaignForm.channel}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Objective</span><span className="font-black text-brand-navy text-right">{campaignForm.objective}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Landing</span><span className="font-mono font-black text-blue-700 text-right">{campaignForm.landingPage}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Currency</span><span className="font-black text-brand-navy text-right">{campaignForm.currency}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                onClick={closeCampaignEditor}
                className="min-w-[44px] min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={saveCampaignDraft}
                className="btn-primary min-h-[44px] py-2.5 px-8 shadow-xl shadow-blue-500/20"
              >
                <Save size={18} aria-hidden="true" /> Simpan Draft Campaign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminCampaignEditorDialog;