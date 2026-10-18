/**
 * Admin Website Editor domain hook
 * =================================
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/15-b1.4d-t5b-studio-website.md
 *
 * ## Why a hook, not a route-mounted page
 *
 * The legacy `AdminDashboard` kept the Website/Blog state (draft blog posts,
 * editor draft, asset database, middle-insert + AI-panel flags) ABOVE the
 * conditional `activeTab === 'website'` JSX, so an in-progress article draft
 * survived client-side tab changes. Moving that state into a page that only
 * mounts for `/admin/studio/website` would silently lose that behaviour. The
 * hook is therefore invoked ONCE by the PERSISTENT `AdminDashboard`, and
 * `AdminWebsiteEditorPage` + the dialogs receive the surface as props.
 *
 * ## Inject, do not import
 *
 * `blogPosts`, `onBlogPostsChange`, `notify` and `recordAudit` are injected.
 * The hook never imports `AdminDashboard` (no cycle) and never imports
 * `LegacyAppStateProvider`. Previewing the public landing page stays OUTSIDE
 * the domain: `AdminDashboard` passes a narrow `onPreviewWebsite` callback that
 * calls `setView?.('landing')`.
 *
 * ## Blog prop bridge (unchanged)
 *
 * `blogPosts` / `onBlogPostsChange` remain the CANONICAL legacy bridge. The
 * hook seeds `blogPostDrafts` from `blogPosts` and re-syncs on every change
 * (the legacy `useEffect`). No localStorage persistence is created for
 * `BlogPost` records.
 *
 * ## Pseudo "AI Chat Agent" — LOCAL demo helper ONLY
 *
 * `generateAiBlogDraft` is NOT a real AI API. It is deterministic local
 * template generation from `aiChatPrompt` / `editingBlogPost.title` /
 * `'topik artikel'`. It makes no network call and no API client is imported.
 *
 * ## Storage
 *
 * The domain owns the single canonical key `theprams_demo_blog_assets` — read
 * with the same `readStorageArray(key)` fallback and written with the same
 * `localStorage.setItem(key, JSON.stringify(...))` semantics. NOT renamed, NOT
 * migrated, no second asset key. `theprams_demo_website_questions` deliberately
 * stays OUT of this domain (T6 Review / Inquiries).
 */

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

import { BLOG_POSTS } from '../../../../constants';
import type { BlogPost } from '../../../../types';
import { readStorageArray } from '../../adminStorage';
import {
  BLOG_ASSETS_STORAGE_KEY,
  BLOG_CATEGORY_OPTIONS,
  BLOG_EDITOR_TEMPLATES,
  type BlogEditorAsset,
} from './adminWebsiteData';

/* ------------------------------------------------------------------ */
/* Injection contract                                                  */
/* ------------------------------------------------------------------ */

export interface UseAdminWebsiteDomainOptions {
  /** Canonical legacy blog-post bridge (defaults to `BLOG_POSTS` upstream). */
  blogPosts: BlogPost[];
  /** Canonical legacy blog-post setter (unchanged; may be undefined). */
  onBlogPostsChange?: (posts: BlogPost[]) => void;
  /** Toast adapter (stays owned by AdminDashboard). */
  notify: (message: string) => void;
  /** Audit sink (stays owned by AdminDashboard). */
  recordAudit: (module: string, action: string, detail: string) => void;
}

/* ------------------------------------------------------------------ */
/* Public surface                                                      */
/* ------------------------------------------------------------------ */

export interface BlogEditorStats {
  total: number;
  literasi: number;
  infoMenarik: number;
  words: number;
}

export interface UseAdminWebsiteDomainResult {
  /* injected adapters re-exposed to the extracted page/dialogs */
  notify: (message: string) => void;

  /* state */
  isSaveWebsiteConfirmOpen: boolean;
  editingBlogPost: BlogPost | null;
  previewBlogPost: BlogPost | null;
  blogEditorAssets: BlogEditorAsset[];
  editingBlogAsset: BlogEditorAsset | null;
  isMiddleInsertOpen: boolean;
  isBlogAiChatOpen: boolean;
  middlePreviewAsset: BlogEditorAsset | null;
  middlePreviewRelatedId: string;
  internetAssetUrl: string;
  internetAssetName: string;
  aiChatPrompt: string;
  aiChatDraft: string;
  blogPostDrafts: BlogPost[];
  blogEditorSearchTerm: string;
  blogEditorCategory: 'Semua' | BlogPost['category'];

