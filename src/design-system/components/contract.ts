/**
 * AKSA Design-System Primitive Internals
 * ======================================
 * B1.4A — Design System Primitives + Public Header Extraction
 *
 * INTERNAL MODULE — not re-exported from `./index.ts`.
 *
 * ## Why this file exists
 *
 * Every AKSA primitive is built the same way:
 *
 *   1. The BASE appearance is an inline `style` object whose values are read
 *      from `src/design-system/tokens/brand.ts` at render time. That is what
 *      keeps the token file the single visual authority — a primitive cannot
 *      drift from the palette because it never contains a colour literal.
 *
 *   2. STATE (`:hover`, `:focus-visible`, `[aria-invalid]`, ...) cannot be
 *      expressed in a React style object. Those rules live in
 *      `./primitives.css`, scoped to `data-aksa-*` attributes, and consume the
 *      CSS custom properties published by step 1.
 *
 * ## Why not a stylesheet injected from JavaScript
 *
 * B1.3 review DEFECT-2 removed an injected `<style>` element from
 * `LearnerLayout` because it mutated the document at runtime and hid a real
 * layout value from the cascade. Repeating that pattern here would regress a
 * decision the architect already made. `primitives.css` is instead a real,
 * static, import-time stylesheet.
 *
 * ## Why not Tailwind utilities for the state layer
 *
 * `index.css` must not be rewritten, and the legacy theme only aliases
 * `brand-blue` / `brand-navy` / `brand-orange` — it has no entry for
 * `tealAccessible`. Using `hover:bg-[var(--x)]` would work, but it would
 * also mean a primitive's colours come from Tailwind's generated CSS while its
 * geometry comes from tokens, splitting visual authority across two systems.
 *
 * ## Scoping guarantee
 *
 * Every rule in `primitives.css` is gated on a `data-aksa-*` attribute, so
 * these primitives cannot restyle a single legacy component in
 * `src/components/`.
 */

import type { CSSProperties } from 'react';

import { focusRing, targetSize } from '../tokens/brand';

/**
 * Focus-ring custom properties, published by every interactive primitive.
 *
 * The values come from the `focusRing` token so the ring width, offset, and
 * colour are decided in exactly one place. `focusRing.color` is the brand teal
 * `#009688`, which measures 3.67:1 against white and therefore clears the 3:1
 * requirement for a UI/focus indicator. It is a boundary, not text.
 */
export const FOCUS_VARS: Record<string, string> = {
  '--aksa-focus-color': focusRing.color,
  '--aksa-focus-width': focusRing.width,
  '--aksa-focus-offset': focusRing.offset,
};

/**
 * Merges token-derived custom properties into a base style object.
 *
 * Order matters: the base style is written first and the custom properties
 * second, so a caller's own `style` prop (merged last at the call site) can
 * still override geometry without losing the state layer.
 */
export function withVars(
  base: CSSProperties,
  vars: Record<string, string>,
): CSSProperties {
  return { ...base, ...vars } as CSSProperties;
}

/** The minimum interactive target, as a token-sourced value. */
export const MIN_TARGET = targetSize.min;

/**
 * Conditional className joiner.
 *
 * Deliberately local rather than a dependency: the whole need is "join the
 * truthy strings", and the primitives are the only consumers.
 */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ');
}
