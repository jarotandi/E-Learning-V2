# src/shared — Cross-Cutting Utility Boundary

Contract: `docs/aksa/03-module-boundaries.md`.

`src/shared` holds code that is genuinely **horizontal**: used by two or more
layers, and not owned by any one of them.

## Belongs here

- Pure formatting/serialisation helpers (date, number, string).
- Result/error primitives shared by adapters and domain layers.
- Validation helpers that are schema-agnostic (shape/type checks only).
- Environment/config reading that contains **no secrets**.
- Cross-cutting types with no owning feature.

## Does not belong here

| Wrong location | Reason |
|----------------|--------|
| Feature-specific UI | Belongs in `src/features/<capability>` |
| Domain rules (mastery, curriculum, validation policy) | Belongs in `src/core` |
| Vendor SDK usage | Belongs in `src/integrations` |
| Router/guard logic | Belongs in `src/app` |
| Design tokens | Belongs in `src/design-system` |
| Generic "misc" dumping ground | No owner, no contract — reject |

## Rules

1. `src/shared` is the **only** layer that must stay free of domain and UI
   imports, so it can be consumed from anywhere.
2. Every module in `src/shared` must be justified by at least two consumers.
3. Prefer duplicating a small helper over creating a premature abstraction.
4. No hidden global state, no singletons with side effects, no ambient
   `window`/`document` access at module scope.
5. `src/shared` must not import from `app`, `features`, `studio`, `core`,
   `integrations`, or `design-system`.

## B1.1 status

Intentionally empty. The existing `src/utils/` and `src/types.ts` continue to
serve the legacy app during B1.1. They are inventoried in
`docs/aksa/b1/01-legacy-compatibility-map.md` and folded into `src/shared` only
when a migration actually needs them.