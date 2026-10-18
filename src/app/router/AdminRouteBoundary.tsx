/**
 * Admin Route Boundary
 * ====================
 * B1.4D-T1 — Canonical admin routing + contract foundation
 *
 * Authority: docs/aksa/b1/09-b1.4d-admin-audit.md
 *            docs/aksa/b1/10-b1.4d-execution-map.md
 *
 * ## Why this exists
 *
 * B1.4D gives all 13 legacy admin tabs a stable canonical URL. The naive
 * approach — 13 separate `<Route>` elements each rendering the legacy admin
 * bridge — would mount a fresh `LegacyRouteBridge` on every tab change and
 * destroy all 72 `AdminDashboard` state slices (form drafts, editing records,
 * selected rows, open modals, finance subview, filters).
 *
 * `AdminDashboard` currently owns that state at the component level and its
 * tabs are switched with `setActiveTab(...)` inside ONE mounted instance.
 * Transient state therefore survives tab switches today. That behaviour must
 * not regress.
 *
 * ## The fix: ONE persistent wildcard branch
 *
 *   <Route path="/admin/*" element={<AdminRouteBoundary />} />
 *
 * React Router keeps this element MOUNTED across `/admin` -> `/admin/users`
 * -> `/admin/commerce/finance` because the matched route object does not
 * change. The boundary renders `BareLegacyRoute`, which renders
 * `LegacyRouteBridge`, whose `motion.div` is keyed on `currentView`.
 *
 * Every valid canonical admin URL derives `currentView === 'admin'` (see
 * `pathToLegacyView`), so the motion key never changes and the whole admin
 * subtree is reconciled in place rather than remounted.
 *
 * ## Responsibilities
 *
 *  1. Known canonical admin path  -> render the legacy bridge.
 *  2. Known group-index path      -> redirect to its canonical child with
 *                                    `replace` so Back returns to where the
 *                                    user actually was, not the redirect stub.
 *  3. Unknown `/admin/*`          -> render Not Found. Never silently fall
 *                                    back to overview.
 *
 * ## Invariant
 *
 * This boundary must NOT be keyed by pathname. `key={location.pathname}` would
 * remount the entire admin tree on every navigation and defeat the whole
 * point of the persistent branch.
 */

import { Navigate, useLocation } from 'react-router-dom';

import { NotFoundPage } from './NotFoundPage';
import { LegacyRouteBridge } from './LegacyRouteBridge';
import {
  adminGroupRedirectTarget,
  isAdminGroupIndex,
  isKnownAdminPath,
} from '../../features/admin/shell/adminWorkspaceModel';

export function AdminRouteBoundary() {
  const location = useLocation();
  const pathname = location.pathname;

  // Group indexes are convenience redirects, not tabs.
  if (isAdminGroupIndex(pathname)) {
    const target = adminGroupRedirectTarget(pathname);
    if (target) {
      return <Navigate to={target} replace />;
    }
  }

  // Every valid canonical admin URL maps to the single legacy `admin` view,
  // so `LegacyRouteBridge` stays mounted and `currentView` stays 'admin'.
  if (isKnownAdminPath(pathname)) {
    return <LegacyRouteBridge />;
  }

  // Unknown /admin/* — explicit Not Found, never a silent overview fallback.
  return <NotFoundPage />;
}

export default AdminRouteBoundary;
