# AI Integration Boundary

## Immediate security issue

Current Vite configuration exposes a path for `GEMINI_API_KEY` to be defined in frontend build code. Production AKSA must not ship provider credentials to the browser.

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
