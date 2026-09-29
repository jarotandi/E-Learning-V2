# Data Authority Contract

## Production authority

Supabase/PostgreSQL will become canonical for shared/production records.

### Server-authoritative domains
- accounts and profiles,
- roles and permissions,
- institutions/workspaces,
- programs and enrollments,
- curriculum and skills,
- learning objects and versions,
- sources and citations,
- validation runs and issues,
- review decisions,
- learner progress/mastery,
- assessments/attempts,
- mentor availability and bookings,
- projects/evidence,
- credentials,
- payments/entitlements,
- audit logs.

### Object storage
- PDFs,
- images,
- audio,
- video,
- 3D/GLB assets,
- datasets,
- exported content packs,
- project submissions.

## Browser-local data

Allowed:
- theme/accessibility preferences,
- transient UI state,
- editor autosave drafts with reconciliation,
- offline downloaded assets/indexes,
- pending offline progress event queue,
- non-sensitive cached query data.

Not allowed as sole production authority:
- users,
- entitlements,
- payment state,
- review approval,
- published content state,
- validation status,
- credential issuance.

## Migration from current demo storage

Current localStorage-backed demo data must be migrated by domain, not by bulk replacement.

Migration order:
1. identity/roles,
2. programs/content,
3. learner progress/assessment,
4. leads/questions/operations,
5. payment/entitlement.

Legacy keys remain read-only migration inputs until their owning domain is cut over.
