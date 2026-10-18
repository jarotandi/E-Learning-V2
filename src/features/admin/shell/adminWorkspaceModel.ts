/**
 * Admin Workspace Pure Routing Model
 * ==================================
 * B1.4D-T1 — Canonical admin routing + contract foundation
 *
 * Authority: docs/aksa/b1/09-b1.4d-admin-audit.md
 *            docs/aksa/b1/10-b1.4d-execution-map.md
 *
 * This module exports ONLY pure helper functions for admin routing.
 * NO React hooks, NO react-router, NO localStorage, NO browser APIs.
 *
 * Pure functions for:
 * - AdminTab ↔ canonical path mapping
 * - Role permission matrix
 * - 8-domain grouping
 * - Path normalization
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type AdminRole =
  | 'Super Admin'
  | 'Content Manager'
  | 'Support';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'leads'
  | 'inquiries'
  | 'marketing'
  | 'website'
  | 'finance'
  | 'programs'
  | 'content'
  | 'questions'
  | 'testimonials'
  | 'reports'
  | 'settings';

export type AdminDomain =
  | 'platform'
  | 'users'
  | 'academic'
  | 'studio'
  | 'review'
  | 'commerce'
  | 'analytics'
  | 'configuration';

// ── Constants ──────────────────────────────────────────────────────────────

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, AdminTab[]> = {
  'Super Admin': [
    'overview', 'users', 'leads', 'inquiries', 'marketing', 'website',
    'finance', 'programs', 'content', 'questions', 'testimonials', 'reports', 'settings',
  ],
  'Content Manager': [
    'overview', 'programs', 'content', 'questions', 'testimonials', 'website',
  ],
  'Support': [
    'overview', 'users', 'leads', 'inquiries', 'settings', 'finance',
  ],
};

export const ADMIN_TAB_DOMAIN: Record<AdminTab, AdminDomain> = {
  overview: 'platform',
  users: 'users',
  questions: 'academic',
  content: 'studio',
  website: 'studio',
  inquiries: 'review',
  testimonials: 'review',
  programs: 'commerce',
  leads: 'commerce',
  marketing: 'commerce',
  finance: 'commerce',
  reports: 'analytics',
  settings: 'configuration',
};

export const ADMIN_TAB_PATH: Record<AdminTab, string> = {
  overview: '/admin',
  users: '/admin/users',
  questions: '/admin/academic/questions',
  content: '/admin/studio/content',
  website: '/admin/studio/website',
  inquiries: '/admin/review/inquiries',
  testimonials: '/admin/review/testimonials',
  programs: '/admin/commerce/programs',
  leads: '/admin/commerce/leads',
  marketing: '/admin/commerce/marketing',
  finance: '/admin/commerce/finance',
  reports: '/admin/analytics',
  settings: '/admin/settings',
};

// Group index redirects
export const ADMIN_GROUP_REDIRECTS: Record<string, string> = {
  '/admin/academic': '/admin/academic/questions',
  '/admin/studio': '/admin/studio/content',
  '/admin/review': '/admin/review/inquiries',
  '/admin/commerce': '/admin/commerce/programs',
};

// All valid admin paths (including group indexes)
const ALL_ADMIN_PATHS: Set<string> = new Set([
  ...Object.values(ADMIN_TAB_PATH),
  ...Object.keys(ADMIN_GROUP_REDIRECTS),
]);

// ── Pure Functions ─────────────────────────────────────────────────────────

/**
 * Maps an admin tab to its canonical path.
 */
export function adminTabToPath(tab: AdminTab): string {
  return ADMIN_TAB_PATH[tab];
}

/**
 * Maps a pathname to an admin tab, or null if not a known admin path.
 */
export function adminPathToTab(pathname: string): AdminTab | null {
  const normalized = normaliseAdminPath(pathname);
  for (const [tab, path] of Object.entries(ADMIN_TAB_PATH)) {
    if (path === normalized) {
      return tab as AdminTab;
    }
  }
  return null;
}

/**
 * Checks if a pathname is a known admin path (tab or group index).
 */
export function isKnownAdminPath(pathname: string): boolean {
  const normalized = normaliseAdminPath(pathname);
  return ALL_ADMIN_PATHS.has(normalized);
}

/**
 * Normalizes a pathname: trims trailing slash, lowercases.
 */
export function normaliseAdminPath(pathname: string): string {
  let p = pathname.trim();
  // Remove trailing slash (but keep root /)
  if (p.length > 1 && p.endsWith('/')) {
    p = p.slice(0, -1);
  }
  return p;
}

/**
 * Returns the domain for a given admin tab.
 */
export function adminDomainForTab(tab: AdminTab): AdminDomain {
  return ADMIN_TAB_DOMAIN[tab];
}

/**
 * Checks if a tab is allowed for a given role.
 */
export function isAdminTabAllowed(role: AdminRole, tab: AdminTab): boolean {
  return ADMIN_ROLE_PERMISSIONS[role].includes(tab);
}

/**
 * Returns all tabs allowed for a given role.
 */
export function allowedAdminTabs(role: AdminRole): AdminTab[] {
  return [...ADMIN_ROLE_PERMISSIONS[role]];
}

/**
 * Checks if a pathname is a group index (redirect-only).
 */
export function isAdminGroupIndex(pathname: string): boolean {
  const normalized = normaliseAdminPath(pathname);
  return normalized in ADMIN_GROUP_REDIRECTS;
}

/**
 * Returns the redirect target for a group index path.
 */
export function adminGroupRedirectTarget(pathname: string): string | null {
  const normalized = normaliseAdminPath(pathname);
  return ADMIN_GROUP_REDIRECTS[normalized] ?? null;
}

/**
 * Returns all valid admin paths.
 */
export function allAdminPaths(): string[] {
  return [...ALL_ADMIN_PATHS];
}

/**
 * Returns all admin tabs.
 */
export function allAdminTabs(): AdminTab[] {
  return Object.keys(ADMIN_TAB_PATH) as AdminTab[];
}

/**
 * Returns all admin domains.
 */
export function allAdminDomains(): AdminDomain[] {
  return ['platform', 'users', 'academic', 'studio', 'review', 'commerce', 'analytics', 'configuration'];
}

/**
 * Checks if a domain has any tabs.
 */
export function tabsForDomain(domain: AdminDomain): AdminTab[] {
  return (Object.entries(ADMIN_TAB_DOMAIN) as [AdminTab, AdminDomain][])
    .filter(([, d]) => d === domain)
    .map(([tab]) => tab);
}
