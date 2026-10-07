/**
 * Legacy View <-> Route Bridge
 * ============================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/b1/01-legacy-compatibility-map.md
 *            docs/aksa/04-route-map.md
 *
 * ## Why this file exists
 *
 * Every existing AKSA component receives `setView: (v: View) => void` and
 * calls it with one of the 21 legacy `View` string literals. Rewriting ~60
 * call sites across 19 components in B1.3 would be a large, risky, and
 * architecturally unnecessary change to business UI code.
 *
 * Instead this module is the SINGLE translation layer between the legacy
 * `View` vocabulary and canonical URLs. The components keep their exact
 * public props. The router simply makes `setView` perform navigation.
 *
 * ## Direction of translation
 *
 *   FORWARD  legacyNavigate(view)  ->  canonical path   (see legacyViewToPath)
 *   REVERSE  canonical path        ->  legacy View       (see pathToLegacyView)
 *
 * The reverse direction is required because `Navbar` receives
 * `currentView: View` to highlight the active link, and because the
 * Navbar-visibility rule is expressed in terms of legacy views.
 *
 * ## Invariant
 *
 * All 21 legacy `View` values must appear in `LEGACY_VIEW_ROUTES` exactly
 * once. `scripts/verify-routes.mjs` asserts this, because a silently dropped
 * `View` would make a legacy capability unreachable — the single worst outcome
 * for this sub-batch.
 *
 * Note: the repository has no test framework (`package.json` exposes only
 * dev/build/preview/clean/lint), so the route contract is enforced by that
 * standalone Node script rather than by a `*.test.ts` file.
 */

import type { View } from '../../types';
import {
  FALLBACK_TRYOUT_ID,
  LEARNER_PATHS,
  PUBLIC_PATHS,
  blogPostPath,
  examPath,
  mentorProfilePath,
  programDetailPath,
  resultPath,
} from './routePaths';

/** Identifiers read when building a parameterised canonical URL. */
export interface LegacySelectionIds {
  programId?: string | null;
  packageId?: string | null;
  mentorId?: string | null;
  blogId?: string | null;
  tryoutId?: string | null;
}

/* ------------------------------------------------------------------ */
/* Forward: View -> path                                              */
/* ------------------------------------------------------------------ */

/**
 * Translates a legacy `View` into the canonical URL for that surface.
 *
 * The `ids` argument is required for the parameterised views. When an id is
 * absent the builders substitute a deterministic fallback so the produced
 * URL is always valid and shareable. See `FALLBACK_TRYOUT_ID` for why the
 * tryout fallback is not merely defensive.
 */
