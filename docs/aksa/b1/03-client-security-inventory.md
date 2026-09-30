# B1.1 — Client AI / Security Inventory

Purpose: evidence-based classification of every client-side credential exposure,
AI-provider call path, and secret-handling risk found in the repository as of the
B1.1 baseline.

Authority: `docs/aksa/01-current-state-audit.md` §"Security finding — P0",
`docs/aksa/07-ai-integration-boundary.md`.

**B1.1 is inventory-only. No large migration is performed here.** Removal of the
injection path is scheduled for B1.2 as a dedicated, auditable change.

---

## Method

All findings come from repository-local inspection against the B1.1 baseline
(`AKSA-B0-SEALED`, `0911d8ccd1134273c612dc18f7e9c82043176614`).

```text
git grep -n "GEMINI_API_KEY"
git grep -nE "process\.env" -- src index.html vite.config.ts
git grep -n "@google/genai" -- src
git grep -nEi "apiKey|generativeai|google\.generativeai|openai|anthropic|openrouter|Gemini" -- src
git grep -nE "fetch\(|XMLHttpRequest|WebSocket|EventSource|axios" -- src
```

Environment inventory: `Get-ChildItem -Force -Recurse -Filter ".env*"`.
Built-output verification: pattern scan of `dist/assets/*.js`.

---

## Findings

### SEC-P0-01 — Client build injects `GEMINI_API_KEY`

**Severity: P0 — client secret exposure path**

| Field | Value |
|---|---|
| Location | `vite.config.ts` line 11 |
| Code | `'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)` |
| Mechanism | Vite `define` performs a build-time literal substitution of the token `process.env.GEMINI_API_KEY` in transformed source |
| Impact | Any frontend expression reading `process.env.GEMINI_API_KEY` is replaced with the literal secret value in the emitted client bundle, readable by any visitor |
| Target | All AI calls traverse a server/edge boundary → AI Router, per `07-ai-integration-boundary.md` |

**Verified current exploitability: latent, not actively exploited.** Three
independent checks confirm no secret is presently shipped:

1. **No consumer in `src/`.** `git grep -nE "process\.env" -- src` returns zero
   matches. `process.env` appears only in `vite.config.ts` (the `define` itself
   and `process.env.DISABLE_HMR` for HMR control). Nothing in application code
   reads the key.
2. **No AI import in `src/`.** `git grep -n "@google/genai" -- src` returns zero
   matches, and a broader case-insensitive sweep for `apiKey`,
   `generativeai`, `google.generativeai`, `openai`, `anthropic`, `openrouter`,
   and `Gemini` across `src/` also returns **zero matches**.
3. **No secret material in the built bundle.** A pattern scan of
   `dist/assets/*.js` for `GEMINI_API_KEY` and `apiKey` returns no matches.

**Why this is still P0:** the injection is a live landmine. The dependency
`@google/genai` is declared in `package.json` and is present in
`node_modules`, so the first developer who writes
`new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })` in a component ships a
live credential to every browser — with a passing build and no warning.

**Remediation (B1.2, dedicated change):**

1. Delete the `define` entry from `vite.config.ts`.
2. Remove `GEMINI_API_KEY` from `.env.example`'s client-facing instructions, or
   relocate it to a server-only section.
3. Confirm no source file regresses by re-running the two greps.
4. Verify a fresh `dist/` contains no key pattern.
5. Do **not** pair this with feature migration — keep the security delta
   reviewable in isolation.

Note: `docs/aksa/07-ai-integration-boundary.md` describes this as "a path for
`GEMINI_API_KEY` to be defined in frontend build code". That wording is accurate
and this inventory confirms it: the path exists, no key is currently committed,
and no code currently consumes it.

### SEC-P0-02 — `@google/genai` declared but unused

**Severity: P0 (dead dependency on a client-secret-capable SDK)**

| Field | Value |
|---|---|
| Location | `package.json` line 14 — `"@google/genai": "^1.29.0"` |
| Usage in `src/` | **Zero imports** (verified by grep) |
| Impact | Ships a provider SDK into the client dependency graph with no consumer, while the build is configured to expose that provider's credential |

