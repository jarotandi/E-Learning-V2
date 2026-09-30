# src/design-system — AKSA Design System Boundary

Contract: `docs/aksa/design/00-brand-contract.md`, `docs/aksa/design/01-design-system.md`,
`docs/aksa/design/06-responsive-accessibility.md`.

`src/design-system` is the single source of truth for AKSA visual language:
brand tokens, layout primitives, and framework-agnostic component contracts.

## Sub-boundaries

| Directory | Responsibility | B1.1 status |
|-----------|----------------|-------------|
| `tokens/` | Typed design tokens (brand, color, spacing, radius, shadow, type, layout, z-index, a11y) | **Implemented (B1.1)** |
| `components/` | Framework-agnostic component primitives (`Button`, `Card`, `Badge`, …) | Reserved — B1.2 |
| `icons/` | AKSA icon wrappers / monogram asset | Reserved — B1.2 |

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

- `brand.emerald` (`#064e3b`) on white/mint passes AAA — safe for body text.
- `brand.teal` (`#009688`) on white is ~3.9:1 — valid for large text and UI
  boundaries only, **not** body text.
- `brand.gold` (`#ffc107`) is an accent only; never body text on white.
- Minimum interactive target: 44×44px (recommended 48×48px).
- Focus ring: 2px `#009688` with 2px offset.