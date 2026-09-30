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

Batch sequence: B1.1 ✅ · B1.2 ✅ · **B1.3 (next)** · B1.4 · B1.5 · `AKSA-B1-SEALED`

| Directory | Responsibility | Status |
|-----------|----------------|--------|
| `navigation/` | Typed navigation definitions + shared nav types | **Contract only** (B1.1) |
| `aliasContractProof.ts` | Compile-time proof that `@/*` resolves to `src/*` | **Implemented** (B1.2) |
| `layouts/` | Shell composition (Learner, Studio, Public, Admin) | Reserved — B1.3 |
| `providers/` | React context providers (Navigation, Session, Theme) | Reserved — B1.3 |
| `router/` | Production router wiring | Reserved — B1.3 |
| `guards/` | Route/capability guard **mechanism** | Reserved — B1.4 |

> Guard enforcement is **not** a B1 deliverable. Real authorization depends on
> B2 identity, so B1.4 delivers only the mechanism.

## Rules

1. No domain or validation logic in `src/app`.
2. Navigation definitions stay UI-framework agnostic (`navigation.types.ts`
   imports neither React nor a router).
3. Guards must not re-implement permission checks inline; they delegate to
   capability resolution introduced with identity in B2.
4. `src/app` must not be imported by `src/core`, `src/features`, `src/studio`,
   `src/integrations`, or `src/shared`.

## Import note

The `@/*` alias resolves to **`src/*`** in both toolchains (`tsconfig.json` `paths`
→ `./src/*`, `vite.config.ts` → `path.resolve(__dirname, 'src')`), as of B1.2 /
CONF-01. New code under `src/` may use `@/design-system/...`. Existing relative
imports remain valid and are not being mass-migrated for style.