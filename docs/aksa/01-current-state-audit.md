# Current-State Audit

## Application navigation

The current application uses a `View` union and `useState<View>` in `src/App.tsx` rather than a production router.

Observed views include:
`landing`, `programs`, `programDetail`, `mentorProfile`, `tryoutListing`, `dashboard`, `learning`, `exam`, `result`, `admin`, `contact`, `testimonials`, `schedule`, `profile`, `login`, `payment`, `finalRegistration`, `blogListing`, `blogPost`, `register`, and `guestRegistration`.

### Classification

| Existing area | B0 classification | AKSA direction |
|---|---|---|
| LandingPage | KEEP / REBRAND | Public AKSA website |
| StudentDashboard | KEEP / REFACTOR | Learner Home |
| LearningPage | KEEP / REFACTOR | Lesson Workspace |
| MentorProfilePage | KEEP / EVOLVE | Guru & Mentor |
| Tryout pages | KEEP / EVOLVE | Assessment Center |
| Program pages | KEEP / EVOLVE | Learning Paths / Programs |
| PaymentPage | KEEP / EVOLVE | Wallet & Payments |
| ProfilePage | KEEP / EVOLVE | Learner Profile |
| Blog | OPTIONAL / EVOLVE | Knowledge/Editorial |
| AdminDashboard | SPLIT | Academic, Studio, Validation, Operations |
| Demo admin toggle | REMOVE before production | Proper role-based routing |

## State and persistence

`src/App.tsx` currently uses browser `localStorage` for demo/business records including:
- programs,
- blog posts,
- website questions,
- leads.

Known keys include:
- `theprams_demo_programs`
- `theprams_demo_blog_posts`
- `theprams_demo_website_questions`
- `theprams_demo_leads`

Production target:
- server authority in Supabase/PostgreSQL,
- browser storage only for cache, preferences, drafts, and offline event queues.

## Legacy brand coupling

Legacy `The Prams` naming remains in:
- localStorage keys,
- constants/content,
- WhatsApp copy,
- sample account/email/content text.

Migration must be explicit and versioned. Do not run a blind global replacement.

## Monolith / maintainability findings

- `src/App.tsx` is already responsible for navigation, auth-like state, consultation, leads, blog state, program state, premium behavior, and many page mounts.
- `src/components/AdminDashboard.tsx` is approximately 412 KB and must be decomposed before adding AKSA Studio/Validation features.
- `src/constants.ts` is approximately 36 KB and contains significant demo/domain data.
- Current application mixes demo data, UI state, and business logic.

## Security finding — P0

`vite.config.ts` currently injects `GEMINI_API_KEY` using Vite `define`:

`process.env.GEMINI_API_KEY = env.GEMINI_API_KEY`

Any secret referenced by frontend code can become client-visible in a built bundle. B1/B2 must move AI calls behind a server/edge boundary and remove client-secret injection.

## Design system already worth preserving

Current tokens in `src/index.css`:
- primary teal: `#009688`
- deep emerald: `#064e3b`
- gold: `#ffc107`
- mint surfaces: `#f0fdfa`, `#ccfbf1`
- Inter typography
- rounded premium cards and Motion-based interaction

These align well with the AKSA visual direction and should be formalized rather than discarded.

## Build/CI note

No GitHub Actions workflow was observed at repository root during this audit. Fresh install/lint/build execution must therefore be performed locally/OpenCode before B0 is sealed.
