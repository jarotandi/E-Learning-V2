/**
 * AKSA Button Primitive
 * =====================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * Authority: docs/aksa/design/00-brand-contract.md
 *            docs/aksa/design/01-design-system.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *
 * ## What this is
 *
 * A presentational control. It renders a real `<button>` (`Button`) or a real
 * `<a>` (`ButtonLink`) and does nothing else: no domain types, no data
 * fetching, no routing knowledge, no permission checks. The caller owns what
 * happens on activation.
 *
 * ## Why it exists
 *
 * Every legacy public control used `bg-brand-blue` (which is `#009688`) as a
 * fill behind normal-size white text. That pairing measures 3.67:1 and fails
 * WCAG AA. Centralising the control in one primitive is what makes the rule
 * enforceable rather than advisory: a future call site cannot re-introduce the
 * violation by copy-paste, because there is no per-call-site colour to copy.
 *
 * ## Contrast contract (measured, not assumed)
 *
 * | State         | Fill                 | White text |
 * |---------------|----------------------|------------|
 * | primary       | `brand.tealAccessible` | 5.32:1 AA |
 * | primary:hover | `brand.tealActive`     | 6.61:1 AA |
 * | secondary     | `brand.emerald`        | 9.72:1 AAA|
 * | danger        | `semantic.error`       | 4.83:1 AA |
 * | danger:hover  | `#b91c1c` (see below)  | 6.47:1 AA |
 * | outline/ghost | transparent            | 5.32:1 AA |
 *
 * `brand.teal` (`#009688`) is deliberately NOT a button fill. It remains the
 * identity colour for the monogram tile, focus rings, borders, and icons.
 *
 * ## No `loading` prop
 *
 * The brief asked for `loading` only "if it can be implemented without fake
 * async behaviour". It cannot: a presentational primitive has no request to
 * await, so a `loading` flag would be a lie waiting to be wired up. Callers
 * with genuine async work should disable the control and render their own
 * pending affordance. Omitted deliberately, not overlooked.
 */

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
  Ref,
} from 'react';

import { colors, radius, spacing, targetSize, typography } from '../tokens/brand';
import { FOCUS_VARS, MIN_TARGET, cx, withVars } from './contract';

/**
 * Visual weight. Ordered from most to least emphasis.
 *
 * `Object.freeze` is not decoration. `as const` gives a readonly TYPE, but the
 * array is still mutable at runtime, so one caller doing
 * `BUTTON_VARIANTS.push(...)` would silently corrupt the contract for every
 * other caller. The same reasoning applies to every exported variant list in
 * this layer, and `scripts/verify-design-system.mjs` asserts it.
 */
export const BUTTON_VARIANTS = Object.freeze([
  'primary',
  'secondary',
  'outline',
  'ghost',
  'danger',
] as const);
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

/**
 * Control size.
 *
 * `sm` is a density decision, not a licence to make a control untappable: it
 * still meets the 44x44px minimum target from the accessibility token.
 */
export const BUTTON_SIZES = Object.freeze(['sm', 'md', 'lg'] as const);
export type ButtonSize = (typeof BUTTON_SIZES)[number];

/**
 * Deep red for the danger hover state.
 *
 * `semantic.error` (#dc2626) already passes AA with white text at 4.83:1, so
 * the base state needs no darkening for contrast reasons. A darker hover is
 * included because a hover that LIGHTENS a destructive control reads as
 * "cancel". #b91c1c is the standard Tailwind red-700 pairing and measures
 * 6.47:1 against white.
 */
const ERROR_DEEP = '#b91c1c';

/**
 * Disabled palette.
 *
 * `neutral.500` on `neutral.200` does not reach 4.5:1. WCAG 1.4.3 explicitly
 * exempts inactive user-interface components, so this is intentional rather
 * than an oversight: a disabled control that stays fully legible competes
 * with the enabled one it is telling you not to use.
 */
const DISABLED = {
  background: colors.neutral[200],
  color: colors.neutral[500],
  border: `1px solid ${colors.neutral[300]}`,
} as const;

interface SizeRecipe {
  padding: string;
  /** Square padding used when `iconOnly` is set. */
  squarePadding: string;
  fontSize: string;
  minHeight: string;
  gap: string;
}

