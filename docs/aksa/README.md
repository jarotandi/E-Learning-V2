# AKSA Architecture & Delivery Contracts

Status: **B0 IN PROGRESS**

This directory is the canonical architecture and migration contract for transforming `jarotandi/E-Learning-V2` into **AKSA — Hybrid AI Learning Platform / Learning OS**.

## Current baseline

- Repository: `jarotandi/E-Learning-V2`
- Baseline branch: `main`
- Baseline SHA: `a470402ac7263c439061c646250fbd4dade1c607`
- B0 branch: `aksa/b0-foundation-audit`
- B0 rule: **documentation/audit only; no runtime behavior change**

## Documents

1. [00-baseline.md](./00-baseline.md)
2. [01-current-state-audit.md](./01-current-state-audit.md)
3. [02-target-architecture.md](./02-target-architecture.md)
4. [03-module-boundaries.md](./03-module-boundaries.md)
5. [04-route-map.md](./04-route-map.md)
6. [05-data-authority.md](./05-data-authority.md)
7. [06-role-permission-map.md](./06-role-permission-map.md)
8. [07-ai-integration-boundary.md](./07-ai-integration-boundary.md)
9. [08-validation-contract.md](./08-validation-contract.md)
10. [09-reference-stack.md](./09-reference-stack.md)
11. [10-batch-roadmap.md](./10-batch-roadmap.md)
12. [11-b0-execution-checklist.md](./11-b0-execution-checklist.md)

## Non-negotiable architecture principles

- AKSA owns learner identity, curriculum, skill graph, mastery, validation, publishing authority, evidence, and credentials.
- External engines such as OpenMAIC must sit behind adapters and are never the AKSA source of truth.
- AI-generated content is always a **draft** until validation and, when required, human review pass.
- Browser storage may be used for cache/preferences/offline queues, not as production authority.
- Credentials and model keys must never be exposed in the client bundle.
- Every batch is baseline-verified, scope-locked, tested, documented, committed, and sealed before the next batch begins.
