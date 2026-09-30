# src/design-system — AKSA Design System Boundary

Contract: `docs/aksa/design/00-brand-contract.md`, `docs/aksa/design/01-design-system.md`,
`docs/aksa/design/06-responsive-accessibility.md`.

`src/design-system` is the single source of truth for AKSA visual language:
brand tokens, layout primitives, and framework-agnostic component contracts.

## Sub-boundaries

Batch sequence: B1.1 ✅ · B1.2 ✅ · **B1.3 (next)** · B1.4 · B1.5 · `AKSA-B1-SEALED`

| Directory | Responsibility | Status |
|-----------|----------------|--------|
| `tokens/` | Typed design tokens (brand, color, contrast, spacing, radius, shadow, type, layout, z-index, a11y) | **Implemented (B1.1), contrast corrected (B1.2)** |
| `components/` | Framework-agnostic component primitives (`Button`, `Card`, `Badge`, …) | Reserved — B1.4 |
| `icons/` | AKSA icon wrappers / monogram asset | Reserved — B1.4 |

Component primitives and icon assets are B1.4 work. They follow the approved
B1.4 design-system scope unless a specific earlier need is approved.

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

Quick rule: **text → emerald; non-text surface/boundary → teal; filled primary
with normal-size white text → `#00796b`.**