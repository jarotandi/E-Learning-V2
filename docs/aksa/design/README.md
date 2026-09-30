# AKSA Design Contract

This directory contains the official AKSA design system and UI contracts derived from the **approved generated AKSA designs**.

## Documents

| File | Purpose |
|------|---------|
| [00-brand-contract.md](./00-brand-contract.md) | Brand identity, logo, tagline, color palette, typography |
| [01-design-system.md](./01-design-system.md) | Design tokens, component primitives, spacing, shadows, radius |
| [02-navigation-information-architecture.md](./02-navigation-information-architecture.md) | Learner, Studio, and Admin IA contracts |
| [03-learner-shell.md](./03-learner-shell.md) | Learner app shell, layout, navigation patterns |
| [04-studio-shell.md](./04-studio-shell.md) | AKSA Studio shell, editor layout, validation integration |
| [05-validation-ui.md](./05-validation-ui.md) | Validation Center UI, review queue, review detail |
| [06-responsive-accessibility.md](./06-responsive-accessibility.md) | Breakpoints, accessibility standards, contrast requirements |

## Authority

**These documents are the visual acceptance references** for all future implementation work. Implementation that materially diverges from this direction must be treated as requiring revision.

## Relationship to B0

These design contracts formalize the visual direction established in the B0 architecture contracts:
- [02-target-architecture.md](../02-target-architecture.md) — Product surfaces
- [03-module-boundaries.md](../03-module-boundaries.md) — Source structure
- [04-route-map.md](../04-route-map.md) — Target routes

## Implementation Notes

- B1.1 establishes the token contracts and navigation data structures
- B1.2+ will implement the production router and shells
- B1.3+ will decompose monolith components
- Existing `src/index.css` and Tailwind config must continue working throughout B1