/**
 * Planned Route Page
 * ==================
 * B1.3 — Production Router + AKSA App Shell
 *
 * The single reusable foundation placeholder for every route that the
 * approved AKSA information architecture reserves but that has no
 * implementation yet.
 *
 * ## HONESTY CONTRACT
 *
 * This component deliberately shows NO charts, NO sample data, NO fake
 * counters, NO action buttons, and NO "coming soon" spinner that implies
 * work in progress. It states three truthful things:
 *
 *   1. which module this is,
 *   2. that it is part of the AKSA architecture but not yet activated,
 *   3. which batch is expected to deliver it.
 *
 * That is all. A placeholder that renders mock analytics is a lie with a
 * progress bar on it.
 *
 * Copy is the approved Indonesian line from the B1.3 brief:
 *   "Modul ini sudah masuk arsitektur AKSA dan akan diaktifkan pada batch
 *    pengembangan berikutnya."
 *
 * Visual treatment follows the approved AKSA direction: white + mint canvas,
 * deep emerald text, teal identity accent, restrained gold status badge,
 * rounded panel, subtle shadow, generous whitespace.
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

import { colors, radius, shadows } from '../../design-system/tokens/brand';

export interface PlannedRoutePageProps {
  /** Module display name, e.g. "Library". */
  moduleName: string;
  /**
   * Owning delivery batch, e.g. "B3", or "TBD" when `docs/aksa/10-batch-roadmap.md`
   * allocates no batch to this module. "TBD" is a truthful value, not a
   * placeholder to default-fill.
   */
  batch: string;
  /** One short, non-functional sentence describing intent. */
  intent: string;
  /** Which surface reserved this module. */
  surface: 'Learner' | 'Studio';
  /** Optional back link. */
  backTo?: string;
  backLabel?: string;
  children?: ReactNode;
}

export function PlannedRoutePage({
  moduleName,
  batch,
  intent,
  surface,
  backTo,
  backLabel = 'Kembali',
  children,
}: PlannedRoutePageProps) {
  return (
    <section
      aria-labelledby="aksa-planned-heading"
      className="rounded-2xl bg-white border border-slate-200/70 p-8 md:p-10"
      style={{ boxShadow: shadows.card }}
    >
      {/* Status badge — gold accent on a mint/emerald label. Gold is an
          accent surface, never normal-size text on white (B1.2 / AR-02). */}
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
        style={{ backgroundColor: colors.brand.goldSoft, color: colors.brand.emerald }}
      >
        <Sparkles size={12} />
        Planned
      </span>

      {/* Small (10px) label. `brand.teal` on white is ~3.67:1 and fails AA for
          normal-size text, so the accessible teal is used for the text while
          `brand.teal` stays reserved for graphical/UI use (B1.3R1). */}
      <p
        className="mt-5 text-[10px] font-black uppercase tracking-widest"
        style={{ color: colors.brand.tealAccessible }}
      >
        AKSA {surface}
      </p>

      <h1
        id="aksa-planned-heading"
        className="mt-1 text-2xl md:text-3xl font-black tracking-tight"
        style={{ color: colors.brand.emerald }}
      >
        {moduleName}
      </h1>

      <p
        className="mt-3 text-sm md:text-[15px] leading-relaxed max-w-2xl"
        style={{ color: colors.neutral[600] }}
      >
        Modul ini sudah masuk arsitektur AKSA dan akan diaktifkan pada batch
        pengembangan berikutnya.
      </p>

      <p className="mt-2 text-sm leading-relaxed max-w-2xl" style={{ color: colors.neutral[500] }}>
        {intent}
      </p>

      {/* Facts, not features. */}
      <dl className="mt-7 grid gap-3 sm:grid-cols-2 max-w-2xl">
        <div
          className="rounded-xl px-4 py-3 border"
          style={{
            borderColor: colors.neutral[200],
            backgroundColor: colors.neutral[50],
            borderRadius: radius.control,
          }}
        >
          <dt
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: colors.neutral[500] }}
          >
            Status
          </dt>
          <dd
            className="mt-0.5 text-sm font-bold"
            style={{ color: colors.brand.emerald }}
          >
            Belum diimplementasikan
          </dd>
        </div>
        <div
          className="rounded-xl px-4 py-3 border"
          style={{
            borderColor: colors.neutral[200],
            backgroundColor: colors.neutral[50],
            borderRadius: radius.control,
          }}
        >
          <dt
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: colors.neutral[500] }}
          >
            Batch pengaktifan
          </dt>
          <dd
            className="mt-0.5 text-sm font-bold"
            style={{ color: colors.brand.emerald }}
          >
            {batch}
          </dd>
        </div>
      </dl>

      {children}

      {backTo ? (
        // Back link is normal-size text (14px bold is still under the 18.66px
        // large-text threshold), so it needs the AA-compliant teal. The arrow
        // icon inherits the same colour; the focus ring keeps brand teal via
        // the global focus-visible contract.
        <Link
          to={backTo}
          className="mt-7 inline-flex items-center gap-2 text-sm font-bold transition-colors"
          style={{ color: colors.brand.tealAccessible }}
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>
      ) : null}
    </section>
  );
}

export default PlannedRoutePage;