This is the coupling that makes SEC-P0-01 dangerous: the SDK is available and
the key is wired, but the code is not yet written. Leaving both in place means
the first AI feature added is one careless `process.env` read away from a
production credential leak.

**Remediation:** after SEC-P0-01 is closed in B1.2, remove the unused
dependency (or relocate it to a server/edge workspace at B5 when the AI Router
lands). Removal must be verified with `npm run lint` + `npm run build`.

### SEC-P1-01 — No server/edge boundary exists for AI calls

**Severity: P1 — architecture issue**

There is no API route, edge function, or backend service in the repository. The
target path in `07-ai-integration-boundary.md` is:

```text
React Client -> AKSA Server / Edge Function -> AI Router -> Provider
```

Only the first hop exists conceptually. The AI Router does not exist at all.
`src/integrations/ai/` is an empty reserved boundary.

**Consequence:** until a server boundary exists, there is nowhere *safe* to place
AI calls. This is why SEC-P0-01 must be closed by **removal**, not by redirecting
calls — there is no server-side target yet.

**Planned:** B5 introduces `src/integrations/ai/` behind an edge/server boundary.

### SEC-P1-02 — `localStorage` is the de-facto authority for identity and payment state

**Severity: P1 — architecture issue**

`src/App.tsx` and `src/components/AdminDashboard.tsx` read and write
`theprams_demo_*` keys (full inventory in `01-legacy-compatibility-map.md`).
The most serious:

| Key | Risk |
|---|---|
| `theprams_demo_users` | Client-editable user/role records — trivially tampered |
| `theprams_demo_transactions`, `theprams_demo_payment_proofs`, `theprams_demo_finance_*` | Client-editable financial state |
| `theprams_demo_audit_events` | Client-writable "audit" log — no audit integrity |

Per `05-data-authority.md`, these are **not allowed as sole production
authority** for users, entitlements, payment state, review approval, published
content state, validation status, or credential issuance.

**Not fixed in B1.1** — intentional. Migration requires server authority (B2).
B1 must preserve these keys unchanged.

### SEC-P1-03 — Admin access has no real gate

**Severity: P1 — architecture issue**

`App.tsx` renders `AdminDashboard` on `view === 'admin'` with a simple
view-toggle and no authentication or capability check. Combined with
SEC-P1-02, an admin console whose user list and finance data live in
`localStorage` is reachable without identity.

**Planned:** B2 identity + RLS; B1.4 introduces the guard mechanism against the
`requiredCapabilities` vocabulary.

### SEC-P2-01 — `README.md` instructs users to place a real key in `.env.local`

**Severity: P2 — cleanup**

`README.md` states: *"Set the `GEMINI_API_KEY` in [.env.local](.env.local) to
your Gemini API key"*. Combined with SEC-P0-01, following this instruction
produces exactly the leak the architecture forbids.

Remediation: update README alongside SEC-P0-01 in B1.2.

### SEC-P2-02 — Placeholder value in `.env.example` looks key-like

**Severity: P2 — cleanup**

`.env.example` contains `GEMINI_API_KEY="MY_GEMINI_API_KEY"`. It is a harmless
placeholder and **is not a real credential** — `.env.example` is the only env
file in the repository (`.gitignore` line 7 ignores `.env*`, line 8 un-ignores
`.env.example`). Risk is confusion only: the string resembles a real key.

Verified: no `.env`, `.env.local`, or `.env.production` exists on disk or in git.

### SEC-P2-03 — No CI workflow

**Severity: P2 — cleanup**

No `.github/workflows` directory exists (re-verified in B1.1; consistent with
`docs/aksa/01-current-state-audit.md`). Lint/build evidence is produced locally
and manually. No automated gate would catch a reintroduced secret injection.

**Planned:** B13 production hardening, or an earlier dedicated hardening
sub-batch once the router migration settles.

---

## Classification Summary

