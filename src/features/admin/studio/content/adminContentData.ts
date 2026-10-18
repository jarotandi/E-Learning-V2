/**
 * Admin Content Library (Studio) data
 * ====================================
 * B1.4D-T5A — Studio / Content Library extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/14-b1.4d-t5a-studio-content.md
 *
 * The `VideoLessonRecord` type, the canonical storage key and the seed lesson
 * list, lifted verbatim out of `AdminDashboard` (T5A). No field was dropped and
 * no seed value was changed.
 *
 * ## Storage ownership
 *
 * The Content domain now owns the single canonical key
 * `theprams_demo_video_lessons`. The key is NOT renamed, NOT migrated, and no
 * additional Content key is introduced, so the admin registry stays at 13/13.
 *
 * ## Website / Blog is NOT here
 *
 * T5A extracts ONLY the Content Library / Video surface. The Website editor and
 * the Blog/Literasi state stay in `AdminDashboard` for T5B.
 */

export interface VideoLessonRecord {
  id: string;
  title: string;
  program: string;
  duration: string;
  views: string;
  date: string;
  status: 'Draft' | 'Published' | 'Archived';
  access: 'Free' | 'Premium' | 'Scholarship';
  thumbnail: string;
  description: string;
  mentor: string;
  module: string;
  tags: string[];
  notes: string;
}

/** The single canonical Content Library storage key (unchanged). */
export const VIDEO_LESSONS_STORAGE_KEY = 'theprams_demo_video_lessons';

/** Seed lessons — values copied verbatim from the legacy monolith. */
export const defaultVideoLessons: VideoLessonRecord[] = [
  { id: 'video-1', title: 'Anatomi Dasar Bagian 1', program: 'Kedokteran Express', duration: '45:20', views: '1.2k', date: '2 hari lalu', status: 'Published', access: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400', description: 'Pengenalan anatomi dasar untuk calon mahasiswa kedokteran dengan pendekatan visual.', mentor: 'dr. Pramono', module: 'Foundation Kedokteran', tags: ['Kedokteran', 'Anatomi'], notes: 'Tambahkan kuis singkat setelah menit 20.' },
  { id: 'video-2', title: 'TPA Penalaran Logis', program: 'SNBT Intensive', duration: '32:15', views: '2.5k', date: '3 hari lalu', status: 'Published', access: 'Free', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400', description: 'Materi pola penalaran logis, implikasi, negasi, dan penarikan kesimpulan.', mentor: 'Siti Aminah, M.Pd.', module: 'Penalaran Umum', tags: ['SNBT', 'Logika'], notes: 'Cocok sebagai materi gratis setelah tryout.' },
  { id: 'video-3', title: 'UUD 1945 & Amandemen', program: 'CPNS Masterclass', duration: '58:40', views: '840', date: '5 hari lalu', status: 'Draft', access: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400', description: 'Pembahasan TWK tentang konstitusi dan perubahan amandemen penting.', mentor: 'Admin The Prams', module: 'TWK CPNS', tags: ['CPNS', 'TWK'], notes: 'Review ulang contoh soal sebelum publish.' },
  { id: 'video-4', title: 'Persiapan Psikotes', program: 'Kedinasan Special', duration: '25:10', views: '1.1k', date: '1 minggu lalu', status: 'Published', access: 'Scholarship', thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400', description: 'Strategi dasar psikotes untuk sekolah kedinasan dan latihan konsentrasi.', mentor: 'Admin The Prams', module: 'Kedinasan', tags: ['Psikotes', 'Kedinasan'], notes: 'Bisa dibuka untuk siswa beasiswa approved.' },
];
