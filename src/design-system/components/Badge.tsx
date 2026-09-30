/**
 * AKSA Badge Primitive
 * ====================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Authority: docs/aksa/design/00-brand-contract.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *
 * ## Why every badge uses the same text colour
 *
 * The obvious recipe — semantic hue text on its own soft surface — is wrong
 * for this palette, and it was measured rather than assumed:
 *
 * | Text            | On its soft surface | Verdict |
 * |-----------------|---------------------|---------|
 * | `success`       | 3.32:1              | FAILS AA |
 * | `warning`       | 2.86:1              | FAILS AA |
 * | `semantic.error`| 3.95:1              | FAILS AA |
 * | `info`          | 3.57:1              | FAILS AA |
 * | `brand.gold`    | 1.53:1              | FAILS AA |
 *
 * So the semantic hue is carried by the BACKGROUND and the text is always
 * `brand.emerald`, which measures 7.96:1 or better on every soft surface in
 * the palette. The variant is still unmistakable — it is the fill that
 * changes — and the label now passes AA.
 *
 * Gold keeps its documented role: it is the `planned` badge's *surface*, the
 * one place in the primitive set where gold is allowed to appear, and it is
 * never text.
 */

import type { HTMLAttributes, ReactNode } from 'react';

import { colors, radius, spacing, typography } from '../tokens/brand';
import { cx } from './contract';

export const BADGE_VARIANTS = Object.freeze([
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
  'planned',
] as const);
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export const BADGE_SIZES = Object.freeze(['sm', 'md'] as const);
export type BadgeSize = (typeof BADGE_SIZES)[number];

/**
 * The tinted surface that carries each variant's identity.
 *
 * `planned` deliberately maps to `goldSoft` — the restrained gold accent used
 * as a surface, per the brand contract.
 */
const SURFACE: Record<BadgeVariant, string> = {
  neutral: colors.neutral[100],
  success: colors.semantic.successSoft,
  warning: colors.semantic.warningSoft,
  danger: colors.semantic.errorSoft,
  info: colors.semantic.infoSoft,
  planned: colors.brand.goldSoft,
};

const SIZE = {
  sm: { padding: `0.0625rem ${spacing[2]}`, fontSize: typography.fontSize.xs[0] },
  md: { padding: `${spacing[1]} ${spacing[2]}`, fontSize: typography.fontSize.sm[0] },
} as const;

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
  className?: string;
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  className,
  style,
  children,
  ...rest
}: BadgeProps) {
  const s = SIZE[size];

  return (
    <span
      {...rest}
      data-aksa-badge={variant}
      className={cx('aksa-badge', className)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[1],
        padding: s.padding,
        backgroundColor: SURFACE[variant],
        // Decorative hairline. A badge is not a control and has no state to
        // identify, so the 3:1 boundary rule does not apply here.
        border: `1px solid ${colors.neutral[300]}`,
        borderRadius: radius.full,
        color: colors.brand.emerald,
        fontFamily: typography.fontFamily.sans.join(', '),
        fontSize: s.fontSize,
        fontWeight: 700,
        lineHeight: typography.fontSize.sm[1].lineHeight,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
