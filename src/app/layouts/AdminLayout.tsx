/**
 * AKSA Admin Layout — Application Shell Owner
 * ===========================================
 * B1.4D-T2 — Admin shell ownership migration
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/11-b1.4d-t2-admin-shell.md
 *
 * ## B1.4D-T2 — SHELL OWNER
 *
 * `AdminLayout` is the persistent route element for the single `/admin/*`
 * wildcard branch, so it stays mounted across all canonical admin child
 * navigation. It is therefore the correct owner of the ADMIN APPLICATION
 * CHROME:
 *
 *   - AKSA admin branding (replaces legacy "The Prams" shell branding)
 *   - desktop sidebar (lg+) with role-filtered navigation
 *   - mobile navigation drawer (< lg)
 *   - shell top bar (mobile menu button + section title)
 *   - role switcher (debug, Super Admin only — preserved legacy contract)
 *   - admin identity display
 *   - logout (wired to LegacyAppStateProvider.requestLogout)
 *   - the Outlet that renders business content
 *
 * It owns NO business-domain state. `AdminDashboard` below the Outlet renders
 * BUSINESS CONTENT ONLY. The 70+ business state slices stay in
 * `AdminDashboard` until their owning domain is extracted (T3+).
 *
 * ## STATE OWNERSHIP
 *
 * `AdminShellProvider` is mounted here and owns ONLY shell-level state:
 * `adminRole`, `activeTab` (derived from URL), `navigateToTab`,
 * `isTabAllowed`, `allowedTabs`, `logout`. Nothing else.
 *
 * ## VIEWPORT / SCROLL
 *
 * This layout owns the viewport and scroll composition (a single `h-screen`
 * frame with one scrolling content region). Business content below must NOT
 * create a nested `h-screen` viewport — that is the scroll-trap failure mode
 * this shell exists to prevent.
 *
 * ## NO SECURITY CLAIM
 *
 * Role switching and navigation filtering here are UI PRESENTATION FILTERING
 * ONLY. There is no authentication and no authorization. SEC-P1-03 ("admin
 * view has no authentication gate") remains **OPEN** and is owned by **B2**.
 * The legacy "DEMO ADMIN" floating button is an unguarded shortcut retained
 * deliberately. Real admin auth (identity, RLS, authorization) is B2 work.
 * Do NOT add auth guards, Supabase, or security claims to this layer.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useLegacyAppState } from '../providers/LegacyAppStateProvider';
import { AdminShellProvider, useAdminShell } from '../../features/admin/shell/AdminShellContext';
import {
  ADMIN_NAV_ITEMS,
  adminTabLabel,
} from '../../features/admin/shell/adminNavigation';
import { isAdminTabAllowed } from '../../features/admin/shell/adminWorkspaceModel';

/* ------------------------------------------------------------------ */
/* Shell                                                              */
/* ------------------------------------------------------------------ */

