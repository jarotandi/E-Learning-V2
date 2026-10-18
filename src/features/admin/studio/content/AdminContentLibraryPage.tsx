/**
 * Admin Content Library Page
 * ===========================
 * B1.4D-T5A — Studio / Content Library extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/14-b1.4d-t5a-studio-content.md
 *
 * The complete `activeTab === 'content'` business surface, extracted out of
 * `AdminDashboard`. This page is pure presentation over the content-domain
 * surface passed in as props:
 *
 *   - it owns NO video/upload state (the hook in `AdminDashboard` does), so a
 *     transient upload/editor draft survives tab navigation;
 *   - the "Video Lesson Editor" and "Upload Video Materi" dialogs are extracted.
 *
 * ## Program filter is presentational (demo) — preserved as-is
 *
 * The legacy "Recent Lessons" toolbar had an uncontrolled `<select>` that never
 * filtered the list. T5A preserves that exactly: B1.4D is decomposition, not
 * feature expansion. No filtering logic was invented.
 *
 * ## Metrics
 *
 * `Total Videos` = list length and `Completion` = published / max(total, 1) are
 * preserved exactly. `Watch Time` (8.5k hrs) and `Active Viewers` (842) remain
 * the same static demo values — no analytics backend was invented.
 *
 * ## Route
 *
 * Still `/admin/studio/content`. No new route.
 */

import { CheckCircle2, Clock, Edit2, Play, Plus, Trash2, Users, Video } from 'lucide-react';

import { Button, IconButton } from '../../../../design-system/components';
import type { Program } from '../../../../types';
import { AdminVideoEditorDialog } from './AdminVideoEditorDialog';
import { AdminVideoUploadDialog } from './AdminVideoUploadDialog';
import type { UseAdminContentDomainResult } from './useAdminContentDomain';

export interface AdminContentLibraryPageProps {
  /** The canonical Content Library domain surface owned by `AdminDashboard`. */
  domain: UseAdminContentDomainResult;
  /** The editable program list, forwarded to the editor dialog's Program select. */
  programs: Program[];
}

export function AdminContentLibraryPage({ domain, programs }: AdminContentLibraryPageProps) {
  const completion = Math.round(
    (domain.videoLessons.filter((video) => video.status === 'Published').length /
      Math.max(domain.videoLessons.length, 1)) * 100,
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Content Management</h2>
          <p className="text-sm text-slate-500">Manage video lessons and learning materials</p>
        </div>
        <Button variant="primary" onClick={domain.openUpload}>
          <Plus size={18} aria-hidden="true" /> Upload Video
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="card-premium p-6">
          <Video className="text-emerald-700 mb-4" size={24} aria-hidden="true" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Videos</p>
          <p className="text-3xl font-black text-brand-navy">{domain.videoLessons.length}</p>
        </div>
        <div className="card-premium p-6">
          <Clock className="text-amber-700 mb-4" size={24} aria-hidden="true" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Watch Time</p>
          <p className="text-3xl font-black text-brand-navy">8.5k hrs</p>
        </div>
        <div className="card-premium p-6">
          <Users className="text-indigo-500 mb-4" size={24} aria-hidden="true" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Viewers</p>
          <p className="text-3xl font-black text-brand-navy">842</p>
        </div>
        <div className="card-premium p-6">
          <CheckCircle2 className="text-emerald-500 mb-4" size={24} aria-hidden="true" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion</p>
          <p className="text-3xl font-black text-brand-navy">{completion}%</p>
        </div>
      </div>

      <div className="card-premium p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-brand-navy">Recent Lessons</h3>
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none">
              <option>All Programs</option>
              <option>Kedokteran Express</option>
              <option>SNBT Intensive</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {domain.videoLessons.map((video) => (
            <div key={video.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-700/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <img src={video.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                  <Play size={16} className="text-slate-400 group-hover:text-emerald-700 relative z-10" aria-hidden="true" />
                  <div className="absolute inset-0 bg-emerald-700/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-navy">{video.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{video.program}</p>
                  <div className="flex gap-1 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${video.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : video.status === 'Draft' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{video.status}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-emerald-700 text-[8px] font-black uppercase">{video.access}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 text-right">
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-brand-navy">{video.duration}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Duration</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-brand-navy">{video.views}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Views</p>
                </div>
                <div className="flex gap-2">
                  <IconButton
                    variant="ghost"
                    aria-label={`Edit video ${video.title}`}
                    icon={<Edit2 size={16} />}
                    onClick={() => domain.setEditingVideo(video)}
                  />
                  <IconButton
                    variant="danger"
                    aria-label={`Hapus video ${video.title}`}
                    icon={<Trash2 size={16} />}
                    onClick={() => domain.deleteVideo(video)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminVideoEditorDialog
        video={domain.editingVideo}
        programs={programs}
        onChange={domain.setEditingVideo}
        onClose={domain.closeEditor}
        onSave={domain.saveVideoEditor}
        onPreview={domain.previewVideo}
      />

      <AdminVideoUploadDialog
        isOpen={domain.isUploadModalOpen}
        uploadStatus={domain.uploadStatus}
        uploadProgress={domain.uploadProgress}
        videoForm={domain.videoForm}
        onFormChange={domain.setVideoForm}
        onStartUpload={domain.simulateVideoUpload}
        onClose={domain.closeUpload}
      />
    </div>
  );
}

export default AdminContentLibraryPage;
