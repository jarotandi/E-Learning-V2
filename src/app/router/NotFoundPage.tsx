/**
 * AKSA Not Found Page
 * ===================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Terminal route for any URL that matches no canonical, compatibility, or
 * planned route. Previously the pre-router `App.tsx` silently fell back to the
 * landing view for any unknown state, which meant a mistyped or retired URL
 * showed the homepage with no indication anything was wrong. B1.3 makes that
 * state explicit and addressable.
 *
 * It offers the two destinations that actually exist in B1.3 — the landing page
 * and the learner app — plus the program list, because `/app` may redirect to
 * `/login` when the visitor has no in-memory user.
 *
 * Route: `*`
 */

import { Link, useLocation } from 'react-router-dom';
import { Compass, Home, LayoutDashboard, SearchX } from 'lucide-react';

import { colors, radius, shadows } from '../../design-system/tokens/brand';
import { LEARNER_PATHS, PUBLIC_PATHS } from './routePaths';

const SUGGESTIONS = [
  { to: PUBLIC_PATHS.landing, label: 'Beranda', icon: Home },
  { to: PUBLIC_PATHS.programs, label: 'Program', icon: Compass },
  { to: LEARNER_PATHS.dashboard, label: 'AKSA App', icon: LayoutDashboard },
] as const;

export function NotFoundPage() {
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: '#f6faf9' }}
    >
      <section
        className="w-full max-w-xl rounded-2xl bg-white border border-slate-200/70 p-8 md:p-10 text-center"
        style={{ boxShadow: shadows.card }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
          style={{ backgroundColor: colors.brand.goldSoft }}
        >
          <SearchX size={26} style={{ color: colors.brand.emerald }} />
        </div>

        {/* 10px label: `brand.teal` on white is ~3.67:1, which fails AA for
            normal-size text. Accessible teal keeps the brand hue and passes. */}
        <p
          className="mt-6 text-[10px] font-black uppercase tracking-widest"
          style={{ color: colors.brand.tealAccessible }}
        >
          404 — Halaman tidak ditemukan
        </p>

        <h1
          className="mt-2 text-2xl md:text-3xl font-black tracking-tight"
          style={{ color: colors.brand.emerald }}
        >
          Alamat ini tidak dikenali
        </h1>

        <p
          className="mt-3 text-sm md:text-[15px] leading-relaxed"
          style={{ color: colors.neutral[600] }}
        >
          Halaman yang kamu cari tidak ada atau sudah dipindahkan. Alamat yang
          sedang dibuka:
        </p>

        <code
          className="mt-3 inline-block max-w-full px-3 py-1.5 text-xs font-mono rounded-lg break-all"
          style={{
            backgroundColor: colors.neutral[50],
            color: colors.neutral[700],
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          {location.pathname}
        </code>

        <div
          className="mt-7 pt-7 flex flex-wrap items-center justify-center gap-2.5"
          style={{ borderTop: `1px solid ${colors.neutral[200]}` }}
        >
          {SUGGESTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors"
                style={{
                  backgroundColor: colors.brand.tealAccessible,
                  color: '#ffffff',
                  borderRadius: radius.control,
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;
