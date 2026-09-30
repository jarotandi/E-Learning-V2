/**
 * AKSA Studio Shell
 * =================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/design/04-studio-shell.md
 *            docs/aksa/design/02-navigation-information-architecture.md
 *            src/app/navigation/studioNavigation.ts
 *
 * ## B1.3 SCOPE — READ BEFORE ADDING ANYTHING HERE
 *
 * B1.3 delivers the Studio SHELL and its ROUTES ONLY. Every Studio route
 * renders a foundation placeholder.
 *
 * This shell does NOT implement, and must not be read as implementing:
 *   - Creator AI or any AI provider call   (B5, needs the AI Router)
 *   - the content editor                    (B4)
 *   - templates or media management         (B4)
 *   - Content Factory generation            (B5)
 *   - validation logic                      (B6)
 *   - review workflow or publishing         (B6)
 *   - analytics                             (B4)
 *
 * Per `docs/aksa/07-ai-integration-boundary.md` there is still no server/edge
 * AI runtime (SEC-P1-01, open, B5). `src/integrations/ai/` must stay empty.
 *
 * ## Creator AI is intentionally absent
 *
 * `studioNavigation` has no top-level "AI Creator" entry, by design: Creator AI
 * is a copilot that lives inside the Editor's right panel and in Content
 * Factory, not a primary navigation destination. Adding one requires architect
 * approval.
 *
 * ## Capability metadata is declared, not enforced
 *
 * Entries carry `requiredCapabilities`. B1.3 does not evaluate them — real
 * authorization is a B2 deliverable. B1.4 introduces the guard mechanism; it
 * still needs B2 identity to mean anything.
 *
 * Studio has no mobile bottom bar in the approved design (it is a desktop-first
 * authoring surface); `studioNavigation.mobileBottomNav` is intentionally
 * empty, and none is rendered.
 */

import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  BadgeCheck,
  BarChart3,
  Factory,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  Menu,
  PenTool,
  Settings,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react';

import { colors, layout } from '../../design-system/tokens/brand';
import type { NavSection } from '../navigation/navigation.types';
import { studioNavigation } from '../navigation/studioNavigation';
import { AksaBrandMark } from './AksaBrandMark';

const ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  BarChart3,
  Factory,
  Image: ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  PenTool,
  Settings,
  ShieldCheck,
};

function resolveIcon(name?: string): LucideIcon | null {
  return name ? ICONS[name] ?? null : null;
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                            */
/* ------------------------------------------------------------------ */

function StudioSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      studioNavigation.sections.map((section) => [
        section.id,
        section.defaultOpen ?? true,
      ]),
    ),
  );

  return (
    <nav
      aria-label="Navigasi AKSA Studio"
      className="flex-1 overflow-y-auto px-3 pb-6"
    >
      {studioNavigation.sections.map((section: NavSection) => {
        const SectionIcon = resolveIcon(section.icon);
        const isOpen = section.collapsible
          ? openSections[section.id]
          : true;

        return (
          <div key={section.id} className="pt-3 first:pt-2">
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
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenSections((previous) => ({
                      ...previous,
                      [section.id]: !previous[section.id],
                    }))
                  }
                  className="w-full flex items-center gap-2 px-3 pt-2 pb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-colors"
                >
                  {SectionIcon ? <SectionIcon size={13} /> : null}
                  <span>{section.label}</span>
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
                            end={item.path === '/studio'}
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
                            {item.requiredCapabilities?.length ? (
                              <span
                                className="ml-auto text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md shrink-0"
                                style={{
                                  backgroundColor: colors.neutral[100],
                                  color: colors.neutral[600],
                                }}
                                title={`Memerlukan: ${item.requiredCapabilities.join(', ')} — belum ditegakkan (B2)`}
                              >
                                Izin
                              </span>
                            ) : null}
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
/* Layout                                                             */
/* ------------------------------------------------------------------ */

export function StudioLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#f6faf9' }}
    >
      <a
        href="#aksa-studio-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-sm focus:font-bold"
        style={{ color: colors.brand.emerald }}
      >
        Lewati ke konten utama
      </a>

      <header
        className="sticky top-0 z-40 bg-white border-b border-slate-200/70"
        style={{ height: layout.nav.headerHeight }}
      >
        <div className="h-full flex items-center gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka navigasi Studio"
            className="lg:hidden p-2 -ml-2 rounded-lg text-brand-navy hover:bg-slate-50"
          >
            <Menu size={20} />
          </button>

          <Link to="/studio" className="shrink-0">
            <AksaBrandMark context="Studio" />
          </Link>

          <div
            className="ml-auto hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: colors.neutral[50] }}
          >
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: colors.brand.emerald }}
            >
              Foundation
            </span>
            <span className="text-[10px]" style={{ color: colors.neutral[500] }}>
              Shell saja — belum ada fitur Studio aktif
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-slate-200/70 bg-white"
          style={{ width: layout.nav.sidebarWidth }}
        >
          <StudioSidebar />
        </aside>

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
              aria-label="Navigasi AKSA Studio"
              className="absolute inset-y-0 left-0 flex flex-col bg-white shadow-2xl"
              style={{ width: layout.nav.sidebarWidth }}
            >
              <div
                className="flex items-center justify-between px-4 border-b border-slate-100"
                style={{ height: layout.nav.headerHeight }}
              >
                <AksaBrandMark context="Studio" size="sm" showTagline={false} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Tutup"
                  className="p-2 -mr-2 rounded-lg text-slate-500 hover:bg-slate-50"
                >
                  <X size={18} />
                </button>
              </div>
              <StudioSidebar onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        ) : null}

        <main
          id="aksa-studio-main"
          className="flex-1 min-w-0 overflow-y-auto"
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
    </div>
  );
}

export default StudioLayout;
