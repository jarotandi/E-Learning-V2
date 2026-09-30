/**
 * AKSA Learner Shell
 * ==================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/design/03-learner-shell.md
 *            docs/aksa/design/02-navigation-information-architecture.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *            src/app/navigation/learnerNavigation.ts
 *            src/design-system/tokens/
 *
 * ## Structure
 *
 *   Header  64px desktop / 56px mobile  — AKSA mark, tagline, search slot,
 *                                        notification slot, profile slot
 *   Sidebar 256px desktop               — 7 groups from learnerNavigation
 *   Drawer  tablet + mobile             — same groups, overlay backdrop
 *   Bottom  mobile only                 — 5 items, MAX_MOBILE_BOTTOM_NAV
 *
 * ## Which routes use this shell in B1.3
 *
 *   USES the shell:
 *     - the 17 planned learner foundation routes
 *     - `/app/assessment`, `/app/profile`, `/app/calendar` — legacy pages that
 *       carry NO navigation chrome of their own, so the shell is additive
 *       rather than duplicated.
 *
 *   DOES NOT use the shell (documented legacy-compatibility mode):
 *     - `/app`      -> `StudentDashboard` (23.6 KB) renders its own sidebar +
 *                      header
 *     - `/app/learn`-> `LearningPage` (40.1 KB) renders its own workspace
 *                      chrome
 *     - exam, result, `/app/wallet`, `/app/login`-adjacent surfaces render
 *       bare, exactly as before the router existed.
 *
 *   Wrapping the two self-chrome pages in this shell would produce a double
 *   header and a double sidebar, which is the specific failure mode B1.3 is
 *   required to avoid. Decomposing them into the AKSA shell is B1.4 work —
 *   see `docs/aksa/b1/04-b1.3-router-migration.md`.
 *
 * ## Status honesty
 *
 * Every entry renders its `status`. `planned` entries carry a "Segera"
 * (upcoming) treatment so a reserved URL can never be mistaken for a shipped
 * feature. Only routes backed by a real legacy capability show as available.
 */

import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';

import { colors, layout, radius } from '../../design-system/tokens/brand';
import {
  MAX_MOBILE_BOTTOM_NAV,
  type NavItem,
  type NavSection,
} from '../navigation/navigation.types';
import { learnerNavigation } from '../navigation/learnerNavigation';
import { useLegacyAppState } from '../providers/LegacyAppStateProvider';
import { AksaBrandMark } from './AksaBrandMark';

/* ------------------------------------------------------------------ */
/* Icon resolution                                                    */
/*                                                                     */
/* `learnerNavigation` stores icon names as strings so the navigation  */
/* contract stays framework-agnostic. The shell resolves them here.     */
/* Icons with no mapping fall back to a neutral dot — they still render */
/* and still navigate, they are simply not decorated.                   */
/* ------------------------------------------------------------------ */

import {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  Compass,
  Download,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  House,
  Library,
  LifeBuoy,
  MessagesSquare,
  Route,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  Video,
  Wallet,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  Compass,
  Download,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  House,
  Library,
  LifeBuoy,
  MessagesSquare,
  Route,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  Video,
  Wallet,
};

function resolveIcon(name?: string): LucideIcon | null {
  return name ? ICONS[name] ?? null : null;
}

