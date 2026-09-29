# AKSA Target Architecture

## Product surfaces

```text
AKSA PLATFORM
├── Public Web
├── Learner App
├── Educator App
├── AKSA Studio
├── Academic Control Center
└── Platform Operations
```

## Logical architecture

```text
Experience Layer
  Public / Learner / Educator / Studio / Academic / Admin
                         |
Application Services
  Learning | Assessment | Projects | Mentor | Live | Studio | Validation
                         |
AKSA Learning Kernel
  Curriculum | Skill Graph | Learner Model | Mastery | Recommendation
                         |
Content Platform
  Content Schema | Learning Objects | Sources | Versions | Publishing
                         |
Integration Layer
  Supabase | AI Router | OpenMAIC Adapter | Live Adapter | Lab Engines
                         |
Data / Storage / Audit
  PostgreSQL | Object Storage | Vector Retrieval | Audit Events
```

## Authority boundaries

AKSA is authoritative for:
- user/role identity,
- organization/institution scope,
- curriculum and skills,
- learner state and mastery,
- source provenance,
- content versions,
- validation state,
- human review decisions,
- published learning objects,
- project evidence,
- credentials/Skills Passport.

External systems are execution engines only.

## Key architectural rule

OpenMAIC, JupyterLite, spreadsheet engines, 3D/BIM engines, and video-call engines must be accessed through explicit adapters. AKSA domain records must not depend on vendor/engine-specific internal identifiers as their sole identity.

## Content lifecycle

```text
Source
  -> Draft
  -> Generate/Edit
  -> Auto Validation
  -> Risk Classification
  -> Human Review when required
  -> Approved
  -> Published
  -> Analytics/Feedback
  -> Re-validation / New Version
```

## Offline principle

Every learning object should eventually declare:
- offline capability,
- required assets,
- estimated download size,
- runtime dependencies,
- sync behavior.

B4 content schema must reserve this contract even though orchestration arrives later in B12.
