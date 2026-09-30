/**
 * AKSA Card Primitive
 * ===================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Authority: docs/aksa/design/00-brand-contract.md
 *            docs/aksa/design/01-design-system.md
 *
 * ## What this is
 *
 * A surface with a rounded AKSA radius, a subtle border, and a restrained
 * shadow. Three variants and nothing else — deliberately no "pricing card",
 * "stat card", "feature card", or any other domain-flavoured variant. If a
 * product surface needs a different border colour it composes `Card` with its
 * own content rather than growing a new variant here.
 *
 * ## Contrast note — the border is decorative
 *
 * `neutral.200` measures 1.26:1 against white, which does not reach the 3:1
 * that WCAG 1.4.11 requires. That requirement applies to the boundary of a
 * control whose state must be identified — an input, a toggle, a selected
 * row. A card's border is decoration; the card's own surface (`white` on the
 * white canvas, or `mint` on `muted`) carries the separation. This is the
 * same reasoning behind `.card-premium` using `border-slate-200` in
 * `index.css`. The `interactive` variant is the exception: because that card
 * IS a control, its hover boundary moves to `tealAccessible` at 5.32:1.
 */

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import { colors, radius, shadows, spacing } from '../tokens/brand';
import { FOCUS_VARS, cx, withVars } from './contract';

/**
 * Frozen for the same reason as `BUTTON_VARIANTS`: `as const` protects the
 * type, not the runtime array.
 */
export const CARD_VARIANTS = Object.freeze([
  'default',
  'muted',
  'interactive',
] as const);
export type CardVariant = (typeof CARD_VARIANTS)[number];

export const CARD_PADDINGS = Object.freeze([
  'none',
  'sm',
  'md',
  'lg',
] as const);
export type CardPadding = (typeof CARD_PADDINGS)[number];

const PADDING_VALUE: Record<CardPadding, string> = {
  none: '0',
  sm: spacing[3],
  md: spacing[5],
  lg: spacing[6],
};

const SURFACE: Record<CardVariant, string> = {
  default: colors.surface.white,
  muted: colors.surface.mint,
  interactive: colors.surface.white,
};

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Visual variant. Defaults to `default`. */
  variant?: CardVariant;
  /** Interior spacing. Defaults to `md`. */
  padding?: CardPadding;
  children?: ReactNode;
  /** Extra classes, appended last. */
  className?: string;
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  style,
  children,
  ...rest
}: CardProps) {
  // `interactive` is a card that behaves like a control, so it only receives
  // the focus ring when the caller has actually made it focusable
  // (`tabIndex`/`onClick`/an inner link). A hover-only affordance on a plain
  // div is a keyboard trap in reverse: it looks actionable and is not.
  const focusable = variant === 'interactive' && rest.tabIndex !== undefined;

  const base: CSSProperties = {
    backgroundColor: SURFACE[variant],
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: radius.card,
    boxShadow: variant === 'muted' ? shadows.none : shadows.card,
    padding: PADDING_VALUE[padding],
    transition:
      'box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease',
    // A card never establishes its own colour for descendants; inner text is
    // the caller's choice, exactly as before this primitive existed.
    color: colors.brand.emerald,
  };

  const vars: Record<string, string> = {
    '--aksa-card-shadow-hover': shadows.cardHover,
    '--aksa-card-border-hover': colors.brand.tealAccessible,
  };

  return (
    <div
      {...rest}
      {...(variant === 'interactive' ? { 'data-aksa-card-interactive': '' } : {})}
      {...(focusable ? { 'data-aksa-focusable': '' } : {})}
      className={cx('aksa-card', className)}
      style={withVars({ ...base, ...(focusable ? FOCUS_VARS : {}), ...style }, vars)}
    >
      {children}
    </div>
  );
}

export default Card;
