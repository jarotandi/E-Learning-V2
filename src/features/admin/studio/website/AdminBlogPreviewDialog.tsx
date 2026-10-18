/**
 * Preview Draft Info Menarik dialog
 *
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction.
 * Body lifted verbatim from the legacy AdminDashboard monolith; only the
 * state/op references are destructured from the injected Website domain.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  X,
} from 'lucide-react';
import { BLOG_POSTS } from '../../../../constants';
import type { UseAdminWebsiteDomainResult } from './useAdminWebsiteDomain';

export interface AdminBlogPreviewDialogProps {
  domain: UseAdminWebsiteDomainResult;
}

export function AdminBlogPreviewDialog({ domain }: AdminBlogPreviewDialogProps) {
  const { previewBlogPost, setPreviewBlogPost, getBlogRelatedOptions } = domain;
  return (
    <AnimatePresence>
      {previewBlogPost && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold">Preview Draft Info Menarik</h3>
                <p className="text-xs text-white/60 mt-1">Preview ini hanya simulasi admin. Tidak membuka halaman publik dan tidak mempublish artikel.</p>
              </div>
              <button onClick={() => setPreviewBlogPost(null)} aria-label="Tutup preview artikel" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <span className="inline-flex px-3 py-1.5 rounded-md bg-brand-blue/10 text-blue-700 text-xs font-black uppercase tracking-widest mb-4">
                    {previewBlogPost.category}
                  </span>
                  <h1 className="text-4xl font-black text-brand-navy leading-tight">{previewBlogPost.title}</h1>
                  <p className="mt-3 text-lg text-slate-600 leading-relaxed">{previewBlogPost.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-bold">
                    <span>{previewBlogPost.author}</span>
                    <span>{previewBlogPost.date}</span>
                    <span>{previewBlogPost.readTime}</span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-8">
                  <img src={previewBlogPost.image || BLOG_POSTS[0].image} className="w-full aspect-video object-cover" alt="" />
                </div>

                <div className="blog-article text-base leading-7">
                  <Markdown
                    components={{
                      p: ({ children }) => {
                        const text = React.Children.toArray(children).join('').trim();
                        const relatedId = text.match(/^\{\{related:(.+)\}\}$/)?.[1];
                        if (relatedId) {
                          const relatedOptions = getBlogRelatedOptions(previewBlogPost, relatedId);
                          return (
                            <div className="my-7 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 whitespace-nowrap">Bacaan lainnya</span>
                                <span className="h-px flex-1 bg-slate-200" />
                              </div>
                              <div className="grid gap-2 sm:grid-cols-3">
                                {relatedOptions.map((item) => (
                                  <div key={item.id} className="min-h-[54px] rounded-md bg-white border border-slate-200 px-3 py-2">
                                    <p className="text-xs font-black text-brand-navy leading-snug line-clamp-2 mb-0">{item.title}</p>
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
                    {previewBlogPost.content}
                  </Markdown>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminBlogPreviewDialog;
