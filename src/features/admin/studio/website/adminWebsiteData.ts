/**
 * Admin Studio / Website Editor data
 * ===================================
 * B1.4D-T5B — Studio / Website Editor + Blog/Literasi extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/15-b1.4d-t5b-studio-website.md
 *
 * The `BlogEditorAsset` type, the canonical blog-asset storage key and the
 * `BLOG_EDITOR_TEMPLATES` article templates, lifted verbatim out of
 * `AdminDashboard` (T5B). No template was rewritten: every label, category,
 * title, excerpt, Markdown body and tag list is copied exactly.
 *
 * ## Storage ownership
 *
 * The Website domain now owns the single canonical key
 * `theprams_demo_blog_assets`. The key is NOT renamed, NOT migrated, and no
 * additional Website key is introduced, so the admin registry stays at 13/13.
 *
 * ## NOT here — Review / Inquiries (T6)
 *
 * `theprams_demo_website_questions` and the `websiteQuestions` state are NOT
 * part of the Studio Website Editor domain. Despite the variable name they
 * belong to `/admin/review/inquiries` and are extracted in T6.
 */

import type { BlogPost } from '../../../../types';

export interface BlogEditorAsset {
  id: string;
  type: 'image' | 'document';
  source: 'pc' | 'internet';
  name: string;
  url: string;
  note: string;
  createdAt: string;
}

/** The single canonical blog-asset storage key (unchanged). */
export const BLOG_ASSETS_STORAGE_KEY = 'theprams_demo_blog_assets';

/** The exact legacy category filter list (order preserved). */
export const BLOG_CATEGORY_OPTIONS: Array<'Semua' | BlogPost['category']> = [
  'Semua',
  'Tips & Trik',
  'Info PTN',
  'Materi',
  'Inspirasi',
  'Literasi',
];

/** Article templates — bodies copied verbatim from the legacy monolith. */
export const BLOG_EDITOR_TEMPLATES: Array<{
  label: string;
  category: BlogPost['category'];
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}> = [
  {
    label: 'Template Tips Belajar',
    category: 'Tips & Trik',
    title: 'Judul Tips Belajar yang Spesifik',
    excerpt: 'Ringkas masalah utama siswa dan janji solusi praktis dalam satu kalimat.',
    content: `# Judul Tips Belajar yang Spesifik

Pembuka singkat: jelaskan masalah yang sering dialami siswa dan kenapa topik ini penting.

## 1. Diagnosis Masalah
Tuliskan cara mengenali masalah belajar, contoh gejala, dan data yang perlu dilihat.

## 2. Langkah Praktis
Berikan langkah yang bisa langsung dilakukan siswa hari ini.

## 3. Contoh Penerapan
Masukkan contoh jadwal, cara review soal, atau pola latihan.

## Checklist
- Target harian jelas.
- Ada evaluasi kesalahan.
- Ada waktu istirahat.
- Ada tryout atau latihan terukur.
`,
    tags: ['Tips Belajar', 'Strategi', 'Tryout']
  },
  {
    label: 'Template Literasi',
    category: 'Literasi',
    title: 'Judul Artikel Literasi',
    excerpt: 'Ringkas teknik membaca, memahami teks, atau menjawab soal literasi.',
    content: `# Judul Artikel Literasi

Pembuka: jelaskan jenis bacaan atau kesalahan literasi yang sering muncul.

## Konsep Utama
Jelaskan prinsip membaca aktif, ide pokok, inferensi, atau bukti teks.

## Contoh Pola Soal
Tulis contoh pola pertanyaan dan cara mengeliminasi pilihan jawaban.

## Latihan Mandiri
Berikan latihan kecil yang bisa dilakukan siswa setelah membaca artikel.
`,
    tags: ['Literasi', 'SNBT', 'Membaca']
  },
  {
    label: 'Template Info Seleksi',
    category: 'Info PTN',
    title: 'Judul Info Seleksi Terbaru',
    excerpt: 'Ringkas informasi seleksi, administrasi, jadwal, atau persiapan dokumen.',
    content: `# Judul Info Seleksi Terbaru

Pembuka: jelaskan konteks seleksi dan siapa yang perlu membaca artikel ini.

## Hal yang Perlu Diperhatikan
Uraikan poin penting secara praktis dan mudah dipindai.

## Dokumen atau Data yang Perlu Disiapkan
Tuliskan daftar dokumen, data diri, atau bukti pendukung.

## Rekomendasi Langkah Berikutnya
Berikan saran aksi yang realistis untuk siswa.
`,
    tags: ['Info Seleksi', 'Pendaftaran', 'Persiapan']
  },
  {
    label: 'Template CPNS/SKD',
    category: 'Materi',
    title: 'Judul Strategi SKD CPNS',
    excerpt: 'Ringkas strategi TWK, TIU, TKP, manajemen waktu, atau evaluasi simulasi.',
    content: `# Judul Strategi SKD CPNS

Pembuka: jelaskan tantangan SKD yang ingin diselesaikan.

## TWK
Tuliskan fokus materi, contoh konteks, dan cara review.

## TIU
Jelaskan pola logika/hitungan dan strategi waktu.

## TKP
Jelaskan prinsip memilih jawaban yang konsisten dengan pelayanan publik.

## Simulasi
Berikan pola latihan dengan timer dan cara evaluasi.
`,
    tags: ['CPNS', 'SKD', 'Strategi']
  }
];
