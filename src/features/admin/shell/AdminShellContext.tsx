/**
 * Admin Shell Context
 * ===================
 * B1.4D-T2 — Admin shell ownership migration
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/11-b1.4d-t2-admin-shell.md
 *
 * ## Why this exists
 *
 * `AdminLayout` is the persistent route element for the single `/admin/*`
 * wildcard branch. Because it stays mounted across all canonical admin child
 * navigation, shell-level state placed here survives tab changes — exactly
 * the behaviour required to avoid remounting the admin subtree.
 *
 * ## What this context OWNS (and nothing more)
 *
 *   adminRole        — UI presentation role (drives navigation visibility)
 *   setAdminRole     — role switch handler
 *   activeTab        — derived from URL via the pure model
 *   navigateToTab    — navigate to a canonical tab path
 *   isTabAllowed     — role -> tab permission check (UI filtering)
 *   allowedTabs      — role -> allowed tabs list
 *   logout           — adapter to LegacyAppStateProvider's requestLogout
 *
 * ## What this context deliberately does NOT own
 *
 * Business domain state (users, leads, finance, programs, questions, blog
 * posts, video lessons, forms, filters, modals, toasts, audit records,
 * notifications, searchTerm) stays in `AdminDashboard` until its owning
 * domain is extracted in T3+. Putting those 70+ slices here would move the
 * monolith rather than decompose it.
 *
 * ## NO SECURITY CLAIM
 *
 * Role switching and tab filtering here are UI presentation filtering ONLY.
 * SEC-P1-03 ("admin view has no authentication gate") remains OPEN and is
 * owned by B2. This is NOT authorization. Do not add auth guards, Supabase,
 * or security claims to this layer.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ADMIN_ROLE_PERMISSIONS,
  adminPathToTab,
  adminTabToPath,
  isAdminTabAllowed,
  type AdminRole,
  type AdminTab,
} from './adminWorkspaceModel';

/* ------------------------------------------------------------------ */
/* Context shape                                                       */
/* ------------------------------------------------------------------ */

export interface AdminShellContextValue {
  /** Current UI presentation role. Drives navigation visibility only. */
  adminRole: AdminRole;
  /**
   * Switch role. Updates the role and navigates to `/admin` (overview) to
   * preserve the legacy reset-to-overview semantics. UI presentation only.
   */
  setAdminRole: (role: AdminRole) => void;
  /** Active tab derived from the URL. Falls back to `overview`. */
  activeTab: AdminTab;
  /** Navigate to the canonical path for a tab. */
  navigateToTab: (tab: AdminTab) => void;
  /** Role -> tab permission check (UI filtering, NOT authorization). */
  isTabAllowed: (tab: AdminTab) => boolean;
  /** Role -> allowed tabs list (UI filtering, NOT authorization). */
  allowedTabs: AdminTab[];
  /** Logout adapter wired to LegacyAppStateProvider's requestLogout. */
  logout: () => void;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export interface AdminShellProviderProps {
  children: ReactNode;
  /** Logout adapter from LegacyAppStateProvider (requestLogout). */
  onLogout: () => void;
}

export function AdminShellProvider({
  children,
  onLogout,
}: AdminShellProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // UI presentation role. Default matches legacy 'Super Admin'.
  // This is NOT authentication state.
  const [adminRole, setAdminRoleState] = useState<AdminRole>('Super Admin');

  // Active tab derived from URL — the pure model is the single source of
  // truth. No second routing registry, no second active-tab state.
  const activeTab: AdminTab = adminPathToTab(location.pathname) ?? 'overview';

  const navigateToTab = useCallback(
    (tab: AdminTab) => {
      navigate(adminTabToPath(tab));
    },
    [navigate],
  );

  const isTabAllowed = useCallback(
    (tab: AdminTab) => isAdminTabAllowed(adminRole, tab),
    [adminRole],
  );

  // B1.4D-T2 Step 8 — UI presentation redirect (NOT authorization).
  //
  // T1 gave every admin tab a direct URL. If a non-Super-Admin role ends up
  // on a tab URL it is not allowed to SEE (e.g. Content Manager at
  // /admin/commerce/finance), the shell redirects presentation back to
  // /admin so the visible UI matches the legacy role-filtered behaviour.
  //
  // `replace` is used so the disallowed URL is not left in history (an
  // automatic correction, not a user navigation).
  //
  // This is UI PRESENTATION ONLY. There is no 403, no auth claim, and no
  // security boundary. SEC-P1-03 remains OPEN (owned by B2).
  useEffect(() => {
    if (!isTabAllowed(activeTab)) {
      navigate(adminTabToPath('overview'), { replace: true });
    }
  }, [activeTab, isTabAllowed, navigate]);

  const allowedTabs = useMemo(
    () => [...ADMIN_ROLE_PERMISSIONS[adminRole]],
    [adminRole],
  );

  // Role switch: update role, then navigate to /admin (overview). Preserves
  // legacy reset-to-overview semantics. UI presentation only.
  const setAdminRole = useCallback(
    (role: AdminRole) => {
      setAdminRoleState(role);
      navigate(adminTabToPath('overview'));
    },
    [navigate],
  );

  const logout = useCallback(() => onLogout(), [onLogout]);

  const value = useMemo<AdminShellContextValue>(
    () => ({
      adminRole,
      setAdminRole,
      activeTab,
      navigateToTab,
      isTabAllowed,
      allowedTabs,
      logout,
    }),
    [adminRole, setAdminRole, activeTab, navigateToTab, isTabAllowed, allowedTabs, logout],
  );

  return (
    <AdminShellContext.Provider value={value}>
      {children}
    </AdminShellContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Consumer hook                                                       */
/* ------------------------------------------------------------------ */

/**
 * Consume the admin shell context. Throws if used outside the provider so a
 * missing provider is a loud failure rather than a silent undefined.
 */
export function useAdminShell(): AdminShellContextValue {
  const ctx = useContext(AdminShellContext);
  if (!ctx) {
    throw new Error(
      'useAdminShell must be used within <AdminShellProvider>. ' +
        'AdminShellProvider is mounted inside AdminLayout.',
    );
  }
  return ctx;
}

export default AdminShellContext;
