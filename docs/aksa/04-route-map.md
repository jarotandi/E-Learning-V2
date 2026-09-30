# Target Route Map

Authority for every URL in the AKSA application.

**Status: implemented in B1.3.** Each route below is classified, and the
classification is enforced by `scripts/verify-routes.mjs`.

## Classification

| Class | Meaning |
|---|---|
| **canonical** | The official AKSA URL for a surface. Exactly one per capability. Stable and shareable. Renders a real, working capability. |
| **compatibility** | An alternate URL retained so an existing legacy flow or an old shared link keeps working. Redirects to, or is served by, a canonical route. |
| **planned** | Reserved by the approved B1 information architecture. Renders a neutral foundation placeholder. **Not** a shipped capability. |

## Guard

Routes marked **guarded** redirect to `/login` when there is no in-memory user.
`payment` and `finalRegistration` are deliberately **not** guarded: neither was in
the pre-router `protectedViews` list, and B1.3 does not change who can reach them.

**A guard here is routing, not authorization.** See
`app/guards/RequireLegacyUser.tsx` and the open finding SEC-P1-03 in
`b1/03-client-security-inventory.md`.

---

## Public

| Route | Class | Guard | Renders |
|---|---|---|---|
| `/` | canonical | — | Landing |
| `/programs` | canonical | — | Program listing |
| `/programs/:programId` | canonical | — | Program detail |
| `/mentors/:mentorId` | canonical | — | Mentor profile |
| `/blog` | canonical | — | Blog listing |
| `/blog/:blogId` | canonical | — | Blog post |
| `/contact` | canonical | — | Contact |
| `/testimonials` | canonical | — | Testimonials |
| `/login` | canonical | — | Login |
| `/register` | canonical | — | Registration |
| `/register/guest` | canonical | — | Guest registration |
| `/register/final` | canonical | — | Final registration |
| `#blog-<blogId>` (on any path) | compatibility | — | Redirects to `/blog/<blogId>` |

Notes:

- `:blogId` is the id of a post in `BLOG_POSTS`. The B0 draft wrote this parameter
  as `:slug`; B1.3 uses `:blogId` because the legacy data is keyed by id and has no
  slug field. The parameter spelling is a naming choice, not a behaviour change.
- `/testimonials`, `/register/guest` and `/register/final` were reachable only
  through in-app `setView` calls before B1.3. B1.3 makes them addressable.
  See CONF-02 in `b1/02-b1-subbatch-plan.md`.

## Learner

| Route | Class | Guard | Shell | Renders |
|---|---|---|---|---|
| `/app` | canonical | guarded | none (self-chrome) | Student dashboard |
| `/app/learn` | canonical | guarded | none (self-chrome) | Learning workspace |
| `/app/assessment` | canonical | guarded | `LearnerLayout` | Tryout listing |
| `/app/assessment/:tryoutId/exam` | canonical | guarded | none | Tryout exam |
| `/app/assessment/:tryoutId/result` | canonical | guarded | none | Tryout result |
| `/app/calendar` | canonical | guarded | `LearnerLayout` | Class schedule |
| `/app/profile` | canonical | guarded | `LearnerLayout` | Profile |
| `/app/wallet` | canonical | **unguarded** | none | Payment |
| `/app/path` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/library` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/labs` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/projects` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/partner-practice` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/ai` | planned | guarded | `LearnerLayout` | Placeholder (B5) |
| `/app/mentors` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/live` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/progress` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/portfolio` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/passport` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/career` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/community` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/rewards` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/downloads` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/settings` | planned | guarded | `LearnerLayout` | Placeholder (B2) |
| `/app/help` | planned | guarded | `LearnerLayout` | Placeholder (B2) |

Notes:

- `/app/library`, `/app/partner-practice`, `/app/community`, `/app/rewards` and
  `/app/help` were added by the B1 approved IA and were absent from the B0 draft of
  this document. CONF-02 required B1.3's route table to include them and this
  document to be amended; both are done.
- `/app/assessment/:tryoutId/exam` and `/app/assessment/:tryoutId/result` were
  previously implicit — the tryout id lived only in component state, so a reload
  mid-exam or a shared result link was impossible. They are now canonical URLs.
- **"none (self-chrome)"** means the legacy component carries its own header and
  sidebar. Wrapping it in `LearnerLayout` would produce a double header and a
  double sidebar. `StudentDashboard` and `LearningPage` stay bare until B1.4
  decomposes them. This is a deliberate compatibility mode, not an oversight.
- `/app/learn/:lessonId` from the B0 draft is **not** a separate route. Lesson
  selection is in-page state within the learning workspace, not a routable
  capability.

## AKSA Studio

Every Studio route is **planned**. B1.3 delivers the shell and the route
boundaries only. There is no Creator AI, no editor, no validation, no review, no
publishing and no analytics. `src/integrations/ai/` does not exist (SEC-P1-01, B5).

| Route | Class | Renders |
|---|---|---|
| `/studio` | planned | Placeholder (B4) |
| `/studio/editor/:contentId` | planned | Placeholder (B4) |
| `/studio/templates` | planned | Placeholder (B4) |
| `/studio/media` | planned | Placeholder (B4) |
| `/studio/factory` | planned | Placeholder (B5) |
| `/studio/validation` | planned | Placeholder (B6) |
| `/studio/review` | planned | Placeholder (B6) |
| `/studio/published` | planned | Placeholder (B6) |
| `/studio/analytics` | planned | Placeholder (B4) |
| `/studio/settings` | planned | Placeholder (B4) |

`/studio/editor` (no id) also resolves, to the same editor placeholder.

## Academic / platform administration

| Route | Class | Renders |
|---|---|---|
| `/admin` | canonical | `AdminDashboard` |

The twelve target admin sub-routes from the B0 draft — `/admin/curriculum`,
`/admin/skills`, `/admin/sources`, `/admin/assessment-bank`, `/admin/educators`,
`/admin/institutions`, `/admin/partners`, `/admin/credentials`,
`/admin/access-fund`, `/admin/audit`, `/admin/settings` — are **not registered**
in B1.3. They resolve to the 404 page. `AdminDashboard` is still a single
408.8 KB component with its own internal tab bar, and splitting it into those
sections is B1.4 work.

`/admin` has **no authentication gate**. The "DEMO ADMIN" button is an unguarded
demo shortcut and must not be described as a security control. SEC-P1-03 is open.

## Educator

The eleven `/educator/*` routes are reserved by the B0 route map but are **not
registered** in B1.3 and resolve to the 404 page. They depend on a real educator
identity and capability model, which is B2 work.

---

## Guard model

Target state: routes use role/capability guards, not scattered
`if (user.role === ...)` checks.

Current state (B1.3): one routing guard, `RequireLegacyUser`. It redirects to
`/login` when there is no in-memory user. It is **not** authentication and **not**
authorization — the "user" is an in-memory object created by a demo login form,
with no credential, no session, no token and no server. Guarding a route does not
withhold its content, because the payloads are already in the JavaScript bundle.

Real identity, session handling, server-side authorization and row-level security
are **B2** deliverables.

## URL contract

`src/app/router/routePaths.ts` is the single source of truth for URL construction.
Nothing else in `src/` should hand-write a path string; it should import a builder
from there. That keeps this document and the code auditable against each other.