| ID | Severity | Summary | Status | Batch |
|---|---|---|---|---|
| SEC-P0-01 | **P0** | Vite `define` injects `GEMINI_API_KEY` into client build | ✅ **CLOSED in B1.2** | — |
| SEC-P0-02 | **P0** | `@google/genai` declared but unused | ✅ **CLOSED in B1.2** | — |
| SEC-P1-01 | P1 | No server/edge boundary for AI calls | ⬜ **Open** | B5 |
| SEC-P1-02 | P1 | `localStorage` is authority for identity/payment/audit | ⬜ **Open** | B2 |
| SEC-P1-03 | P1 | Admin view has no authentication gate | ⬜ **Open** | B2 |
| SEC-P2-01 | P2 | README instructs real key into `.env.local` | ✅ **CLOSED in B1.2** | — |
| SEC-P2-02 | P2 | Placeholder key-like value in `.env.example` | ✅ **CLOSED in B1.2** | — |
| SEC-P2-03 | P2 | No CI workflow | ⬜ **Open** | B13 |

**B1.2 did not solve, and does not claim to have solved, any B2 or B5 issue.**
SEC-P1-01, SEC-P1-02, SEC-P1-03, and SEC-P2-03 remain open.

---

## B1.2 Remediation Evidence

Closure commit: **`a01a872` — `fix(security): remove client AI credential exposure path`**
(committed in isolation, paired with no alias, design, or feature change).

### SEC-P0-01 — CLOSED

`vite.config.ts` before:

```typescript
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    ...
```

`vite.config.ts` after:

```typescript
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    ...
```

Removed: the entire `define` block, and `loadEnv` (which existed only to feed
that block). Preserved unchanged: the React plugin, the Tailwind plugin, the
`server.hmr` behaviour, and all other build behaviour.

Verification after the change:

```text
git grep -nE "process\.env\.(GEMINI_API_KEY|GOOGLE_API_KEY)" -- src vite.config.ts
  -> no live code matches (documentation references only)
git grep -n "GEMINI_API_KEY" -- . ":!docs"
  -> .env.example (prohibition note only), src/integrations/README.md (closure note)
```

### SEC-P0-02 — CLOSED

```text
npm uninstall @google/genai
```

- `package.json`: `"@google/genai": "^1.29.0"` removed from `dependencies`.
- `package-lock.json`: updated by npm tooling; zero remaining `@google/genai`
  entries (verified with `Select-String`). The lockfile was not hand-edited.
- `npm audit` vulnerability count fell from **12 → 9** (6 high → 4 high,
  4 moderate → 3 moderate) as a side effect.
- No application import existed, so removal is behaviour-neutral.

### SEC-P2-01 — CLOSED

`README.md` no longer instructs developers to create a client `.env.local` with
a real key. The step was removed and replaced with an architecture-safe note:

```markdown
## AI Integration

AI provider integration is not active in the client.
Future AI calls must use the AKSA server/edge AI Router boundary.
```

No fake or non-existent server was documented.

> Implementation note: `README.md` has mixed encoding (a UTF-8 section followed
> by a pre-existing UTF-16LE fragment), which is why Git classifies it as binary.
> The edit was performed byte-precisely to leave the UTF-16 fragment untouched.

### SEC-P2-02 — CLOSED / REMOVED

`GEMINI_API_KEY="MY_GEMINI_API_KEY"` was deleted from `.env.example`. No
replacement client-visible AI secret variable was added. Instead, `.env.example`
now carries an explicit prohibition notice so the variable is not reintroduced:

```text
# SECURITY: Do NOT add AI provider keys (GEMINI_API_KEY, GOOGLE_API_KEY, or any
# other provider secret) to this file or to any client-visible .env file.
```

`APP_URL` was retained, since it is a URL, not a credential.

### Fresh gates after remediation

