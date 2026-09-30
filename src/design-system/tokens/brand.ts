/**
 * AKSA Brand & Design Token Contract
 * ==================================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/00-brand-contract.md
 *           docs/aksa/design/01-design-system.md
 *           docs/aksa/design/06-responsive-accessibility.md
 *
 * Scope note (B1.1):
 * - This module is ADDITIVE and FUTURE-FACING.
 * - It is NOT wired into any existing component in B1.1.
 * - `src/index.css` and the Tailwind pipeline remain the active styling
 *   authority until B1.2+ migrates consumers to these tokens.
 * - These tokens intentionally do NOT re-declare Tailwind. Where a value
 *   already exists in Tailwind, the token references the semantic intent
 *   rather than re-implementing the scale.
 *
 * Import convention:
 * The repository `@/*` alias currently resolves to the project ROOT
 * (see tsconfig.json `paths` and vite.config.ts `resolve.alias`), not to
 * `src/`. Therefore new code under `src/` uses relative imports, matching
 * the existing `src/components/*` convention. The alias target is
 * tracked as a B1.2 follow-up in docs/aksa/b1/02-b1-subbatch-plan.md.
 */

/* ------------------------------------------------------------------ */
/* Brand identity                                                      */
/* ------------------------------------------------------------------ */

export const brand = {
  name: 'AKSA',
  tagline: 'Belajar Tanpa Batas',
  monogram: 'A',
  legalName: 'AKSA',
} as const;

/* ------------------------------------------------------------------ */
/* Colors                                                             */
/* ------------------------------------------------------------------ */

/**
 * Contrast notes (WCAG 2.1 AA) are asserted in
 * docs/aksa/design/06-responsive-accessibility.md. Key facts:
 * - `brand.emerald` on white/mint passes AAA.
 * - `brand.teal` on white is ~3.9:1 and therefore ONLY valid for large
 *   text or UI boundaries. Body text on teal must use white.
 * - `brand.gold` is an accent only; never use as body text on white.
 */
export const colors = {
  brand: {
    /** Primary teal — primary actions, navigation, boundaries. */
    teal: '#009688',
    tealHover: '#00796b',
    tealActive: '#00695c',
    /** Deep emerald — body text on light surfaces, emphasis. */
    emerald: '#064e3b',
    emeraldHover: '#065f46',
    /** Restrained gold accent — spark, rewards, premium markers. */
    gold: '#ffc107',
    goldHover: '#ffb300',
    goldSoft: '#fff8e1',
  },
  surface: {
    white: '#ffffff',
    mint: '#f0fdfa',
    mintSecondary: '#ccfbf1',
    mintTertiary: '#a7f3d0',
  },
  semantic: {
    success: '#059669',
    successSoft: '#d1fae5',
    warning: '#d97706',
    warningSoft: '#fef3c7',
    error: '#dc2626',
    errorSoft: '#fee2e2',
    info: '#0284c7',
    infoSoft: '#e0f2fe',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Spacing                                                            */
/* ------------------------------------------------------------------ */

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

/* ------------------------------------------------------------------ */
/* Radius                                                             */
/* ------------------------------------------------------------------ */

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
  /** Default card radius. */
  card: '1rem',
  /** Default button/input radius. */
  control: '0.5rem',
} as const;

/* ------------------------------------------------------------------ */
/* Elevation                                                          */
/* ------------------------------------------------------------------ */

/** Philosophy: subtle depth. No dramatic drop shadows. */
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
  cardHover: '0 4px 12px 0 rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
} as const;

/* ------------------------------------------------------------------ */
/* Typography                                                         */
/* ------------------------------------------------------------------ */

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Layout                                                             */
/* ------------------------------------------------------------------ */

export const layout = {
  nav: {
    headerHeight: '4rem',
    sidebarWidth: '16rem',
    sidebarCollapsedWidth: '4rem',
    mobileNavHeight: '3.5rem',
  },
  content: {
    maxWidth: '80rem',
    maxWidthWide: '96rem',
    padding: '1.5rem',
    gap: '1.5rem',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
  nav: 1000,
} as const;

/* ------------------------------------------------------------------ */
/* Accessibility primitives                                            */
/* ------------------------------------------------------------------ */

/** Minimum interactive target size (WCAG 2.1 target size). */
export const targetSize = {
  min: '44px',
  recommended: '48px',
} as const;

export const focusRing = {
  color: colors.brand.teal,
  width: '2px',
  offset: '2px',
} as const;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type BrandToken = typeof brand;
export type ColorToken = typeof colors;
export type SpacingToken = typeof spacing;
export type RadiusToken = typeof radius;
export type ShadowToken = typeof shadows;
export type TypographyToken = typeof typography;
export type LayoutToken = typeof layout;
export type BreakpointToken = typeof breakpoints;
export type ZIndexToken = typeof zIndex;

/* ------------------------------------------------------------------ */
/* Aggregate contract                                                 */
/* ------------------------------------------------------------------ */

/**
 * Single aggregate object for consumers that prefer a namespaced import.
 * Individual named exports remain the primary API.
 */
export const aksaDesignTokens = {
  brand,
  colors,
  spacing,
  radius,
  shadows,
  typography,
  layout,
  breakpoints,
  zIndex,
  targetSize,
  focusRing,
} as const;

export type AksaDesignTokens = typeof aksaDesignTokens;