function AdminShell() {
  const { adminRole, activeTab, navigateToTab, logout } =
    useAdminShell();
  const location = useLocation();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Role-filtered navigation items. UI presentation filtering ONLY.
  const visibleNavItems = ADMIN_NAV_ITEMS.filter((item) =>
    isAdminTabAllowed(adminRole, item.tab),
  );

  // Close the mobile drawer whenever the route changes (e.g. a nav click or a
  // programmatic redirect). URL is the source of truth for the active item.
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!isMobileNavOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileNavOpen]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isMobileNavOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileNavOpen]);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Preserve legacy identity semantics: Super Admin shows the named admin,
  // other roles show the role label. Presentation only — not auth state.
  const identityName = adminRole === 'Super Admin' ? 'dr. Pramono' : adminRole;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-brand-navy text-white border-r border-white/5 shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-emerald-900/30"
            aria-hidden="true"
          >
            AK
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-none tracking-tight text-white">
              AKSA
            </h1>
            <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold">
              Platform Admin
            </span>
          </div>
        </div>

        <nav
          className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto"
          aria-label="Admin navigation"
        >
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => navigateToTab(item.tab)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all border-l-4 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                <item.icon size={20} aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
          <RoleSwitcher />
          <AdminIdentity
            identityName={identityName}
            roleLabel={adminRole}
            logout={logout}
          />
        </div>
      </aside>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeMobileNav}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div
            id="admin-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col bg-brand-navy text-white shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-lg text-white shrink-0"
                  aria-hidden="true"
                >
                  AK
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold leading-none tracking-tight text-white truncate">
                    AKSA
                  </h2>
                  <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold">
                    Platform Admin
                  </span>
                </div>
              </div>
              <button
                onClick={closeMobileNav}
                aria-label="Tutup menu admin"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <span aria-hidden="true">&#10005;</span>
              </button>
            </div>

            <nav
              className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto"
              aria-label="Admin navigation mobile"
            >
              {visibleNavItems.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => navigateToTab(item.tab)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all border-l-4 ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <item.icon size={20} aria-hidden="true" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-4">
              <RoleSwitcher />
              <AdminIdentity
                identityName={identityName}
                roleLabel={adminRole}
                logout={logout}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Content column ────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/*
          Shell top bar — owned by AdminLayout at EVERY breakpoint.
          Below lg it carries the mobile menu button; at lg+ the desktop
          sidebar already shows navigation/identity, so the bar keeps only
          the current section title. This is structural chrome, not a
          business header: the legacy Search + Bell controls live in
          AdminDashboard as a content toolbar (T2 transitional).
        */}
        <header className="shrink-0 h-16 flex items-center gap-3 px-4 sm:px-6 bg-white border-b border-slate-200">
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label="Buka menu admin"
            aria-expanded={isMobileNavOpen}
            aria-controls={isMobileNavOpen ? 'admin-mobile-nav' : undefined}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <span aria-hidden="true">&#9776;</span>
          </button>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              AKSA Platform Admin
            </p>
            <p className="text-sm font-bold text-brand-navy truncate">
              {adminTabLabel(activeTab)}
            </p>
          </div>
        </header>

        {/* Single scrolling content region. Business content renders here. */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

/**
 * Debug role switcher. Preserved legacy contract: exposed ONLY while the
 * current role is Super Admin. This is a DEBUG affordance, not production
 * RBAC. Switching role navigates to `/admin` (overview) and re-filters nav.
 */
function RoleSwitcher() {
  const { adminRole, setAdminRole } = useAdminShell();
  if (adminRole !== 'Super Admin') return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">
        Role Switcher (Debug)
      </p>
      <div className="grid grid-cols-1 gap-1">
        {(['Super Admin', 'Content Manager', 'Support'] as const).map((role) => (
          <button
            key={role}
            onClick={() => setAdminRole(role)}
            aria-pressed={adminRole === role}
            className={`min-h-[44px] px-3 py-2 rounded text-xs font-bold border transition-all ${
              adminRole === role
                ? 'bg-white text-brand-navy border-white'
                : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Admin identity + logout. Presentation only — no authentication state.
 * Logout delegates to the legacy confirmation flow via requestLogout.
 */
function AdminIdentity({
  identityName,
  roleLabel,
  logout,
}: {
  identityName: string;
  roleLabel: string;
  logout: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="https://i.pravatar.cc/150?u=admin"
          className="w-10 h-10 rounded-xl shrink-0"
          alt=""
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{identityName}</p>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate">
            {roleLabel}
          </p>
        </div>
      </div>
      <button
        onClick={logout}
        aria-label="Keluar dari admin"
        title="Logout"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-white/5 transition-colors"
      >
        <span aria-hidden="true">&#8592;</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

/**
 * Admin route layout. Provides the shell context and renders the shell.
 * `AdminLayout` is mounted inside `LegacyAppStateProvider`, so it can obtain
 * the existing `requestLogout` adapter without inventing new logout semantics.
 */
export function AdminLayout() {
  const { requestLogout } = useLegacyAppState();

  return (
    <AdminShellProvider onLogout={requestLogout}>
      <AdminShell />
    </AdminShellProvider>
  );
}

export default AdminLayout;
