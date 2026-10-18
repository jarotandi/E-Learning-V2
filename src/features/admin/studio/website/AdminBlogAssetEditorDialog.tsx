/**
 * Edit Aset Editor Blog dialog
 *
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction.
 * Body lifted verbatim from the legacy AdminDashboard monolith; only the
 * state/op references are destructured from the injected Website domain.
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  Save,
  X,
} from 'lucide-react';
import type { BlogEditorAsset } from './adminWebsiteData';
import type { UseAdminWebsiteDomainResult } from './useAdminWebsiteDomain';

export interface AdminBlogAssetEditorDialogProps {
  domain: UseAdminWebsiteDomainResult;
}

export function AdminBlogAssetEditorDialog({ domain }: AdminBlogAssetEditorDialogProps) {
  const { blogEditorAssets, editingBlogAsset, setEditingBlogAsset, saveBlogEditorAssets, notify } = domain;
  return (
    <AnimatePresence>
      {editingBlogAsset && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-5 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold">Edit Aset Editor Blog</h3>
                <p className="text-xs text-white/60">Ubah nama, URL, tipe, dan catatan aset database.</p>
              </div>
              <button onClick={() => setEditingBlogAsset(null)} aria-label="Tutup aset editor" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Aset</label>
                <input aria-label="Nama aset" value={editingBlogAsset.name} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipe</label>
                  <select aria-label="Tipe aset" value={editingBlogAsset.type} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, type: e.target.value as BlogEditorAsset['type'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                    <option value="image">Image</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sumber</label>
                  <select aria-label="Sumber aset" value={editingBlogAsset.source} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, source: e.target.value as BlogEditorAsset['source'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                    <option value="pc">PC</option>
                    <option value="internet">Internet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL / Data File</label>
                <textarea aria-label="URL atau data file" value={editingBlogAsset.url} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, url: e.target.value })} className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan</label>
                <input aria-label="Catatan aset" value={editingBlogAsset.note} onChange={(e) => setEditingBlogAsset({ ...editingBlogAsset, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
              </div>
            </div>
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setEditingBlogAsset(null)} className="px-5 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase">Batal</button>
              <button
                onClick={() => {
                  saveBlogEditorAssets(blogEditorAssets.map((asset) => asset.id === editingBlogAsset.id ? editingBlogAsset : asset));
                  setEditingBlogAsset(null);
                  notify('Aset editor berhasil diperbarui.');
                }}
                className="btn-primary py-2.5 px-6"
              >
                <Save size={16} /> Simpan Aset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminBlogAssetEditorDialog;
