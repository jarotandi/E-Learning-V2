# B1.3R1 — Planned Route Delivery Map

## Purpose

`src/app/router/routePaths.ts` declares 17 planned learner routes and 10 planned
Studio metadata entries. The router registers 17 and 11 planned surfaces
respectively — the extra Studio surface is `/studio/editor/:contentId`, declared
directly in `AppRouter.tsx` rather than derived from the array. Each route
carries a `batch` field that the placeholder page renders to the user. Before
B1.3R1, almost every one of those fields read `B2`.

That was wrong, and it was wrong in a specific, self-reinforcing way: **B2 is
Identity & Data Authority**, not the next delivery batch. Because B2 happens to
follow B1, "the next batch" and "B2" read the same, and every planned surface
inherited `B2` by default rather than by decision.

This document records, per route, which delivery batch actually owns it and
what the authority for that claim is — or, where no authority exists, that there
is none.

## Authority

`docs/aksa/10-batch-roadmap.md` is the sole delivery-batch authority. Supporting
evidence may come from `docs/aksa/design/02-navigation-information-architecture.md`
(module → path) and `docs/aksa/b1/01-legacy-compatibility-map.md` (legacy view →
batch), but neither of those allocates batches for the planned surfaces below
except where explicitly noted.

The two claims this document refuses to make:

1. **"B2 owns it" because B2 is next.** B2's roadmap scope is Supabase Auth,
   roles/permissions, RLS, storage, audit foundation, and initial domain
   migrations. None of that is a UI surface, and none of it implies delivery of
   a Library, a Community feed, or a Help Center.
2. **"Some batch obviously owns it."** Where the roadmap is silent, this document
   records `TBD` rather than inferring an owner from adjacency. A wrong owner is
   worse than a known gap: a wrong owner produces a false delivery promise on a
   user-visible page, which is exactly what the placeholder is supposed to avoid.

## Rule for the `batch` field

| Value | Meaning |
|---|---|
| `B<n>` | The roadmap explicitly allocates this capability to batch `n`. |
| `TBD` | The roadmap allocates **no** batch. Deliberately unallocated. |

`TBD` is a truthful value, not a placeholder awaiting a default. It is not to be
back-filled with "whatever batch comes next" when that batch is chosen.

---

## Learner routes

| Route | Module | Current status | Delivery batch | Authority |
|---|---|---|---|---|
| `/app/path` | My Path / Skill Map | planned placeholder | **B3** | roadmap B3 "Learning Kernel": skill graph, prerequisite graph, learner model, mastery, deterministic recommendation v1 |
| `/app/library` | Library | planned placeholder | **TBD** | No roadmap batch allocates a learner content library. B4 is authoring-side (Studio); B12 is offline packs. Neither is this surface |
| `/app/labs` | Skills Labs | planned placeholder | **B9** | roadmap B9 "Skills Labs" |
| `/app/projects` | Projects | planned placeholder | **B11** | roadmap B11 "Projects & Credentials": real projects |
| `/app/partner-practice` | Partner Practice | planned placeholder | **TBD** | No roadmap batch names peer/paired practice. B10 owns human support (tutors, chat, booking, video) but does not establish this surface |
| `/app/ai` | AI Tutor | planned placeholder | **B10** | roadmap B10 "Human Support" lists "AI Tutor" explicitly. Learner-facing tutoring, **not** B5 Creator AI. Also blocked on the server/edge AI Router (SEC-P1-01) |
| `/app/mentors` | Guru & Mentor | planned placeholder | **B10** | roadmap B10 "Human Support": primary/on-demand tutors. Corroborated by `01-legacy-compatibility-map.md` (`mentorProfile` → B10) |
| `/app/live` | AKSA Live | planned placeholder | **B10** | roadmap B10: scheduled/instant video, office hours. Corroborated by `01-legacy-compatibility-map.md` (`schedule` → B10) |
| `/app/progress` | Progress | planned placeholder | **TBD** | B3 owns the mastery and learner-model **data**, which this would present, but the roadmap does not allocate the surface |
| `/app/portfolio` | Portfolio | planned placeholder | **B11** | roadmap B11 lists "portfolio" |
| `/app/passport` | Skills Passport | planned placeholder | **B11** | roadmap B11 lists "Skills Passport" |
| `/app/career` | Career | planned placeholder | **TBD** | No roadmap batch owns career guidance or selection preparation |
| `/app/community` | Community | planned placeholder | **TBD** | No roadmap batch owns a learner community or discussion feed |
| `/app/rewards` | Rewards | planned placeholder | **TBD** | No roadmap batch owns achievements, points, or recognition |
| `/app/downloads` | Downloads | planned placeholder | **B12** | roadmap B12 "Offline & Edge": downloadable content packs, storage manager. This is the offline-material capability, **not** localStorage-as-authority (that is B2 / SEC-P1-02) |
| `/app/settings` | Settings | planned placeholder | **TBD** | No roadmap batch owns learner account settings |
| `/app/help` | Help Center | planned placeholder | **TBD** | No roadmap batch owns help, FAQ, or support content |

## Studio routes

| Route | Module | Current status | Delivery batch | Authority |
|---|---|---|---|---|
| `/studio` | Dashboard | planned placeholder | **B4** | roadmap B4 "AKSA Studio Core" owns the Studio shell this lands in |
| `/studio/editor` | Studio / Editor | planned placeholder | **B4** | roadmap B4: "editor" |
| `/studio/editor/:contentId` | Editor (deep link) | planned placeholder | **B4** | same as `/studio/editor` |
| `/studio/templates` | Templates | planned placeholder | **B4** | roadmap B4: "templates" |
| `/studio/media` | Media Library | planned placeholder | **B4** | roadmap B4: "media/source manager" |
| `/studio/factory` | Content Factory | planned placeholder | **B5** | roadmap B5 "Creator AI & Content Factory" |
| `/studio/validation` | Validation Center | planned placeholder | **B6** | roadmap B6 "Validation Center": validator registry, risk policy |
| `/studio/review` | Review Queue | planned placeholder | **B6** | roadmap B6: "review queue", "human review" |
| `/studio/published` | Published Content | planned placeholder | **B6** | roadmap B6: "publish gate", "re-validation" |
| `/studio/analytics` | Analytics | planned placeholder | **TBD** | The roadmap establishes no batch for Studio analytics. B4 owns authoring primitives, not engagement reporting |
| `/studio/settings` | Settings | planned placeholder | **TBD** | The roadmap establishes no batch for Studio settings. Not a B4 Studio Core deliverable |

---

## Summary

Two different things get counted, and conflating them was the source of the
B1.3R1 counting error. **Metadata entries** are the rows in the two arrays in
`routePaths.ts`. **Registered route surfaces** are the URLs the router actually
registers. The two differ for Studio, because `/studio/editor/:contentId` is
declared directly in `AppRouter.tsx` with `batch="B4"` rather than being derived
from the metadata array.

### A. Metadata entries (`routePaths.ts`)

| Array | Total | Explicit | TBD |
|---|---|---|---|
| `PLANNED_LEARNER_ROUTES` | **17** | **9** | **8** |
| `PLANNED_STUDIO_ROUTES` | **10** | **8** | **2** |

Learner explicit (9): path, labs, projects, ai, mentors, live, portfolio,
passport, downloads.
Learner TBD (8): library, partner-practice, progress, career, community,
rewards, settings, help.
Studio explicit (8): dashboard, editor, templates, media, factory, validation,
review, published.
Studio TBD (2): analytics, settings.

### B. Registered planned route surfaces (`AppRouter.tsx`)

| Surface set | Total | Explicit | TBD |
|---|---|---|---|
| Learner (`/app/*`) | **17** | **9** | **8** |
| Studio (`/studio/*`) | **11** | **9** | **2** |
| **Overall** | **28** | **18** | **10** |

The Studio surface count is 11 against 10 metadata entries. The extra surface is
`/studio/editor/:contentId`, a canonical deep link registered alongside the
array-derived routes and rendered by the same `PlannedRoutePage` with `batch="B4"`.
It therefore adds one explicit surface and no new TBD.

## The finding

The **8 `TBD` learner metadata entries** and **2 `TBD` Studio entries** are the
substantive finding. Each is a real user-facing module in the approved IA with
no owner in the roadmap, and each previously displayed "Batch pengaktifan B2" to
a user — a false delivery promise on a page whose entire purpose is to avoid
false promises.

## Carried forward

Resolving the 8 learner and 2 Studio `TBD` allocations is roadmap work, not B1
work. It requires amending `10-batch-roadmap.md`, which is B0-sealed territory
and outside B1's mandate. B1.3R1 records the gap; B1.3R2 reconciles the counts
against source; neither fills it by guessing.