const SIZE: Record<ButtonSize, SizeRecipe> = {
  sm: {
    padding: `${spacing[2]} ${spacing[4]}`,
    squarePadding: spacing[2],
    fontSize: typography.fontSize.sm[0],
    minHeight: MIN_TARGET,
    gap: spacing[2],
  },
  md: {
    padding: `${spacing[2]} ${spacing[5]}`,
    squarePadding: spacing[3],
    fontSize: typography.fontSize.sm[0],
    minHeight: MIN_TARGET,
    gap: spacing[2],
  },
  lg: {
    padding: `${spacing[3]} ${spacing[6]}`,
    squarePadding: spacing[3],
    fontSize: typography.fontSize.base[0],
    minHeight: targetSize.recommended,
    gap: spacing[2],
  },
};

interface VariantRecipe {
  background: string;
  color: string;
  border: string;
  hoverBackground: string;
  hoverBorder: string;
  fontWeight: number;
}

const VARIANT: Record<ButtonVariant, VariantRecipe> = {
  // Filled. #00796b, NOT #009688 — see the contrast contract above.
  primary: {
    background: colors.brand.tealAccessible,
    color: colors.surface.white,
    border: '1px solid transparent',
    hoverBackground: colors.brand.tealActive,
    hoverBorder: colors.brand.tealActive,
    fontWeight: 700,
  },
  // Filled, lower emphasis. Deep emerald is the AKSA body-text colour and
  // passes AAA against white.
  secondary: {
    background: colors.brand.emerald,
    color: colors.surface.white,
    border: '1px solid transparent',
    hoverBackground: colors.brand.emeraldHover,
    hoverBorder: colors.brand.emeraldHover,
    fontWeight: 700,
  },
  // Unfilled with a visible boundary. The text needs AA, so the border and
  // the label both use the accessible teal rather than #009688.
  outline: {
    background: 'transparent',
    color: colors.brand.tealAccessible,
    border: `2px solid ${colors.brand.tealAccessible}`,
    hoverBackground: colors.surface.mint,
    hoverBorder: colors.brand.tealAccessible,
    fontWeight: 700,
  },
  // Unfilled, no resting border. For tertiary actions in dense toolbars.
  ghost: {
    background: 'transparent',
    color: colors.brand.emerald,
    border: '1px solid transparent',
    hoverBackground: colors.surface.mint,
    hoverBorder: colors.surface.mintSecondary,
    fontWeight: 600,
  },
  danger: {
    background: colors.semantic.error,
    color: colors.surface.white,
    border: '1px solid transparent',
    hoverBackground: ERROR_DEEP,
    hoverBorder: ERROR_DEEP,
    fontWeight: 700,
  },
};

interface ButtonOwnProps {
  /** Visual weight. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Control size. Defaults to `md`. */
  size?: ButtonSize;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  /**
   * Marks the control as the current selection in a set — an active nav item,
   * a chosen filter. Purely a resting appearance; it is not a toggle, so no
   * `aria-pressed` is emitted. Selection state that a screen reader must know
   * about belongs on `aria-current` / `aria-selected` at the call site.
   */
  active?: boolean;
  /** Renders a square control sized to the minimum target. */
  iconOnly?: boolean;
  /** Visible content. */
  children?: ReactNode;
  /** Extra classes, appended last. */
  className?: string;
}

/**
 * An accessible name is REQUIRED for an icon-only control and optional
 * otherwise. This is enforced by the type system rather than by a lint rule
 * or a runtime warning, so an unlabelled icon button does not compile.
 */
type AccessibleName =
  | { iconOnly?: false; 'aria-label'?: string }
  | { iconOnly: true; 'aria-label': string };

export type ButtonProps = ButtonOwnProps &
  AccessibleName &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    /**
     * React 19 passes `ref` to function components as an ordinary prop, so no
     * `forwardRef` wrapper is needed — but it still has to be declared or a
     * caller cannot reach the underlying element.
     */
    ref?: Ref<HTMLButtonElement>;
  };

export type ButtonLinkProps = ButtonOwnProps &
  AccessibleName &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    /** Required. The presence of `href` is what selects the anchor rendering. */
    href: string;
    ref?: Ref<HTMLAnchorElement>;
    /**
     * An anchor has no native `disabled` attribute, so this is expressed as
     * `aria-disabled="true"` plus removal from the tab order. Suppressed from
     * the DOM so no invalid attribute is emitted.
     */
    disabled?: boolean;
  };

