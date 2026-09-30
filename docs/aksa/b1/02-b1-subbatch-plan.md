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

### B1.2 — Security + Build Foundation Hardening ✅ CURRENT

Security and build foundation only. **No router, no shells, no feature work.**

| Item | Status |
|---|---|
| SEC-P0-01 — remove `process.env.GEMINI_API_KEY` Vite `define` | **Closed** |
| SEC-P0-01 — drop now-unused `loadEnv` | **Closed** |
| SEC-P0-02 — remove unused `@google/genai` dependency | **Closed** |
| SEC-P2-01 — README no longer instructs client AI secret setup | **Closed** |
| SEC-P2-02 — remove legacy `GEMINI_API_KEY` placeholder from `.env.example` | **Closed** |
| CONF-01 — realign `@/*` alias to `src/` in tsconfig + Vite | **Closed** |
| AR-02 — correct `#009688` accessibility guidance; add `#00796b` | **Closed** |
| Router / app shells | **Deferred to B1.3** |
| `AdminDashboard` decomposition | **Deferred to B1.4** |
| Runtime product behaviour change | **None** |

### B1.3 — Production Router + AKSA App Shell

| Item | Notes |
|---|---|
| Introduce production router | Lazy-loaded routes per `04-route-map.md` |
| `app/router/` wiring | Router instance, route table, lazy boundaries |
| `app/layouts/LearnerLayout.tsx` | Per `03-learner-shell.md` |
| `app/layouts/StudioLayout.tsx` | Per `04-studio-shell.md` |
| `app/layouts/PublicLayout.tsx` | Host legacy public pages |
| `app/layouts/AdminLayout.tsx` | Host legacy `AdminDashboard` |
| `app/providers/` | Session, Theme, Navigation context |
| `app/guards/` skeleton | Placeholder contract; enforcement needs B2 |
| Bind navigation contracts to router | `learnerNavigation`, `studioNavigation` |
| Preserve all 21 legacy `View`s | Redirect/alias table, no dead routes |
| Real `@/` import adoption | Alias now resolves to `src/` (CONF-01) |

Router migration is the highest-risk item in B1. It must land with the legacy
redirect/alias table so no capability becomes unreachable.

### B1.4 — Design System + Monolith Decomposition

| Item | Notes |
|---|---|
| Split `Navbar` | → `app/layouts/PublicHeader.tsx` |
| Split `AdminDashboard.tsx` (408.8 KB) | → `app/layouts/AdminLayout.tsx` + admin sections |
| Decompose `StudentDashboard`, `LearningPage` | → `features/learn/*` |
| Decompose `LandingPage`, program pages | → `features/public/*` |
| Build design-system primitives | `Button`, `Card`, `Badge`, `Input`, `Tabs`, `Table` |
| Apply tokens to migrated components | Progressive; `index.css` stays authoritative meanwhile |
| Enforce `requiredCapabilities` in navigation | Mechanism only — **real enforcement requires B2 identity** |
| Collapsible section state, breadcrumbs, mobile bottom nav | Role-aware pieces need B2 for real capability data |

Admin decomposition targets per `03-module-boundaries.md`: platform dashboard,
users/roles, academic/curriculum, studio/content, validation/review,
programs/commerce, analytics, configuration.

### B1.5 — Regression + Visual Acceptance

| Item | Notes |
|---|---|
| Full legacy capability sweep | Every `View` in `01-legacy-compatibility-map.md` reachable |
| Fresh `npm ci` / `lint` / `build` | Evidence recorded |
| **Visual acceptance vs approved generated AKSA designs** | Side-by-side review of every migrated surface against `docs/aksa/design/` |
| Contrast audit | Automated + manual pass against `06-responsive-accessibility.md` |
| Keyboard navigation audit | Per migrated surface |
| Responsive audit | Per migrated surface at all five breakpoints |
| Bundle regression review | Chunk-size delta vs B1.1/B1.2 baseline |
| Security re-verification | Credential greps + `dist/` scan must stay clean |
| Confirmation that authorization is NOT yet enforced | B2 dependency stated explicitly |

B1.5 must explicitly compare implementation against the approved generated AKSA
designs. Divergence is a defect requiring revision, not a style preference.

---

## Sequencing Rules

1. **No sub-batch may delete a working capability** without a redirect and an
   entry in `01-legacy-compatibility-map.md`.
2. Security closure (B1.2) precedes router migration (B1.3), which precedes
   component decomposition (B1.4). Decomposition needs stable route boundaries,
   and router work should not be built on an open credential path.
3. The P0 secret-injection removal shipped in **its own commit**
   (`a01a872 fix(security): remove client AI credential exposure path`), paired
   with no alias or design change, so the security delta is reviewable in
   isolation. Alias and accessibility corrections landed separately.
4. `index.css` remains the styling authority until B1.4 primitives exist. Token
   adoption is progressive, never a big-bang rewrite.