  /* derived */
  blogCategoryOptions: Array<'Semua' | BlogPost['category']>;
  visibleBlogPosts: BlogPost[];
  blogEditorStats: BlogEditorStats;

  /* setters */
  setIsSaveWebsiteConfirmOpen: Dispatch<SetStateAction<boolean>>;
  setEditingBlogPost: Dispatch<SetStateAction<BlogPost | null>>;
  setPreviewBlogPost: Dispatch<SetStateAction<BlogPost | null>>;
  setEditingBlogAsset: Dispatch<SetStateAction<BlogEditorAsset | null>>;
  setIsMiddleInsertOpen: Dispatch<SetStateAction<boolean>>;
  setIsBlogAiChatOpen: Dispatch<SetStateAction<boolean>>;
  setMiddlePreviewAsset: Dispatch<SetStateAction<BlogEditorAsset | null>>;
  setMiddlePreviewRelatedId: Dispatch<SetStateAction<string>>;
  setInternetAssetUrl: Dispatch<SetStateAction<string>>;
  setInternetAssetName: Dispatch<SetStateAction<string>>;
  setAiChatPrompt: Dispatch<SetStateAction<string>>;
  setBlogEditorSearchTerm: Dispatch<SetStateAction<string>>;
  setBlogEditorCategory: Dispatch<SetStateAction<'Semua' | BlogPost['category']>>;

  /* operations */
  createBlogPostDraft: (category?: BlogPost['category']) => void;
  saveBlogPost: (post: BlogPost) => void;
  syncBlogPostsToWebsite: (posts?: BlogPost[]) => void;
  deleteBlogPost: (id: string) => void;
  duplicateBlogPost: (post: BlogPost) => void;
  insertBlogContentBlock: (block: string) => void;
  getBlogRelatedOptions: (post: BlogPost, selectedId?: string) => BlogPost[];
  saveBlogEditorAssets: (nextAssets: BlogEditorAsset[]) => void;
  addInternetBlogAsset: () => void;
  importBlogAssetFromPc: (file: File) => void;
  insertBlogAsset: (asset: BlogEditorAsset) => void;
  deleteBlogAsset: (id: string) => void;
  generateAiBlogDraft: () => void;
}

