/**
 * Admin Content Library domain hook
 * ==================================
 * B1.4D-T5A — Studio / Content Library extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/14-b1.4d-t5a-studio-content.md
 *
 * ## Why a hook, not a route-mounted page
 *
 * The legacy `AdminDashboard` kept the Content Library state (video list,
 * upload modal, editor draft, upload progress) ABOVE the conditional
 * `activeTab === 'content'` JSX, so an in-progress upload/editor draft survived
 * client-side tab changes. Moving that state into a page that only mounts for
 * `/admin/studio/content` would silently lose that behaviour. The hook is
 * therefore invoked ONCE by the PERSISTENT `AdminDashboard`, and
 * `AdminContentLibraryPage` + the two dialogs receive the surface as props.
 *
 * ## Inject, do not import
 *
 * `notify` (the toast adapter) and `recordAudit` (the audit sink) stay owned by
 * `AdminDashboard` and are injected. The hook never imports `AdminDashboard`,
 * so there is no import cycle.
 *
 * ## Storage
 *
 * The Content domain owns the single canonical key
 * `theprams_demo_video_lessons` — read with the same
 * `readStorageArray(key, defaultVideoLessons)` fallback and written with the
 * same `localStorage.setItem(key, JSON.stringify(...))` semantics. NOT renamed,
 * NOT migrated, no second key.
 *
 * ## Upload is a DEMO simulation
 *
 * Despite the UI copy ("video file"), there is no real upload and no File API
 * persistence. Selecting a file / pressing Start Upload only drives the
 * `idle -> uploading -> completed` demo. T5A preserves that exactly.
 */

import { useState, type Dispatch, type SetStateAction } from 'react';

import { PROGRAMS } from '../../../../constants';
import { readStorageArray } from '../../adminStorage';
import {
  VIDEO_LESSONS_STORAGE_KEY,
  defaultVideoLessons,
  type VideoLessonRecord,
} from './adminContentData';

export type VideoUploadStatus = 'idle' | 'uploading' | 'completed';

export interface VideoFormState {
  title: string;
  description: string;
  duration: string;
  program: string;
}

/** The blank upload form. Program falls back to the first canonical program. */
export const createInitialVideoForm = (): VideoFormState => ({
  title: '',
  description: '',
  duration: '',
  program: PROGRAMS[0].title,
});

/* ------------------------------------------------------------------ */
/* Injection contract                                                  */
/* ------------------------------------------------------------------ */

export interface UseAdminContentDomainOptions {
  /** Toast adapter (stays owned by AdminDashboard). */
  notify: (message: string) => void;
  /** Audit sink (stays owned by AdminDashboard). */
  recordAudit: (module: string, action: string, detail: string) => void;
}

/* ------------------------------------------------------------------ */
/* Public surface                                                      */
/* ------------------------------------------------------------------ */

export interface UseAdminContentDomainResult {
  videoLessons: VideoLessonRecord[];
  isUploadModalOpen: boolean;
  editingVideo: VideoLessonRecord | null;
  uploadStatus: VideoUploadStatus;
  uploadProgress: number;
  videoForm: VideoFormState;

  setEditingVideo: Dispatch<SetStateAction<VideoLessonRecord | null>>;
  setVideoForm: Dispatch<SetStateAction<VideoFormState>>;

  /** Open the "Upload Video Materi" modal (the content contextual add). */
  openUpload: () => void;
  /** Close the upload modal (callers gate this on `uploadStatus === 'idle'`). */
  closeUpload: () => void;
  /** Close the video editor without saving. */
  closeEditor: () => void;
  /** Persist the edited lesson (replace by id or prepend). */
  saveVideoEditor: (video: VideoLessonRecord) => void;
  /** Remove a lesson from the demo list. */
  deleteVideo: (video: VideoLessonRecord) => void;
  /** Demo preview toast for a lesson. */
  previewVideo: (video: VideoLessonRecord) => void;
  /** Drive the DEMO upload simulation. */
  simulateVideoUpload: () => void;
}

export function useAdminContentDomain({
  notify,
  recordAudit,
}: UseAdminContentDomainOptions): UseAdminContentDomainResult {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [videoLessons, setVideoLessons] = useState<VideoLessonRecord[]>(
    () => readStorageArray(VIDEO_LESSONS_STORAGE_KEY, defaultVideoLessons),
  );
  const [editingVideo, setEditingVideo] = useState<VideoLessonRecord | null>(null);
  const [uploadStatus, setUploadStatus] = useState<VideoUploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoForm, setVideoForm] = useState<VideoFormState>(createInitialVideoForm);

  const saveVideoLessons = (nextVideos: VideoLessonRecord[]) => {
    setVideoLessons(nextVideos);
    localStorage.setItem(VIDEO_LESSONS_STORAGE_KEY, JSON.stringify(nextVideos));
  };

  const openUpload = () => {
    setIsUploadModalOpen(true);
  };

  const closeUpload = () => {
    setIsUploadModalOpen(false);
  };

  const closeEditor = () => {
    setEditingVideo(null);
  };

  const previewVideo = (video: VideoLessonRecord) => {
    notify(`Preview video "${video.title}" dibuka di mode demo.`);
  };

  const saveVideoEditor = (video: VideoLessonRecord) => {
    if (!video.title.trim()) {
      notify('Judul video wajib diisi.');
      return;
    }
    const sanitized: VideoLessonRecord = {
      ...video,
      title: video.title.trim(),
      program: video.program.trim() || PROGRAMS[0].title,
      duration: video.duration.trim() || '00:00',
      thumbnail: video.thumbnail.trim() || defaultVideoLessons[0].thumbnail,
      tags: video.tags.map((tag) => tag.trim()).filter(Boolean),
    };
    const nextVideos = videoLessons.some((item) => item.id === sanitized.id)
      ? videoLessons.map((item) => (item.id === sanitized.id ? sanitized : item))
      : [sanitized, ...videoLessons];
    saveVideoLessons(nextVideos);
    setEditingVideo(null);
    recordAudit('Content Library', 'Save Video Lesson', sanitized.title);
    notify('Detail video berhasil disimpan.');
  };

  const deleteVideo = (video: VideoLessonRecord) => {
    saveVideoLessons(videoLessons.filter((item) => item.id !== video.id));
    notify(`Video "${video.title}" dihapus dari daftar demo.`);
  };

  const simulateVideoUpload = () => {
    if (!videoForm.title) return;
    setUploadStatus('uploading');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('completed');
          setTimeout(() => {
            setIsUploadModalOpen(false);
            setUploadStatus('idle');
            setVideoForm(createInitialVideoForm());
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return {
    videoLessons,
    isUploadModalOpen,
    editingVideo,
    uploadStatus,
    uploadProgress,
    videoForm,
    setEditingVideo,
    setVideoForm,
    openUpload,
    closeUpload,
    closeEditor,
    saveVideoEditor,
    deleteVideo,
    previewVideo,
    simulateVideoUpload,
  };
}

export default useAdminContentDomain;
