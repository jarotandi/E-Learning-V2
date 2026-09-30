/**
 * AKSA Design Token Contracts — public surface
 * ============================================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/00-brand-contract.md
 *            docs/aksa/design/01-design-system.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *
 * Import path note: the repository `@/*` alias currently resolves to the
 * project ROOT, not `src/`. Use a relative import from inside `src/`.
 */

export {
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
  aksaDesignTokens,
} from './brand';

export type {
  BrandToken,
  ColorToken,
  SpacingToken,
  RadiusToken,
  ShadowToken,
  TypographyToken,
  LayoutToken,
  BreakpointToken,
  ZIndexToken,
  AksaDesignTokens,
} from './brand';