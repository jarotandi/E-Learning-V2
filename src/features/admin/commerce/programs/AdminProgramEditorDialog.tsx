/**
 * Admin Commerce / Program Editor dialog
 * ======================================
 * B1.4D-T7A — Commerce Programs extraction (`/admin/commerce/programs`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The COMPLETE legacy Program Editor modal, moved verbatim out of
 * `AdminDashboard.tsx` (every field: title, category, price, description,
 * longDescription, target, schedule, image, color, facilities, curriculum,
 * packages, package popularity, package features). The only changes are the
 * required accessibility + contrast fixes (labelled + >=44px close, >=44px
 * footer actions, accessible darker tokens).
 *
 * Rendered by the orchestrator as a sibling of the tab conditionals, so an
 * in-progress editor draft survives client-side tab changes.
 */

import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import type { ProgramPackage } from '../../../../types';
import type { UseAdminProgramsDomainResult } from './useAdminProgramsDomain';

export interface AdminProgramEditorDialogProps {
  domain: UseAdminProgramsDomainResult;
}

export function AdminProgramEditorDialog({ domain }: AdminProgramEditorDialogProps) {
  const { editingProgram, setEditingProgram, setProgramPendingSave } = domain;

  return (
         <AnimatePresence>
 {editingProgram && (
   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
         <div className="p-6 bg-brand-navy text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-xl">
                  <Award size={20} className="text-blue-300" />
               </div>
               <h3 className="font-bold">Edit Program: {editingProgram.title}</h3>
            </div>
            <button onClick={() => { setEditingProgram(null); setProgramPendingSave(null); }} aria-label="Tutup editor program" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors">
               <X size={20} />
            </button>
         </div>

         <div className="p-8 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-10">
               {/* Basic Info */}
               <div className="space-y-6">
                  <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest border-b pb-2">Program Details</h4>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program Title</label>
                        <input 
                          className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                          value={editingProgram.title}
                          onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                        <input 
                          className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                          value={editingProgram.category}
                          onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Base Price Display</label>
                        <input 
                          className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                          value={editingProgram.price}
                          onChange={(e) => setEditingProgram({ ...editingProgram, price: e.target.value })}
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Short Description</label>
                     <textarea 
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm h-20 resize-none"
                        value={editingProgram.description}
                        onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Long Description / Detail Program</label>
                     <textarea 
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm h-28 resize-none"
                        value={editingProgram.longDescription || ''}
                        onChange={(e) => setEditingProgram({ ...editingProgram, longDescription: e.target.value })}
                        placeholder="Deskripsi panjang yang muncul di halaman detail program."
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Audience</label>
                     <input 
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium"
                        value={editingProgram.target}
                        onChange={(e) => setEditingProgram({ ...editingProgram, target: e.target.value })}
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Schedule Text</label>
                     <input 
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium"
                        value={editingProgram.schedule}
                        onChange={(e) => setEditingProgram({ ...editingProgram, schedule: e.target.value })}
                        placeholder="e.g. Sen & Rab, 19:00"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Image URL</label>
                        <input 
                           className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs"
                           value={editingProgram.image}
                           onChange={(e) => setEditingProgram({ ...editingProgram, image: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Theme Color (Tailwind Class)</label>
                        <input 
                           className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs"
                           value={editingProgram.color}
                           onChange={(e) => setEditingProgram({ ...editingProgram, color: e.target.value })}
                           placeholder="bg-blue-600"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Facilities (Comma separated)</label>
                     <textarea 
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs h-20"
                        value={editingProgram.facilities?.join(', ')}
                        onChange={(e) => setEditingProgram({ ...editingProgram, facilities: e.target.value.split(',').map(f => f.trim()) })}
                     />
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Curriculum</label>
                        <button
                          type="button"
                          onClick={() => setEditingProgram({
                            ...editingProgram,
                            curriculum: [
                              ...(editingProgram.curriculum || []),
                              { week: (editingProgram.curriculum?.length || 0) + 1, topic: 'Topik Baru', description: 'Deskripsi materi.' }
                            ]
                          })}
                          className="text-[10px] font-black text-blue-700 uppercase tracking-widest hover:underline"
                        >
                          + Add Week
                        </button>
                     </div>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {(editingProgram.curriculum || []).map((item, index) => (
                          <div key={`${item.week}-${index}`} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="grid grid-cols-12 gap-2 mb-2">
                              <input
                                type="number"
                                value={item.week}
                                onChange={(event) => {
                                  const next = [...(editingProgram.curriculum || [])];
                                  next[index] = { ...item, week: Number(event.target.value) || index + 1 };
                                  setEditingProgram({ ...editingProgram, curriculum: next });
                                }}
                                className="col-span-2 px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold"
                              />
                              <input
                                value={item.topic}
                                onChange={(event) => {
                                  const next = [...(editingProgram.curriculum || [])];
                                  next[index] = { ...item, topic: event.target.value };
                                  setEditingProgram({ ...editingProgram, curriculum: next });
                                }}
                                className="col-span-9 px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold"
                                placeholder="Topik"
                              />
                              <button
                                type="button"
                                onClick={() => setEditingProgram({ ...editingProgram, curriculum: editingProgram.curriculum?.filter((_, i) => i !== index) || [] })}
                                className="col-span-1 text-slate-300 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <textarea
                              value={item.description}
                              onChange={(event) => {
                                const next = [...(editingProgram.curriculum || [])];
                                next[index] = { ...item, description: event.target.value };
                                setEditingProgram({ ...editingProgram, curriculum: next });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs h-16 resize-none"
                              placeholder="Deskripsi minggu ini"
                            />
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Packages Info */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                     <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest">Program Packages</h4>
                     <button 
                        onClick={() => {
                           const newPackage: ProgramPackage = {
                              id: `pkg-${Date.now()}`,
                              name: 'New Package',
                              price: 'Rp 0',
                              duration: '1 Bulan',
                              features: []
                           };
                           setEditingProgram({
                              ...editingProgram,
                              packages: [...(editingProgram.packages || []), newPackage]
                           });
                        }}
                        className="flex items-center gap-1 text-[10px] font-black text-blue-700 uppercase tracking-widest hover:underline"
                     >
                        <Plus size={14} /> Add Package
                     </button>
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                     {editingProgram.packages?.map((pkg, pIdx) => (
                        <div key={pkg.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative group">
                           <button 
                              onClick={() => {
                                 const newPkgs = editingProgram.packages?.filter((_, i) => i !== pIdx);
                                 setEditingProgram({ ...editingProgram, packages: newPkgs });
                              }}
                              className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <Trash2 size={14} />
                           </button>

                           <div className="grid grid-cols-2 gap-3 mb-4">
                              <div>
                                 <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Package Name</label>
                                 <input 
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                    value={pkg.name}
                                    onChange={(e) => {
                                       const newPkgs = [...(editingProgram.packages || [])];
                                       newPkgs[pIdx] = { ...pkg, name: e.target.value };
                                       setEditingProgram({ ...editingProgram, packages: newPkgs });
                                    }}
                                 />
                              </div>
                              <div>
                                 <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Price</label>
                                 <input 
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                    value={pkg.price}
                                    onChange={(e) => {
                                       const newPkgs = [...(editingProgram.packages || [])];
                                       newPkgs[pIdx] = { ...pkg, price: e.target.value };
                                       setEditingProgram({ ...editingProgram, packages: newPkgs });
                                    }}
                                 />
                              </div>
                              <div>
                                 <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Duration</label>
                                 <input 
                                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                    value={pkg.duration}
                                    onChange={(e) => {
                                       const newPkgs = [...(editingProgram.packages || [])];
                                       newPkgs[pIdx] = { ...pkg, duration: e.target.value };
                                       setEditingProgram({ ...editingProgram, packages: newPkgs });
                                    }}
                                 />
                              </div>
                              <label className="flex items-center gap-2 mt-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                 <input
                                   type="checkbox"
                                   checked={Boolean(pkg.isPopular)}
                                   onChange={(e) => {
                                      const newPkgs = [...(editingProgram.packages || [])].map((item, index) => (
                                        index === pIdx ? { ...item, isPopular: e.target.checked } : { ...item, isPopular: false }
                                      ));
                                      setEditingProgram({ ...editingProgram, packages: newPkgs });
                                   }}
                                   className="rounded border-slate-300"
                                 />
                                 Popular
                              </label>
                           </div>

                           <div>
                              <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Features (Line separated)</label>
                              <textarea 
                                 className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[10px] h-20"
                                 value={pkg.features.join('\n')}
                                 onChange={(e) => {
                                    const newPkgs = [...(editingProgram.packages || [])];
                                    newPkgs[pIdx] = { ...pkg, features: e.target.value.split('\n').filter(f => f.trim()) };
                                    setEditingProgram({ ...editingProgram, packages: newPkgs });
                                 }}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            <button 
               onClick={() => { setEditingProgram(null); setProgramPendingSave(null); }}
               className="min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors"
            >
               Discard
            </button>
            <button 
               onClick={() => setProgramPendingSave(editingProgram)}
               className="btn-primary min-h-[44px] py-2.5 px-8 shadow-xl shadow-blue-500/20"
            >
               <Save size={18} />
               Update Program
            </button>
         </div>
      </motion.div>
   </div>
 )}
         </AnimatePresence>
  );
}

export default AdminProgramEditorDialog;