5. Each sub-batch runs `npm run lint` + `npm run build` fresh and records
   evidence before commit.
6. **B1 contains no product capability.** B1.5 proves correctness and visual
   acceptance; it does not add features.

---

## Architecture Conflicts Found in B1.1

Per instruction to report conflicts rather than silently rewriting architecture,
the following discrepancy was found between the B0 architecture contracts and
the actual repository. **No architecture document was rewritten in B1.1.**

### CONF-01 — `@/*` path alias resolves to the repository root, not `src/`

| Field | Value |
|---|---|
| Severity | P2 (build ergonomics, not runtime behaviour) |
| Evidence (before) | `tsconfig.json` → `"paths": { "@/*": ["./*"] }`; `vite.config.ts` → `'@': path.resolve(__dirname, '.')` |
| Consequence | `@/design-system/tokens/brand` resolved to `<repo>/design-system/tokens/brand`, which does not exist. The only working alias form was `@/src/design-system/...`. |
| Existing code | `src/components/*` uses relative imports (`../types`), and `git grep "from '@/" -- src` returned **zero** matches, so the alias was entirely unused. |
| Decision in B1.1 | New files used **relative imports**, matching existing convention; the design doc example was temporarily shown as relative. |
| **Resolution in B1.2** | **CLOSED.** Both sides realigned to `src/`: `tsconfig.json` → `"@/*": ["./src/*"]`; `vite.config.ts` → `path.resolve(__dirname, 'src')`. Verified by deliberate regression test: reverting `tsconfig.json` to `./*` makes `npm run lint` fail with `TS2307`, proving the guard works. |
| Guard | `src/app/aliasContractProof.ts` — compile-time proof; contains no runtime behaviour. |
| Import migration | Not performed. Existing relative imports remain valid and were not mass-migrated for style. |

Note: `docs/aksa/03-module-boundaries.md` and `design/01-design-system.md` present
`src/` as the intended root; the fix realigned the *build config* to the
documented architecture rather than the reverse.

### CONF-02 — B0 documents list a `gems`/skill-graph-adjacent surface not present in the route map

Not reproduced as a defect: `docs/aksa/04-route-map.md` and
`design/02-navigation-information-architecture.md` both place "My Path / Skill Map"
at `/app/path`, consistent with each other. Recorded here only to note that the
B0 audit did not enumerate `/app/library`, `/app/partner-practice`,
`/app/community`, `/app/rewards`, or `/app/help`, which the B1 approved IA
adds. Resolution: the B1 IA is additive to the route map; **B1.3's** route table
must include these paths and B0's `04-route-map.md` should be amended at B1.3
to reflect them.

### Non-conflict recorded for visibility

- `docs/aksa/01-current-state-audit.md` estimates `AdminDashboard.tsx` at
  ~412 KB; measured size is 408.8 KB (418,614 bytes). Within estimation
  tolerance — not a defect, but the audit figure is now stale.
- `docs/aksa/01-current-state-audit.md` notes "No GitHub Actions workflow was
  observed". Re-verified in B1.1: no `.github/workflows` directory exists, so
  lint/build evidence remains locally produced.

---

## Deferred Across B1

| Deferred | To |
|---|---|
| Production router | B1.3 |
| Shell/layout components | B1.3 |
| `app/router/` wiring, legacy redirect/alias table | B1.3 |
| Design-system primitives | B1.4 |
| AdminDashboard split | B1.4 |
| Navbar split, feature decomposition | B1.4 |
| Guard **enforcement** (mechanism in B1.4, real authz needs B2) | B2 |
| Legacy brand replacement (`The Prams` → AKSA) | Per-domain, B2+ |
| localStorage → server authority | B2 |
| Admin authentication | B2 |
| AI server/edge runtime + AI Router | B5 |
| Dark mode | B13 |
| Supabase | B2 |
| OpenMAIC | B7 |
| Creator AI behaviour | B5 |
| Validation logic | B6 |
| CI workflow | B13 |

---

## B1 Seal Criteria

B1 is sealed when:

- all five sub-batches (B1.1 → B1.5) are on `aksa/b1-app-foundation`,
- every legacy `View` in `01-legacy-compatibility-map.md` remains reachable,
- `npm ci`, `npm run lint`, `npm run build` pass fresh,
- SEC-P0-01 and SEC-P0-02 in `03-client-security-inventory.md` are closed with
  evidence and have stayed closed,
- `AdminDashboard.tsx` is decomposed to the eight target sections (B1.4),
- B1.5's visual acceptance confirms migrated surfaces match the approved
  generated AKSA designs in `docs/aksa/design/`,
- B1.5 records explicitly that real authorization enforcement remains a B2
  dependency rather than a B1 deliverable,
- then `AKSA-B1-SEALED` is created.

B1.1 and B1.2 alone are **not** sealable — they are foundation sub-batches by
design.