export function legacyViewToPath(
  view: View,
  ids: LegacySelectionIds = {},
): string {
  switch (view) {
    case 'landing':
      return PUBLIC_PATHS.landing;
    case 'programs':
      return PUBLIC_PATHS.programs;
    case 'programDetail':
      return programDetailPath(ids.programId ?? '');
    case 'mentorProfile':
      return mentorProfilePath(ids.mentorId ?? '');
    case 'blogListing':
      return PUBLIC_PATHS.blogListing;
    case 'blogPost':
      return blogPostPath(ids.blogId ?? '');
    case 'contact':
      return PUBLIC_PATHS.contact;
    case 'testimonials':
      return PUBLIC_PATHS.testimonials;
    case 'login':
      return PUBLIC_PATHS.login;
    case 'register':
      return PUBLIC_PATHS.register;
    case 'guestRegistration':
      return PUBLIC_PATHS.guestRegistration;
    case 'finalRegistration':
      return PUBLIC_PATHS.finalRegistration;
    case 'dashboard':
      return LEARNER_PATHS.dashboard;
    case 'learning':
      return LEARNER_PATHS.learning;
    case 'tryoutListing':
      return LEARNER_PATHS.assessment;
    case 'exam':
      return examPath(ids.tryoutId ?? FALLBACK_TRYOUT_ID);
    case 'result':
      return resultPath(ids.tryoutId ?? FALLBACK_TRYOUT_ID);
    case 'schedule':
      return LEARNER_PATHS.calendar;
    case 'profile':
      return LEARNER_PATHS.profile;
    case 'payment':
      return LEARNER_PATHS.wallet;
    case 'admin':
      return '/admin';
    default: {
      // Exhaustiveness guard: adding a `View` without a route is a compile
      // error rather than a silently unreachable capability.
      const unreachable: never = view;
      return unreachable;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Reverse: path -> View                                              */
/* ------------------------------------------------------------------ */

/** Everything the reverse mapping can recover from a URL. */
export interface PathContext {
  /** Route parameter values, keyed by `:`-prefixed pattern name. */
  params?: Record<string, string | undefined>;
}

function normalise(pathname: string): string {
  if (!pathname) return '/';
  // Collapse a trailing slash, but keep the bare root as '/'.
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return trimmed === '' ? '/' : trimmed;
}

/**
 * Translates a canonical URL back into the legacy `View` it represents.
 *
 * Returns `null` for URLs that are not legacy views — planned learner
 * routes, Studio routes, and the 404 route. Callers must treat `null` as
 * "no legacy view", not as an error.
 */
export function pathToLegacyView(
  pathname: string,
  context: PathContext = {},
): View | null {
  const path = normalise(pathname);
  const params = context.params ?? {};

  switch (path) {
    case PUBLIC_PATHS.landing:
      return 'landing';
    case PUBLIC_PATHS.programs:
      return 'programs';
    case PUBLIC_PATHS.blogListing:
      return 'blogListing';
    case PUBLIC_PATHS.contact:
      return 'contact';
    case PUBLIC_PATHS.testimonials:
      return 'testimonials';
    case PUBLIC_PATHS.login:
      return 'login';
    case PUBLIC_PATHS.register:
      return 'register';
    case PUBLIC_PATHS.guestRegistration:
      return 'guestRegistration';
    case PUBLIC_PATHS.finalRegistration:
      return 'finalRegistration';
    case LEARNER_PATHS.dashboard:
      return 'dashboard';
    case LEARNER_PATHS.learning:
      return 'learning';
    case LEARNER_PATHS.assessment:
      return 'tryoutListing';
    case LEARNER_PATHS.calendar:
      return 'schedule';
    case LEARNER_PATHS.profile:
      return 'profile';
    case LEARNER_PATHS.wallet:
      return 'payment';
    case '/admin':
      return 'admin';
    default:
      break;
  }

  // Parameterised public routes.
  if (path.startsWith('/programs/') && path.length > '/programs/'.length) {
    return 'programDetail';
  }
  if (path.startsWith('/mentors/') && path.length > '/mentors/'.length) {
    return 'mentorProfile';
  }
  if (path.startsWith('/blog/') && path.length > '/blog/'.length) {
    return 'blogPost';
  }

  // Parameterised assessment routes.
  if (path.startsWith('/app/assessment/')) {
    const tail = path.slice('/app/assessment/'.length);
    if (tail.endsWith('/exam')) return 'exam';
    if (tail.endsWith('/result')) return 'result';
  }

  // `params` is consulted only as a fallback for callers that pass a bare
  // pathname with a stripped prefix. The suffix tests above are authoritative.
  if (params.tryoutId && path.endsWith('/exam')) return 'exam';
  if (params.tryoutId && path.endsWith('/result')) return 'result';

  return null;
}

/* ------------------------------------------------------------------ */
/* Coverage + chrome rules                                            */
/* ------------------------------------------------------------------ */

/**
 * The complete legacy view registry, in the order declared by `src/types.ts`.
 *
 * This is the authoritative proof that B1.3 preserves all 21 capabilities.
 */
export const LEGACY_VIEW_ROUTES: readonly View[] = [
  'landing',
  'programs',
  'programDetail',
  'mentorProfile',
  'tryoutListing',
  'dashboard',
  'learning',
  'exam',
  'result',
  'admin',
  'contact',
  'testimonials',
  'schedule',
  'profile',
  'login',
  'payment',
  'finalRegistration',
  'blogListing',
  'blogPost',
  'register',
  'guestRegistration',
] as const;

/** Total legacy `View` count preserved by B1.3. */
export const LEGACY_VIEW_COUNT = LEGACY_VIEW_ROUTES.length;

/**
 * Legacy views that require an in-memory user.
 *
 * This list is copied VERBATIM from the pre-router protection effect in
 * `src/App.tsx`:
 *
 *   const protectedViews: View[] = [
 *     'dashboard', 'learning', 'exam', 'result', 'tryoutListing', 'profile', 'schedule'
 *   ];
 *
 * Note what is NOT here: `payment` and `finalRegistration` are deliberately
 * unprotected in the legacy behaviour (a user can reach checkout while logged
 * out). B1.3 preserves that exactly rather than "improving" it, because a
 * security change disguised as a routing change is exactly the kind of silent
 * behaviour change B1.3 must not make.
 */
export const PROTECTED_LEGACY_VIEWS: readonly View[] = [
  'dashboard',
  'learning',
  'exam',
  'result',
  'tryoutListing',
  'profile',
  'schedule',
] as const;

export function isProtectedLegacyView(view: View | null): boolean {
  return view !== null && PROTECTED_LEGACY_VIEWS.includes(view);
}

/**
 * Legacy views that intentionally render the public `Navbar`.
 *
 * Verbatim from the pre-router condition in `src/App.tsx`:
 *
 *   !['exam','result','payment','finalRegistration','admin',
 *     'dashboard','learning','login'].includes(view)
 *
 * `dashboard` and `learning` are absent because both legacy components carry
 * their own full header/sidebar. Rendering the Navbar there would be the
 * double-chrome bug B1.3 is required to avoid.
 */
export const NAVBAR_HIDDEN_LEGACY_VIEWS: readonly View[] = [
  'exam',
  'result',
  'payment',
  'finalRegistration',
  'admin',
  'dashboard',
  'learning',
  'login',
] as const;

export function showsLegacyNavbar(view: View | null): boolean {
  if (view === null) return false;
  return !NAVBAR_HIDDEN_LEGACY_VIEWS.includes(view);
}

/**
 * Legacy views that own their own navigation chrome and therefore must NOT be
 * wrapped in `LearnerLayout`.
 *
 * `StudentDashboard` was decomposed in B1.4B and now renders as content only
 * inside `LearnerLayout`. `LearningPage` was decomposed in B1.4C and now
 * renders as content only inside `LearnerLayout`. No learner legacy views
 * own their own chrome — all render inside `LearnerLayout`.
 */
export const SELF_CHROME_LEGACY_VIEWS: readonly View[] = [
] as const;

/** True when the view must render outside any AKSA layout. */
export function isSelfChromeView(view: View | null): boolean {
  return view !== null && SELF_CHROME_LEGACY_VIEWS.includes(view);
}

/* ------------------------------------------------------------------ */
/* Blog hash backward compatibility                                   */
/* ------------------------------------------------------------------ */

const LEGACY_BLOG_HASH = /^#blog-(.+)$/;

/**
 * Extracts the blog id from a legacy `#blog-<id>` hash.
 *
 * Returns `null` when the hash is not a blog hash. The caller then decides
 * whether to leave the hash alone.
 */
export function blogIdFromLegacyHash(hash: string): string | null {
  const match = LEGACY_BLOG_HASH.exec(hash ?? '');
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
