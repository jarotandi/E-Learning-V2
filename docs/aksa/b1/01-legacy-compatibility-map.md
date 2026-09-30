# B1.1 — Legacy Compatibility Map

Purpose: record exactly which existing capability must keep working during B1,
and where each one is headed. This is the regression contract for B1.

Authority: `docs/aksa/01-current-state-audit.md`, `docs/aksa/04-route-map.md`,
`docs/aksa/05-data-authority.md`.

**B1.1 rule: no legacy capability is deleted, renamed, or made unreachable.**
B1.1 adds contracts only; every file listed below is untouched.

---

## View → Component → Future Destination

`src/App.tsx` currently dispatches on a `View` union (`src/types.ts`) via
`useState<View>`. There is no router. This mapping is the authoritative
current-state ↔ target-destination record.

| `View` value | Current component | Size | Future AKSA destination | Route (target) | Batch |
|---|---|---|---|---|---|
| `landing` | `LandingPage` | 48.0 KB | Public Web | `/` | B1.3 |
| `programs` | `ProgramListingPage` | 9.2 KB | Public Web / Programs | `/programs` | B1.3 |
| `programDetail` | `ProgramDetailPage` | 27.5 KB | Public Web / Program Detail | `/programs/:programId` | B1.3 |
| `mentorProfile` | `MentorProfilePage` | 9.2 KB | Guru & Mentor | `/mentors/:mentorId` | B10 |
| `tryoutListing` | `TryoutListingPage` | 7.7 KB | Assessment Center | `/app/assessment` | B3 |
| `dashboard` | `StudentDashboard` | 23.6 KB | Learner Home | `/app` | B1.2 |
| `learning` | `LearningPage` | 40.1 KB | Lesson Workspace | `/app/learn/:lessonId` | B1.2 |
| `exam` | `TryoutExamPage` | 16.7 KB | Assessment Center / Exam Runner | `/app/assessment` | B3 |
| `result` | `TryoutResultPage` | 26.5 KB | Assessment Center / Result | `/app/assessment` | B3 |
| `admin` | `AdminDashboard` | 408.8 KB | Platform Admin (split) | `/admin/*` | B1.3 |
| `contact` | `ContactPage` | 9.2 KB | Public Web / Contact | `/contact` | B1.3 |
| `testimonials` | `TestimonialsPage` | 19.1 KB | Public Web / Editorial | `/blog` (optional) | B1.3 |
| `schedule` | *(inlined in `App.tsx`)* | — | Educator / Calendar | `/app/calendar` | B10 |
| `profile` | `ProfilePage` | 10.0 KB | Learner Profile | `/app/profile` | B1.2 |
| `login` | `LoginPage` | 41.9 KB | Identity | `/login` | B2 |
| `payment` | `PaymentPage` | 25.8 KB | Wallet & Payments | `/app/wallet` | B1.3 |
| `finalRegistration` | `FinalRegistrationPage` | 10.1 KB | Enrolment flow | `/app/...` | B2 |
| `blogListing` | `BlogListingPage` | 10.9 KB | Knowledge/Editorial | `/blog` | B1.3 |
| `blogPost` | `BlogPostPage` | 17.9 KB | Knowledge/Editorial | `/blog/:slug` | B1.3 |
| `register` | `LoginPage` (register mode) | 41.9 KB | Identity | `/register` | B2 |
| `guestRegistration` | `LoginPage` (guest mode) | 41.9 KB | Identity | `/register` (guest) | B2 |

### Shared / structural components

| Component | Size | Future destination | Batch |
|---|---|---|---|
| `Navbar` | 7.4 KB | `app/layouts/PublicHeader.tsx` | B1.4 |
| `App.tsx` | — | `app/router/` + per-surface layouts | B1.3 |

---

## Capability Mapping

Required by the B1 brief. Each row states the legacy owner and the AKSA target.

| Legacy capability | Legacy owner | AKSA target | Nav group | Batch |
|---|---|---|---|---|
| LandingPage | `LandingPage.tsx` | Public Web home | — | B1.3 |
| StudentDashboard | `StudentDashboard.tsx` | Learner Home (`Beranda`) | BERANDA | B1.2 |
| LearningPage | `LearningPage.tsx` | Lesson Workspace | LEARN → Kelas Saya | B1.2 |
| Tryout* (listing/exam/result) | `TryoutListingPage`, `TryoutExamPage`, `TryoutResultPage` | Assessment Center | PRACTICE | B3 |
| MentorProfilePage | `MentorProfilePage.tsx` | Guru & Mentor | SUPPORT | B10 |
| PaymentPage | `PaymentPage.tsx` | Wallet & Payments | UTILITIES | B1.3 |
| AdminDashboard | `AdminDashboard.tsx` | Platform Admin, decomposed | `/admin/*` | B1.3 |
| Blog (listing/post) | `BlogListingPage`, `BlogPostPage` | Knowledge/Editorial | — | B1.3 |
| Login / Register / Guest | `LoginPage.tsx` (3 modes) | Identity | — | B2 |
| Program pages | `ProgramListingPage`, `ProgramDetailPage` | Programs / Learning Paths | — | B1.3 |

---

## MUST Remain Functional During B1

