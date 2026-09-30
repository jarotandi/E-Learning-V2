# src/studio — AKSA Studio Boundary

Contract: `docs/aksa/design/04-studio-shell.md`, `docs/aksa/design/05-validation-ui.md`,
`docs/aksa/07-ai-integration-boundary.md`, `docs/aksa/08-validation-contract.md`.

`src/studio` is the **creator/authoring surface**. It is distinct from learner
features and from platform administration.

## Reserved sub-boundaries

| Directory | Responsibility | Batch |
|-----------|----------------|-------|
| `editor/` | Three-panel structured learning-object editor | B4 |
| `templates/` | Template library + template-based creation | B4 |
| `media/` | Media library, source/citation manager | B4 |
| `content-factory/` | Batch generation queue (writes versioned drafts only) | B5 |
| `validation/` | Validation Center dashboard, run results, risk classification | B6 |
| `review/` | Review Queue, Review Material detail, human decisions | B6 |

The directory is intentionally empty in B1.1. B1.1 records the boundary and the
navigation contract; implementation begins at B4.

## Rules

1. **Creator AI lives inside Studio.** It is reachable from the Editor right
   panel and from Content Factory. It must never be promoted to a standalone
   primary navigation item (see `src/app/navigation/studioNavigation.ts`).
2. **Generation always produces drafts.** Content Factory writes versioned
   **draft** content only — never approved, never published.
3. **No self-granted publish authority.** AI output must pass the publish hard
   gate in `docs/aksa/08-validation-contract.md`.
4. **Validation is not bypassable from the UI.** Decision actions map to
   permissions (`review.approve`, `review.request_revision`, `publish.execute`)
   and to auditable review records.
5. **No vendor internals.** OpenMAIC and other engines are reached only through
   adapter interfaces in `src/integrations/openmaic`.
6. **Studio must not import `app`.** It may import `design-system`, `shared`,
   `core`, and `integrations` interfaces.

## Admin relationship

The legacy `src/components/AdminDashboard.tsx` (~412 KB) is *not* Studio. Its
future decomposition target is `src/app/layouts/AdminLayout.tsx` plus admin
features (B1.3), while governance capabilities (validation, review) converge
with Studio in B6. No admin capability is deleted in B1.1.