/**
 * AKSA Public Layout
 * =================
 * B1.3 — Production Router + AKSA App Shell
 * B1.4A — Public header extraction (this file's second revision)
 *
 * Authority: docs/aksa/design/03-learner-shell.md
 *            docs/aksa/b1/02-b1-subbatch-plan.md
 *            docs/aksa/b1/06-b1.4a-design-system-public-header.md
 *
 * ## B1.4A revision — what changed and why
 *
 * B1.3 deliberately rendered the legacy `Navbar` and deferred its replacement.
 * B1.4A is that work: the public chrome is now `PublicHeader`, the
 * application-owned AKSA header built on the design-system primitives.
 *
 * The B1.3 reasoning is preserved rather than reversed:
 *
 *  1. There is still exactly ONE public chrome owner. `Navbar` is no longer
 *     imported anywhere, so the "two public headers" risk that justified
 *     keeping it is gone; the remaining reason — its legacy wordmark — is
 *     exactly what B1.4A was asked to remove.
 *  2. The chrome-visibility rule is UNCHANGED. `showsLegacyNavbar` and
 *     `NAVBAR_HIDDEN_LEGACY_VIEWS` are the pre-existing rule from
 *     `legacyViewRoutes.ts`, copied verbatim from the pre-router condition in
 *     `src/App.tsx`. The header is therefore still hidden on `login`,
 *     `payment`, `finalRegistration`, `exam`, `result`, `admin`, `dashboard`,
 *     and `learning`, and still shown everywhere else. No double chrome.
 *  3. Guest handling is UNCHANGED: `user?.id === 'u_guest' ? null : user`.
 *
 * ## `bg-white`, not the AKSA mint canvas
 *
 * The legacy public pages were authored against a white document surface.
 * Tinting them mint would be a visual change to every public page, which is
 * B1.3 scope, not B1.4A. The mint surface belongs to the new shells
 * (LearnerLayout, StudioLayout).
 */

import { Outlet } from 'react-router-dom';
import { useLegacyAppState } from '../providers/LegacyAppStateProvider';
import { showsLegacyNavbar } from '../router/legacyViewRoutes';
import { PublicHeader } from './PublicHeader';

export function PublicLayout() {
  const { currentView, setView, user, requestLogout } = useLegacyAppState();

  // Guest accounts are deliberately not shown an authenticated header, which
  // matches the pre-router expression `user?.id === 'u_guest' ? null : user`.
  const headerUser = user?.id === 'u_guest' ? null : user;

  return (
    <div className="min-h-screen bg-white">
      {showsLegacyNavbar(currentView) && (
        <PublicHeader
          currentView={currentView!}
          setView={setView}
          user={headerUser}
          onLogout={requestLogout}
        />
      )}
      <Outlet />
    </div>
  );
}

export default PublicLayout;
