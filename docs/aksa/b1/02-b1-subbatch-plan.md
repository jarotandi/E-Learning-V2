# B1 Sub-Batch Plan

B1 — App Foundation is delivered incrementally. Each sub-batch is independently
verifiable, scoped, and revertable. This document fixes the sequence so B1 does
not drift into feature work.

Authority: `docs/aksa/10-batch-roadmap.md` (B1 definition),
`docs/aksa/03-module-boundaries.md`.

---

## B1 Scope (from roadmap)

- production router,
- app shells/layouts,
- role-aware navigation,
- design-system formalization,
- split large monolith components,
- remove direct client secret injection path.

Everything below is decomposition of what already exists. B1 introduces **no new
product capability**.

---

## Sub-Batch Sequence

### B1.1 — App Foundation Structure + Design Contract ✅ CURRENT

| Item | Status |
|---|---|
| Official design contract (`docs/aksa/design/`) | Done |
| Brand / design-system / a11y tokens contract | Done |
| Learner + Studio navigation data contract | Done |
| Source boundary skeleton (`app`, `design-system`, `core`, `features`, `studio`, `integrations`, `shared`) | Done |
| Legacy compatibility map | Done |
| Client security inventory | Done |
| Sub-batch plan (this file) | Done |
| Runtime behaviour change | **None** |
| New dependencies | **None** |

### B1.2 — Router + Shell Skeleton

| Item | Notes |
|---|---|
| Introduce production router | Lazy-loaded routes per `04-route-map.md` |
| `app/router/` wiring | Router instance, route table, lazy boundaries |
| `app/layouts/LearnerLayout.tsx` | Per `03-learner-shell.md` |
| `app/layouts/StudioLayout.tsx` | Per `04-studio-shell.md` |
| `app/layouts/PublicLayout.tsx` | Host legacy public pages |
| `app/layouts/AdminLayout.tsx` | Host legacy `AdminDashboard` |
| `app/providers/` | Session, Theme, Navigation context |
| `app/guards/` skeleton | Placeholder contract; real evaluation at B1.4 |
| Bind navigation contracts to router | `learnerNavigation`, `studioNavigation` |
| Preserve all 21 legacy `View`s | Redirect/alias table, no dead routes |
| **Remove `process.env.GEMINI_API_KEY` injection** | P0, see `03-client-security-inventory.md` |
| Fix `@/*` alias target | Currently resolves to repo root, not `src/` |

Router migration is the highest-risk item in B1. It must land with the legacy
redirect/alias table so no capability becomes unreachable.

### B1.3 — Monolith Decomposition

| Item | Notes |
|---|---|
| Split `Navbar` | → `app/layouts/PublicHeader.tsx` |
| Split `AdminDashboard.tsx` (408.8 KB) | → `app/layouts/AdminLayout.tsx` + admin sections |
| Decompose `StudentDashboard`, `LearningPage` | → `features/learn/*` |
| Decompose `LandingPage`, program pages | → `features/public/*` |
| Build design-system primitives | `Button`, `Card`, `Badge`, `Input`, `Tabs`, `Table` |
| Apply tokens to migrated components | Progressive; `index.css` stays authoritative meanwhile |

Admin decomposition targets per `03-module-boundaries.md`: platform dashboard,
users/roles, academic/curriculum, studio/content, validation/review,
programs/commerce, analytics, configuration.

### B1.4 — Role-Aware Navigation

| Item | Notes |
|---|---|
| Capability resolution | Reads from session claims |
| Guard evaluation | Enforce `requiredCapabilities` in navigation contracts |
| Collapsible section state | Persisted preference |
| Breadcrumbs | Learner + Studio |
| Mobile bottom nav (5 entries max) | Per `02-navigation-information-architecture.md` |

Depends on B2 for real identity. B1.4 ships the mechanism with a stub
capability source; enforcement becomes meaningful after B2.

---

## Sequencing Rules

1. **No sub-batch may delete a working capability** without a redirect and an
   entry in `01-legacy-compatibility-map.md`.
2. Router migration (B1.2) precedes component decomposition (B1.3) so that
   decomposition has stable route boundaries.