These are hard regression constraints. Any B1 change that breaks one is a defect.

| # | Constraint | Evidence / Notes |
|---|---|---|
| 1 | All 21 `View` values remain dispatchable | `src/types.ts` union unchanged in B1.1 |
| 2 | `LandingPage` renders and reaches programs/mentors/blog/contact | `Navbar` + hero CTAs |
| 3 | Login → Dashboard path works in all three modes | `login`, `register`, `guestRegistration` share `LoginPage` |
| 4 | Dashboard → Learning → Exam → Result chain works | `dashboard` → `learning` → `exam` → `result` |
| 5 | Tryout upgrade/consult callbacks still fire | `openUpgradeProgram`, `onConsult` |
| 6 | Admin access and admin ↔ landing toggle still work | `admin` view + `setView` toggle |
| 7 | Program selection state survives view changes | `selectedProgramId`, `selectedPackageId`, `selectedTryoutId` |
| 8 | localStorage demo data still reads and writes | `theprams_demo_*` keys |
| 9 | Premium gating and upgrade flow unchanged | `isPremium`, `premiumUntil` |
| 10 | Contact form + website questions persist | `theprams_demo_website_questions` |
| 11 | Leads capture from landing/contact still works | `theprams_demo_leads` |
| 12 | Blog posts remain admin-editable | `theprams_demo_blog_posts` |
| 13 | Testimonials page reachable and renders | `testimonials` view |
| 14 | Profile page reflects current user | `user` prop |
| 15 | Build output stays a single-page Vite bundle | no router rewrite in B1.1 |

---

## Browser-Local Storage Inventory

Documented per `docs/aksa/05-data-authority.md`. These keys are **read-only
migration inputs** until the owning domain is cut over in B2+.

### Owned by `src/App.tsx`

| Key | Purpose | Owning future domain |
|---|---|---|
| `theprams_demo_programs` | Program records | identity→programs migration step 2 |
| `theprams_demo_blog_posts` | Blog posts | programs/content migration step 2 |
| `theprams_demo_website_questions` | Contact/consult questions | leads/questions migration step 4 |
| `theprams_demo_leads` | Lead captures | leads/questions migration step 4 |

### Owned by `src/components/AdminDashboard.tsx`

| Key | Purpose | Owning future domain |
|---|---|---|
| `theprams_demo_users` | Admin user records | identity/roles migration step 1 |
| `theprams_demo_leads` | Lead records (shared with `App.tsx`) | leads/questions migration step 4 |
| `theprams_demo_transactions` | Finance transactions | payment/entitlement step 5 |
| `theprams_demo_payment_proofs` | Payment proof uploads | payment/entitlement step 5 |
| `theprams_demo_finance_entries` | Finance ledger entries | payment/entitlement step 5 |
| `theprams_demo_finance_realizations` | Finance realizations | payment/entitlement step 5 |
| `theprams_demo_assets` | Asset records | payment/entitlement step 5 |
| `theprams_demo_audit_events` | Audit events | audit foundation (B2) |
| `theprams_demo_notifications` | Notification events | platform ops (B2) |

**Do not rename, bulk-replace, or delete these keys in B1.** Per
`docs/aksa/01-current-state-audit.md`: legacy `The Prams` naming remains until
migration is explicit and versioned.

### Shared utilities

`src/utils/security.ts` provides `escapeHtml`, `readStoredArray`,
`isValidEmail`, `isValidIndonesianPhone`. These fold into `src/shared/` only
when a migration actually needs them.

---

## Known Structural Debt (Not Fixed in B1.1 or B1.2)

| Debt | Size | Planned treatment |
|---|---|---|
| `AdminDashboard.tsx` monolith | 408.8 KB | B1.4 decomposition into `/admin/*` |
| `App.tsx` orchestration | — | B1.3 router + layouts |
| `Navbar.tsx` monolith | 7.4 KB | B1.4 split into `app/layouts/PublicHeader.tsx` |
| `LoginPage.tsx` tri-modal | 41.9 KB | B2 identity split |
| `constants.ts` demo data | ~36 KB | Per-domain migration B2–B3 |
| `TestimonialsPage` unmapped in route map | 19.1 KB | Decision needed: editorial vs remove (B1.3) |

---

## B1.1 Verification

Confirmed in B1.1: no file under `src/components/`, `src/types.ts`,
`src/constants.ts`, `src/utils/`, `src/index.css`, `src/main.tsx`, or
`src/App.tsx` was modified, moved, or deleted. All additions live in new
`src/app/`, `src/design-system/`, `src/core/`, `src/features/`, `src/studio/`,
`src/integrations/`, and `src/shared/` boundaries, and are not imported by any
rendered component.

## B1.2 Verification

Confirmed in B1.2: no legacy component, `src/App.tsx`, `src/index.css`, or any
runtime file was modified. Changes were confined to `vite.config.ts`,
`tsconfig.json`, `package.json` / `package-lock.json`, `README.md`,
`.env.example`, design tokens, and `docs/aksa/**`. The production bundle is
byte-identical to the B1.1 build output (`index-ClsckA6U.js`, 1,474,396 bytes),
which is direct evidence that every legacy capability listed above still behaves
identically. All 21 legacy `View` values remain dispatchable.