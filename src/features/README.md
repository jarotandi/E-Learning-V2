# src/features — Learner Feature Boundary

Contract: `docs/aksa/03-module-boundaries.md`, `docs/aksa/04-route-map.md`,
`docs/aksa/design/02-navigation-information-architecture.md`.

`src/features` holds **vertical learner capabilities**: each folder owns one
user-facing capability, including its UI, hooks, and orchestration for that
capability.

## Reserved feature folders

| Folder | Capability | B0 nav group | Batch |
|--------|-----------|--------------|-------|
| `learn/` | Lesson workspace, enrolled classes | LEARN | B1–B3 |
| `skill-map/` | My Path / Skill Map | LEARN | B3 |
| `labs/` | Skills Labs (spreadsheet, code/data, 3D/BIM) | LEARN | B9 |
| `projects/` | Projects, evidence submission | PRACTICE | B11 |
| `assessment/` | Assessment Center, tryout/exam | PRACTICE | B3 |
| `ai-tutor/` | AI Tutor | SUPPORT | B10 |
| `mentors/` | Guru & Mentor, booking | SUPPORT | B10 |
| `live/` | AKSA Live (scheduled/instant) | SUPPORT | B10 |
| `portfolio/` | Portfolio | GROWTH | B11 |
| `passport/` | Skills Passport, Open Badges | GROWTH | B11 |
| `career/` | Career guidance | GROWTH | B11 |
| `community/` | Community, rewards | COMMUNITY | B12+ |

The folder is intentionally empty in B1.1. B1.1 establishes the boundary only;
existing legacy pages under `src/components/` continue to serve these
capabilities until each is migrated. See
`docs/aksa/b1/01-legacy-compatibility-map.md`.

## Rules

1. **Feature-to-feature imports are forbidden.** Features communicate through
   `core` domain types or explicit contracts, never by importing each other.
2. **No direct provider calls.** Features must not call OpenAI/Gemini/Anthropic
   or any model provider directly — AI access goes through the AI Router
   (`src/integrations/ai`), per `docs/aksa/07-ai-integration-boundary.md`.
3. **No direct database calls in presentation code.** Data access is delegated
   to a service/repository layer that maps to `core` + `src/integrations`.
4. **Validation policy is not a feature concern.** Publishing hard gates belong
   to the Validation Center (B6), not to feature components.
5. Features may import `design-system`, `shared`, `core`, and `integrations`
   interfaces. They must not import `app` or `studio`.

## Structure convention (when a feature lands)

```
features/<capability>/
├── <Capability>Page.tsx      # route-level entry
├── components/                # capability-local UI
├── hooks/                     # capability-local hooks
├── services/                  # orchestration (calls core/integrations)
└── types.ts                   # capability-local view models
```