export function useAdminWebsiteDomain({
  blogPosts,
  onBlogPostsChange,
  notify,
  recordAudit,
}: UseAdminWebsiteDomainOptions): UseAdminWebsiteDomainResult {
  const [isSaveWebsiteConfirmOpen, setIsSaveWebsiteConfirmOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [previewBlogPost, setPreviewBlogPost] = useState<BlogPost | null>(null);
  const [blogEditorAssets, setBlogEditorAssets] = useState<BlogEditorAsset[]>(
    () => readStorageArray(BLOG_ASSETS_STORAGE_KEY),
  );
  const [editingBlogAsset, setEditingBlogAsset] = useState<BlogEditorAsset | null>(null);
  const [isMiddleInsertOpen, setIsMiddleInsertOpen] = useState(false);
  const [isBlogAiChatOpen, setIsBlogAiChatOpen] = useState(false);
  const [middlePreviewAsset, setMiddlePreviewAsset] = useState<BlogEditorAsset | null>(null);
  const [middlePreviewRelatedId, setMiddlePreviewRelatedId] = useState<string>('');
  const [internetAssetUrl, setInternetAssetUrl] = useState('');
  const [internetAssetName, setInternetAssetName] = useState('');
  const [aiChatPrompt, setAiChatPrompt] = useState('');
  const [aiChatDraft, setAiChatDraft] = useState('');
  const [blogPostDrafts, setBlogPostDrafts] = useState<BlogPost[]>(blogPosts);
  const [blogEditorSearchTerm, setBlogEditorSearchTerm] = useState('');
  const [blogEditorCategory, setBlogEditorCategory] = useState<'Semua' | BlogPost['category']>('Semua');

  // Legacy blog-prop bridge: the canonical `blogPosts` prop re-seeds the drafts.
  useEffect(() => {
    setBlogPostDrafts(blogPosts);
  }, [blogPosts]);

  const blogCategoryOptions = BLOG_CATEGORY_OPTIONS;

  const visibleBlogPosts = useMemo(() => {
    const keyword = blogEditorSearchTerm.trim().toLowerCase();
    return blogPostDrafts.filter((post) => {
      const matchesCategory = blogEditorCategory === 'Semua' || post.category === blogEditorCategory;
      const matchesKeyword = !keyword || `${post.title} ${post.excerpt} ${post.author} ${post.tags.join(' ')}`.toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });
  }, [blogPostDrafts, blogEditorCategory, blogEditorSearchTerm]);

  const blogEditorStats = useMemo(() => ({
    total: blogPostDrafts.length,
    literasi: blogPostDrafts.filter((post) => post.category === 'Literasi').length,
    infoMenarik: blogPostDrafts.filter((post) => post.category !== 'Literasi').length,
    words: blogPostDrafts.reduce((sum, post) => sum + post.content.trim().split(/\s+/).filter(Boolean).length, 0)
  }), [blogPostDrafts]);

  const createBlogPostDraft = (category: BlogPost['category'] = 'Literasi') => {
    const template = BLOG_EDITOR_TEMPLATES.find((item) => item.category === category) || BLOG_EDITOR_TEMPLATES[0];
    setEditingBlogPost({
      id: `blog-${Date.now()}`,
      title: template?.title || 'Artikel Baru',
      excerpt: template?.excerpt || 'Ringkasan singkat artikel untuk kartu Info Menarik.',
      content: template?.content || '# Artikel Baru\n\nTulis isi artikel di sini.',
      author: 'Admin The Prams',
      authorRole: 'Content Specialist',
      authorAvatar: 'https://i.pravatar.cc/150?u=admin',
      category,
      image: BLOG_POSTS[0].image,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: '5 min read',
      tags: template?.tags || [category]
    });
  };

  const saveBlogPost = (post: BlogPost) => {
    const sanitized: BlogPost = {
      ...post,
      id: post.id.trim() || `blog-${Date.now()}`,
      title: post.title.trim() || 'Judul Artikel Baru',
      excerpt: post.excerpt.trim() || 'Ringkasan artikel belum diisi.',
      content: post.content.trim() || '# Artikel Baru\n\nTulis konten artikel di sini.',
      author: post.author.trim() || 'Admin The Prams',
      authorRole: post.authorRole.trim() || 'Content Specialist',
      authorAvatar: post.authorAvatar.trim() || 'https://i.pravatar.cc/150?u=admin',
      image: post.image.trim() || BLOG_POSTS[0].image,
      date: post.date.trim() || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: post.readTime.trim() || '5 min read',
      tags: post.tags.map((tag) => tag.trim()).filter(Boolean)
    };
    const nextPosts = blogPostDrafts.find((item) => item.id === sanitized.id)
      ? blogPostDrafts.map((item) => item.id === sanitized.id ? sanitized : item)
      : [sanitized, ...blogPostDrafts];
    setBlogPostDrafts(nextPosts);
    onBlogPostsChange?.(nextPosts);
    setEditingBlogPost(null);
    recordAudit('Website Editor', 'Save Blog/Literasi', sanitized.title);
    notify('Konten Info Menarik tersimpan dan tampil di website.');
  };

  const syncBlogPostsToWebsite = (posts = blogPostDrafts) => {
    setBlogPostDrafts(posts);
    onBlogPostsChange?.(posts);
    recordAudit('Website Editor', 'Publish Info Menarik', `${posts.length} artikel`);
    notify('Info Menarik & Literasi sudah disinkronkan ke website publik.');
  };

  const deleteBlogPost = (id: string) => {
    const nextPosts = blogPostDrafts.filter((item) => item.id !== id);
    syncBlogPostsToWebsite(nextPosts);
    notify('Artikel dihapus dari Info Menarik.');
  };

  const duplicateBlogPost = (post: BlogPost) => {
    const copy: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      title: `${post.title} - Copy`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const nextPosts = [copy, ...blogPostDrafts];
    syncBlogPostsToWebsite(nextPosts);
    setEditingBlogPost(copy);
  };

  const insertBlogContentBlock = (block: string) => {
    if (!editingBlogPost) return;
    setEditingBlogPost({
      ...editingBlogPost,
      content: `${editingBlogPost.content.trim()}\n\n${block}`.trim()
    });
  };

  const getBlogRelatedOptions = (post: BlogPost, selectedId?: string) => {
    const selected = selectedId ? blogPostDrafts.find((item) => item.id === selectedId && item.id !== post.id) : null;
    return [
      ...(selected ? [selected] : []),
      ...blogPostDrafts.filter((item) => item.id !== post.id && item.id !== selected?.id)
    ].slice(0, 3);
  };

  const saveBlogEditorAssets = (nextAssets: BlogEditorAsset[]) => {
    setBlogEditorAssets(nextAssets);
    localStorage.setItem(BLOG_ASSETS_STORAGE_KEY, JSON.stringify(nextAssets));
  };

  const addInternetBlogAsset = () => {
    const url = internetAssetUrl.trim();
    if (!url) {
      notify('URL gambar/dokumen wajib diisi.');
      return;
    }
    const isImage = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url) || url.includes('images.unsplash.com') || url.includes('source.unsplash.com');
    const asset: BlogEditorAsset = {
      id: `asset-${Date.now()}`,
      type: isImage ? 'image' : 'document',
      source: 'internet',
      name: internetAssetName.trim() || (isImage ? 'Gambar Internet' : 'Dokumen Internet'),
      url,
      note: 'Disimpan dari URL internet',
      createdAt: new Date().toLocaleString('id-ID')
    };
    saveBlogEditorAssets([asset, ...blogEditorAssets]);
    setInternetAssetUrl('');
    setInternetAssetName('');
    notify('Aset internet tersimpan ke database editor.');
  };

  const importBlogAssetFromPc = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const asset: BlogEditorAsset = {
        id: `asset-${Date.now()}`,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        source: 'pc',
        name: file.name,
        url: String(reader.result || ''),
        note: `${Math.round(file.size / 1024)} KB dari PC`,
        createdAt: new Date().toLocaleString('id-ID')
      };
      saveBlogEditorAssets([asset, ...blogEditorAssets]);
      notify('File dari PC tersimpan ke database editor.');
    };
    reader.readAsDataURL(file);
  };

  const insertBlogAsset = (asset: BlogEditorAsset) => {
    if (asset.type === 'image') {
      insertBlogContentBlock(`![${asset.name}](${asset.url})`);
    } else {
      insertBlogContentBlock(`[${asset.name}](${asset.url})`);
    }
  };

  const deleteBlogAsset = (id: string) => {
    saveBlogEditorAssets(blogEditorAssets.filter((asset) => asset.id !== id));
    notify('Aset editor dihapus dari database.');
  };

  const generateAiBlogDraft = () => {
    const topic = aiChatPrompt.trim() || editingBlogPost?.title || 'topik artikel';
    const draft = `## ${topic}\n\nPembuka singkat: jelaskan masalah utama pembaca dan kenapa bagian ini penting.\n\n### Poin Penting\n- Jelaskan konsep utama secara sederhana.\n- Tambahkan contoh yang dekat dengan kebutuhan siswa.\n- Akhiri dengan langkah praktis yang bisa dicoba hari ini.\n\n> **Catatan editor:** cek kembali akurasi data sebelum publish.`;
    setAiChatDraft(draft);
    notify('AI chat agent membuat draft blok artikel.');
  };

  return {
    notify,
    isSaveWebsiteConfirmOpen,
    editingBlogPost,
    previewBlogPost,
    blogEditorAssets,
    editingBlogAsset,
    isMiddleInsertOpen,
    isBlogAiChatOpen,
    middlePreviewAsset,
    middlePreviewRelatedId,
    internetAssetUrl,
    internetAssetName,
    aiChatPrompt,
    aiChatDraft,
    blogPostDrafts,
    blogEditorSearchTerm,
    blogEditorCategory,
    blogCategoryOptions,
    visibleBlogPosts,
    blogEditorStats,
    setIsSaveWebsiteConfirmOpen,
    setEditingBlogPost,
    setPreviewBlogPost,
    setEditingBlogAsset,
    setIsMiddleInsertOpen,
    setIsBlogAiChatOpen,
    setMiddlePreviewAsset,
    setMiddlePreviewRelatedId,
    setInternetAssetUrl,
    setInternetAssetName,
    setAiChatPrompt,
    setBlogEditorSearchTerm,
    setBlogEditorCategory,
    createBlogPostDraft,
    saveBlogPost,
    syncBlogPostsToWebsite,
    deleteBlogPost,
    duplicateBlogPost,
    insertBlogContentBlock,
    getBlogRelatedOptions,
    saveBlogEditorAssets,
    addInternetBlogAsset,
    importBlogAssetFromPc,
    insertBlogAsset,
    deleteBlogAsset,
    generateAiBlogDraft,
  };
}

export default useAdminWebsiteDomain;
