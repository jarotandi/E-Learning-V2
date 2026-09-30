/**
 * AKSA Router — barrel
 * ====================
 * B1.3 — Production Router + AKSA App Shell
 *
 * `AppRouter` is the only component a rendered entry point should import.
 * Everything else is exported for tests, route-verification tooling, and
 * documentation generation, so the route contract can be inspected without
 * mounting a browser.
 */

export { AppRouter, AppRoutes, default as default } from './AppRouter';
export { LegacyRouteBridge } from './LegacyRouteBridge';
export { LegacyOverlays } from './LegacyOverlays';
export { LegacySchedulePage, type LegacySchedulePageProps } from './LegacySchedulePage';
export { NotFoundPage } from './NotFoundPage';
export { PlannedRoutePage, type PlannedRoutePageProps } from './PlannedRoutePage';

export {
  blogIdFromLegacyHash,
  isProtectedLegacyView,
  isSelfChromeView,
  legacyViewToPath,
  pathToLegacyView,
  showsLegacyNavbar,
  LEGACY_VIEW_COUNT,
  LEGACY_VIEW_ROUTES,
  NAVBAR_HIDDEN_LEGACY_VIEWS,
  PROTECTED_LEGACY_VIEWS,
  SELF_CHROME_LEGACY_VIEWS,
  type LegacySelectionIds,
  type PathContext,
} from './legacyViewRoutes';

export {
  blogPostPath,
  examPath,
  mentorProfilePath,
  plannedLearnerPaths,
  programDetailPath,
  resultPath,
  studioEditorPath,
  ADMIN_PATHS,
  FALLBACK_TRYOUT_ID,
  LEARNER_PATHS,
  PLANNED_LEARNER_ROUTES,
  PLANNED_STUDIO_ROUTES,
  PUBLIC_PATHS,
  STUDIO_PATHS,
  type PlannedLearnerRoute,
  type PlannedStudioRoute,
} from './routePaths';