3. The P0 secret-injection removal ships in B1.2 as its own auditable change,
   paired with nothing else, so the security delta is reviewable in isolation.
4. `index.css` remains the styling authority until B1.3 primitives exist. Token
   adoption is progressive, never a big-bang rewrite.
5. Each sub-batch runs `npm run lint` + `npm run build` fresh and records
   evidence before commit.

---

## Architecture Conflicts Found in B1.1

Per instruction to report conflicts rather than silently rewriting architecture,
the following discrepancy was found between the B0 architecture contracts and
the actual repository. **No architecture document was rewritten in B1.1.**

### CONF-01 — `@/*` path alias resolves to the repository root, not `src/`

| Field | Value |
|---|---|
| Severity | P2 (build ergonomics, not runtime behaviour) |
| Evidence | `tsconfig.json` → `"paths": { "@/*": ["./*"] }`; `vite.config.ts` → `'@': path.resolve(__dirname, '.')` |
| Consequence | `@/design-system/tokens/brand` resolves to `<repo>/design-system/tokens/brand`, which does not exist. The correct alias form today is `@/src/design-system/tokens/brand`. |
| Existing code | `src/components/*` uses relative imports (`../types`), so the alias is effectively unused today. |
| Decision taken in B1.1 | New files under `src/` use **relative imports**, matching existing convention. The design docs' `@/design-system/...` example was corrected to a relative import. |
| Planned fix | B1.2 — realign both `tsconfig.json` and `vite.config.ts` to `src/*`, then migrate imports. Must be a dedicated change because it touches build config. |

Note: `docs/aksa/03-module-boundaries.md` and `design/01-design-system.md` present
`src/` as the intended root; the fix realigns the *build config* to the
documented architecture rather than the reverse.

### CONF-02 — B0 documents list a `gems`/skill-graph-adjacent surface not present in the route map

Not reproduced as a defect: `docs/aksa/04-route-map.md` and
`design/02-navigation-information-architecture.md` both place "My Path / Skill Map"
at `/app/path`, consistent with each other. Recorded here only to note that the
B0 audit did not enumerate `/app/library`, `/app/partner-practice`,
`/app/community`, `/app/rewards`, or `/app/help`, which the B1 approved IA
adds. Resolution: the B1 IA is additive to the route map; B1.2's route table
must include these paths and B0's `04-route-map.md` should be amended at B1.2
seal to reflect them.

### Non-conflict recorded for visibility

- `docs/aksa/01-current-state-audit.md` estimates `AdminDashboard.tsx` at
  ~412 KB; measured size is 408.8 KB (418,614 bytes). Within estimation
  tolerance — not a defect, but the audit figure is now stale.
- `docs/aksa/01-current-state-audit.md` notes "No GitHub Actions workflow was
  observed". Re-verified in B1.1: no `.github/workflows` directory exists, so
  lint/build evidence remains locally produced.

---

## B1.1 Non-Goals (Explicitly Deferred)

| Deferred | To |
|---|---|
| Production router | B1.2 |
| Shell/layout components | B1.2 |
| Guard evaluation | B1.4 |
| Design-system primitives | B1.3 |
| AdminDashboard split | B1.3 |
| Legacy brand replacement (`The Prams` → AKSA) | Per-domain, B2+ |
| localStorage → server authority | B2 |
| Dark mode | B13 |
| Supabase | B2 |
| OpenMAIC | B7 |
| Creator AI behaviour | B5 |
| Validation logic | B6 |

---

## B1 Seal Criteria

B1 is sealed when:

- all four sub-batches are merged to `aksa/b1-app-foundation`,
- every legacy `View` in `01-legacy-compatibility-map.md` remains reachable,
- `npm run lint` and `npm run build` pass fresh,
- the P0 client-secret finding in `03-client-security-inventory.md` is closed,
- `AdminDashboard.tsx` is decomposed to the eight target sections,
- a design-system audit confirms migrated components match
  `docs/aksa/design/`,
- then `AKSA-B1-SEALED` is created.

B1.1 alone is **not** sealable — it is a foundation sub-batch by design.