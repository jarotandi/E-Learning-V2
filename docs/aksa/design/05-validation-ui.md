# Validation UI Contract

**Status: OFFICIAL — Derived from Approved Generated AKSA Designs**

This document defines the Validation Center UI, Review Queue, and Review Material Detail views. Implementation occurs in B6+. B1.1 documents the contract only.

---

## Validation Pipeline Overview

```
AI Generate
    ↓
Auto Validation
    ↓
Risk Classification
    ↓
Review Queue (when required)
    ↓
Human Review
    ↓
Approve / Request Revision / Reject
    ↓
Publish
    ↓
Re-validation (scheduled or triggered)
```

---

## Validation Center Dashboard

### Purpose

High-level overview of validation health across all content.

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Validation Center                                      [Filters ▼]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │  Draft      │ │ Validating  │ │ In Review   │ │ Published   │  │
│  │  1,247      │ │  89         │ │  156        │ │  3,421      │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
│                                                                     │
│  ┌──────────────────────────┐ ┌────────────────────────────────┐  │
│  │ Risk Distribution        │ │ Validation Trends (7d)         │  │
│  │ ████████ Low (72%)       │ │ ████ Validations/day           │  │
│  │ ███████ Medium (21%)     │ │ ████ Pass rate                 │  │
│  │ ███ High (7%)            │ │ ████ Avg time to approve       │  │
│  └──────────────────────────┘ └────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Recent Activity                                              │  │
│  │ ──────────────────────────────────────────────────────────── │  │
│  │ "Photosynthesis Lesson" — Auto-validated → Low Risk → Draft  │  │
│  │ "Cell Division Quiz" — In Review (Dr. Sarah, 2h ago)         │  │
│  │ "Newton's Laws" — Approved & Published (15m ago)             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Metrics Cards

| Metric | Description | Warning Threshold |
|--------|-------------|-------------------|
| Draft | Content awaiting validation | >500 |
| Validating | Auto-validation running | >50 for >1h |
| In Review | Human review pending | >100 or >24h oldest |
| Published | Live content | — |

---

## Review Queue

### Purpose

Centralized queue for content requiring human review.

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Review Queue                                    [Filters] [Sort ▼]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────┬──────────────────┬────────┬────────┬────────┬──────┬─────┐ │
│  │ #  │ Title            │ Type   │ Risk   │ Status │ Due  │ Act │ │
│  ├────┼──────────────────┼────────┼────────┼────────┼──────┼─────┤ │
│  │ 1  │ Photosynthesis   │ Lesson │ ● Low  │ Ready  │ 2d   │ [→] │ │
│  │ 2  │ Cell Division    │ Quiz   │ ●● Med │ In Rev │ 1d   │ [→] │ │
│  │ 3  │ CRISPR Ethics    │ Essay  │ ●●● Hi │ Queued │ 3d   │ [→] │ │
│  │ 4  │ Newton's Laws    │ Lab    │ ●● Med │ Approved│ —   │ [⋯] │ │
│  └────┴──────────────────┴────────┴────────┴────────┴──────┴─────┘ │
│                                                                     │
│  [← Prev]  1  2  3  4  5  [Next →]    Showing 1–25 of 156         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Row Actions

| Action | Icon | Behavior |
|--------|------|----------|
| Review | → | Opens Review Detail panel |
| Claim | ✋ | Assigns to current reviewer |
| History | 🕐 | Shows validation/review history |
| Menu | ⋯ | Reassign, escalate, view logs |

### Filters

- **Status:** All, Queued, Ready for Review, In Review, Approved, Rejected, Needs Revision
- **Risk:** All, Low, Medium, High
- **Type:** All, Lesson, Quiz, Lab, Essay, Project, Simulation
- **Assignee:** Me, Unassigned, Specific reviewer
- **Date Range:** Created, Due, Updated

---

## Review Material Detail

### Purpose

Full review workspace for a single content item.

### Layout (Two-Panel)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Review: "Cell Division Quiz"                    [Back] [Actions ▼] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────┐ ┌─────────────────────────────────┐  │
│  │ CONTENT PREVIEW (60%)   │ │ VALIDATION & REVIEW (40%)       │  │
│  │                         │ │                                 │  │
│  │ ┌─────────────────────┐ │ │ Status: ●● Medium Risk          │  │
│  │ │  [Quiz Render]      │ │ │ Assignee: Dr. Sarah Chen        │  │
│  │ │                     │ │ │ Due: Tomorrow 23:59             │  │
│  │ │ Question 1: ...     │ │ ├─────────────────────────────────┤ │
│  │ │   A) Option A       │ │ │ AUTO-VALIDATION RESULTS         │  │
│  │ │   B) Option B       │ │ │ ✅ Fact Check: PASS (0.94)      │  │
│  │ │   C) Option C       │ │ │ ✅ Citation Check: PASS (0.87)  │  │
│  │ │   D) Option D       │ │ │ ⚠️ Curriculum Align: WARN (0.62)│ │
│  │ │                     │ │ │ ✅ Age-Level: PASS (0.91)       │  │
│  │ │ [Next Question]     │ │ │ ✅ Language Quality: PASS (0.89)│ │
│  │ └─────────────────────┘ │ ├─────────────────────────────────┤ │
│  │                         │ │ RISK CLASSIFICATION             │  │
│  │ Version: v3.2           │ │ ●● Medium — Curriculum alignment│ │
│  │ Source: Biology Ch 4    │ │   below threshold               │ │
│  │ Modified: 2h ago        │ ├─────────────────────────────────┤ │
│  │                         │ │ CITATIONS & REFERENCES          │ │
│  │ [Toggle: Student/Teacher│ │ 📎 Campbell Biology, Ch 12      │ │
│  │  View]                  │ │ 📎 Khan Academy: Mitosis        │ │
│  │                         │ │ 🔗 DOI: 10.1038/nature12345     │ │
│  └─────────────────────────┘ ├─────────────────────────────────┤ │
│                              │ REVIEWER NOTES                  │ │
│                              │ [Text area for private notes]   │ │
│                              ├─────────────────────────────────┤ │
│                              │ DECISION                        │ │
│                              │ [Approve] [Request Revision]    │ │
│                              │ [Reject]  [Escalate]            │ │
│                              └─────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Content Preview Panel

