/**
 * AKSA Brand Mark
 * ===============
 * B1.3 — Production Router + AKSA App Shell
 *
 * The AKSA monogram + wordmark used by the Learner and Studio shells.
 *
 * Visual contract (docs/aksa/design/00-brand-contract.md):
 * - Wordmark "AKSA", tagline "Belajar Tanpa Batas".
 * - Primary brand teal #009688 (`colors.brand.teal`).
 * - Deep emerald #064e3b for wordmark text (`colors.brand.emerald`).
 * - Restrained gold #ffc107 as a spark accent only, never normal text.
 *
 * The brand tokens are read from `src/design-system/tokens/` so this component
 * cannot drift from the approved palette. The existing Tailwind theme in
 * `src/index.css` maps the same values to `brand-blue` / `brand-navy` /
 * `brand-orange`, so legacy pages and the new shell stay visually consistent.
 *
 * NOTE ON CONTRAST (B1.2 / AR-02): the monogram tile uses the brand teal
 * #009688 as a SURFACE with white content that is LARGE (the "A" glyph),
 * not normal-size text. #009688 clears the 3:1 large-text/UI threshold.
 * Any normal-size white label placed on a teal fill must use
 * `colors.brand.tealAccessible` (#00796b, ~5.32:1) instead.
 */

import { brand, colors } from '../../design-system/tokens/brand';

export interface AksaBrandMarkProps {
  /** Optional leading sub-label, e.g. "Studio". */
  context?: string;
  /** Hides the tagline. Used on the compact mobile header. */
  showTagline?: boolean;
  size?: 'sm' | 'md';
}

export function AksaBrandMark({
  context,
  showTagline = true,
  size = 'md',
}: AksaBrandMarkProps) {
  const tile = size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-xl';
  const glyph = size === 'sm' ? 'text-base' : 'text-lg';
  const wordmark = size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${tile} flex items-center justify-center font-black text-white shrink-0`}
        style={{
          backgroundColor: colors.brand.teal,
          boxShadow: '0 4px 12px -4px rgb(0 150 136 / 0.45)',
        }}
        aria-hidden="true"
      >
        <span className={`${glyph} leading-none`}>{brand.monogram}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`${wordmark} font-black tracking-tight leading-none`}
            style={{ color: colors.brand.emerald }}
          >
            {brand.name}
          </span>
          {context ? (
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: colors.brand.goldHover }}
            >
              {context}
            </span>
          ) : null}
        </div>
        {showTagline ? (
          <p
            className="text-[10px] font-medium leading-tight mt-0.5 truncate"
            style={{ color: colors.neutral[500] }}
          >
            {brand.tagline}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default AksaBrandMark;
