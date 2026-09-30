/**
 * AKSA Navigation Contracts — public surface
 * ==========================================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/02-navigation-information-architecture.md
 *
 * Import path note: `@/*` resolves to `src/*` in both TypeScript
 * (`tsconfig.json` paths) and Vite (`resolve.alias`), as of B1.2 / CONF-01.
 * Relative imports remain valid and do not need mass migration.
 */

export type {
  NavId,
  NavPath,
  NavCapability,
  NavIconName,
  NavEntryKind,
  NavItem,
  NavStatus,
  NavSection,
  NavigationConfig,
} from './navigation.types';

export { MAX_MOBILE_BOTTOM_NAV, navKindOf, requiresCapabilities } from './navigation.types';

export { learnerNavigation } from './learnerNavigation';
export { studioNavigation } from './studioNavigation';