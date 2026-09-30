/**
 * AKSA Navigation Contract — shared types
 * =======================================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/02-navigation-information-architecture.md
 *            docs/aksa/04-route-map.md
 *            docs/aksa/06-role-permission-map.md
 *
 * These types are intentionally UI-framework agnostic: they carry no React
 * imports and no router imports. A router or a component library can bind
 * to them later (B1.2+) without redefining the navigation model.
 *
 * B1.1 scope note: nothing in `src/app/navigation/` is imported by any
 * rendered component yet. These are contract-only definitions.
 */

/** Unique identifier for a navigation entry. */
export type NavId = string;

/**
 * Relative target path, aligned with the B0 route map.
 * Absolute paths are allowed for top-level surfaces (e.g. `/app`).
 */
export type NavPath = string;

/**
 * Capability / permission gate. Values are intended to resolve to the
 * B0 role-permission vocabulary (docs/aksa/06-role-permission-map.md).
 *
 * B1.1 does not evaluate these. B1.4 introduces guard evaluation once
 * identity (B2) provides real capabilities.
 */
export type NavCapability = string;

/** Lucide icon name. Kept as a string to stay framework-agnostic. */
export type NavIconName = string;

/**
 * How a navigation entry is presented in the primary surface.
 *
 * - `item`      — normal clickable row.
 * - `group`     — collapsible grouping header (e.g. LEARN, PRACTICE).
 * - `separator` — visual divider, not interactive.
 */
export type NavEntryKind = 'item' | 'group' | 'separator';

/** A single navigation entry. */
export interface NavItem {
  /** Stable identifier, safe for test selectors and analytics. */
  id: NavId;
  /** Display label. Group labels are typically uppercase. */
  label: string;
  /** Target route. Omitted for pure grouping/separator entries. */
  path?: NavPath;
  /** Lucide icon name for the leading icon slot. */
  icon?: NavIconName;
  /** Presentation kind. Defaults to `item` when omitted. */
  kind?: NavEntryKind;
  /** Trailing count/badge value, e.g. unread notifications. */
  badge?: string | number;
  /** Child entries. Only meaningful for `group` entries. */
  children?: NavItem[];
  /** Capabilities required to see this entry. Empty/absent = visible. */
  requiredCapabilities?: NavCapability[];
  /**
   * Position in the mobile bottom bar (0-4, max five entries).
   * Only present on entries that are also mobile-primary.
   */
  mobilePriority?: number;
  /** Marks entries that are not yet implemented (B1+ sub-batches). */
  status?: NavStatus;
}

/**
 * Delivery status of a navigation target.
 *
 * B1.1 records `planned` for every entry that has no route yet, so the
 * IA cannot be mistaken for shipped functionality.
 */
export type NavStatus = 'planned' | 'in-progress' | 'available';

/** A named group of entries rendered as one sidebar block. */
export interface NavSection {
  id: NavId;
  /** Section heading. Rendered uppercase in the sidebar. */
  label: string;
  /** Entries in render order. */
  items: NavItem[];
  /** Whether the group can be collapsed. */
  collapsible?: boolean;
  /** Default expanded state when `collapsible` is true. */
  defaultOpen?: boolean;
  /** Icon shown when the section is collapsed to icon-only mode. */
  icon?: NavIconName;
}

/** A full navigation definition for one product surface. */
export interface NavigationConfig {
  /** Stable surface id, e.g. `learner`, `studio`. */
  id: NavId;
  /** Surface label for debugging and analytics. */
  label: string;
  /** Route prefix owned by this surface. */
  basePath: string;
  /** Sidebar sections in render order. */
  sections: NavSection[];
  /** Header actions (search, notifications, profile). */
  headerActions: NavItem[];
  /** Mobile bottom bar. Must not exceed five entries. */
  mobileBottomNav: NavItem[];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Maximum entries permitted in a mobile bottom bar. */
export const MAX_MOBILE_BOTTOM_NAV = 5;

/**
 * Normalises an entry to its default kind.
 * Exported so renderers agree on the default instead of re-deciding it.
 */
export function navKindOf(item: NavItem): NavEntryKind {
  return item.kind ?? 'item';
}

/**
 * Returns true when the entry declares capabilities it requires.
 * B1.1 performs no evaluation — this only inspects declared metadata.
 */
export function requiresCapabilities(item: NavItem): boolean {
  return Array.isArray(item.requiredCapabilities) && item.requiredCapabilities.length > 0;
}