/**
 * Admin Commerce / Programs page
 * ==============================
 * B1.4D-T7A — Commerce Programs extraction (`/admin/commerce/programs`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The complete legacy `activeTab === 'programs'` surface, moved verbatim out of
 * `AdminDashboard.tsx` except for the accessibility + contrast fixes required by
 * the extraction (labelled + >=44px primary/row actions, an accessible search
 * field name, keyboard-revealed row actions, and accessible darker tokens).
 *
 * VIEW ONLY: this page receives the canonical Programs domain as a prop and does
 * NOT invoke the hook (single authority). `onNewProgram` is the legacy
 * contextual-add adapter wired to `AdminDashboard.runContextualAdd`.
 */

import {
  BookOpen,
  DollarSign,
  Edit2,
  Filter,
  Globe,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import type { UseAdminProgramsDomainResult } from './useAdminProgramsDomain';

export interface AdminProgramsPageProps {
  domain: UseAdminProgramsDomainResult;
  /** Legacy contextual-add adapter (delegates to the canonical draft factory). */
  onNewProgram: () => void;
}

export function AdminProgramsPage({ domain, onNewProgram }: AdminProgramsPageProps) {
  const {
    programsList,
    programCategories,
    filteredProgramsList,
    programSearchTerm,
    setProgramSearchTerm,
    programCategoryFilter,
    setProgramCategoryFilter,
    editingProgram,
    setEditingProgram,
    deleteProgram,
    resetProgramsToDefault,
  } = domain;

  return (
<div className="animate-in fade-in duration-500 space-y-6">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
     <div>
        <h2 className="text-2xl font-bold text-brand-navy">Program Inventory & Curriculum</h2>
        <p className="text-sm text-slate-500">Manage all educational offerings and their detailed specifications</p>
     </div>
     <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            value={programSearchTerm}
            onChange={(event) => setProgramSearchTerm(event.target.value)}
            placeholder="Search programs..." aria-label="Cari program"
            className="text-sm bg-transparent border-none focus:ring-0 font-medium"
          />
        </div>
        <button
          onClick={resetProgramsToDefault}
          className="btn-secondary min-h-[44px] py-2 px-5 whitespace-nowrap"
        >
           Reset
        </button>
        <button
          onClick={onNewProgram}
          className="btn-primary min-h-[44px] py-2 px-6 whitespace-nowrap"
        >
           <Plus size={18} />
           New Program
        </button>
     </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
     {[
       { label: 'Courses', value: String(programsList.length), icon: BookOpen, color: 'text-blue-700' },
       { label: 'Packages', value: String(programsList.reduce((sum, program) => sum + (program.packages?.length || 0), 0)), icon: DollarSign, color: 'text-emerald-700' },
       { label: 'Categories', value: String(programCategories.length - 1), icon: TrendingUp, color: 'text-amber-700' },
       { label: 'Published', value: String(programsList.length), icon: Globe, color: 'text-indigo-500' }
     ].map((p, i) => (
       <div key={i} className="card-premium p-5 flex flex-col gap-2">
          <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${p.color}`}>
             <p.icon size={20} />
          </div>
          <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{p.label}</p>
             <p className="text-lg font-black text-brand-navy">{p.value}</p>
          </div>
       </div>
     ))}
  </div>

  <div className="card-premium overflow-hidden">
     <div className="p-6 border-b border-slate-100 flex items-center gap-4">
        <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
           <Filter size={14} />
           <span>Category:</span>
           <select
             value={programCategoryFilter}
             onChange={(event) => setProgramCategoryFilter(event.target.value)}
             className="bg-transparent outline-none font-black text-slate-600"
           >
             {programCategories.map((category) => (
               <option key={category} value={category}>{category}</option>
             ))}
           </select>
        </label>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
           <TrendingUp size={14} />
           <span>Sort: Newest</span>
        </div>
     </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50/50">
           <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program & Schedule</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
           </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
           {filteredProgramsList.map((item) => (
             <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-brand-navy line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium italic">{item.schedule || 'TBA'}</p>
                     </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                </td>
                <td className="px-6 py-4">
                   <p className="text-sm font-black text-brand-navy">{item.price}</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase">{item.packages?.length || 0} Packages</p>
                </td>
                <td className="px-6 py-4">
                   <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingProgram(item)}
                        aria-label={`Edit program ${item.title}`}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-blue-700 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteProgram(item.id)}
                        aria-label={`Hapus program ${item.title}`}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-red-700 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
             </tr>
           ))}
        </tbody>
     </table>
     {filteredProgramsList.length === 0 && (
       <div className="p-10 text-center text-sm font-bold text-slate-400">
         Tidak ada program yang cocok dengan filter editor.
       </div>
     )}

  </div>
</div>
  );
}

export default AdminProgramsPage;
