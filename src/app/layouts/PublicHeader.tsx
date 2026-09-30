/**
 * AKSA Public Header
 * ==================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Authority: docs/aksa/design/00-brand-contract.md
 *            docs/aksa/design/02-navigation-information-architecture.md
 *            docs/aksa/b1/01-legacy-compatibility-map.md (B1.4 scope)
 *
 * Replaces the legacy `src/components/Navbar.tsx` as the single owner of
 * public chrome. It is rendered by `PublicLayout` and nowhere else.
 *
 * ## Brand migration
 *
 * The legacy "The Prams" wordmark is gone from the public chrome. This header
 * renders `AksaBrandMark` — the AKSA monogram, the "AKSA" wordmark, and the
 * "Belajar Tanpa Batas" tagline, all read from the design tokens. This is the
 * approved AKSA shell brand migration for the public surface.
 *
 * The retired wordmark still exists in product copy inside public page
 * components; renaming that content is explicitly out of B1.4A scope.
 *
 * ## Every legacy capability is preserved
 *
 * | Destination         | Legacy label        | Here                        | Canonical path    |
 * |---------------------|---------------------|-----------------------------|-------------------|
 * | `landing`           | Home                | Home                        | `/`               |
 * | `programs`          | E-Learning Program  | Program                     | `/programs`       |
 * | `guestRegistration` | Tryout Gratis + 🔥  | Tryout Gratis + "Baru" 🔥   | `/register/guest` |
 * | `blogListing`       | Info Menarik        | Info                        | `/blog`           |
 * | `testimonials`      | Testimoni           | Testimoni                   | `/testimonials`   |
 * | `login`             | Masuk               | Masuk                       | `/login`          |
 * | `register`          | Daftar              | Daftar                      | `/register`       |
 * | `dashboard`         | Dashboard           | Dashboard                   | `/app`            |
 * | logout              | Logout              | Logout                      | `requestLogout`   |
 *
 * `href` values are produced by `legacyViewToPath` — the existing single
 * translation layer — so this file contains no route strings of its own.
 *
 * ## Why the visible labels were shortened
 *
 * STEP 2 of the brief enumerates the legacy labels; STEP 4 specifies the new
 * header's labels as "Home / Program / Tryout Gratis / Info / Testimoni". The
 * visible label follows STEP 4 and the full legacy phrasing is kept as the
 * accessible name, so no descriptive text is lost. WCAG 2.5.3 (Label in Name)
 * holds in both cases: the visible text is contained in the accessible name —
 * "Program" is a substring of "E-Learning Program", "Info" of "Info Menarik".
 *
 * ## Defects corrected here (all detailed in 06-b1.4a-*.md)
 *
 * 1. **Dead zone at 768–1023px.** The legacy header revealed the auth buttons
 *    from `md` (768px) but the nav links only from `lg` (1024px), and the
 *    hamburger only below `md`. Between 768px and 1023px a visitor could log
 *    in but could not navigate anywhere. This header uses ONE breakpoint:
 *    full navigation at `lg` and above, hamburger below it.
 * 2. **No signed-in state on mobile.** The legacy drawer always rendered
 *    "Masuk" / "Daftar", even when signed in, so a signed-in mobile user had
 *    no route to the dashboard and could not sign out from public chrome. The
 *    drawer now renders the same auth block as the desktop bar.
 * 3. **Contrast.** The legacy header put normal-size white text on
 *    `bg-brand-blue` (`#009688`, 3.67:1) and used `text-brand-blue` for the
 *    active link, the "Masuk" label, and a 9px badge. All are corrected here
 *    through the design-system primitives.
 *
 * ## Height and stacking are deliberately unchanged
 *
 * The header keeps the legacy `h-20` (80px). `LandingPage` and
 * `TestimonialsPage` hard-code `pt-20` to clear the fixed header, so
 * `layout.nav.headerHeight` (4rem) would have opened a 16px gap above the
 * hero on every public page. That token remains the learner/studio shell
 * height; aligning the public header with it is B1.5 visual acceptance.
 *
 * `z-50` is likewise kept rather than the `zIndex.nav` token (1000):
 * `ProgramDetailPage`'s fixed bottom bar already sits at `z-50`, and raising
 * the header above it would invert a relationship the legacy pages rely on.
 */

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, RefObject } from 'react';
import {
  BookOpen,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { Badge, Button, ButtonLink, IconButton } from '../../design-system/components';
import { colors, shadows, spacing, zIndex } from '../../design-system/tokens/brand';
import type { User, View } from '../../types';
import { legacyViewToPath } from '../router/legacyViewRoutes';
import { AksaBrandMark } from './AksaBrandMark';

export interface PublicHeaderProps {
  /** Current legacy view. Drives the active-link treatment. */
  currentView: View;
  /** Router-backed navigation adapter from `LegacyAppStateProvider`. */
  setView: (view: View) => void;
  /** Authenticated user, or `null` for a guest (see `PublicLayout`). */
  user: User | null;
  /** Opens the existing logout confirmation. Not a direct sign-out. */
  onLogout: () => void;
}

interface PublicNavItem {
  /** Visible label. */
  label: string;
  /** Full legacy phrasing, used as the accessible name. */
  accessibleName: string;
  view: View;
  icon: LucideIcon;
  badge?: string;
}

/** Module-level so the destination list is a single auditable table. */
const PUBLIC_NAV: readonly PublicNavItem[] = [
  { label: 'Home', accessibleName: 'Home', view: 'landing', icon: Home },
  {
    label: 'Program',
    accessibleName: 'E-Learning Program',
    view: 'programs',
    icon: BookOpen,
  },
  {
    label: 'Tryout Gratis',
    accessibleName: 'Tryout Gratis',
    view: 'guestRegistration',
    icon: Star,
    badge: 'Baru',
  },
  {
    label: 'Info',
    accessibleName: 'Info Menarik',
    view: 'blogListing',
    icon: Search,
  },
  {
    label: 'Testimoni',
    accessibleName: 'Testimoni',
    view: 'testimonials',
    icon: Users,
  },
];

/** Matches the `pt-20` offset baked into the public pages. See file header. */
const HEADER_HEIGHT = '5rem';

/**
 * Full-width control whose content is left-aligned.
 *
 * `Button` centres its content, which is right for a button and wrong for a
 * menu row. Overriding via `style` works because `Button` merges the caller's
 * `style` last; a Tailwind `!` class would also win, but v4 moved the
 * important modifier to a postfix (`px-3!`) and relying on that syntax for a
 * layout nudge is harder to read than saying what it means.
 */
const ROW_STYLE = { justifyContent: 'flex-start' } as const;

export function PublicHeader({
  currentView,
  setView,
  user,
  onLogout,
}: PublicHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  /**
   * SPA navigation from a real anchor.
   *
   * The destinations are `<a href>` elements, so they keep link semantics, a
   * middle-click, and cmd/ctrl-click to open in a new tab. A plain left click
   * is delegated to the router-backed `setView` so the in-memory demo session
   * survives — a real page load would drop it, since the legacy demo user
   * lives in React state only.
   */
  function navigate(
    event: MouseEvent<HTMLAnchorElement>,
    view: View,
    after?: () => void,
  ) {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.defaultPrevented || event.button !== 0 || modified) {
      // Unmodified handling is the browser's job: new tab, new window, and
      // middle-click all need the plain anchor behaviour.
      return;
    }
    event.preventDefault();
    setView(view);
    after?.();
  }

  // Close the profile popover on outside pointer-down and on Escape, and
  // return focus to its trigger so a keyboard user is not dropped at the top
  // of the document.
  useEffect(() => {
    if (!profileOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileOpen(false);
        profileTriggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  // Drawer: Escape closes it and returns focus to the trigger, and opening it
  // moves focus to the first destination so the menu is immediately
  // keyboard-operable rather than requiring a Tab first.
  useEffect(() => {
    if (!drawerOpen) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        drawerTriggerRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const authBlock = user ? (
    <ProfileMenu
      open={profileOpen}
      user={user}
      onToggle={() => setProfileOpen((value) => !value)}
      onDashboard={() => {
        setProfileOpen(false);
        setView('dashboard');
      }}
      onLogout={() => {
        setProfileOpen(false);
        onLogout();
      }}
      containerRef={profileRef}
      triggerRef={profileTriggerRef}
    />
  ) : (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="md" onClick={() => setView('login')}>
        Masuk
      </Button>
      <Button variant="primary" size="md" onClick={() => setView('register')}>
        Daftar
      </Button>
    </div>
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md"
      style={{
        zIndex: 50,
        borderBottom: `1px solid ${colors.neutral[200]}`,
        boxShadow: shadows.sm,
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between"
          style={{ height: HEADER_HEIGHT }}
        >
          <ButtonLink
            variant="ghost"
            size="md"
            href={legacyViewToPath('landing')}
            onClick={(event) => navigate(event, 'landing')}
            aria-label="AKSA, Belajar Tanpa Batas, beranda"
          >
            <AksaBrandMark />
          </ButtonLink>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {PUBLIC_NAV.map((item) => {
                const active = currentView === item.view;
                return (
                  <li key={item.view}>
                    <ButtonLink
                      variant="ghost"
                      size="md"
                      active={active}
                      href={legacyViewToPath(item.view)}
                      onClick={(event) => navigate(event, item.view)}
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.accessibleName}
                    >
                      <span className="text-[13px]">{item.label}</span>
                      {item.badge ? <NewBadge /> : null}
                    </ButtonLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* One breakpoint for both desktop clusters. See DEFECT-1 in the
              file header: splitting them across md/lg left 768–1023px with no
              navigation at all. */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {authBlock}
          </div>

          <div className="lg:hidden">
            <IconButton
              ref={drawerTriggerRef}
              variant="ghost"
              size="md"
              aria-label={drawerOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={drawerOpen}
              aria-controls="aksa-public-drawer"
              onClick={() => setDrawerOpen((value) => !value)}
              icon={drawerOpen ? <X size={24} /> : <Menu size={24} />}
            />
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <motion.div
          id="aksa-public-drawer"
          ref={drawerRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="lg:hidden bg-white overflow-y-auto"
          style={{
            maxHeight: `calc(100vh - ${HEADER_HEIGHT})`,
            borderBottom: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <nav aria-label="Navigasi utama (seluler)">
            <ul className="px-4 py-4 space-y-1">
              {PUBLIC_NAV.map((item) => {
                const active = currentView === item.view;
                const Icon = item.icon;
                return (
                  <li key={item.view}>
                    <ButtonLink
                      variant="ghost"
                      size="lg"
                      fullWidth
                      style={ROW_STYLE}
                      active={active}
                      href={legacyViewToPath(item.view)}
                      onClick={(event) =>
                        navigate(event, item.view, () => setDrawerOpen(false))
                      }
                      aria-current={active ? 'page' : undefined}
                      aria-label={item.accessibleName}
                    >
                      <Icon
                        size={20}
                        aria-hidden="true"
                        style={{ color: colors.neutral[500] }}
                      />
                      <span className="text-sm font-bold">{item.label}</span>
                      {item.badge ? <NewBadge /> : null}
                    </ButtonLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* DEFECT-2: the legacy drawer always rendered Masuk/Daftar, so a
              signed-in mobile user had no route to the dashboard and no way
              to sign out from public chrome. */}
          <div
            className="px-4 pb-6 pt-4"
            style={{ borderTop: `1px solid ${colors.neutral[200]}` }}
          >
            {user ? (
              <div className="flex flex-col gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  style={ROW_STYLE}
                  onClick={() => {
                    setDrawerOpen(false);
                    setView('dashboard');
                  }}
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  style={ROW_STYLE}
                  onClick={() => {
                    setDrawerOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut size={18} aria-hidden="true" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    setView('login');
                  }}
                >
                  Masuk
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    setView('register');
                  }}
                >
                  Daftar
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

/**
 * The "Baru 🔥" badge.
 *
 * The legacy badge was `text-red-500` on `bg-red-50` at 9px — roughly 3.9:1,
 * which fails AA at that size. This uses the design-system `Badge`, whose label
 * is `brand.emerald` (9.15:1 on the gold surface).
 *
 * `planned` is the right variant for "new": the brand contract reserves gold
 * for "spark/highlight, premium indicators", and the brief's visual language
 * asks for a restrained gold accent. Gold stays a surface, never text. The
 * pulse is gated on `motion-safe` because WCAG 2.2.2 applies to motion that
 * starts on its own.
 */
function NewBadge() {
  return (
    <Badge variant="planned" size="sm" className="motion-safe:animate-pulse">
      Baru <span aria-hidden="true">🔥</span>
    </Badge>
  );
}

interface ProfileMenuProps {
  open: boolean;
  user: User;
  onToggle: () => void;
  onDashboard: () => void;
  onLogout: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Signed-in disclosure: avatar + "Dashboard", expanding to Dashboard/Logout.
 *
 * Implemented as a DISCLOSURE (`aria-expanded` + `aria-controls`) rather than
 * `role="menu"`. A `role="menu"` obliges the author to implement the whole APG
 * menu keyboard model — arrow navigation, type-ahead, roving focus — which a
 * two-item popover does not need and would only half-implement. The
 * disclosure pattern is the honest fit.
 */
function ProfileMenu({
  open,
  user,
  onToggle,
  onDashboard,
  onLogout,
  containerRef,
  triggerRef,
}: ProfileMenuProps) {
  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="aksa-profile-menu"
        aria-label={`Menu akun ${user.name}`}
        className="flex items-center gap-2 rounded-full transition-colors"
        style={{
          minHeight: '44px',
          padding: `${spacing[1]} ${spacing[4]} ${spacing[1]} ${spacing[2]}`,
          // `surface.mint` is #f0fdfa, which is also what the legacy
          // `bg-slate-50` resolved to — `index.css` remaps `--color-slate-50`
          // to mint. Reading the token keeps that identity without relying on
          // a Tailwind override.
          backgroundColor: open ? colors.surface.mintSecondary : colors.surface.mint,
          border: `1px solid ${colors.neutral[200]}`,
        }}
      >
        <img
          src={user.avatar}
          alt=""
          width={32}
          height={32}
          className="rounded-full border-2 border-white shadow-sm"
        />
        <span
          className="text-sm font-bold"
          style={{ color: colors.brand.emerald }}
        >
          Dashboard
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          style={{
            color: colors.neutral[600],
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms ease',
          }}
        />
      </button>

      {open ? (
        <div
          id="aksa-profile-menu"
          className="absolute right-0 rounded-2xl py-2"
          style={{
            top: `calc(100% + ${spacing[2]})`,
            width: '12rem',
            backgroundColor: colors.surface.white,
            border: `1px solid ${colors.neutral[200]}`,
            boxShadow: shadows.lg,
            // Safe to exceed the header's own `z-50`: the header is
            // `position: fixed` with a non-auto z-index, so it establishes a
            // stacking context and this value cannot escape above it.
            zIndex: zIndex.nav,
          }}
        >
          <ul>
            <li>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                style={ROW_STYLE}
                onClick={onDashboard}
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                Dashboard
              </Button>
            </li>
            <li
              aria-hidden="true"
              style={{
                height: 1,
                margin: `${spacing[1]} ${spacing[4]}`,
                backgroundColor: colors.neutral[200],
              }}
            />
            <li>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                style={ROW_STYLE}
                onClick={onLogout}
              >
                <LogOut size={16} aria-hidden="true" />
                Logout
              </Button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default PublicHeader;
