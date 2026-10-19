/**
 * Admin Commerce / Leads page
 * ============================
 * B1.4D-T7A — Commerce Leads extraction (`/admin/commerce/leads`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The complete legacy `activeTab === 'leads'` surface, moved verbatim out of
 * `AdminDashboard.tsx` except for the required accessibility + contrast fixes:
 * the hover-only row actions are now also revealed on keyboard focus
 * (`group-focus-within:opacity-100`), carry `aria-label`s, and are >=44x44.
 *
 * The `allLeads` ordering (persisted `localLeads` first, then in-memory
 * seed/demo leads) is preserved exactly.
 *
 * VIEW ONLY: receives the canonical Leads domain as a prop; does NOT invoke the
 * hook.
 */

import {
  MoreVertical,
  Plus,
  UserPlus,
} from 'lucide-react';
import type { UseAdminLeadsDomainResult } from './useAdminLeadsDomain';

export interface AdminLeadsPageProps {
  domain: UseAdminLeadsDomainResult;
}

export function AdminLeadsPage({ domain }: AdminLeadsPageProps) {
  const { allLeads, openNewLeadForm, setLeadPendingConvert, setSelectedLead, setLeadNoteDraft } = domain;

  return (
<div className="animate-in fade-in duration-500 space-y-6">
  <div className="flex justify-between items-center">
     <div>
        <h2 className="text-2xl font-bold text-brand-navy">Lead Management</h2>
        <p className="text-sm text-slate-500">Capture and convert potential students</p>
     </div>
     <button onClick={openNewLeadForm} className="btn-primary py-2 px-6">
        <Plus size={18} />
        Add New Lead
     </button>
  </div>

  <div className="card-premium overflow-hidden">
     <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
           <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Interest</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Source</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
           {allLeads.map((lead) => (
             <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                   <p className="text-sm font-bold text-brand-navy">{lead.name}</p>
                   <p className="text-[10px] text-slate-400 font-medium">{lead.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{lead.programOfInterest}</td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{lead.source}</span>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-amber-50 text-amber-700'
                   }`}>
                      {lead.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-2 group-hover:opacity-100 group-focus-within:opacity-100 opacity-0 transition-opacity">
                      <button
                        onClick={() => setLeadPendingConvert(lead)}
                        aria-label={`Convert ${lead.name} menjadi siswa`}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-700 hover:bg-blue-50 rounded-lg"
                        title="Convert to Student"
                      >
                         <UserPlus size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setLeadNoteDraft(lead.note || '');
                        }}
                        aria-label={`Lihat detail lead ${lead.name}`}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-lg"
                        title="Detail Lead"
                      >
                         <MoreVertical size={16} />
                      </button>
                   </div>
                </td>
             </tr>
           ))}
        </tbody>
     </table>
  </div>
</div>
  );
}

export default AdminLeadsPage;
