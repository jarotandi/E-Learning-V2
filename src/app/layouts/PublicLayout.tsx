/**
 * AKSA Public Layout
 * =================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/design/03-learner-shell.md
 *            docs/aksa/b1/02-b1-subbatch-plan.md
 *
 * ## B1.3 compatibility decision — read before "fixing" this
 *
 * `PublicLayout` deliberately renders the EXISTING legacy `Navbar`
 * (`src/components/Navbar.tsx`) rather than a new AKSA public header.
 *
 * Reasons:
 *
 *  1. `Navbar` is imported by no other shell and already owns the public
 *     navigation. Re-implementing it here would produce two public headers.
 *  2. `Navbar` still carries the "Bimbel The Prams" wordmark. Replacing the
 *     legacy brand lockup is explicitly out of B1.3 scope — B1.2's
 *     sub-batch plan defers "Legacy brand replacement (The Prams -> AKSA)" to
 *     per-domain work in B2+.
 *  3. Decomposing `Navbar` into `app/layouts/PublicHeader.tsx` is listed as
 *     B1.4 work in `docs/aksa/b1/01-legacy-compatibility-map.md`.
 *
 * `PublicLayout`'s job in B1.3 is therefore to (a) own the public route
 * boundary, (b) apply the AKSA document surface (mint canvas), and (c) keep
 * the Navbar as the single visual owner of public chrome. It is structurally
 * minimal BY DESIGN, not by omission.
 *
 * The Navbar is hidden on routes that own their own chrome. That rule is the
 * pre-existing `NAVBAR_HIDDEN_LEGACY_VIEWS` set from `legacyViewRoutes.ts`,
 * evaluated here against the derived legacy view.
 */

import { Outlet } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { useLegacyAppState } from '../providers/LegacyAppStateProvider';
import { showsLegacyNavbar } from '../router/legacyViewRoutes';

export function PublicLayout() {
  const { currentView, setView, user, requestLogout } = useLegacyAppState();

  // Guest accounts are deliberately not shown an authenticated Navbar, which
  // matches the pre-router expression `user?.id === 'u_guest' ? null : user`.
  const navbarUser = user?.id === 'u_guest' ? null : user;

  return (
    // `bg-white`, not the AKSA mint canvas. The legacy public pages were
    // authored against a white document surface; tinting them mint would be a
    // visual change to every public page, which B1.3 must not make. The mint
    // surface belongs to the NEW shells (LearnerLayout, StudioLayout).
    <div className="min-h-screen bg-white">
      {showsLegacyNavbar(currentView) && (
        <Navbar
          currentView={currentView!}
          setView={setView}
          user={navbarUser}
          logout={requestLogout}
        />
      )}
      <Outlet />
    </div>
  );
}

export default PublicLayout;
