/**
 * Admin Video Upload Dialog
 * ==========================
 * B1.4D-T5A — Studio / Content Library extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/14-b1.4d-t5a-studio-content.md
 *
 * The complete "Upload Video Materi" modal, extracted out of `AdminDashboard`.
 * It preserves the three visual states (`idle` / `uploading` / `completed`), the
 * form fields, the program selection, the file/drop-zone visual, the progress
 * ring and the completion state.
 *
 * ## This is a DEMO simulation — there is NO real upload
 *
 * Despite the "Video File" copy, selecting a file only triggers the demo
 * progression in `useAdminContentDomain.simulateVideoUpload`. Nothing is
 * uploaded and no File API data is persisted. T5A preserves that exactly and
 * does not add real upload capability.
 *
 * ## Accessibility (T5A)
 *
 *  - the header close control has `aria-label` and a 44px target;
 *  - fields carry accessible names matching their visible labels;
 *  - the file input is `sr-only` (visually hidden but still keyboard reachable
 *    and still triggered by the wrapping label), not `hidden`.
 */

import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus, Video, X } from 'lucide-react';

import { Button } from '../../../../design-system/components';
import { PROGRAMS } from '../../../../constants';
import type { VideoFormState, VideoUploadStatus } from './useAdminContentDomain';

export interface AdminVideoUploadDialogProps {
  /** Whether the modal is open. */
  isOpen: boolean;
  /** The demo upload state. */
  uploadStatus: VideoUploadStatus;
  /** The demo upload progress (0-100). */
  uploadProgress: number;
  /** The upload form values. */
  videoForm: VideoFormState;
  /** Report updated form values. */
  onFormChange: (form: VideoFormState) => void;
  /** Start (or simulate) the upload. */
  onStartUpload: () => void;
  /** Close the modal (callers gate this on `uploadStatus === 'idle'`). */
  onClose: () => void;
}

export function AdminVideoUploadDialog({
  isOpen,
  uploadStatus,
  uploadProgress,
  videoForm,
  onFormChange,
  onStartUpload,
  onClose,
}: AdminVideoUploadDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => uploadStatus === 'idle' && onClose()}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 pointer-events-auto flex flex-col max-h-[90vh]"
          >
            <div className="p-8 bg-brand-navy text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
                  <Video size={24} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none mb-1">Upload Video Materi</h3>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Content Library Management</p>
                </div>
              </div>
              <button
                onClick={() => uploadStatus === 'idle' && onClose()}
                aria-label="Tutup upload video"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="p-10 overflow-y-auto space-y-8">
              {uploadStatus === 'idle' ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Video Title</label>
                      <input
                        aria-label="Video Title"
                        value={videoForm.title}
                        onChange={(e) => onFormChange({ ...videoForm, title: e.target.value })}
                        placeholder="e.g. Strategi IRT SNBT 2024"
                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Associated Program</label>
                      <select
                        aria-label="Associated Program"
                        value={videoForm.program}
                        onChange={(e) => onFormChange({ ...videoForm, program: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-sm"
                      >
                        {PROGRAMS.map((p) => <option key={p.id}>{p.title}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Duration (Min:Sec)</label>
                      <input
                        aria-label="Duration (Min:Sec)"
                        value={videoForm.duration}
                        onChange={(e) => onFormChange({ ...videoForm, duration: e.target.value })}
                        placeholder="e.g. 45:20"
                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Video Description</label>
                      <textarea
                        aria-label="Video Description"
                        value={videoForm.description}
                        onChange={(e) => onFormChange({ ...videoForm, description: e.target.value })}
                        placeholder="Jelaskan detail materi pembahasan video ini..."
                        className="w-full h-44 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Video File</label>
                    <label className="w-full p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-slate-50 hover:border-emerald-700 transition-all cursor-pointer group">
                      <div className="p-4 bg-blue-50 text-emerald-700 rounded-2xl group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        <Plus size={32} aria-hidden="true" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-brand-navy">Choose video or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">MP4, MOV up to 500MB</p>
                      </div>
                      <input type="file" className="sr-only" accept="video/*" aria-label="Pilih file video" onChange={onStartUpload} />
                    </label>
                  </div>
                </div>
              ) : uploadStatus === 'uploading' ? (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-8">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64" cy="64" r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                      />
                      <circle
                        cx="64" cy="64" r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * uploadProgress) / 100}
                        className="text-emerald-700 transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-brand-navy">
                      {uploadProgress}%
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-navy mb-2">Mengupload Video...</h4>
                    <p className="text-slate-500 font-medium">Harap jangan menutup jendela ini hingga proses selesai.</p>
                  </div>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-8 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                    <Check size={48} strokeWidth={4} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-brand-navy mb-2">Video Berhasil Diupload!</h4>
                    <p className="text-slate-500 font-medium">Materi "{videoForm.title}" telah ditambahkan ke database.</p>
                  </div>
                </div>
              )}
            </div>

            {uploadStatus === 'idle' && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4 shrink-0">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={!videoForm.title}
                  onClick={onStartUpload}
                >
                  Start Upload
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminVideoUploadDialog;
