/**
 * AKSA Navigation Contracts — public surface
 * ==========================================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/02-navigation-information-architecture.md
 *
 * Import path note: the repository `@/*` alias currently resolves to the
 * project ROOT, not `src/`. Use a relative import from inside `src/`.
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