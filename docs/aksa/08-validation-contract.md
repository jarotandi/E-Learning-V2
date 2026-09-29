# AKSA Validation Contract

## Principle

**AI-generated does not mean AKSA-verified.**

Every generated or materially edited learning object must have a validation state.

## Pipeline

```text
SOURCE
 -> DRAFT
 -> AUTO_VALIDATION
 -> RISK_CLASSIFICATION
 -> REVIEW_QUEUE (when required)
 -> HUMAN_REVIEW
 -> APPROVED
 -> PUBLISHED
 -> RE_VALIDATION
```

## Validator registry

Minimum validators:
1. Fact Validator
2. Citation Validator
3. Curriculum Validator
4. Age-Level Validator
5. Language Quality Validator
6. Quiz & Assessment Validator
7. Interactive Logic Validator
8. 3D / Visual Validator
9. Safety & Compliance Validator
10. License & Copyright Validator

## Risk classes

### Low
Routine content with strong references and deterministic checks.
May require creator confirmation only, depending on policy.

### Medium
Academic or interactive content where human academic review is required before publish.

### High
Health, safety, engineering-critical, sensitive, complex 3D/anatomy, or other specialist content.
Requires specialist reviewer.

## Canonical content statuses

```text
DRAFT
VALIDATING
VALIDATION_FAILED
NEEDS_REVISION
HIGH_RISK_REVIEW
READY_FOR_REVIEW
IN_REVIEW
APPROVED
PUBLISHED
SUPERSEDED
ARCHIVED
```

## Validation result requirements

A validation run records:
- validator id/version,
- content version id,
- status,
- score where meaningful,
- findings/issues,
- evidence/references used,
- timestamp,
- execution metadata.

## Human review

Review decisions record:
- reviewer,
- role/scope,
- decision,
- comments,
- resolved issues,
- source/content version,
- timestamp.

## Re-validation triggers

- source update,
- curriculum update,
- material version change,
- reported error,
- policy change,
- validator version update,
- scheduled staleness interval.

## Publish hard gate

No public AI-generated learning content may transition to `PUBLISHED` unless the applicable validation policy is satisfied.
