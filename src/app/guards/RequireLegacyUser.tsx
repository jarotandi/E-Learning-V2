/**
 * AKSA Routing Guards
 * ===================
 * B1.3 — Production Router + AKSA App Shell
 *
 * ## WHAT THIS IS
 *
 * A *routing guard*: when a learner route is requested and there is no
 * in-memory user, the router sends the visitor to `/login`. That is all.
 *
 * ## WHAT THIS IS NOT — READ BEFORE CITING IT AS A CONTROL
 *
 * This is **NOT** authentication and **NOT** authorization. It is a
 * presentation-level redirect, and it provides no protection whatsoever:
 *
 *   - The "user" is a plain in-memory object created by the demo login form.
 *     There is no credential, no session, no token, no server.
 *   - Navigating directly to a guarded URL while logged out redirects, but
 *     nothing prevents a caller from supplying a user object, and nothing
 *     prevents a client from skipping the redirect entirely.
 *   - The route payloads are already in the JavaScript bundle. Guarding a
 *     route does not withhold its content.
 *
 * Real identity, real session handling, server-side authorization, and
 * row-level security are **B2** deliverables. SEC-P1-01 / SEC-P1-02 /
 * SEC-P1-03 in `docs/aksa/b1/03-client-security-inventory.md` remain OPEN
 * because of that, and nothing in this file closes them.
 *
 * ## Why the guard exists at all
 *
 * `src/App.tsx` before B1.3 had a `useEffect` that redirected the visitor to
 * the login view whenever the current view was in `protectedViews` and no user
 * existed. That behaviour is preserved verbatim — see `PROTECTED_LEGACY_VIEWS`
 * in `../router/legacyViewRoutes.ts`. Expressing it as a route guard rather
 * than an effect matters for one reason: an effect-based redirect renders the
 * protected page for at least one frame before firing, whereas a guard never
 * renders it at all. Same policy, no flash.
 *
 * The guard list is copied from the legacy list, so `payment` and
 * `finalRegistration` stay UNPROTECTED exactly as they were. B1.3 does not
 * quietly "fix" that; changing who can reach checkout is a product/security
 * decision, not a routing one.
 */

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useLegacyAppState } from '../providers/LegacyAppStateProvider';
import { PUBLIC_PATHS } from '../router/routePaths';

/** Router-state key holding the intended destination after a guard bounce. */
export const RETURN_PATH_STATE_KEY = 'aksaReturnPath';

/** Router-state key describing why the visitor was bounced. */
export const RETURN_REASON_STATE_KEY = 'aksaReturnReason';

export interface GuardedRouteState {
  [RETURN_PATH_STATE_KEY]: string;
  [RETURN_REASON_STATE_KEY]: 'protected-learner-route';
}

/**
 * Wraps a learner route that requires an in-memory user.
 *
 * When there is no user the visitor is replaced onto `/login` and the
 * intended destination is recorded in router state.
 */
export function RequireLegacyUser({ children }: { children: ReactNode }) {
  const { user } = useLegacyAppState();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={PUBLIC_PATHS.login}
        replace
        state={
          {
            [RETURN_PATH_STATE_KEY]: `${location.pathname}${location.search}`,
            [RETURN_REASON_STATE_KEY]: 'protected-learner-route',
          } satisfies GuardedRouteState
        }
      />
    );
  }

  return <>{children}</>;
}

/**
 * Reads the return path recorded by `RequireLegacyUser`, if any.
 *
 * B1.3 RECORDS the destination but deliberately does NOT consume it. Doing so
 * would require overriding `LoginPage`'s existing post-login redirect
 * (`setView(mockUser.role === 'Admin' ? 'admin' : 'dashboard')`), and silently
 * changing where a demo login lands is exactly the kind of behaviour drift a
 * migration batch must not introduce.
 *
 * Consuming it belongs with B2, when the post-login decision becomes a real
 * authorization decision against a real identity.
 */
export function useReturnPath(): string | null {
  const location = useLocation();
  const state = location.state as Partial<GuardedRouteState> | null;
  return state?.[RETURN_PATH_STATE_KEY] ?? null;
}
