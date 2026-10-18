/**
 * Admin Studio / Website Editor page surface
 *
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction.
 * Body lifted verbatim from the legacy AdminDashboard monolith; only the
 * state/op references are destructured from the injected Website domain.
 */

import {
  CheckCircle2,
  Plus,
  Search,
  Trash2,
  FileText,
  Copy,
  X,
  Layout,
  Globe,
  Target,
  Smartphone,
  Image as ImageIcon,
} from 'lucide-react';
import { BLOG_EDITOR_TEMPLATES } from './adminWebsiteData';
import type { UseAdminWebsiteDomainResult } from './useAdminWebsiteDomain';

export interface AdminWebsiteEditorPageProps {
  domain: UseAdminWebsiteDomainResult;
  onPreviewWebsite?: () => void;
}

export function AdminWebsiteEditorPage({ domain, onPreviewWebsite }: AdminWebsiteEditorPageProps) {
  const { setIsSaveWebsiteConfirmOpen, setEditingBlogPost, setPreviewBlogPost, blogPostDrafts, blogEditorSearchTerm, setBlogEditorSearchTerm, blogEditorCategory, setBlogEditorCategory, blogCategoryOptions, visibleBlogPosts, blogEditorStats, createBlogPostDraft, syncBlogPostsToWebsite, deleteBlogPost, duplicateBlogPost, notify } = domain;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Website Editor Panel</h2>
          <p className="text-sm text-slate-500">Panel editing visual untuk mengatur UI, konten, layout, brand, responsive behavior, dan SEO website publik.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onPreviewWebsite?.()} className="btn-secondary py-2 px-6">Preview Changes</button>
          <button onClick={() => setIsSaveWebsiteConfirmOpen(true)} className="btn-secondary py-2 px-6">Save Changes</button>
          <button onClick={() => notify('Update website dipublikasikan di mode demo.')} className="btn-primary py-2 px-6">Publish Updates</button>
        </div>
      </div>

      <div className="card-premium p-8 bg-white">
        <h3 className="font-bold text-brand-navy mb-6">Rincian Menu Website Editor</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Preview Changes', detail: 'Melihat hasil perubahan draft di halaman landing sebelum disimpan atau dipublikasikan.' },
            { name: 'Save Changes', detail: 'Menyimpan draft konfigurasi UI. Saat diklik muncul konfirmasi Iya/Tidak.' },
            { name: 'Publish Updates', detail: 'Mempublikasikan draft agar dianggap aktif di website publik pada mode demo.' },
            { name: 'Home Hero Section', detail: 'Mengubah konten hero, gambar, overlay, tinggi section, dan alignment teks.' },
            { name: 'Section Builder', detail: 'Mengatur urutan section, menambah section, toggle visibility, dan membuka editor section.' },
            { name: 'Typography System', detail: 'Mengatur gaya heading, body text, dan button text agar konsisten.' },
            { name: 'CTA & Button Style', detail: 'Mengatur teks tombol, gaya button, dan tampilan CTA utama.' },
            { name: 'Global Navigation', detail: 'Mengatur item navbar, tambah menu, dan hapus menu dari draft.' },
            { name: 'Brand Identity', detail: 'Mengatur warna brand, card radius, surface style, dan shadow system.' },
            { name: 'Responsive Controls', detail: 'Mengatur perilaku UI di mobile/tablet seperti stacking, spacing, dan visibility.' },
            { name: 'Reusable Components', detail: 'Membuka editor komponen yang dipakai berulang: card, accordion, testimonial, footer.' },
            { name: 'SEO Metadata', detail: 'Mengatur preview Google, SEO title, meta description, dan SEO tags.' },
          ].map((item) => (
            <div key={item.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-sm font-black text-brand-navy mb-1">{item.name}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-8 bg-white">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
          <div>
            <h3 className="font-bold text-brand-navy">Editor Info Menarik & Literasi</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
              Tulis, edit, dan publish blog/artikel literasi yang tampil di menu Info Menarik. Perubahan judul, ringkasan, gambar, isi artikel, tag, author, bacaan lainnya, dan gambar tengah langsung dipakai halaman blog publik setelah disimpan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setPreviewBlogPost(visibleBlogPosts[0] || blogPostDrafts[0] || null)} className="btn-secondary py-2 px-4 text-xs">Preview Draft</button>
            <button onClick={() => syncBlogPostsToWebsite()} className="btn-secondary py-2 px-4 text-xs">Publish / Sinkronkan</button>
            <button onClick={() => createBlogPostDraft('Literasi')} className="btn-primary py-2 px-5 flex items-center gap-2 text-xs">
              <Plus size={18} /> Tulis Artikel
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {[
            { title: 'Yang Tampil di Publik', desc: 'Kartu artikel di menu Info Menarik dan halaman detail blog memakai data dari editor ini.' },
            { title: 'Isi Artikel Fleksibel', desc: 'Konten mendukung Markdown, gambar tengah, bacaan lainnya 3 opsi, quote, highlight, CTA, dan heading.' },
            { title: 'Alur Sinkron', desc: 'Simpan & Publish membuat artikel langsung masuk daftar publik; Preview membuka halaman Info Menarik.' }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">{item.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Artikel', value: blogEditorStats.total },
            { label: 'Konten Literasi', value: blogEditorStats.literasi },
            { label: 'Info Menarik', value: blogEditorStats.infoMenarik },
            { label: 'Total Kata', value: blogEditorStats.words }
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-brand-navy mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              value={blogEditorSearchTerm}
              onChange={(e) => setBlogEditorSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-blue-700"
              placeholder="Cari judul, ringkasan, author, atau tag..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {blogCategoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setBlogEditorCategory(category)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${blogEditorCategory === category ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-slate-500 border-slate-200 hover:text-blue-700'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {BLOG_EDITOR_TEMPLATES.map((template) => (
            <button
              key={template.label}
              onClick={() => createBlogPostDraft(template.category)}
              className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-[10px] font-black text-blue-700 uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-colors"
            >
              {template.label}
            </button>
          ))}
        </div>

        {visibleBlogPosts.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <FileText size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="font-black text-brand-navy">Belum ada artikel yang cocok</p>
            <p className="text-sm text-slate-500 mt-1">Ubah filter pencarian atau buat artikel baru.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visibleBlogPosts.map((post) => (
              <div key={post.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col">
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img src={post.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[9px] font-black uppercase">{post.category}</span>
                  <span className="text-[9px] text-slate-400 font-bold">{post.readTime}</span>
                  <span className="ml-auto text-[9px] text-slate-400 font-bold">{post.date}</span>
                </div>
                <p className="text-sm font-black text-brand-navy line-clamp-2">{post.title}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-lg bg-white border border-slate-100 text-[9px] font-bold text-slate-400">#{tag.trim()}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <img src={post.authorAvatar} className="w-7 h-7 rounded-full" alt="" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-brand-navy truncate">{post.author}</p>
                    <p className="text-[9px] text-slate-400 truncate">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setEditingBlogPost(post)} aria-label={`Edit artikel ${post.title}`} className="flex-1 min-h-[44px] py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-blue-700 uppercase">Edit</button>
                  <button onClick={() => duplicateBlogPost(post)} aria-label={`Duplikasi artikel ${post.title}`} title="Duplikasi artikel" className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-700">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => deleteBlogPost(post.id)} aria-label={`Hapus artikel ${post.title}`} title="Hapus artikel" className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { title: 'Hero Section', desc: 'Mengatur judul utama, sub-headline, dan gambar pembuka halaman depan.', icon: Layout },
          { title: 'Navigation', desc: 'Mengelola menu navbar publik seperti Beranda, Program, Tryout, Testimoni, dan Kontak.', icon: Globe },
          { title: 'Brand Identity', desc: 'Meninjau warna brand utama dan sekunder yang dipakai di landing page.', icon: ImageIcon },
          { title: 'SEO Metadata', desc: 'Mengatur judul pencarian, deskripsi Google preview, dan tag SEO dasar.', icon: Search },
          { title: 'Typography', desc: 'Mengatur skala heading, gaya body text, weight, dan jarak antar elemen.', icon: FileText },
          { title: 'Section Layout', desc: 'Mengatur urutan section, padding, container width, dan visibilitas blok halaman.', icon: Layout },
          { title: 'CTA Buttons', desc: 'Mengatur teks tombol utama, link tujuan, warna, radius, dan gaya hover.', icon: Target },
          { title: 'Responsive UI', desc: 'Mengontrol tampilan desktop/mobile, spacing, dan prioritas konten di layar kecil.', icon: Smartphone },
        ].map((item) => (
          <div key={item.title} className="card-premium p-5 bg-white">
            <item.icon size={20} className="text-blue-700 mb-3" />
            <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium p-8">
            <h3 className="font-bold text-brand-navy mb-6">Home Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hero Title</label>
                <input className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold" defaultValue="Wujudkan Mimpi Menjadi Dokter Bersama The Prams" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sub-headline</label>
                <textarea className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 h-24" defaultValue="Bimbingan belajar spesialis persiapan masuk Kedokteran dan sekolah kedinasan dengan metode penalaran yang teruji." />
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <ImageIcon className="text-slate-300" size={32} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-brand-navy">Hero Background Image</p>
                  <p className="text-[10px] text-slate-400">Recommended: 1920x1080px (Max 2MB)</p>
                </div>
                <button onClick={() => notify('Pemilih gambar hero dibuka di mode demo.')} className="px-4 py-2 bg-white rounded-lg text-[10px] font-bold text-blue-700 border border-slate-200">Change Image</button>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hero Height</label>
                  <select onChange={() => notify('Tinggi hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                    <option>Large 750px</option>
                    <option>Medium 640px</option>
                    <option>Compact 520px</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Overlay</label>
                  <select onChange={() => notify('Overlay hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                    <option>Navy Gradient</option>
                    <option>Dark Soft</option>
                    <option>Light Clean</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Text Align</label>
                  <select onChange={() => notify('Alignment hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                    <option>Left</option>
                    <option>Center</option>
                    <option>Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-brand-navy">Section Builder</h3>
              <button onClick={() => notify('Section baru ditambahkan ke draft halaman.')} className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Add Section</button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Hero Carousel', status: 'Visible', order: '01' },
                { name: 'Program Unggulan', status: 'Visible', order: '02' },
                { name: 'Why Choose The Prams', status: 'Visible', order: '03' },
                { name: 'Mentor Preview', status: 'Visible', order: '04' },
                { name: 'Testimonials', status: 'Hidden Mobile', order: '05' },
                { name: 'FAQ Section', status: 'Visible', order: '06' },
              ].map((section) => (
                <div key={section.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400">{section.order}</span>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{section.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{section.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => notify(`${section.name} dipindahkan ke atas.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Up</button>
                    <button onClick={() => notify(`Visibilitas ${section.name} diubah.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Toggle</button>
                    <button onClick={() => notify(`Editor ${section.name} dibuka.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-blue-700">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-premium p-8">
              <h3 className="font-bold text-brand-navy mb-6">Typography System</h3>
              <div className="space-y-4">
                {['H1 Display', 'Section Heading', 'Body Text', 'Button Text'].map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{type}</span>
                    <select onChange={() => notify(`${type} typography diperbarui.`)} className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold">
                      <option>Default</option>
                      <option>Compact</option>
                      <option>Bold</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-premium p-8">
              <h3 className="font-bold text-brand-navy mb-6">CTA & Button Style</h3>
              <div className="space-y-4">
                <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" defaultValue="Lihat Program" />
                <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" defaultValue="Ikut Tryout Gratis" />
                <div className="grid grid-cols-3 gap-3">
                  {['Solid', 'Outline', 'Soft'].map((style) => (
                    <button key={style} onClick={() => notify(`Style CTA ${style} dipilih.`)} className="py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase">{style}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium p-8">
            <h3 className="font-bold text-brand-navy mb-6">Global Navigation</h3>
            <div className="flex flex-wrap gap-3">
              {['Beranda', 'Program', 'Tryout', 'Testimoni', 'Kontak'].map(nav => (
                <div key={nav} className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-sm font-bold text-brand-navy">{nav}</span>
                  <button onClick={() => notify(`Menu ${nav} dihapus dari draft navigasi.`)} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
                </div>
              ))}
              <button onClick={() => notify('Menu baru ditambahkan ke draft navigasi.')} className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Add Menu</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-premium p-8 bg-brand-navy text-white">
            <h3 className="font-bold mb-6">Brand Identity</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Primary Color</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-blue rounded-xl" />
                  <code className="text-xs text-white/60">#2563EB</code>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Secondary Color</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange rounded-xl" />
                  <code className="text-xs text-white/60">#F59E0B</code>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Surface & Border Radius</p>
                <div className="grid grid-cols-2 gap-3">
                  <select onChange={() => notify('Style card diperbarui.')} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs">
                    <option>Card 8px</option>
                    <option>Card 12px</option>
                    <option>Card 16px</option>
                  </select>
                  <select onChange={() => notify('Shadow system diperbarui.')} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs">
                    <option>Soft Shadow</option>
                    <option>Flat</option>
                    <option>Elevated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium p-8">
            <h3 className="font-bold text-brand-navy mb-4">Responsive Controls</h3>
            <div className="space-y-3">
              {[
                'Mobile hero text wraps before CTA',
                'Hide decorative stats on small screens',
                'Stack program cards on mobile',
                'Compress navbar spacing on tablet',
              ].map((rule) => (
                <button key={rule} onClick={() => notify(`${rule} diperbarui.`)} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
                  <span className="text-xs font-bold text-slate-600">{rule}</span>
                  <CheckCircle2 size={16} className="text-emerald-700" />
                </button>
              ))}
            </div>
          </div>

          <div className="card-premium p-8">
            <h3 className="font-bold text-brand-navy mb-4">Reusable Components</h3>
            <div className="space-y-3">
              {['Program Card', 'Mentor Card', 'FAQ Accordion', 'Testimonial Card', 'Footer Block'].map((component) => (
                <button key={component} onClick={() => notify(`Editor komponen ${component} dibuka.`)} className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-700">
                  Edit {component}
                </button>
              ))}
            </div>
          </div>

          <div className="card-premium p-8">
             <h3 className="font-bold text-brand-navy mb-4">SEO Metadata</h3>
             <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                   <p className="text-[10px] font-bold text-blue-700 mb-1">Google Preview</p>
                   <p className="text-sm font-bold text-blue-800 line-clamp-1">The Prams - Bimbingan Belajar Kedokteran...</p>
                   <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">Lulus seleksi kampus impian dengan metode penalaran kedokteran eksklusif dr. Pramono.</p>
                </div>
                <button onClick={() => notify('Editor SEO tags dibuka.')} className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit SEO Tags</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminWebsiteEditorPage;