/**
 * Resting appearance for `active`.
 *
 * Each variant keeps its own identity: a filled variant deepens, an unfilled
 * variant takes a mint fill and an accessible-teal label. Contrast is
 * re-checked in every case — `emerald` on `mint` is 9.32:1 and
 * `tealAccessible` on `mint` is 5.10:1.
 */
const ACTIVE_OVERRIDE: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: colors.brand.emerald,
    borderColor: colors.brand.emerald,
    color: colors.surface.white,
  },
  secondary: {
    backgroundColor: colors.brand.emeraldHover,
    borderColor: colors.brand.emeraldHover,
    color: colors.surface.white,
  },
  outline: {
    backgroundColor: colors.surface.mintSecondary,
    borderColor: colors.brand.tealAccessible,
    color: colors.brand.emerald,
  },
  ghost: {
    backgroundColor: colors.surface.mintSecondary,
    borderColor: colors.brand.tealAccessible,
    color: colors.brand.emerald,
  },
  danger: {
    backgroundColor: ERROR_DEEP,
    borderColor: ERROR_DEEP,
    color: colors.surface.white,
  },
};

interface ResolvedAppearance {
  style: CSSProperties;
  vars: Record<string, string>;
}

function resolveAppearance(options: {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  iconOnly: boolean;
  disabled: boolean;
}): ResolvedAppearance {
  const { variant, size, fullWidth, iconOnly, disabled } = options;
  const v = VARIANT[variant];
  const s = SIZE[size];

  const background = disabled ? DISABLED.background : v.background;
  const color = disabled ? DISABLED.color : v.color;
  const border = disabled ? DISABLED.border : v.border;

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: iconOnly ? s.squarePadding : s.padding,
    minHeight: s.minHeight,
    // A square control is pinned square so a 44x44px target is guaranteed
    // rather than hoped for.
    minWidth: iconOnly ? s.minHeight : undefined,
    width: fullWidth ? '100%' : undefined,
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: s.fontSize,
    fontWeight: v.fontWeight,
    lineHeight: typography.fontSize.sm[1].lineHeight,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    backgroundColor: background,
    color,
    border,
    borderRadius: radius.control,
    transition:
      'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
  };

  const vars: Record<string, string> = {
    ...FOCUS_VARS,
    '--aksa-btn-bg-hover': disabled ? DISABLED.background : v.hoverBackground,
    '--aksa-btn-border-hover': disabled
      ? DISABLED.border
      : v.hoverBorder,
  };

  return { style, vars };
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    active = false,
    iconOnly = false,
    disabled = false,
    className,
    style,
    children,
    ref,
    ...rest
  } = props;

  const { style: base, vars } = resolveAppearance({
    variant,
    size,
    fullWidth,
    iconOnly,
    disabled,
  });

  return (
    <button
      {...rest}
      ref={ref}
      // Defaulting to `type="button"` is load-bearing: inside a `<form>` a
      // button with no type submits it. A presentational control must never
      // do that by accident.
      type={rest.type ?? 'button'}
      disabled={disabled}
      data-aksa-button={variant}
      data-aksa-focusable=""
      {...(disabled ? { 'data-aksa-disabled': '' } : {})}
      {...(active ? { 'data-aksa-active': '' } : {})}
      className={cx('aksa-button', className)}
      style={withVars({ ...base, ...(active ? ACTIVE_OVERRIDE[variant] : {}), ...style }, vars)}
    >
      {children}
    </button>
  );
}

/**
 * Anchor rendering. Same visual contract as `Button`, different element.
 *
 * An `<a>` has no `disabled` attribute, so `disabled` is expressed as
 * `aria-disabled="true"` plus removal from the tab order plus
 * `pointer-events: none` (see `primitives.css`).
 */
export function ButtonLink(props: ButtonLinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    active = false,
    iconOnly = false,
    disabled = false,
    className,
    style,
    children,
    ref,
    ...rest
  } = props;

  const { style: base, vars } = resolveAppearance({
    variant,
    size,
    fullWidth,
    iconOnly,
    disabled,
  });

  return (
    <a
      {...rest}
      ref={ref}
      data-aksa-button={variant}
      data-aksa-focusable=""
      {...(disabled ? { 'aria-disabled': true, tabIndex: -1 } : {})}
      {...(active ? { 'data-aksa-active': '' } : {})}
      className={cx('aksa-button', className)}
      style={withVars({ ...base, ...(active ? ACTIVE_OVERRIDE[variant] : {}), ...style }, vars)}
    >
      {children}
    </a>
  );
}

export default Button;
