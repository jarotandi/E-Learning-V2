/**
 * AKSA Application Router
 * =======================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/04-route-map.md
 *            docs/aksa/b1/02-b1-subbatch-plan.md
 *            docs/aksa/b1/01-legacy-compatibility-map.md
 *
 * ## Architecture
 *
 *   BrowserRouter
 *     └─ LegacyAppStateProvider     legacy business state + setView adapter
 *          ├─ LegacyHashRedirect     #blog-<id>  ->  /blog/<id>
 *          ├─ Routes                 URL -> shell -> legacy component
 *          └─ LegacyOverlays         consult FAB, modals, demo admin toggle
 *
 * ## Layout assignment rule (the double-chrome contract)
 *
 * A surface is wrapped in a layout ONLY when the legacy component it renders
 * carries no navigation chrome of its own. Sources of truth:
 *
 *   self-chrome legacy views   -> rendered bare, no layout
 *     StudentDashboard  (`/app`,      23.6 KB, own `<aside>` + header)
 *     LearningPage      (`/app/learn`, 40.1 KB, own workspace chrome)
 *   navbar-hidden legacy views -> rendered bare, no layout, no Navbar
 *     login, finalRegistration, exam, result, payment (`/app/wallet`)
 *   everything else public     -> PublicLayout (hosts the legacy Navbar)
 *   learner, no own chrome     -> LearnerLayout (AKSA shell)
 *   studio foundation          -> StudioLayout (AKSA shell, placeholders)
 *   admin                      -> AdminLayout (no chrome; AdminDashboard
 *                                 already owns a 256px sidebar)
 *
 * Wrapping a self-chrome page in a shell would render two headers and two
 * sidebars. That is the specific failure B1.3 must not ship, and it is why
 * `/app` and `/app/learn` are documented legacy-compatibility routes.
 *
 * ## Route-level lazy loading
 *
 * Every legacy screen is loaded through `React.lazy` inside
 * `LegacyRouteBridge`, and every placeholder is a direct import (they are tiny).
 * Measured before/after numbers are in
 * `docs/aksa/b1/04-b1.3-router-migration.md`.
 *
 * ## Route inventory
 *
 * 21 canonical routes cover the 21 legacy `View` values, 17 planned learner
 * routes and 10 planned Studio routes reserve the approved IA, and one `*`
 * route renders Not Found. `docs/aksa/04-route-map.md` classifies each.
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';

import { AdminLayout } from '../layouts/AdminLayout';
import { LearnerLayout } from '../layouts/LearnerLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { StudioLayout } from '../layouts/StudioLayout';
import { RequireLegacyUser } from '../guards/RequireLegacyUser';
import { LegacyAppStateProvider } from '../providers/LegacyAppStateProvider';
import { LegacyOverlays } from './LegacyOverlays';
import { LegacyRouteBridge } from './LegacyRouteBridge';
import { NotFoundPage } from './NotFoundPage';
import { blogIdFromLegacyHash } from './legacyViewRoutes';
import {
  ADMIN_PATHS,
  LEARNER_PATHS,
  PLANNED_LEARNER_ROUTES,
  PLANNED_STUDIO_ROUTES,
  PUBLIC_PATHS,
  STUDIO_PATHS,
  blogPostPath,
  examPath,
  mentorProfilePath,
  programDetailPath,
  resultPath,
  studioEditorPath,
} from './routePaths';

const PlannedRoutePage = lazy(() =>
  import('./PlannedRoutePage').then((m) => ({ default: m.PlannedRoutePage })),
);

/* ------------------------------------------------------------------ */
/* Legacy hash compatibility                                          */
/* ------------------------------------------------------------------ */

/**
 * Redirects the legacy `#blog-<id>` share form to the canonical `/blog/<id>`.
 *
 * Mounted above `<Routes>` so the form is accepted on ANY path, not only `/`.
 * The pre-router code handled this with a `hashchange` listener; the router
 * expresses the same capability as a redirect.
 *
 * Renders nothing when the current hash is not a blog hash, so normal
 * navigation is untouched.
 */
