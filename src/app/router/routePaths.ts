/**
 * AKSA Canonical Route Paths
 * ==========================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/04-route-map.md
 *            docs/aksa/b1/02-b1-subbatch-plan.md
 *            docs/aksa/b1/01-legacy-compatibility-map.md
 *
 * This module is the single source of truth for URL construction. Nothing
 * else in `src/` should hand-write a path string; it should import a builder
 * from here. That keeps the canonical URL contract in one auditable place.
 *
 * Route classification (documented in docs/aksa/04-route-map.md):
 *
 *   canonical      — the official AKSA URL for a surface. Exactly one per
 *                    capability. Stable and shareable.
 *   compatibility  — an alternate URL retained so an existing legacy flow or
 *                    an old shared link keeps working. Always redirects to
 *                    (or is served by) a canonical route.
 *   planned        — reserved by the approved B1 IA. Renders a neutral
 *                    foundation placeholder. NOT a shipped capability.
 *
 * IMPORTANT (B1.3 scope): a `planned` path existing does NOT mean the feature
 * exists. The navigation contracts in `src/app/navigation/` reflect this with
 * `status: 'planned'`.
 */

import { TRYOUTS } from '../../constants';

/* ------------------------------------------------------------------ */
/* Public                                                              */
/* ------------------------------------------------------------------ */

export const PUBLIC_PATHS = {
  landing: '/',
  programs: '/programs',
  blogListing: '/blog',
  contact: '/contact',
  testimonials: '/testimonials',
  login: '/login',
  register: '/register',
  guestRegistration: '/register/guest',
  finalRegistration: '/register/final',
} as const;

/* ------------------------------------------------------------------ */
/* Learner                                                             */
/* ------------------------------------------------------------------ */

export const LEARNER_PATHS = {
  dashboard: '/app',
  learning: '/app/learn',
  assessment: '/app/assessment',
  calendar: '/app/calendar',
  profile: '/app/profile',
  wallet: '/app/wallet',
} as const;

/* ------------------------------------------------------------------ */
/* Admin / Studio                                                      */
/* ------------------------------------------------------------------ */

export const ADMIN_PATHS = {
  admin: '/admin',
} as const;

export const STUDIO_PATHS = {
  dashboard: '/studio',
  editor: '/studio/editor',
  templates: '/studio/templates',
  media: '/studio/media',
  factory: '/studio/factory',
  validation: '/studio/validation',
  review: '/studio/review',
  published: '/studio/published',
  analytics: '/studio/analytics',
  settings: '/studio/settings',
} as const;

/* ------------------------------------------------------------------ */
/* Parameterised builders                                             */
/* ------------------------------------------------------------------ */

const encode = (value: string) => encodeURIComponent(value);

/** Canonical program detail URL. */
export const programDetailPath = (programId: string) =>
  `/programs/${encode(programId)}`;

/** Canonical mentor profile URL. */
export const mentorProfilePath = (mentorId: string) =>
  `/mentors/${encode(mentorId)}`;

/**
 * Canonical blog post URL.
 *
 * B1.3 note: the legacy shared-link form is `#blog-<id>` on the current path.
 * `blogPostPath` is the canonical form. The hash form is redirected to this
 * in `AppRouter`; see `legacyHashRedirect`.
 */
export const blogPostPath = (blogId: string) => `/blog/${encode(blogId)}`;

/** Canonical tryout exam URL. */
export const examPath = (tryoutId: string) =>
  `/app/assessment/${encode(tryoutId)}/exam`;

/** Canonical tryout result URL. */
export const resultPath = (tryoutId: string) =>
  `/app/assessment/${encode(tryoutId)}/result`;

/** Canonical Studio editor URL. */
export const studioEditorPath = (contentId: string) =>
  `/studio/editor/${encode(contentId)}`;

/* ------------------------------------------------------------------ */
/* Tryout id fallback                                                  */
/* ------------------------------------------------------------------ */

/**
 * Deterministic fallback tryout id.
 *
 * WHY THIS EXISTS: `TryoutListingPage` and the premium payment branch call
 * `setView('exam')` WITHOUT ever setting a tryout id — the id is normally
 * established earlier by `LoginPage`. The canonical exam route requires a
 * `:tryoutId` segment, so when no id is present we must still produce a
 * deterministic, shareable URL rather than a broken one.
 *
 * This mirrors the pre-router behaviour exactly: with `selectedTryoutId ===
 * null`, `TryoutExamPage` already fell back to the first `TRYOUTS` entry. The
 * router now makes that implicit fallback explicit in the URL.
 */
export const FALLBACK_TRYOUT_ID: string = TRYOUTS[0]?.id ?? 'to-1';

/* ------------------------------------------------------------------ */
/* Planned learner foundation routes                                  */
/* ------------------------------------------------------------------ */

/**
 * Planned learner modules from the approved B1 IA.
 *
 * These render a neutral foundation placeholder inside `LearnerLayout`.
 * They implement NOTHING. Listing a path here is an architectural
 * reservation, not a shipped feature.
 *
 * Deliberately NOT listed (they already map to a real legacy capability and
 * therefore have their own canonical route above):
 *   /app/learn, /app/assessment, /app/calendar, /app/profile, /app/wallet
 */
export interface PlannedLearnerRoute {
  /** URL segment under `/app`. */
  segment: string;
  /** Human label shown in the shell and the placeholder. */
  label: string;
  /** Owning delivery batch, per docs/aksa/b1/02-b1-subbatch-plan.md. */
  batch: string;
  /** Non-functional description of what the module will be. */
  intent: string;
}