- **Renders actual content** — lesson, quiz, lab, etc. in learner view
- **Toggle views** — Student view / Teacher view (with answers)
- **Version indicator** — Current version badge
- **Source link** — Links to curriculum skill/source

### Validation & Review Panel

#### Status Bar

| Element | Values |
|---------|--------|
| Risk Badge | Low / Medium / High (color-coded) |
| Assignee | Reviewer name + avatar |
| Due Date | Relative + absolute |
| Content Status | Draft / Validating / In Review / Approved / Published |

#### Auto-Validation Results

| Validator | Status | Score | Details |
|-----------|--------|-------|---------|
| Fact Check | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Expandable findings |
| Citation Check | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Missing/weak citations |
| Curriculum Alignment | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Skill coverage gaps |
| Age-Level | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Readability, complexity |
| Language Quality | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Grammar, clarity, tone |
| Quiz/Assessment Logic | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Answer key validity |
| Interactive Logic | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Simulation behavior |
| 3D/Visual | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Asset integrity |
| Safety/Compliance | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Policy violations |
| License/Copyright | ✅ PASS / ⚠️ WARN / ❌ FAIL | 0–1 | Asset licensing |

#### Risk Classification

- **Low** — All validators PASS, strong references, deterministic content
- **Medium** — ≥1 WARN, academic/interactive content, human review required
- **High** — ≥1 FAIL, or health/safety/engineering-critical, specialist reviewer required

#### Citations & References

- Clickable links to sources
- DOI, URL, ISBN identifiers
- Version of source at time of validation

#### Reviewer Notes

- Private to reviewer
- Persisted across sessions
- Not visible to creator

#### Decision Actions

| Action | Effect | Required For |
|--------|--------|--------------|
| **Approve** | Status → Approved → Publish queue | All risk levels |
| **Request Revision** | Status → Needs Revision, notifies creator | Medium, High |
| **Reject** | Status → Rejected, creator must restart | High (policy violation) |
| **Escalate** | Reassign to specialist reviewer | High risk, conflict |

---

## Validation Status Indicators (Global)

Used across Studio, Editor, Content Factory:

| Status | Badge | Color | Meaning |
|--------|-------|-------|---------|
| `DRAFT` | Draft | Neutral | Editable, not validated |
| `VALIDATING` | Validating... | Blue (animated) | Auto-validation running |
| `VALIDATION_FAILED` | Failed | Red | Auto-validation failed |
| `NEEDS_REVISION` | Revision | Orange | Creator must address issues |
| `HIGH_RISK_REVIEW` | High Risk | Red | Specialist review required |
| `READY_FOR_REVIEW` | Ready | Yellow | Queued for reviewer |
| `IN_REVIEW` | In Review | Blue | Reviewer assigned |
| `APPROVED` | Approved | Green | Ready to publish |
| `PUBLISHED` | Published | Green + ✓ | Live |
| `SUPERSEDED` | Superseded | Muted | Newer version published |
| `ARCHIVED` | Archived | Muted | Removed from library |

---

## Re-Validation Triggers (UI Indicators)

When viewing published content, show re-validation status:

```
┌─────────────────────────────────────────────────────────┐
│ ✅ Published — Last validated 14 days ago               │
│ ⚠️ Scheduled re-validation in 16 days                   │
│ 🔄 Triggers: Source updated 3d ago, Validator v2.1 avail│
│ [Run Validation Now]                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Mobile Adaptation

| View | Adaptation |
|------|------------|
| Dashboard | Stack metric cards, horizontal scroll charts |
| Queue | Card-based rows, tap to open detail modal |
| Detail | Stacked panels (preview above, validation below) |

---

## Accessibility

- Queue table: proper `<table>` semantics, sortable headers
- Status badges: text + color (not color-only)
- Decision buttons: clear labels, confirm destructive actions
- Focus management: trap in detail panel, restore on close
- Screen reader: live region for validation progress

---

## Implementation Contract (B6+)

| File | Responsibility |
|------|----------------|
| `src/studio/validation/ValidationDashboard.tsx` | Dashboard |
| `src/studio/validation/ReviewQueue.tsx` | Queue list |
| `src/studio/validation/ReviewDetail.tsx` | Two-panel detail |
| `src/studio/validation/ValidationResults.tsx` | Validator results panel |
| `src/studio/validation/RiskBadge.tsx` | Risk indicator component |
| `src/studio/validation/DecisionActions.tsx` | Approve/Revise/Reject |

---

## Do Not Implement Yet (B1.1)

- ❌ Validation logic
- ❌ Review queue components
- ❌ Auto-validation runners
- ❌ Risk classification engine

✅ **Do:** Document the contract (this file)