function LegacyHashRedirect() {
  const hash = typeof window === 'undefined' ? '' : window.location.hash;
  const blogId = blogIdFromLegacyHash(hash);
  if (!blogId) return null;
  return <Navigate to={blogPostPath(blogId)} replace />;
}

/* ------------------------------------------------------------------ */
/* Route elements                                                     */
/* ------------------------------------------------------------------ */

/** Wraps a route that requires an in-memory user. */
function Guarded({ children }: { children: ReactNode }) {
  return <RequireLegacyUser>{children}</RequireLegacyUser>;
}

/** Bare legacy surface — no layout, no Navbar. See the header comment. */
function BareLegacyRoute() {
  return <LegacyRouteBridge />;
}

/* ------------------------------------------------------------------ */
/* Route table                                                        */
/* ------------------------------------------------------------------ */

export function AppRoutes() {
  return (
    <Routes>
      {/* =========================================================== */}
      {/* PUBLIC — PublicLayout hosts the legacy Navbar               */}
      {/* =========================================================== */}
      <Route element={<PublicLayout />}>
        {/* canonical: landing */}
        <Route index element={<BareLegacyRoute />} />

        {/* canonical: programs */}
        <Route path="programs" element={<BareLegacyRoute />} />
        {/* canonical: program detail */}
        <Route path="programs/:programId" element={<BareLegacyRoute />} />

        {/* canonical: mentor profile */}
        <Route path="mentors/:mentorId" element={<BareLegacyRoute />} />

        {/* canonical: blog listing + post */}
        <Route path="blog" element={<BareLegacyRoute />} />
        <Route path="blog/:blogId" element={<BareLegacyRoute />} />

        {/* canonical: contact, testimonials (compatibility) */}
        <Route path="contact" element={<BareLegacyRoute />} />
        <Route path="testimonials" element={<BareLegacyRoute />} />

        {/* canonical: register + guest registration */}
        <Route path="register" element={<BareLegacyRoute />} />
        <Route path="register/guest" element={<BareLegacyRoute />} />
      </Route>

      {/* =========================================================== */}
      {/* BARE LEGACY — previously rendered with no chrome at all      */}
      {/* =========================================================== */}
      {/* login */}
      <Route path={PUBLIC_PATHS.login} element={<BareLegacyRoute />} />

      {/* canonical: final registration */}
      <Route path={PUBLIC_PATHS.finalRegistration} element={<BareLegacyRoute />} />

      {/* canonical: tryout exam + result */}
      <Route
        path="/app/assessment/:tryoutId/exam"
        element={
          <Guarded>
            <BareLegacyRoute />
          </Guarded>
        }
      />
      <Route
        path="/app/assessment/:tryoutId/result"
        element={
          <Guarded>
            <BareLegacyRoute />
          </Guarded>
        }
      />

      {/* canonical: payment. Deliberately UNGUARDED — `payment` was not in
          the pre-router `protectedViews` list, and B1.3 does not change who
          can reach checkout. See guards/RequireLegacyUser.tsx. */}
      <Route path={LEARNER_PATHS.wallet} element={<BareLegacyRoute />} />

      {/* LEGACY-COMPATIBILITY MODE — self-chrome pages.
          `LearningPage` renders its own workspace chrome.
          Wrapping it in LearnerLayout would double both. It stays
          bare, exactly as before the router existed. B1.4C decomposes it. */}
      <Route
        path={LEARNER_PATHS.learning}
        element={
          <Guarded>
            <BareLegacyRoute />
          </Guarded>
        }
      />

      {/* =========================================================== */}
      {/* LEARNER — AKSA shell                                          */}
      {/* =========================================================== */}
      {/* B1.4B: `/app` (dashboard) now uses LearnerLayout.
          StudentDashboard content is decomposed into features/learn/dashboard/
          and renders as CONTENT ONLY inside the shell. */}
      <Route element={<LearnerLayout surfaceLabel="Learner App" />}>
        <Route
          path={LEARNER_PATHS.dashboard}
          element={
            <Guarded>
              <BareLegacyRoute />
            </Guarded>
          }
        />
        {/* Legacy learner pages that carry NO chrome of their own, so the
            shell is additive rather than duplicated. */}
        <Route
          path={LEARNER_PATHS.assessment}
          element={
            <Guarded>
              <BareLegacyRoute />
            </Guarded>
          }
        />
        <Route
          path={LEARNER_PATHS.calendar}
          element={
            <Guarded>
              <BareLegacyRoute />
            </Guarded>
          }
        />
        <Route
          path={LEARNER_PATHS.profile}
          element={
            <Guarded>
              <BareLegacyRoute />
            </Guarded>
          }
        />

        {/* Planned learner foundation routes — 17 approved IA paths that
            have no implementation. Placeholder only. */}
        {PLANNED_LEARNER_ROUTES.map((route) => (
          <Route
            key={route.segment}
            path={`/app/${route.segment}`}
            element={
              <Guarded>
                <PlannedRoutePage
                  moduleName={route.label}
                  batch={route.batch}
                  intent={route.intent}
                  surface="Learner"
                />
              </Guarded>
            }
          />
        ))}
      </Route>

      {/* =========================================================== */}
      {/* STUDIO — AKSA shell, placeholders only                       */}
      {/* =========================================================== */}
      <Route element={<StudioLayout />}>
        {PLANNED_STUDIO_ROUTES.map((route) => (
          <Route
            key={route.segment || 'index'}
            path={route.segment ? `${STUDIO_PATHS.dashboard}/${route.segment}` : STUDIO_PATHS.dashboard}
            element={
              <PlannedRoutePage
                moduleName={route.label}
                batch={route.batch}
                intent={route.intent}
                surface="Studio"
              />
            }
          />
        ))}

        {/* canonical: Studio editor deep link */}
        <Route
          path="/studio/editor/:contentId"
          element={
            <PlannedRoutePage
              moduleName="Studio / Editor"
              batch="B4"
              intent="Editor konten Authoring dengan panel Copilot. Belum ada editor yang berjalan."
              surface="Studio"
            />
          }
        />
      </Route>

      {/* =========================================================== */}
      {/* ADMIN — structural host only                                 */}
      {/* =========================================================== */}
      <Route element={<AdminLayout />}>
        <Route path={ADMIN_PATHS.admin} element={<BareLegacyRoute />} />
      </Route>

      {/* =========================================================== */}
      {/* NOT FOUND                                                    */}
      {/* =========================================================== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/* ------------------------------------------------------------------ */
/* Router entry point                                                 */
/* ------------------------------------------------------------------ */

/**
 * Root router component. Mounted by `src/main.tsx` in place of the legacy
 * `App` component.
 *
 * `<Suspense>` wraps the whole tree because `PlannedRoutePage` is lazy; the
 * legacy screens have their own nested `Suspense` inside
 * `LegacyRouteBridge` so navigating away from a loading legacy screen does not
 * unmount the shell.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <LegacyAppStateProvider>
        <LegacyHashRedirect />
        <Suspense fallback={<AppBootFallback />}>
          <AppRoutes />
        </Suspense>
        <LegacyOverlays />
      </LegacyAppStateProvider>
    </BrowserRouter>
  );
}

function AppBootFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#f6faf9' }}
    >
      <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 animate-pulse" />
    </div>
  );
}

/* Re-exported so route builders are reachable from one import site. */
export {
  ADMIN_PATHS,
  LEARNER_PATHS,
  PUBLIC_PATHS,
  STUDIO_PATHS,
  blogPostPath,
  examPath,
  mentorProfilePath,
  programDetailPath,
  resultPath,
  studioEditorPath,
};

export default AppRouter;
