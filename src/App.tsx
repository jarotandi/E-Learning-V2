/**
 * AKSA App — B1.3 entry point
 * ===========================
 *
 * The legacy view state machine that used to live here is preserved intact in:
 *
 *   src/app/providers/LegacyAppStateProvider.tsx   every piece of state, the
 *                                                  localStorage keys, lead and
 *                                                  website-question capture,
 *                                                  consultation behaviour, and
 *                                                  the upgrade flow
 *   src/app/router/LegacyRouteBridge.tsx           the prop wiring for all 21
 *                                                  legacy `View` capabilities
 *   src/app/router/AppRouter.tsx                   the URL -> surface mapping
 *
 * `setView` keeps its exact signature — `(v: View) => void` — so all ~60 call
 * sites across the 19 legacy components are unchanged. What changed is what
 * `setView` does: it now performs router navigation to a canonical URL instead
 * of setting a `view` string.
 *
 * This file remains only so that any import of `./App` still resolves. New
 * code should import `AppRouter` from `src/app/router` directly.
 *
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export { AppRouter as default, AppRouter } from './app/router/AppRouter';
