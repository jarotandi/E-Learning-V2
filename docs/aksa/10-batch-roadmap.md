# AKSA Batch Roadmap

## Phase A — Foundation

### B0 — Baseline Audit & Architecture Contract
Documentation only. Establish canonical architecture and migration boundaries.

### B1 — App Foundation
- production router,
- app shells/layouts,
- role-aware navigation,
- design-system formalization,
- split large monolith components,
- remove direct client secret injection path.

### B2 — Identity & Data Authority
- Supabase Auth,
- roles/permissions,
- RLS,
- storage,
- audit foundation,
- initial domain migrations.

### B3 — Learning Kernel
- curriculum,
- skill graph,
- prerequisite graph,
- learner model,
- mastery,
- deterministic recommendation v1.

## Phase B — Content Intelligence

### B4 — AKSA Studio Core
- structured content schema,
- learning-object block registry,
- editor,
- templates,
- media/source manager,
- preview/versioning.

### B5 — Creator AI & Content Factory
- structured generation,
- single-content copilot,
- batch generation queue,
- source-grounded generation.

### B6 — Validation Center
- automatic validator registry,
- risk policy,
- review queue,
- human review,
- publish gate,
- re-validation.

### B7 — OpenMAIC Adapter
- generation request mapping,
- classroom generation,
- normalization,
- failure isolation,
- no source-of-truth leakage.

### B8 — Interactive Engine
- interactive diagram,
- canvas,
- simulation,
- Three.js 3D,
- quiz,
- voice,
- roleplay,
- safe interactive runtime.

## Phase C — Learning Ecosystem

### B9 — Skills Labs
Start with three reference verticals:
1. Spreadsheet Lab
2. Code/Data Lab
3. 3D/BIM Lab

Then extend to Office, Presentation, CAD, Estimator, AI, Design, Marketing, Language.

### B10 — Human Support
- AI Tutor,
- primary/on-demand tutors,
- chat,
- booking,
- office hours,
- scheduled/instant video,
- session records.

### B11 — Projects & Credentials
- real projects,
- rubric/assessment,
- portfolio,
- evidence graph,
- Skills Passport,
- Open Badges compatibility.

### B12 — Offline & Edge
- downloadable content packs,
- local progress event log,
- conflict-safe sync,
- storage manager,
- AKSA Edge contract.

## Phase D — Production

### B13 — Production Hardening
- security,
- accessibility,
- observability,
- backups,
- performance,
- E2E/load tests,
- recovery,
- release governance.

## Batch discipline

Every batch follows:
`BASELINE VERIFY -> SCOPE LOCK -> IMPLEMENT -> FOCUSED TEST -> REGRESSION -> BUILD/LINT -> DOCS -> COMMIT -> PUSH -> SEAL`.
