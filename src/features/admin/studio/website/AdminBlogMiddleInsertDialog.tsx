/**
 * Jendela Sisipan Tengah Artikel (middle insert) dialog
 *
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction.
 * Body lifted verbatim from the legacy AdminDashboard monolith; only the
 * state/op references are destructured from the injected Website domain.
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  X,
  Bot,
} from 'lucide-react';
import type { UseAdminWebsiteDomainResult } from './useAdminWebsiteDomain';

export interface AdminBlogMiddleInsertDialogProps {
  domain: UseAdminWebsiteDomainResult;
}

export function AdminBlogMiddleInsertDialog({ domain }: AdminBlogMiddleInsertDialogProps) {
  const { editingBlogPost, blogEditorAssets, isMiddleInsertOpen, setIsMiddleInsertOpen, setIsBlogAiChatOpen, middlePreviewAsset, setMiddlePreviewAsset, middlePreviewRelatedId, setMiddlePreviewRelatedId, blogPostDrafts, insertBlogContentBlock, getBlogRelatedOptions, insertBlogAsset, deleteBlogAsset } = domain;
  return (
    <AnimatePresence>
      {editingBlogPost && isMiddleInsertOpen && (
        <div className="fixed inset-0 z-[135] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold">Jendela Sisipan Tengah Artikel</h3>
                <p className="text-xs text-white/60 mt-1">Pilih gambar dan bacaan lainnya yang perlu disisipkan. Aset yang tidak perlu bisa dihapus dari database editor.</p>
              </div>
              <button onClick={() => setIsMiddleInsertOpen(false)} aria-label="Tutup jendela sisipan" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-black text-brand-navy">Pilih Gambar Tengah</p>
                      <p className="text-xs text-slate-500">Gunakan gambar dari database. Jika belum ada, import dari PC atau simpan URL internet di panel Database Gambar & Dokumen.</p>
                    </div>
                    <button onClick={() => setIsBlogAiChatOpen(true)} className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-black uppercase flex items-center gap-2"><Bot size={14} /> Bingung?</button>
                  </div>
                  {blogEditorAssets.filter((asset) => asset.type === 'image').length === 0 ? (
                    <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
                      <p className="text-sm font-black text-brand-navy">Belum ada gambar di database.</p>
                      <p className="text-xs text-slate-500 mt-1">Tutup jendela ini, lalu import dari PC atau simpan URL internet.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-3">
                      {blogEditorAssets.filter((asset) => asset.type === 'image').map((asset) => (
                        <div key={asset.id} className={`rounded-xl border p-3 ${middlePreviewAsset?.id === asset.id ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                          <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3">
                            <img src={asset.url} className="w-full h-full object-cover" alt="" />
                          </div>
                          <p className="text-xs font-black text-brand-navy truncate">{asset.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{asset.source}</p>
                          <div className="grid grid-cols-3 gap-1 mt-3">
                            <button onClick={() => setMiddlePreviewAsset(asset)} className="py-2 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase">Preview</button>
                            <button onClick={() => insertBlogAsset(asset)} className="py-2 rounded-lg bg-blue-700 text-white text-[9px] font-black uppercase">Pakai</button>
                            <button onClick={() => deleteBlogAsset(asset.id)} className="py-2 rounded-lg bg-red-50 text-red-500 text-[9px] font-black uppercase">Hapus</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="font-black text-brand-navy mb-1">Pilih Bacaan Lainnya</p>
                  <p className="text-xs text-slate-500 mb-4">Pilih artikel utama untuk rekomendasi. Sistem tetap menampilkan 3 opsi horizontal.</p>
                  <div className="grid md:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {blogPostDrafts.filter((post) => post.id !== editingBlogPost.id).map((post) => (
                      <button
                        key={post.id}
                        onClick={() => setMiddlePreviewRelatedId(post.id)}
                        className={`text-left rounded-xl border p-3 ${middlePreviewRelatedId === post.id ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-700/40'}`}
                      >
                        <p className="text-[10px] font-black text-blue-700 uppercase mb-1">{post.category}</p>
                        <p className="text-xs font-black text-brand-navy line-clamp-2">{post.title}</p>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => insertBlogContentBlock(`{{related:${middlePreviewRelatedId || blogPostDrafts.find((post) => post.id !== editingBlogPost.id)?.id || 'artikel-terkait'}}}`)}
                      className="btn-primary py-2 px-5 text-xs"
                    >
                      <BookOpen size={16} /> Sisipkan Bacaan
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-black text-brand-navy mb-3">Preview Sisipan</p>
                  <div className="rounded-xl bg-white border border-slate-200 p-3 mb-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Gambar</p>
                    {middlePreviewAsset ? (
                      <>
                        <img src={middlePreviewAsset.url} className="w-full rounded-lg border border-slate-100" alt="" />
                        <p className="text-xs font-black text-brand-navy mt-2">{middlePreviewAsset.name}</p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400">Pilih gambar untuk preview.</p>
                    )}
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Bacaan lainnya</p>
                    <div className="grid grid-cols-3 gap-2">
                      {getBlogRelatedOptions(editingBlogPost, middlePreviewRelatedId).map((post) => (
                        <div key={post.id} className="min-h-[54px] rounded-md bg-slate-50 border border-slate-200 px-2 py-2">
                          <p className="text-[10px] font-black text-brand-navy line-clamp-2">{post.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={() => middlePreviewAsset && insertBlogAsset(middlePreviewAsset)} disabled={!middlePreviewAsset} className="py-2.5 rounded-xl bg-blue-700 text-white text-[10px] font-black uppercase disabled:opacity-40">Sisipkan Gambar</button>
                    <button onClick={() => setIsMiddleInsertOpen(false)} className="py-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase">Selesai</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminBlogMiddleInsertDialog;
