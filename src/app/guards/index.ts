/**
 * AKSA Guards — barrel
 * ===================
 * B1.3 — Production Router + AKSA App Shell
 *
 * The guard mechanism itself lands in B1.4. B1.3 ships exactly one guard,
 * `RequireLegacyUser`, whose scope is routing — not authorization. See that
 * file for the explicit list of what it does not do.
 */

export {
  RequireLegacyUser,
  useReturnPath,
  RETURN_PATH_STATE_KEY,
  RETURN_REASON_STATE_KEY,
  type GuardedRouteState,
} from './RequireLegacyUser';
