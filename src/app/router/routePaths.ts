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
  /**
   * Owning delivery batch, per `docs/aksa/10-batch-roadmap.md` (authority).
   *
   * `'TBD'` means the roadmap allocates NO batch to this module. That is a
   * deliberate, truthful value — not a gap to be filled with "the next batch".
   * B2 is Identity & Data Authority (Supabase Auth, roles, RLS, storage,
   * audit); it is infrastructure other batches depend on, NOT a catch-all
   * delivery batch. Assigning a UI surface to B2 merely because B2 comes next
   * is the specific error this field was corrected for (B1.3R1).
   *
   * Full audit and per-value authority: docs/aksa/b1/05-planned-route-delivery-map.md
   */
  batch: string;
  /** Non-functional description of what the module will be. */
  intent: string;
}

export const PLANNED_LEARNER_ROUTES: readonly PlannedLearnerRoute[] = [
  {
    segment: 'path',
    label: 'My Path / Skill Map',
    // roadmap B3 "Learning Kernel": skill graph, learner model, mastery.
    batch: 'B3',
    intent: 'Peta tujuan belajar dan penanda gap kompetensi.',
  },
  {
    segment: 'library',
    label: 'Library',
    // No roadmap batch owns a learner content library. B4 owns authoring
    // (Studio side); B12 owns offline packs. Neither is this surface.
    batch: 'TBD',
    intent: 'Koleksi materi, modul, dan sumber belajar terkurasi.',
  },
  {
    segment: 'labs',
    label: 'Skills Labs',
    // roadmap B9 "Skills Labs".
    batch: 'B9',
    intent: 'Latihan praktik terpandu berbasis skenario nyata.',
  },
  {
    segment: 'projects',
    label: 'Projects',
    // roadmap B11 "Projects & Credentials": real projects.
    batch: 'B11',
    intent: 'Proyek terstruktur sebagai bukti kemampuan.',
  },
  {
    segment: 'partner-practice',
    label: 'Partner Practice',
    // No roadmap batch names peer/paired practice. B10 owns human support
    // (tutors, chat, booking, video) but does not establish this surface.
    batch: 'TBD',
    intent: 'Berlatih berpasangan dengan mentor atau fellow learner.',
  },
  {
    segment: 'ai',
    label: 'AI Tutor',
    // roadmap B10 "Human Support" lists "AI Tutor" explicitly. This is
    // learner-facing tutoring, NOT B5 Creator AI. It also requires the
    // server/edge AI Router to exist first (SEC-P1-01).
    batch: 'B10',
    intent: 'Tutor AI. Memerlukan AKSA server/edge AI Router — belum ada.',
  },
  {
    segment: 'mentors',
    label: 'Guru & Mentor',
    // roadmap B10 "Human Support": primary/on-demand tutors.
    // Corroborated by b1/01-legacy-compatibility-map.md (mentorProfile -> B10).
    batch: 'B10',
    intent: 'Direktori guru dan mentor AKSA.',
  },
  {
    segment: 'live',
    label: 'AKSA Live',
    // roadmap B10 "Human Support": scheduled/instant video, office hours.
    // Corroborated by b1/01-legacy-compatibility-map.md (schedule -> B10).
    batch: 'B10',
    intent: 'Sesi live terjadwal dan rekaman kelas.',
  },
  {
    segment: 'progress',
    label: 'Progress',
    // No roadmap batch owns a progress surface. B3 owns the mastery and
    // learner-model DATA this would present, but the roadmap does not
    // allocate the surface itself, so ownership stays unallocated.
    batch: 'TBD',
    intent: 'Analisis kemajuan belajar berbasis data.',
  },
  {
    segment: 'portfolio',
    label: 'Portfolio',
    // roadmap B11 "Projects & Credentials" lists "portfolio".
    batch: 'B11',
    intent: 'Kumpulan karya dan achievement learner.',
  },
  {
    segment: 'passport',
    label: 'Skills Passport',
    // roadmap B11 "Projects & Credentials" lists "Skills Passport".
    batch: 'B11',
    intent: 'Sertifikasi kompetensi yang dapat diverifikasi.',
  },
  {
    segment: 'career',
    label: 'Career',
    // No roadmap batch owns career guidance or selection preparation.
    batch: 'TBD',
    intent: 'Panduan karier dan persiapan seleksi.',
  },
  {
    segment: 'community',
    label: 'Community',
    // No roadmap batch owns a learner community or discussion feed.
    batch: 'TBD',
    intent: 'Ruang diskusi dan komunitas antar learner.',
  },
  {
    segment: 'rewards',
    label: 'Rewards',
    // No roadmap batch owns achievements, points, or recognition.
    batch: 'TBD',
    intent: 'Sistem achievement, poin, dan pengakuan.',
  },
  {
    segment: 'downloads',
    label: 'Downloads',
    // roadmap B12 "Offline & Edge": downloadable content packs, storage
    // manager. This is offline-material capability, NOT localStorage-as-
    // authority (that is B2 / SEC-P1-02).
    batch: 'B12',
    intent: 'Berkas unduhan dan materi milik learner.',
  },
  {
    segment: 'settings',
    label: 'Settings',
    // No roadmap batch owns learner account settings.
    batch: 'TBD',
    intent: 'Pengaturan akun dan preferensi learner.',
  },
  {
    segment: 'help',
    label: 'Help Center',
    // No roadmap batch owns help, FAQ, or support content.
    batch: 'TBD',
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
  /**
   * Owning delivery batch, per `docs/aksa/10-batch-roadmap.md` (authority).
   * `'TBD'` means the roadmap allocates no batch. Same rule and same intent as
   * `PlannedLearnerRoute['batch']`.
   */
  batch: string;
  intent: string;
}

export const PLANNED_STUDIO_ROUTES: readonly PlannedStudioRoute[] = [
  {
    segment: '',
    label: 'Dashboard',
    // roadmap B4 "AKSA Studio Core" owns the Studio shell this lands in.
    batch: 'B4',
    intent: 'Ringkasan aktivitas authoring AKSA Studio.',
  },
  {
    segment: 'editor',
    label: 'Studio / Editor',
    // roadmap B4: "editor".
    batch: 'B4',
    intent: 'Editor konten Authoring dengan panel Copilot.',
  },
  {
    segment: 'templates',
    label: 'Templates',
    // roadmap B4: "templates".
    batch: 'B4',
    intent: 'Pustaka template konten terstruktur.',
  },
  {
    segment: 'media',
    label: 'Media Library',
    // roadmap B4: "media/source manager".
    batch: 'B4',
    intent: 'Kelola aset gambar, video, dan dokumen.',
  },
  {
    segment: 'factory',
    label: 'Content Factory',
    // roadmap B5 "Creator AI & Content Factory".
    batch: 'B5',
    intent: 'Pipeline pembuatan konten. Memerlukan AI Router.',
  },
  {
    segment: 'validation',
    label: 'Validation Center',
    // roadmap B6 "Validation Center": automatic validator registry, risk policy.
    batch: 'B6',
    intent: 'Validasi kelayakan konten sebelum publikasi.',
  },
  {
    segment: 'review',
    label: 'Review Queue',
    // roadmap B6: "review queue", "human review".
    batch: 'B6',
    intent: 'Antrean review dan persetujuan konten.',
  },
  {
    segment: 'published',
    label: 'Published Content',
    // roadmap B6: "publish gate", "re-validation".
    batch: 'B6',
    intent: 'Konten yang sudah tayang.',
  },
  {
    segment: 'analytics',
    label: 'Analytics',
    // The roadmap establishes NO batch for Studio analytics. B4 owns authoring
    // primitives, not engagement reporting. Left unallocated rather than
    // invented (B1.3R1).
    batch: 'TBD',
    intent: 'Performa konten dan keterlibatan learner.',
  },
  {
    segment: 'settings',
    label: 'Settings',
    // The roadmap establishes NO batch for Studio settings. Not a B4 Studio
    // Core deliverable. Left unallocated rather than invented (B1.3R1).
    batch: 'TBD',
    intent: 'Pengaturan Studio dan preferensi authoring.',
  },
] as const;
