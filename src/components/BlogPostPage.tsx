import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Search,
  Tags,
  Twitter,
  User,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { BLOG_POSTS } from '../constants';
import { BlogPost, View } from '../types';

interface BlogPostPageProps {
  blogId: string | null;
  setView: (v: View) => void;
  setSelectedBlogId?: (id: string) => void;
  posts?: BlogPost[];
}

const slugifyHeading = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-');

const splitContentForMiddleInsert = (content: string) => {
  const lines = content.split('\n');
  const headingIndexes = lines
    .map((line, index) => ({ line, index }))
    .filter((item) => /^##\s+/.test(item.line))
    .map((item) => item.index);
  const splitAt = headingIndexes.length > 1
    ? headingIndexes[Math.floor(headingIndexes.length / 2)]
    : Math.ceil(lines.length / 2);

  return {
    before: lines.slice(0, splitAt).join('\n').trim(),
    after: lines.slice(splitAt).join('\n').trim()
  };
};

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ blogId, setView, setSelectedBlogId, posts = BLOG_POSTS }) => {
  const post = posts.find((item) => item.id === blogId);
  const [shareCopied, setShareCopied] = React.useState(false);
  const headings = React.useMemo(() => {
    if (!post) return [];
    return [...post.content.matchAll(/^##\s+(.+)$/gm)].map((match) => {
      const title = match[1].trim();
      return { title, id: slugifyHeading(title) };
    });
  }, [post]);
  const categories = React.useMemo(() => Array.from(new Set(posts.map((item) => item.category))), [posts]);
  const relatedPosts = React.useMemo(() => posts.filter((item) => item.id !== post?.id).slice(0, 3), [posts, post?.id]);
  const popularPosts = React.useMemo(() => posts.filter((item) => item.id !== post?.id).slice(0, 5), [posts, post?.id]);
  const hasMiddleImage = Boolean(post?.content.match(/!\[[^\]]*\]\([^)]+\)/));
  const hasRelatedBlock = Boolean(post?.content.match(/\{\{related:.+\}\}/));
  const middleContent = React.useMemo(() => post ? splitContentForMiddleInsert(post.content) : { before: '', after: '' }, [post]);
  const shareUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return `https://theprams.id/blog/${post?.id || ''}`;
    return `${window.location.origin}${window.location.pathname}#blog-${post?.id || ''}`;
  }, [post?.id]);
  const shareText = post ? `${post.title} - ${post.excerpt}` : '';
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareCopied(false);
    }
  };
  const openShareChannel = (channel: 'whatsapp' | 'facebook' | 'linkedin' | 'instagram' | 'x') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const urls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      instagram: 'https://www.instagram.com/',
      x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    };
    window.open(urls[channel], '_blank', 'noopener,noreferrer');
  };
  const renderRelatedReadingBox = (selectedId?: string) => {
    const selected = selectedId ? posts.find((item) => item.id === selectedId && item.id !== post?.id) : null;
    const options = [
      ...(selected ? [selected] : []),
      ...relatedPosts.filter((item) => item.id !== selected?.id)
    ].slice(0, 3);

    if (!options.length) return null;

    return (
      <div className="my-7 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue whitespace-nowrap">Bacaan lainnya</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {options.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSelectedBlogId?.(item.id); setView('blogPost'); }}
              className="w-full min-h-[54px] text-left rounded-md bg-white border border-slate-200 px-3 py-2 hover:border-brand-blue/50 transition-colors group"
            >
              <span className="block text-xs font-black text-brand-navy group-hover:text-brand-blue line-clamp-2 leading-snug">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };
  const markdownComponents = {
    h2: ({ children }: any) => {
      const title = String(children);
      return <h2 id={slugifyHeading(title)}>{children}</h2>;
    },
    p: ({ children }: any) => {
      const text = React.Children.toArray(children).join('').trim();
      const relatedId = text.match(/^\{\{related:(.+)\}\}$/)?.[1];
      if (relatedId) return renderRelatedReadingBox(relatedId);
      return <p>{children}</p>;
    },
    img: ({ src, alt }: any) => (
      <img src={src || ''} alt={alt || ''} />
    )
  };

  if (!post) {
    return (
      <div className="pt-40 text-center pb-40">
        <h2 className="text-2xl font-bold text-brand-navy">Artikel tidak ditemukan</h2>
        <button onClick={() => setView('blogListing')} className="mt-4 text-brand-blue font-bold">Kembali ke Blog</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-28 pb-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 lg:px-6">
          <button
            onClick={() => setView('blogListing')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-blue mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali ke Blog
          </button>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-10 items-end">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 mb-5">
                <button onClick={() => setView('landing')} className="hover:text-brand-blue">Beranda</button>
                <ChevronRight size={14} />
                <button onClick={() => setView('blogListing')} className="hover:text-brand-blue">Blog</button>
                <ChevronRight size={14} />
                <span className="text-brand-blue">{post.category}</span>
              </div>

              <span className="inline-flex px-3 py-1.5 rounded-md bg-brand-blue/10 text-brand-blue text-xs font-black uppercase tracking-widest mb-5">
                {post.category}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy leading-tight tracking-tight max-w-4xl">
                {post.title}
              </h1>

              <p className="mt-5 text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <img src={post.authorAvatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <span>
                    <strong className="block text-brand-navy">{post.author}</strong>
                    <span className="text-xs">{post.authorRole}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2"><Calendar size={17} /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock size={17} /> {post.readTime}</span>
              </div>
            </motion.div>

            <div className="hidden lg:block">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Cari Artikel</p>
                <button onClick={() => setView('blogListing')} className="w-full flex items-center gap-3 rounded-lg bg-white border border-slate-200 px-4 py-3 text-left text-sm text-slate-500 hover:border-brand-blue/40">
                  <Search size={18} />
                  Temukan topik lainnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 lg:px-6 py-10">
        <div className="relative overflow-hidden rounded-lg aspect-[16/8] bg-slate-100 border border-slate-200">
          <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-5 lg:px-6 pb-24 grid lg:grid-cols-[minmax(0,720px)_300px] gap-12 items-start">
        <article className="min-w-0">
          {headings.length > 0 && (
            <div className="mb-9 rounded-lg bg-slate-50 border border-slate-200 p-5">
              <p className="text-sm font-black text-brand-navy mb-4">Daftar Isi</p>
              <div className="space-y-2">
                {headings.map((heading, index) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="flex items-start gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-brand-blue transition-colors"
                  >
                    <span className="text-brand-blue font-black">{index + 1}.</span>
                    <span>{heading.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="blog-article">
            {hasMiddleImage && hasRelatedBlock ? (
              <Markdown components={markdownComponents}>{post.content}</Markdown>
            ) : (
              <>
                <Markdown components={markdownComponents}>{middleContent.before}</Markdown>
                {!hasMiddleImage && (
                  <figure className="blog-middle-media">
                    <img src={post.image} alt={post.title} />
                    <figcaption>Ilustrasi materi: {post.category}</figcaption>
                  </figure>
                )}
                {!hasRelatedBlock && renderRelatedReadingBox()}
                <Markdown components={markdownComponents}>{middleContent.after}</Markdown>
              </>
            )}
          </div>

          <div className="mt-12 rounded-lg bg-brand-navy p-7 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-2">The Prams</p>
            <h3 className="text-2xl font-black mb-3">Siap ukur kemampuanmu?</h3>
            <p className="text-white/75 leading-relaxed mb-5">Mulai dari tryout gratis, lalu lihat rekomendasi belajar berdasarkan hasilmu.</p>
            <button onClick={() => setView('guestRegistration')} className="px-5 py-3 rounded-md bg-brand-orange text-brand-navy text-sm font-black">
              Mulai Tryout Gratis
            </button>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-6 flex gap-5 items-start">
            <img src={post.authorAvatar} className="w-16 h-16 rounded-full object-cover bg-white" alt="" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-blue mb-1">Ditulis oleh</p>
              <h4 className="text-xl font-black text-brand-navy">{post.author}</h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {post.authorRole} di The Prams. Menulis panduan belajar, strategi ujian, dan insight persiapan pendidikan.
              </p>
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-black text-brand-navy mb-4">Bagikan Artikel</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'WhatsApp', icon: MessageCircle, action: () => openShareChannel('whatsapp') },
                { label: 'Facebook', icon: Facebook, action: () => openShareChannel('facebook') },
                { label: 'LinkedIn', icon: Linkedin, action: () => openShareChannel('linkedin') },
                { label: 'Instagram', icon: Instagram, action: () => openShareChannel('instagram') },
                { label: 'X', icon: Twitter, action: () => openShareChannel('x') },
                { label: shareCopied ? 'Tersalin' : 'Salin', icon: shareCopied ? Check : Copy, action: copyShareLink },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`h-12 rounded-md border text-slate-500 hover:text-brand-blue hover:border-brand-blue/40 flex items-center justify-center gap-2 text-xs font-black transition-colors ${shareCopied && item.label === 'Tersalin' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'border-slate-200'}`}
                >
                  <item.icon size={17} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {headings.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 hidden lg:block">
              <p className="text-sm font-black text-brand-navy mb-4">Isi Artikel</p>
              <div className="space-y-2">
                {headings.map((heading) => (
                  <a key={heading.id} href={`#${heading.id}`} className="block text-sm font-semibold text-slate-500 hover:text-brand-blue leading-snug">
                    {heading.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Tags size={17} className="text-brand-orange" />
              <p className="text-sm font-black text-brand-navy">Kategori</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setView('blogListing')}
                  className={`px-3 py-2 rounded-md text-xs font-bold border ${category === post.category ? 'bg-brand-blue text-white border-brand-blue' : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-brand-blue'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-black text-brand-navy mb-4">Artikel Populer</p>
            <div className="space-y-4">
              {popularPosts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSelectedBlogId?.(item.id); setView('blogPost'); }}
                  className="w-full text-left group"
                >
                  <p className="text-xs font-bold text-brand-blue mb-1">{item.category}</p>
                  <p className="text-sm font-bold text-slate-700 leading-snug group-hover:text-brand-blue">{item.title}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-5 lg:px-6">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-black text-brand-navy">Artikel Terkait</h2>
            <button onClick={() => setView('blogListing')} className="text-sm font-black text-brand-blue">Lihat Semua</button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((item) => (
              <button
                key={item.id}
                onClick={() => { setSelectedBlogId?.(item.id); setView('blogPost'); }}
                className="text-left bg-white rounded-lg border border-slate-200 overflow-hidden group"
              >
                <img src={item.image} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-brand-blue mb-2">{item.category}</p>
                  <h3 className="text-lg font-black text-brand-navy leading-snug group-hover:text-brand-blue">{item.title}</h3>
                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User size={14} /> {item.author}</span>
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
