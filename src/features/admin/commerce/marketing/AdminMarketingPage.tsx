/**
 * Admin Commerce / Marketing page
 * ===============================
 * B1.4D-T7B — Commerce Marketing extraction (`/admin/commerce/marketing`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/18-b1.4d-t7b-commerce-marketing.md
 *
 * The complete legacy `activeTab === 'marketing'` surface, moved verbatim out of
 * `AdminDashboard.tsx` except for the accessibility + contrast fixes required by
 * the extraction (labelled + >=44px primary/row actions, an accessible landing
 * page edit button, and accessible darker tokens).
 *
 * VIEW ONLY: this page receives the canonical Marketing domain as a prop and does
 * NOT invoke the hook (single authority).
 */

import { useCallback } from 'react';
import {
  Calendar,
  Edit2,
  FileText,
  Layout,
  Megaphone,
  Plus,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import type { UseAdminMarketingDomainResult } from './useAdminMarketingDomain';

export interface AdminMarketingPageProps {
  domain: UseAdminMarketingDomainResult;
}

export function AdminMarketingPage({ domain }: AdminMarketingPageProps) {
  const {
    openCampaignEditor,
    demoLandingPages,
    campaignTotalBudget,
    campaignDailyBudget,
    campaignEstimatedDays,
    formatCurrencyAmount,
    openLandingPageEditor,
    notify,
  } = domain;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Marketing & Campaigns</h2>
          <p className="text-sm text-slate-500">Manage landing pages and monitor conversion funnels</p>
        </div>
        <button
          onClick={openCampaignEditor}
          className="btn-primary min-h-[44px] py-2 px-6 flex items-center gap-2"
        >
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { title: 'Campaign Setup', desc: 'Buat nama campaign, objective, channel, audience, landing page, dan catatan eksekusi.', icon: Megaphone },
          { title: 'Budget Fleksibel', desc: 'Budget total dan budget harian bisa diisi bebas dengan mata uang default IDR atau mata uang lain.', icon: Wallet },
          { title: 'Daily Control', desc: 'Estimasi durasi campaign dihitung otomatis dari total budget dibagi budget harian.', icon: Calendar },
          { title: 'Draft Mode', desc: 'Campaign baru tersimpan sebagai draft demo sebelum dieksekusi ke channel iklan.', icon: FileText },
        ].map((item) => (
          <div key={item.title} className="card-premium p-5 bg-white">
            <item.icon size={20} className="text-blue-700 mb-3" />
            <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-premium p-6">
          <TrendingUp className="text-emerald-700 mb-4" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
          <p className="text-3xl font-black text-brand-navy">4.8%</p>
          <p className="text-[10px] text-emerald-700 font-bold mt-2">+0.5% from last week</p>
        </div>
        <div className="card-premium p-6">
          <Users className="text-blue-700 mb-4" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Leads</p>
          <p className="text-3xl font-black text-brand-navy">2,450</p>
          <p className="text-[10px] text-blue-700 font-bold mt-2">Organic: 65% | Paid: 35%</p>
        </div>
        <div className="card-premium p-6">
          <Target className="text-amber-700 mb-4" size={24} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total ROI</p>
          <p className="text-3xl font-black text-brand-navy">3.2x</p>
          <p className="text-[10px] text-amber-700 font-bold mt-2">Target ROI: 4.0x</p>
        </div>
      </div>

      <div className="card-premium p-8">
        <h3 className="font-bold text-brand-navy mb-6">Landing Page Management</h3>
        <div className="space-y-4">
          {demoLandingPages.map((page, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white shadow-sm rounded-xl"><Layout size={18} className="text-slate-400" /></div>
                <div>
                  <p className="text-sm font-bold text-brand-navy">{page.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{page.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-navy">{page.hits}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Views</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${page.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  {page.status}
                </span>
                <button
                  onClick={() => openLandingPageEditor(page.name)}
                  aria-label={`Buka editor landing page ${page.name}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-blue-700 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100"
                >
                  <Edit2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMarketingPage;