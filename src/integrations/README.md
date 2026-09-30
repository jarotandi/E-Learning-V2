# src/integrations — External Engine & Service Boundary

Contract: `docs/aksa/02-target-architecture.md`, `docs/aksa/07-ai-integration-boundary.md`,
`docs/aksa/09-reference-stack.md`, `docs/aksa/05-data-authority.md`.

`src/integrations` is the **only** layer allowed to talk to external systems.
Every integration is an **adapter**: AKSA domain records never depend on a
vendor's internal identifiers as their sole identity.

## Reserved sub-boundaries

| Directory | Adapter responsibility | Batch |
|-----------|------------------------|-------|
| `supabase/` | Postgres/Auth/Storage/RLS access | B2 |
| `ai/` | AI Router — provider selection, policy, redaction, structured-output validation | B1 secret-path removal → B5 |
| `openmaic/` | OpenMAIC generation adapter + normalisation | B7 |
| `live/` | Live session adapter (Jitsi / BigBlueButton) | B10 |
| `office/` | Spreadsheet/doc/presentation engine adapter (Univer) | B9 |
| `notebook/` | Browser/offline code+data lab adapter (JupyterLite) | B9 |
| `spatial/` | 3D/BIM engine adapter | B9 |

The directory is intentionally empty in B1.1. **No adapter is implemented in
B1.1** — no Supabase, no OpenMAIC, no lab engines.

## Rules

1. **Adapter-only access.** Upper layers depend on adapter *interfaces*, never
   on vendor SDKs directly.
2. **No secrets in the client bundle.** Provider credentials must never be
   referenced by frontend code. AI calls must traverse a server/edge boundary.
   See `docs/aksa/b1/03-client-security-inventory.md` for the current P0 finding.
3. **Normalisation at the boundary.** Vendor payloads are mapped to AKSA
   domain/`core` shapes inside the adapter, not leaked upward.
4. **Failure isolation.** An engine failure must not corrupt AKSA domain state;
   adapters return typed error results.
5. **Deny-by-default.** Integrations must not assume network availability or
   provider availability, and must not silently degrade authority.
6. **Exit strategy required.** Before an adapter lands, record license, data
   ownership, offline behaviour, security boundary, and exit strategy per
   `docs/aksa/09-reference-stack.md`.

## Security direction (B1.1)

`vite.config.ts` currently injects `process.env.GEMINI_API_KEY` into the client
build via Vite `define`. This is classified **P0** in
`docs/aksa/b1/03-client-security-inventory.md`. B1.1 documents the risk and
defines the target path. Removal of the injection path is a B1.2 task and must
not be paired with feature migration, so that the change stays auditable.