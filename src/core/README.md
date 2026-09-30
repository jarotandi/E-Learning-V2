# src/core — AKSA Learning Kernel Boundary

Contract: `docs/aksa/02-target-architecture.md`, `docs/aksa/03-module-boundaries.md`,
`docs/aksa/05-data-authority.md`.

`src/core` is the **domain layer**. It owns curriculum, skills, learner model,
mastery, and content structure. It is framework-free: no React, no router,
no UI library.

## Reserved sub-boundaries

| Directory | Owns | Delivered in |
|-----------|------|--------------|
| `curriculum/` | Programs, modules, lessons, prerequisite graph | B3 |
| `skills/` | Skill taxonomy, skill nodes, mappings to curriculum | B3 |
| `learner/` | Learner profile, enrollment, learner state | B3 |
| `mastery/` | Mastery computation, mastery records, progression | B3 |
| `content/` | Learning object schema, versions, provenance | B4 |

These directories are intentionally empty in B1.1. They are reserved so that
B3/B4 land against a declared boundary rather than inventing one.

## Rules

1. **No UI imports.** `core` must not import React components, page components,
   or `design-system`.
2. **No vendor internals.** `core` must not import OpenMAIC, JupyterLite,
   spreadsheet, BIM, or video-call internals. Engines are reached only through
   adapter interfaces in `src/integrations`.
3. **No validation rules hidden in UI.** Validation policy belongs to the
   validation domain (B6), not to arbitrary components.
4. **AKSA identity is canonical.** Domain records must not use a vendor/engine
   identifier as their sole primary key.
5. **Domain types are serialisable.** Plain data structures only — no class
   instances holding framework handles, no DOM references.

## Data authority

All `core` domain state will ultimately be server-authoritative
(Supabase/PostgreSQL) per `docs/aksa/05-data-authority.md`. Browser storage may
only cache, hold preferences, or queue offline events. B1.1 introduces no
persistence.