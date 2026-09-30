/**
 * AKSA Design Token Contracts — public surface
 * ============================================
 * B1.1 — App Foundation Structure + Design Contract
 *
 * Authority: docs/aksa/design/00-brand-contract.md
 *            docs/aksa/design/01-design-system.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *
 * Import path note: `@/*` resolves to `src/*` in both TypeScript
 * (`tsconfig.json` paths) and Vite (`resolve.alias`), as of B1.2 / CONF-01.
 * New code may use `@/design-system/...`. Relative imports remain valid and do
 * not need mass migration.
 */

export {
  brand,
  colors,
  contrast,
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
  ContrastToken,
  SpacingToken,
  RadiusToken,
  ShadowToken,
  TypographyToken,
  LayoutToken,
  BreakpointToken,
  ZIndexToken,
  AksaDesignTokens,
} from './brand';