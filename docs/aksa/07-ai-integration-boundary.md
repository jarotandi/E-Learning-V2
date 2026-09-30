# AI Integration Boundary

## Immediate security issue

**RESOLVED in B1.2.** The Vite configuration previously exposed a path for
`GEMINI_API_KEY` to be defined in frontend build code via `define`. That
injection has been **removed** along with the now-unused `loadEnv` call and the
unused `@google/genai` dependency, so AKSA no longer ships — nor has a path to
ship — provider credentials to the browser.

See `docs/aksa/b1/03-client-security-inventory.md` (SEC-P0-01, SEC-P0-02) for
closure evidence. The target boundary below is unchanged and is **not yet
implemented**: there is still no AI server/edge runtime (SEC-P1-01, tracked for
B5). Until that exists, `src/integrations/ai/` must remain empty.

## Target request path

```text
React Client
   -> AKSA Server / Edge Function
      -> AI Router
         -> OpenAI / Gemini / Anthropic / OpenRouter / local models
```

## AI Router responsibilities

- provider selection,
- model policy,
- cost/availability policy,
- per-task routing,
- timeout/retry,
- redaction and policy checks,
- structured-output validation,
- tracing,
- usage accounting.

## Creator AI contract

Creator AI is a copilot inside AKSA Studio.

It may:
- generate lesson drafts,
- generate quizzes,
- propose diagrams/images,
- generate narration scripts,
- propose simulations/interactions,
- adapt content by age/language,
- map claims to sources.

It may not:
- grant itself publish authority,
- bypass validation,
- write arbitrary untrusted runtime code directly into production,
- treat generated citations as verified references.

## Content Factory contract

Content Factory performs batch generation but writes only versioned **draft** content.

## OpenMAIC boundary

```text
AKSA Generation Request
 -> OpenMAIC Adapter
 -> OpenMAIC engine
 -> Normalize
 -> AKSA Content Schema
 -> Validation Center
```

OpenMAIC output is never automatically trusted/published.