| Gate | Result |
|---|---|
| `npm ci` | PASS |
| `npm run lint` | PASS (exit 0) |
| `npm run build` | PASS (exit 0, 2904 modules) |
| `dist/assets/*.js` scanned for `GEMINI_API_KEY`, `MY_GEMINI_API_KEY`, `AIza`, `googleapis`, `GOOGLE_API_KEY`, `apiKey` | **Zero matches** |
| `dist` scanned for `GoogleGenAI` | **Zero matches** |

Bundle output is byte-for-byte unchanged from the B1.1 baseline
(`index-ClsckA6U.js`, 1,474,396 bytes), confirming no runtime behaviour change.
The three case-insensitive `genai` substring hits in `dist` were verified to be
Indonesian prose ("mendalam mengenai", "detail mengenai", "soal mengenai"), not
SDK code.

---

## Verified Absent

Re-verified fresh at the start of B1.2, before any edit. Recorded explicitly so
absence is not re-litigated every sub-batch.

| Checked | Result |
|---|---|
| `process.env` reads in `src/` | None |
| `@google/genai` imports in `src/` | None |
| `GoogleGenAI` constructor usage | None |
| Any AI provider SDK import in `src/` | None |
| Any `apiKey` identifier in `src/` | None |
| `Gemini` / `generativeai` / `openai` / `anthropic` / `openrouter` in `src/` code | None (prose only in boundary READMEs) |
| `fetch(` / `XMLHttpRequest` / `WebSocket` / `EventSource` / `axios` in `src/` | None |
| Real credentials committed | None |
| `.env` / `.env.local` / `.env.production` | None (only `.env.example`) |
| Secret patterns in built `dist/assets/*.js` | None |
| GitHub Actions workflows | None |
| `@/` imports in `src/` before CONF-01 fix | None (alias was unused, so realignment was safe) |

**The B1.1 inventory was accurate.** No contradiction was found between the
recorded findings and repository state, so no STOP condition was triggered.

---

## B1.1 Security Posture (Historical)

Recorded as it stood at B1.1, before remediation. Superseded by the B1.2
evidence above; retained because it documents the original risk.

- **No new exposure introduced by B1.1.** New files under `src/` are contract
  definitions with no network access, no environment reads, and no provider
  imports. Verified by grep across the B1.1 diff.
- **No credential was being shipped.** SEC-P0-01 was a live path, not an
  active leak.
- **SEC-P0-01 and SEC-P0-02 were open by design** and were the first security
  action of B1.2.

---

## B1.2 Security Posture (Current)

- **Both P0 findings are closed** with fresh evidence, in an isolated commit.
- **No new exposure introduced.** The B1.2 diff adds one compile-time-only
  TypeScript proof file (`src/app/aliasContractProof.ts`) containing no runtime
  behaviour, no network access, and no environment reads. Verified by scanning
  every changed `.ts`/`.tsx` file for `process.env`, `apiKey`, `GEMINI`,
  `genai`, `fetch(`, and `localStorage` — **zero matches**.
- **The injection path no longer exists.** There is no `define` block in
  `vite.config.ts`, so no build-time secret substitution can occur. Removing the
  capability — rather than merely removing the unused reference — means a future
  careless `process.env` read fails loudly instead of silently shipping a key.
- **`@google/genai` is no longer installed**, so the SDK is not reachable even
  accidentally.
- **Still open, and not addressed by B1.2:** SEC-P1-01 (no AI server/edge
  runtime — B5), SEC-P1-02 (`localStorage` authority — B2), SEC-P1-03 (ungated
  admin — B2), SEC-P2-03 (no CI — B13).

---

## Standing Regression Gates (run at every future sub-batch)

```text
git grep -n "GEMINI_API_KEY" -- . ":!docs"        # expect: prohibition notes only
git grep -n "@google/genai" -- src package.json   # expect: no matches
git grep -nE "process\.env\.(GEMINI_API_KEY|GOOGLE_API_KEY)" -- src vite.config.ts
                                                     # expect: no matches
# after npm run build:
# scan dist/assets/*.js for GEMINI_API_KEY | MY_GEMINI_API_KEY | AIza | apiKey
```

Any non-empty result from these gates is a regression and must block the
sub-batch.