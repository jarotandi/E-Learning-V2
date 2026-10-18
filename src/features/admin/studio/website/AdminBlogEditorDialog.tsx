/**
 * Editor Info Menarik & Literasi dialog (incl. asset DB + floating AI helper)
 *
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction.
 * Body lifted verbatim from the legacy AdminDashboard monolith; only the
 * state/op references are destructured from the injected Website domain.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  BookOpen,
  Search,
  Trash2,
  FileText,
  Layout,
  Upload,
  Save,
  X,
  Info,
  Quote,
  Target,
  Image as ImageIcon,
  Bot,
  Link,
} from 'lucide-react';
import type { BlogPost } from '../../../../types';
import { BLOG_EDITOR_TEMPLATES } from './adminWebsiteData';
import { BLOG_POSTS } from '../../../../constants';
import type { UseAdminWebsiteDomainResult } from './useAdminWebsiteDomain';

export interface AdminBlogEditorDialogProps {
  domain: UseAdminWebsiteDomainResult;
}

export function AdminBlogEditorDialog({ domain }: AdminBlogEditorDialogProps) {
  const { editingBlogPost, setEditingBlogPost, setPreviewBlogPost, blogEditorAssets, setEditingBlogAsset, setIsMiddleInsertOpen, isBlogAiChatOpen, setIsBlogAiChatOpen, internetAssetUrl, setInternetAssetUrl, internetAssetName, setInternetAssetName, aiChatPrompt, setAiChatPrompt, aiChatDraft, blogPostDrafts, saveBlogPost, insertBlogContentBlock, getBlogRelatedOptions, saveBlogEditorAssets, addInternetBlogAsset, importBlogAssetFromPc, insertBlogAsset, deleteBlogAsset, generateAiBlogDraft } = domain;
  return (
    <AnimatePresence>
      {editingBlogPost && (
        <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={22} className="text-amber-300" />
                <div>
                  <h3 className="font-bold">Editor Info Menarik & Literasi</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Tersinkron ke menu Info Menarik</p>
                  <p className="text-xs text-white/70 mt-1 max-w-2xl">
                    Form ini mengatur kartu blog, halaman detail artikel, gambar tengah, bacaan lainnya, metadata author, tag, dan isi Markdown yang tampil di website publik.
                  </p>
                </div>
              </div>
              <button onClick={() => setEditingBlogPost(null)} aria-label="Tutup editor Info Menarik" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-b border-slate-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Template Cepat</p>
                  <p className="text-xs text-slate-500">Gunakan struktur artikel panjang tanpa mengubah desain halaman Info Menarik.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOG_EDITOR_TEMPLATES.map((template) => (
                    <button
                      key={template.label}
                      onClick={() => setEditingBlogPost({
                        ...editingBlogPost,
                        title: template.title,
                        excerpt: template.excerpt,
                        category: template.category,
                        content: template.content,
                        tags: template.tags
                      })}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-700 hover:border-blue-700"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 overflow-y-auto grid lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul</label>
                  <input aria-label="Judul artikel" value={editingBlogPost.title} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ringkasan Kartu</label>
                  <textarea aria-label="Ringkasan kartu" value={editingBlogPost.excerpt} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })} className="w-full h-24 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kategori</label>
                    <select aria-label="Kategori" value={editingBlogPost.category} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, category: e.target.value as BlogPost['category'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold">
                      <option>Tips & Trik</option>
                      <option>Info PTN</option>
                      <option>Materi</option>
                      <option>Inspirasi</option>
                      <option>Literasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Read Time</label>
                    <input aria-label="Read time" value={editingBlogPost.readTime} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, readTime: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Publish</label>
                  <input aria-label="Tanggal publish" value={editingBlogPost.date} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, date: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="30 April 2026" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL Gambar Utama</label>
                  <input aria-label="URL gambar utama" value={editingBlogPost.image} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, image: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                </div>
                <div className="grid md:grid-cols-[140px_1fr] gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="aspect-video rounded-xl overflow-hidden bg-white border border-slate-100">
                    <img src={editingBlogPost.image || BLOG_POSTS[0].image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-brand-navy mb-1">Rincian Gambar</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Gambar utama dipakai untuk kartu di menu Info Menarik, hero gambar di detail artikel, dan default gambar tengah jika artikel belum punya gambar sisipan. Untuk gambar di tengah bacaan, gunakan tombol Tambah Gambar Tengah.
                    </p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-black text-brand-navy mb-2">Sisipan Tengah Artikel</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">Kelola gambar tengah dan bacaan lainnya lewat jendela khusus: pilih aset yang perlu disisipkan, hapus aset yang tidak perlu, dan preview sebelum masuk artikel.</p>
                  <div className="grid md:grid-cols-3 gap-2">
                    <button
                      onClick={() => setIsMiddleInsertOpen(true)}
                      className="px-4 py-3 rounded-xl bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Layout size={15} /> Buka Jendela Sisipan
                    </button>
                    <button
                      onClick={() => insertBlogContentBlock(`![Gambar pendukung: ${editingBlogPost.title}](${editingBlogPost.image || BLOG_POSTS[0].image})`)}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-blue-700 uppercase tracking-widest hover:border-blue-700 flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={15} /> Tambah Gambar Tengah
                    </button>
                    <button
                      onClick={() => insertBlogContentBlock(`{{related:${blogPostDrafts.find((item) => item.id !== editingBlogPost.id)?.id || blogPostDrafts[0]?.id || 'artikel-terkait'}}}`)}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-blue-700 uppercase tracking-widest hover:border-blue-700 flex items-center justify-center gap-2"
                    >
                      <BookOpen size={15} /> Tambah Bacaan Lainnya
                    </button>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm font-black text-brand-navy">Database Gambar & Dokumen</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">Impor dari PC atau simpan URL internet, lalu pilih aset untuk disisipkan ke artikel.</p>
                    </div>
                    <ImageIcon size={18} className="text-blue-700 shrink-0" />
                  </div>
                  <div className="grid md:grid-cols-[1fr_auto] gap-2 mb-3">
                    <label className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-blue-700 uppercase tracking-widest hover:border-blue-700 flex items-center justify-center gap-2 cursor-pointer">
                      <Upload size={15} /> Import dari PC
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                        aria-label="Import aset dari PC"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) importBlogAssetFromPc(file);
                          e.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <button
                      onClick={() => window.open('https://unsplash.com/s/photos/education-learning', '_blank', 'noopener,noreferrer')}
                      className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-700 hover:border-blue-700 flex items-center justify-center gap-2"
                    >
                      <Search size={15} /> Cari Internet
                    </button>
                  </div>
                  <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
                    <input aria-label="Nama aset internet" value={internetAssetName} onChange={(e) => setInternetAssetName(e.target.value)} className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs outline-none" placeholder="Nama aset" />
                    <input aria-label="URL aset internet" value={internetAssetUrl} onChange={(e) => setInternetAssetUrl(e.target.value)} className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs outline-none" placeholder="Paste URL gambar/dokumen" />
                    <button onClick={addInternetBlogAsset} className="px-4 py-3 rounded-xl bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-center">
                      <Link size={14} /> Simpan
                    </button>
                  </div>
                  {blogEditorAssets.length === 0 ? (
                    <p className="text-xs text-slate-400">Belum ada aset tersimpan.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {blogEditorAssets.map((asset) => (
                        <div key={asset.id} className="rounded-xl bg-white border border-slate-200 p-3">
                          <div className="flex gap-3">
                            <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                              {asset.type === 'image' ? <img src={asset.url} className="w-full h-full object-cover" alt="" /> : <FileText size={20} className="text-slate-400" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black text-brand-navy truncate">{asset.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">{asset.source} - {asset.type}</p>
                              <input aria-label={`Catatan aset ${asset.name}`} value={asset.note} onChange={(e) => saveBlogEditorAssets(blogEditorAssets.map((item) => item.id === asset.id ? { ...item, note: e.target.value } : item))} className="mt-1 w-full text-[10px] bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 outline-none" />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => insertBlogAsset(asset)} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase">Sisipkan</button>
                            <button onClick={() => setEditingBlogAsset(asset)} className="px-3 py-2 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-black uppercase">Edit</button>
                            <button onClick={() => deleteBlogAsset(asset.id)} aria-label={`Hapus aset ${asset.name}`} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-slate-50 text-red-600"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot size={18} className="text-amber-300" />
                    <div>
                      <p className="text-sm font-black">AI Chat Agent Artikel</p>
                      <p className="text-xs text-white/50">Bantu buat draft heading, paragraf, checklist, atau CTA lalu sisipkan ke konten.</p>
                    </div>
                  </div>
                  <textarea aria-label="Prompt AI chat agent" value={aiChatPrompt} onChange={(e) => setAiChatPrompt(e.target.value)} className="w-full h-20 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-xs outline-none" placeholder="Contoh: buatkan bagian bacaan literasi tentang cara mencari ide pokok..." />
                  <div className="flex gap-2 mt-3">
                    <button onClick={generateAiBlogDraft} className="px-4 py-2 rounded-xl bg-brand-orange text-brand-navy text-[10px] font-black uppercase">Buat Draft</button>
                    {aiChatDraft && <button onClick={() => insertBlogContentBlock(aiChatDraft)} className="px-4 py-2 rounded-xl bg-white text-brand-navy text-[10px] font-black uppercase">Sisipkan Draft</button>}
                  </div>
                  {aiChatDraft && (
                    <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-black/30 p-3 text-[10px] leading-relaxed whitespace-pre-wrap text-white/80">{aiChatDraft}</pre>
                  )}
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-sm font-black text-brand-navy mb-2">Rincian Bacaan Lainnya</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    Bacaan lainnya tampil sebagai 3 opsi horizontal di tengah artikel. Jika admin memilih satu artikel melalui blok Bacaan Lainnya, artikel itu menjadi opsi pertama dan dua sisanya diambil otomatis dari daftar Info Menarik.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {getBlogRelatedOptions(editingBlogPost).map((item) => (
                      <div key={item.id} className="rounded-lg bg-white border border-slate-200 px-2 py-2">
                        <p className="text-[10px] font-black text-brand-navy leading-snug line-clamp-2">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Author</label>
                    <input aria-label="Author" value={editingBlogPost.author} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, author: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" placeholder="Author" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Role Author</label>
                    <input aria-label="Role author" value={editingBlogPost.authorRole} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, authorRole: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" placeholder="Author role" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL Avatar Author</label>
                  <input aria-label="URL avatar author" value={editingBlogPost.authorAvatar} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, authorAvatar: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tags (pisahkan koma)</label>
                  <input aria-label="Tags (pisahkan koma)" value={editingBlogPost.tags.join(', ')} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, tags: e.target.value.split(',') })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-sm font-black text-brand-navy mb-2">Panduan isi artikel</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                    <span>Minimal 4 heading</span>
                    <span>1 checklist praktis</span>
                    <span>Contoh penerapan</span>
                    <span>CTA lembut ke program</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Kartu Info Menarik</p>
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase">Live</span>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <img src={editingBlogPost.image || BLOG_POSTS[0].image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[9px] font-black uppercase">{editingBlogPost.category}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{editingBlogPost.readTime || '5 min read'}</span>
                  </div>
                  <h4 className="text-lg font-black text-brand-navy leading-tight">{editingBlogPost.title || 'Judul Artikel'}</h4>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">{editingBlogPost.excerpt || 'Ringkasan artikel akan tampil di sini.'}</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                    <img src={editingBlogPost.authorAvatar || 'https://i.pravatar.cc/150?u=admin'} className="w-9 h-9 rounded-full" alt="" />
                    <div>
                      <p className="text-xs font-black text-brand-navy">{editingBlogPost.author || 'Admin The Prams'}</p>
                      <p className="text-[10px] text-slate-400">{editingBlogPost.date || 'Tanggal publish'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blok Layout Artikel</p>
                      <p className="text-xs text-slate-500 mt-1">Sisipkan elemen seperti editor slide: gambar tengah, bacaan lainnya, quote, highlight, atau CTA.</p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[9px] font-black text-slate-400 uppercase">Flexible</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      {
                        label: 'Heading',
                        icon: FileText,
                        block: '## Subjudul Baru\n\nTulis paragraf pembuka untuk bagian ini.'
                      },
                      {
                        label: 'Gambar Tengah',
                        icon: ImageIcon,
                        block: `![Tulis caption gambar di sini](${editingBlogPost.image || BLOG_POSTS[0].image})`
                      },
                      {
                        label: 'Bacaan Lainnya',
                        icon: BookOpen,
                        block: `{{related:${blogPostDrafts.find((item) => item.id !== editingBlogPost.id)?.id || blogPostDrafts[0]?.id || 'artikel-terkait'}}}`
                      },
                      {
                        label: 'Quote',
                        icon: Quote,
                        block: '> Tulis kutipan penting atau insight utama di sini.'
                      },
                      {
                        label: 'Highlight',
                        icon: Info,
                        block: '> **Catatan penting:** Tulis ringkasan poin kunci yang perlu diperhatikan pembaca.'
                      },
                      {
                        label: 'CTA',
                        icon: Target,
                        block: '## Siap Latihan Lebih Terarah?\n\nIkuti tryout gratis The Prams untuk melihat analisis kemampuan dan rekomendasi belajar yang sesuai targetmu.'
                      }
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => insertBlogContentBlock(item.block)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-700 hover:border-blue-700 transition-colors"
                      >
                        <item.icon size={14} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Konten Markdown</label>
                  <textarea aria-label="Konten Markdown" value={editingBlogPost.content} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })} className="w-full h-[360px] px-5 py-4 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 outline-none font-mono text-xs leading-relaxed" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Kata', value: editingBlogPost.content.trim().split(/\s+/).filter(Boolean).length },
                    { label: 'Heading', value: (editingBlogPost.content.match(/^##?\s/gm) || []).length },
                    { label: 'Tags', value: editingBlogPost.tags.filter(Boolean).length }
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase">{stat.label}</p>
                      <p className="text-lg font-black text-brand-navy">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 max-h-[420px] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Isi Artikel</p>
                    <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Markdown</span>
                  </div>
                  <div className="blog-article text-sm leading-6">
                    <Markdown
                      components={{
                        p: ({ children }) => {
                          const text = React.Children.toArray(children).join('').trim();
                          const relatedId = text.match(/^\{\{related:(.+)\}\}$/)?.[1];
                          const related = relatedId ? blogPostDrafts.find((item) => item.id === relatedId) : null;
                          const relatedOptions = getBlogRelatedOptions(editingBlogPost, related?.id);
                          if (relatedId && relatedOptions.length) {
                            return (
                              <div className="my-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 whitespace-nowrap">Bacaan lainnya</p>
                                  <span className="h-px flex-1 bg-slate-200" />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {relatedOptions.map((item) => (
                                    <div key={item.id} className="min-h-[48px] rounded-md bg-white border border-slate-200 px-2 py-1.5">
                                      <p className="text-[10px] font-black text-brand-navy leading-snug mb-0 line-clamp-2">{item.title}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          return <p>{children}</p>;
                        }
                      }}
                    >
                      {editingBlogPost.content}
                    </Markdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => setPreviewBlogPost(editingBlogPost)} className="btn-secondary py-2.5 px-6">Preview Draft</button>
              <div className="flex gap-3">
                <button onClick={() => setEditingBlogPost(null)} className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100">Batal</button>
                <button onClick={() => saveBlogPost(editingBlogPost)} className="btn-primary py-2.5 px-8">
                  <Save size={18} /> Simpan & Publish
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsBlogAiChatOpen((value) => !value)}
              aria-label="AI Chat Agent"
              className="absolute right-6 bottom-24 w-14 h-14 rounded-full bg-blue-700 text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
              title="AI Chat Agent"
            >
              <Bot size={24} />
            </button>
            {isBlogAiChatOpen && (
              <div className="absolute right-6 bottom-40 w-[320px] rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-black">AI Chat Agent</p>
                    <p className="text-[10px] text-white/50">Bantu pilih sisipan atau buat draft.</p>
                  </div>
                  <button onClick={() => setIsBlogAiChatOpen(false)} aria-label="Tutup AI chat" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1 hover:bg-white/10 rounded-lg"><X size={14} /></button>
                </div>
                <textarea aria-label="Prompt AI chat agent" value={aiChatPrompt} onChange={(e) => setAiChatPrompt(e.target.value)} className="w-full h-20 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs outline-none" placeholder="Contoh: gambar apa yang cocok untuk artikel ini?" />
                <div className="flex gap-2 mt-3">
                  <button onClick={generateAiBlogDraft} className="px-3 py-2 rounded-xl bg-brand-orange text-brand-navy text-[10px] font-black uppercase">Buat</button>
                  {aiChatDraft && <button onClick={() => insertBlogContentBlock(aiChatDraft)} className="px-3 py-2 rounded-xl bg-white text-brand-navy text-[10px] font-black uppercase">Sisipkan</button>}
                  <button onClick={() => setIsMiddleInsertOpen(true)} className="ml-auto px-3 py-2 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase">Sisipan</button>
                </div>
                {aiChatDraft && <pre className="mt-3 max-h-32 overflow-auto rounded-xl bg-black/30 p-3 text-[10px] whitespace-pre-wrap text-white/80">{aiChatDraft}</pre>}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminBlogEditorDialog;
