# src/app — Application Shell Boundary

Contract: `docs/aksa/design/03-learner-shell.md`, `docs/aksa/design/04-studio-shell.md`,
`docs/aksa/03-module-boundaries.md`.

`src/app` owns **application composition only**: routing, layouts, providers,
guards, and navigation definitions. It must not contain domain rules,
data access, or feature UI.

## Dependency direction

```
src/app  ->  src/features  ->  src/core  ->  src/integrations  ->  src/shared
```

`src/app` may import from any lower layer. Lower layers must never import `src/app`.

## Sub-boundaries

| Directory | Responsibility | B1.1 status |
|-----------|----------------|-------------|
| `navigation/` | Typed navigation definitions + shared nav types | **Contract only** (B1.1) |
| `layouts/` | Shell composition (Learner, Studio, Public, Admin) | Reserved — B1.2 |
| `providers/` | React context providers (Navigation, Session, Theme) | Reserved — B1.2 |
| `guards/` | Route/capability guards | Reserved — B1.4 |
| `router/` | Production router wiring | Reserved — B1.2 |

## Rules

1. No domain or validation logic in `src/app`.
2. Navigation definitions stay UI-framework agnostic (`navigation.types.ts`
   imports neither React nor a router).
3. Guards must not re-implement permission checks inline; they delegate to
   capability resolution introduced with identity in B2.
4. `src/app` must not be imported by `src/core`, `src/features`, `src/studio`,
   `src/integrations`, or `src/shared`.

## Import note

The repository `@/*` alias resolves to the **project root**, not `src/`
(`tsconfig.json` `paths` → `./*`, `vite.config.ts` → `path.resolve(__dirname, '.')`).
All files under `src/` therefore use relative imports. Realigning the alias to
`src/` is tracked as a B1.2 follow-up in `docs/aksa/b1/02-b1-subbatch-plan.md`.