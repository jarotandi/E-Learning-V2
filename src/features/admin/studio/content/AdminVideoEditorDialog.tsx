/**
 * Admin Video Editor Dialog
 * ==========================
 * B1.4D-T5A — Studio / Content Library extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/14-b1.4d-t5a-studio-content.md
 *
 * The complete "Video Lesson Editor" modal, extracted out of `AdminDashboard`.
 * Every editable property is preserved: title, program, duration, views,
 * status, access, mentor, module, description, notes, thumbnail and tags.
 *
 * The dialog is presentational: the in-progress record is owned by the content
 * domain hook, so edits are reported through `onChange` and the save through
 * `onSave`. The editor remains a MODAL — no `/admin/studio/content/:id` route.
 *
 * ## Program options
 *
 * The Program `<select>` enumerates the editable `programs` list (legacy used
 * the monolith's `programsList`) followed by the same four legacy fallbacks.
 * The semantics are preserved exactly — not switched to the `PROGRAMS` seed.
 *
 * ## Accessibility (T5A)
 *
 *  - close button has `aria-label` and a 44px target;
 *  - every field carries an accessible name matching its visible label;
 *  - the selected tag chip uses an accessible dark emerald instead of white
 *    text on the raw brand teal.
 */

import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Play, Save, Video, X } from 'lucide-react';

import { Button } from '../../../../design-system/components';
import type { Program } from '../../../../types';
import type { VideoLessonRecord } from './adminContentData';

export interface AdminVideoEditorDialogProps {
  /** The lesson being edited, or null to render nothing. */
  video: VideoLessonRecord | null;
  /** The editable program list offered in the Program select. */
  programs: Program[];
  /** Report an updated in-progress record. */
  onChange: (video: VideoLessonRecord) => void;
  /** Close without saving. */
  onClose: () => void;
  /** Persist the (already mutated) record. */
  onSave: (video: VideoLessonRecord) => void;
  /** Demo preview toast. */
  onPreview: (video: VideoLessonRecord) => void;
}

export function AdminVideoEditorDialog({
  video,
  programs,
  onChange,
  onClose,
  onSave,
  onPreview,
}: AdminVideoEditorDialogProps) {
  return (
    <AnimatePresence>
      {video && (
        <div className="fixed inset-0 z-[122] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video size={22} className="text-emerald-300" aria-hidden="true" />
                <div>
                  <h3 className="font-bold">Video Lesson Editor</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Metadata, akses, thumbnail, dan catatan materi</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup editor video"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-8 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul Video</label>
                    <input aria-label="Judul Video" value={video.title} onChange={(e) => onChange({ ...video, title: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program</label>
                    <select aria-label="Program" value={video.program} onChange={(e) => onChange({ ...video, program: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                      {programs.map((program) => <option key={program.id} value={program.title}>{program.title}</option>)}
                      <option>Kedokteran Express</option>
                      <option>SNBT Intensive</option>
                      <option>CPNS Masterclass</option>
                      <option>Kedinasan Special</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Durasi</label>
                    <input aria-label="Durasi" value={video.duration} onChange={(e) => onChange({ ...video, duration: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Views</label>
                    <input aria-label="Views" value={video.views} onChange={(e) => onChange({ ...video, views: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                    <select aria-label="Status" value={video.status} onChange={(e) => onChange({ ...video, status: e.target.value as VideoLessonRecord['status'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                      <option>Draft</option>
                      <option>Published</option>
                      <option>Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Akses</label>
                    <select aria-label="Akses" value={video.access} onChange={(e) => onChange({ ...video, access: e.target.value as VideoLessonRecord['access'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                      <option>Free</option>
                      <option>Premium</option>
                      <option>Scholarship</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mentor</label>
                    <input aria-label="Mentor" value={video.mentor} onChange={(e) => onChange({ ...video, mentor: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Modul / Chapter</label>
                    <input aria-label="Modul / Chapter" value={video.module} onChange={(e) => onChange({ ...video, module: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi Video</label>
                  <textarea aria-label="Deskripsi Video" value={video.description} onChange={(e) => onChange({ ...video, description: e.target.value })} className="w-full h-28 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Editor / Materi</label>
                  <textarea aria-label="Catatan Editor / Materi" value={video.notes} onChange={(e) => onChange({ ...video, notes: e.target.value })} className="w-full h-24 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-100 outline-none text-sm text-amber-900" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="card-premium p-5 bg-white">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4">
                    <img src={video.thumbnail} className="w-full h-full object-cover" alt="" />
                  </div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Thumbnail URL</label>
                  <input aria-label="Thumbnail URL" value={video.thumbnail} onChange={(e) => onChange({ ...video, thumbnail: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs" />
                </div>

                <div className="card-premium p-5 bg-white">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tags (pisahkan koma)</label>
                  <input aria-label="Tags (pisahkan koma)" value={video.tags.join(', ')} onChange={(e) => onChange({ ...video, tags: e.target.value.split(',') })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {video.tags.filter(Boolean).map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-lg bg-blue-50 text-emerald-700 text-[10px] font-black uppercase">{tag.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-5 bg-slate-50">
                  <p className="text-sm font-black text-brand-navy mb-3">Checklist Publish</p>
                  {[
                    ['Judul', video.title],
                    ['Durasi', video.duration],
                    ['Thumbnail', video.thumbnail],
                    ['Deskripsi', video.description],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
                      <span className="text-xs font-bold text-slate-500">{label}</span>
                      <CheckCircle2 size={16} className={value ? 'text-emerald-500' : 'text-slate-300'} aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Button variant="secondary" onClick={() => onPreview(video)}>
                <Play size={16} aria-hidden="true" /> Preview
              </Button>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Batal
                </Button>
                <Button variant="primary" onClick={() => onSave(video)}>
                  <Save size={18} aria-hidden="true" />
                  Simpan Video
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminVideoEditorDialog;