export const PLANNED_LEARNER_ROUTES: readonly PlannedLearnerRoute[] = [
  {
    segment: 'path',
    label: 'My Path / Skill Map',
    batch: 'B2',
    intent: 'Peta tujuan belajar dan penanda gap kompetensi.',
  },
  {
    segment: 'library',
    label: 'Library',
    batch: 'B2',
    intent: 'Koleksi materi, modul, dan sumber belajar terkurasi.',
  },
  {
    segment: 'labs',
    label: 'Skills Labs',
    batch: 'B2',
    intent: 'Latihan praktik terpandu berbasis skenario nyata.',
  },
  {
    segment: 'projects',
    label: 'Projects',
    batch: 'B2',
    intent: 'Proyek terstruktur sebagai bukti kemampuan.',
  },
  {
    segment: 'partner-practice',
    label: 'Partner Practice',
    batch: 'B2',
    intent: 'Berlatih berpasangan dengan mentor atau fellow learner.',
  },
  {
    segment: 'ai',
    label: 'AI Tutor',
    batch: 'B5',
    intent: 'Tutor AI. Memerlukan AKSA server/edge AI Router — belum ada.',
  },
  {
    segment: 'mentors',
    label: 'Guru & Mentor',
    batch: 'B2',
    intent: 'Direktori guru dan mentor AKSA.',
  },
  {
    segment: 'live',
    label: 'AKSA Live',
    batch: 'B2',
    intent: 'Sesi live terjadwal dan rekaman kelas.',
  },
  {
    segment: 'progress',
    label: 'Progress',
    batch: 'B2',
    intent: 'Analisis kemajuan belajar berbasis data.',
  },
  {
    segment: 'portfolio',
    label: 'Portfolio',
    batch: 'B2',
    intent: 'Kumpulan karya dan achievement learner.',
  },
  {
    segment: 'passport',
    label: 'Skills Passport',
    batch: 'B2',
    intent: 'Sertifikasi kompetensi yang dapat diverifikasi.',
  },
  {
    segment: 'career',
    label: 'Career',
    batch: 'B2',
    intent: 'Panduan karier dan persiapan seleksi.',
  },
  {
    segment: 'community',
    label: 'Community',
    batch: 'B2',
    intent: 'Ruang diskusi dan komunitas antar learner.',
  },
  {
    segment: 'rewards',
    label: 'Rewards',
    batch: 'B2',
    intent: 'Sistem achievement, poin, dan pengakuan.',
  },
  {
    segment: 'downloads',
    label: 'Downloads',
    batch: 'B2',
    intent: 'Berkas unduhan dan materi milik learner.',
  },
  {
    segment: 'settings',
    label: 'Settings',
    batch: 'B2',
    intent: 'Pengaturan akun dan preferensi learner.',
  },
  {
    segment: 'help',
    label: 'Help Center',
    batch: 'B2',
    intent: 'Bantuan, FAQ, dan dukungan AKSA.',
  },
] as const;

/** Map of planned segment -> full path, for router registration. */
export const plannedLearnerPaths: Record<string, string> =
  Object.fromEntries(
    PLANNED_LEARNER_ROUTES.map((route) => [route.segment, `/app/${route.segment}`]),
  );

/* ------------------------------------------------------------------ */
/* Planned Studio foundation routes                                    */
/* ------------------------------------------------------------------ */

/**
 * Studio foundation routes.
 *
 * B1.3 renders shell/placeholder only. No editor, no AI, no generation, no
 * validation logic, no review workflow, no publishing, no analytics.
 * Those are B4/B6 deliverables.
 */
export interface PlannedStudioRoute {
  segment: string;
  label: string;
  batch: string;
  intent: string;
}

export const PLANNED_STUDIO_ROUTES: readonly PlannedStudioRoute[] = [
  {
    segment: '',
    label: 'Dashboard',
    batch: 'B4',
    intent: 'Ringkasan aktivitas authoring AKSA Studio.',
  },
  {
    segment: 'editor',
    label: 'Studio / Editor',
    batch: 'B4',
    intent: 'Editor konten Authoring dengan panel Copilot.',
  },
  {
    segment: 'templates',
    label: 'Templates',
    batch: 'B4',
    intent: 'Pustaka template konten terstruktur.',
  },
  {
    segment: 'media',
    label: 'Media Library',
    batch: 'B4',
    intent: 'Kelola aset gambar, video, dan dokumen.',
  },
  {
    segment: 'factory',
    label: 'Content Factory',
    batch: 'B5',
    intent: 'Pipeline pembuatan konten. Memerlukan AI Router.',
  },
  {
    segment: 'validation',
    label: 'Validation Center',
    batch: 'B6',
    intent: 'Validasi kelayakan konten sebelum publikasi.',
  },
  {
    segment: 'review',
    label: 'Review Queue',
    batch: 'B6',
    intent: 'Antrean review dan persetujuan konten.',
  },
  {
    segment: 'published',
    label: 'Published Content',
    batch: 'B6',
    intent: 'Konten yang sudah tayang.',
  },
  {
    segment: 'analytics',
    label: 'Analytics',
    batch: 'B4',
    intent: 'Performa konten dan keterlibatan learner.',
  },
  {
    segment: 'settings',
    label: 'Settings',
    batch: 'B4',
    intent: 'Pengaturan Studio dan preferensi authoring.',
  },
] as const;