/* ------------------------------------------------------------------ */
/* Status treatment                                                   */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: NavItem['status'] }) {
  if (status === 'available') {
    return <span className="sr-only">(tersedia)</span>;
  }
  return (
    // Contrast: `brand.emerald` (#064e3b) on `brand.goldSoft` (#fff8e1) is
    // ~8.4:1, which passes AA for this 9px label. The gold accent is used as
    // the badge SURFACE tint only — gold is never used as normal-size text
    // (B1.2 / AR-02).
    <span
      className="ml-auto text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md shrink-0"
      style={{ backgroundColor: colors.brand.goldSoft, color: colors.brand.emerald }}
    >
      Segera
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                            */
/* ------------------------------------------------------------------ */

function LearnerSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      learnerNavigation.sections.map((section) => [
        section.id,
        section.defaultOpen ?? true,
      ]),
    ),
  );

  const toggleSection = (section: NavSection) => {
    if (!section.collapsible) return;
    setOpenSections((previous) => ({
      ...previous,
      [section.id]: !previous[section.id],
    }));
  };

  return (
    <nav
      aria-label="Navigasi utama AKSA"
      className="flex-1 overflow-y-auto px-3 pb-6 space-y-1"
    >
      {learnerNavigation.sections.map((section) => {
        const SectionIcon = resolveIcon(section.icon);
        const isOpen = section.collapsible ? openSections[section.id] : true;

        return (
          <div key={section.id} className="pt-3 first:pt-2">
            {/* Group header. For a single-item group the header itself is the
                link (BERANDA), matching the approved design mock. */}
            {section.items.length === 1 ? (
              <NavLink
                to={section.items[0].path ?? '#'}
                onClick={onNavigate}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-brand-blue/10 text-brand-navy'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {SectionIcon ? <SectionIcon size={17} /> : null}
                <span className="truncate">{section.label}</span>
              </NavLink>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-2 px-3 pt-2 pb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-colors"
                >
                  {SectionIcon ? <SectionIcon size={13} /> : null}
                  <span>{section.label}</span>
                  {section.collapsible ? (
                    <ChevronDown
                      size={13}
                      className={`ml-auto transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  ) : null}
                </button>

                {isOpen ? (
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const ItemIcon = resolveIcon(item.icon);
                      return (
                        <li key={item.id}>
                          <NavLink
                            to={item.path ?? '#'}
                            onClick={onNavigate}
                            end={item.path === '/app'}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors ${
                                isActive
                                  ? 'bg-brand-blue/10 text-brand-navy font-bold'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-brand-navy'
                              }`
                            }
                          >
                            {ItemIcon ? (
                              <ItemIcon size={15} className="shrink-0" />
                            ) : null}
                            <span className="truncate">{item.label}</span>
                            <StatusDot status={item.status} />
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */

function LearnerHeader({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const { user, requestLogout } = useLegacyAppState();
  const [profileOpen, setProfileOpen] = useState(false);

  // Close profile menu on outside click
  useEffect(() => {
    if (!profileOpen) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [profileOpen]);

  // Escape key closes profile menu
  useEffect(() => {
    if (!profileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        profileTriggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [profileOpen]);

  const profileRef = React.useRef<HTMLDivElement>(null);
  const profileTriggerRef = React.useRef<HTMLButtonElement>(null);

  const isPremium = user?.isPremium ?? false;

  return (
    <header
      // 56px on mobile, 64px from tablet up — per the shell contract.
      //
      // B1.3 DEFECT FOUND AND FIXED HERE. This used to be an inline
      // `style={{ height: '3.5rem' }}` on <header> plus an injected
      // `<style>` rule that resized an INNER div to `layout.nav.headerHeight`.
      // Inline styles win over stylesheet rules, so the outer <header> stayed
      // 56px at every width while its inner content became 64px from 768px up.
      // Measured in Chrome at a 1000px viewport: header bounding box 56px,
      // inner box 64px, 8px of content overflowing the header.
      //
      // The responsive height now lives on the element that is actually
      // measured. `h-14` is 3.5rem and `h-16` is 4rem, which is exactly
      // `layout.nav.headerHeight`, so the token and the CSS agree.
      className="sticky top-0 z-40 h-14 md:h-16 bg-white border-b border-slate-200/70"
    >
      <div className="h-full flex items-center gap-3 px-4 md:px-6">
        {/* Hamburger — shows wherever the 256px sidebar is NOT docked.
            B1.3 DEFECT FOUND AND FIXED HERE: this was `md:hidden`, which is
            768px, while the sidebar is `lg:flex`, which is 1024px. Between
            768px and 1023px the drawer trigger was hidden AND the sidebar was
            not yet docked, and the bottom bar is also `md:hidden` — so that
            whole band had NO navigation at all. Measured at a 1000px
            viewport: hamburger `display:none`, sidebar `display:none`,
            bottom bar `display:none`.

            `docs/aksa/design/03-learner-shell.md` requires:
              768px-1023px (md) -> Collapsible sidebar (drawer), full header
              1024px+      (lg) -> Full sidebar, full header
            so the trigger belongs on `lg:hidden`, matching the sidebar. */}
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Buka navigasi"
          className="lg:hidden p-2 -ml-2 rounded-lg text-brand-navy hover:bg-slate-50"
        >
          <Menu size={20} />
        </button>

        <Link to="/app" className="shrink-0 hidden sm:block">
          <AksaBrandMark />
        </Link>
        <Link to="/app" className="shrink-0 sm:hidden">
          <AksaBrandMark size="sm" showTagline={false} />
        </Link>

        {/* Global search — visual slot only. B1.3 ships no search behaviour
            and this must not be mistaken for a working feature. */}
        <div className="hidden lg:flex flex-1 max-w-sm ml-4">
          <div
            className="w-full flex items-center gap-2 px-3.5 border bg-slate-50"
            style={{
              height: '2.5rem',
              borderRadius: radius.control,
              borderColor: colors.neutral[200],
            }}
            aria-hidden="true"
          >
            <Search size={15} style={{ color: colors.neutral[400] }} />
            <span
              className="text-[13px]"
              style={{ color: colors.neutral[400] }}
            >
              Cari materi, kelas, atau mentor
            </span>
            <kbd
              className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white"
              style={{
                borderColor: colors.neutral[200],
                color: colors.neutral[400],
              }}
            >
              Ctrl K
            </kbd>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notification slot — visual only in B1.3. */}
          <button
            type="button"
            disabled
            aria-label="Notifikasi (segera)"
            title="Notifikasi — segera hadir"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 cursor-not-allowed"
            style={{ backgroundColor: colors.neutral[50] }}
          >
            <Bell size={17} />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.brand.gold }}
            />
          </button>

          {/* Profile disclosure — accessible account menu with Profile + Logout.
              Replaces the legacy sidebar "Keluar" item and the simple profile link. */}
          <div className="relative" ref={profileRef}>
            <button
              ref={profileTriggerRef}
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
              aria-controls="aksa-learner-profile-menu"
              aria-label={`Menu akun ${user?.name ?? 'Tamu'}`}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border hover:bg-slate-50 transition-colors"
              style={{ borderColor: colors.neutral[200] }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                style={{ backgroundColor: colors.brand.emerald }}
              >
                {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </span>
              <span className="hidden md:flex flex-col leading-none">
                <span
                  className="text-[12px] font-bold truncate max-w-[120px]"
                  style={{ color: colors.brand.emerald }}
                >
                  {user?.name ?? 'Tamu'}
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: colors.neutral[500] }}
                >
                  {isPremium ? 'Premium' : 'Free'}
                </span>
              </span>
              <ChevronDown size={14} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div
                id="aksa-learner-profile-menu"
                role="menu"
                aria-orientation="vertical"
                aria-label={`Menu akun ${user?.name ?? 'Tamu'}`}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl border shadow-lg overflow-hidden"
                style={{ borderColor: colors.neutral[200] }}
              >
                <Link
                  to="/app/profile"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-navy hover:bg-slate-50"
                >
                  <User size={15} className="text-slate-400" />
                  Profil
                </Link>
                <hr className="border-slate-100 my-1" />
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => {
                    setProfileOpen(false);
                    requestLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile bottom navigation                                           */
/* ------------------------------------------------------------------ */

function LearnerBottomNav() {
  const items = [...learnerNavigation.mobileBottomNav]
    .sort((a, b) => (a.mobilePriority ?? 99) - (b.mobilePriority ?? 99))
    .slice(0, MAX_MOBILE_BOTTOM_NAV);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Navigasi utama mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200"
      style={{ height: layout.nav.mobileNavHeight, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="h-full flex items-stretch">
        {items.map((item) => {
          const ItemIcon = resolveIcon(item.icon);
          return (
            <li key={item.id} className="flex-1">
              <NavLink
                to={item.path ?? '#'}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `h-full flex flex-col items-center justify-center gap-0.5 text-[9px] font-bold transition-colors ${
                    isActive ? 'text-brand-navy' : 'text-slate-400'
                  }`
                }
              >
                {ItemIcon ? <ItemIcon size={17} /> : null}
                <span className="truncate px-0.5">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                             */
/* ------------------------------------------------------------------ */

export interface LearnerLayoutProps {
  /** Sidebar caption, so the surface is identifiable while browsing. */
  surfaceLabel?: string;
}

export function LearnerLayout({ surfaceLabel }: LearnerLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Auto-close the drawer on navigation, per
  // docs/aksa/design/03-learner-shell.md ("Auto-close on route change").
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f6faf9' }}>
      {/* Skip link — accessibility requirement in the shell contract. */}
      <a
        href="#aksa-learner-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-sm focus:font-bold"
        style={{ color: colors.brand.emerald }}
      >
        Lewati ke konten utama
      </a>

      <LearnerHeader onOpenDrawer={() => setDrawerOpen(true)} />

      <div className="flex-1 flex min-h-0">
        {/* Desktop sidebar (>=1024px per the shell contract) */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-slate-200/70 bg-white"
          style={{ width: layout.nav.sidebarWidth }}
        >
          {surfaceLabel ? (
            <div className="px-4 pt-4 pb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {surfaceLabel}
              </p>
            </div>
          ) : null}
          <LearnerSidebarContent />
        </aside>

        {/* Tablet drawer (<1024px) */}
        {drawerOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Tutup navigasi"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-brand-navy/40"
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigasi AKSA"
              className="absolute inset-y-0 left-0 flex flex-col bg-white shadow-2xl"
              style={{ width: layout.nav.sidebarWidth }}
            >
              <div
                className="flex items-center justify-between px-4 border-b border-slate-100 h-14 md:h-16"
              >
                <AksaBrandMark size="sm" showTagline={false} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Tutup"
                  className="p-2 -mr-2 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  <X size={18} />
                </button>
              </div>
              <LearnerSidebarContent onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        ) : null}

        {/* Main */}
        <main
          id="aksa-learner-main"
          className="flex-1 min-w-0 overflow-y-auto pb-16 md:pb-0"
        >
          <div
            className="mx-auto w-full flex flex-col"
            style={{
              maxWidth: layout.content.maxWidth,
              padding: layout.content.padding,
              gap: layout.content.gap,
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <LearnerBottomNav />
    </div>
  );
}

export default LearnerLayout;
