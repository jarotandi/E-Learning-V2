# src/design-system — AKSA Design System Boundary

Contract: `docs/aksa/design/00-brand-contract.md`, `docs/aksa/design/01-design-system.md`,
`docs/aksa/design/06-responsive-accessibility.md`.

`src/design-system` is the single source of truth for AKSA visual language:
brand tokens, layout primitives, and framework-agnostic component contracts.

## Sub-boundaries

Batch sequence: B1.1 ✅ · B1.2 ✅ · B1.3 ✅ · **B1.4A (next)** · B1.4B–D · B1.5 · `AKSA-B1-SEALED`

| Directory | Responsibility | Status |
|-----------|----------------|--------|
| `tokens/` | Typed design tokens (brand, color, contrast, spacing, radius, shadow, type, layout, z-index, a11y) | **Implemented (B1.1), contrast corrected (B1.2)** |
| `components/` | Presentational primitives: `Button`, `ButtonLink`, `IconButton`, `Card`, `Badge`, `Input`, `Tabs`, `Table` | **Implemented (B1.4A)** |
| `icons/` | AKSA icon wrappers / monogram asset | Reserved — B1.4D |

`components/contract.ts` is internal and is not re-exported from
`components/index.ts`. `components/primitives.css` is the primitive state
layer and is loaded once from `src/main.tsx`.

## How a primitive is built

Every primitive follows one pattern, and the pattern is the contract:

1. **Base appearance** is an inline `style` object whose values are read from
   `tokens/brand.ts` at render time. A primitive therefore cannot drift from
   the palette, because it contains no colour literal.
2. **State** (`:hover`, `:focus-visible`, `[aria-invalid]`, `[data-aksa-disabled]`)
   cannot be expressed in a React style object, so those rules live in
   `components/primitives.css`, scoped to `data-aksa-*` attributes, reading
   `var(--aksa-*)` custom properties the component publishes.

The stylesheet is **not** injected from JavaScript. B1.3 review DEFECT-2 removed
an injected `<style>` from `LearnerLayout`; reintroducing that pattern here
would regress a decision the architect already made.

`npx tsx scripts/verify-design-system.mjs` proves this contract: it imports the
real modules, asserts the exported API and the frozen variant lists, and fails
if a colour literal appears in the primitive layer or if the legacy wordmark
returns to `PublicHeader`.

## Rules

1. Tokens must reflect the approved generated AKSA designs. Material divergence
   requires architect review.
2. Tokens are **additive**. They must not replace or rewrite `src/index.css`
   or the Tailwind pipeline while legacy components still depend on them.
3. New code should import tokens rather than hardcoding hex values or radii.
4. Tokens must not re-declare Tailwind; they express AKSA semantic intent and
   reference Tailwind-compatible scales.
5. Component primitives must remain presentational. No data fetching, no
   domain types, no capability checks.
6. `design-system` must not import from `src/app`, `src/features`, `src/studio`,
   `src/core`, or `src/integrations`.

## Contrast constraints (WCAG 2.1 AA)

The approved teal / emerald / gold AKSA identity is unchanged. What follows is
the **usage rule** for those colours, corrected in B1.2 (architect review AR-02).

- `brand.emerald` (`#064e3b`) on white/mint passes AAA — safe for normal-size text.
- `brand.teal` (`#009688`) against white is **≈ 3.67:1**. It does **not** meet
  AA for normal-size text (4.5:1 required), in either direction: teal text on
  white, and white normal-size text on a teal background, are both the same
  3.67:1 pairing. Suitable for UI/graphical boundaries and for sufficiently
  large text where the 3:1 threshold applies.
- `brand.tealAccessible` (`#00796b`) is the correct background for a **filled
  primary control carrying normal-size white text** — white on `#00796b` is
  **≈ 5.32:1**, which passes AA.
- `brand.gold` (`#ffc107`) is an accent only (spark, rewards, premium markers);
  never normal-size text on white.
- Minimum interactive target: 44×44px (recommended 48×48px).
- Focus ring: 2px `#009688` with 2px offset — teal is a UI boundary, so
  3.67:1 clears the 3:1 requirement.

Two further constraints were measured in B1.4A while building the primitives:

- **The semantic hues are not text colours.** `semantic.success` on
  `successSoft` is 3.32:1, `semantic.warning` on `warningSoft` 2.86:1,
  `semantic.error` on `errorSoft` 3.95:1, and `info` on `infoSoft` 3.57:1 — all
  fail AA. `Badge` therefore always uses `brand.emerald` for its label (7.96:1
  or better on every soft surface) and carries the variant in the background.
  `semantic.error` on white (4.83:1) is fine as body text, so `Input` uses it
  for error messages.
- **A control boundary needs 3:1, decoration does not.** `neutral.200` is
  1.26:1 and `neutral.300` 1.48:1 against white, so neither may bound an
  input. `Input` uses `neutral.500` (4.74:1) at rest. A `Card` border is
  decoration — the surface carries the separation — so `neutral.200` is
  correct there, and the `interactive` variant moves to `tealAccessible`
  because that card *is* a control.

Quick rule: **text → emerald; non-text surface/boundary → teal; filled primary
with normal-size white text → `#00796b`.**