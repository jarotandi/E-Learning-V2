# AKSA Studio Shell Contract

**Status: OFFICIAL — Derived from Approved Generated AKSA Designs**

This document defines the shell/layout contract for AKSA Studio. Shell implementation occurs in B1.3; Studio's own feature surfaces (editor, validation) arrive in B4/B6 per the roadmap.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header (64px)                                               │
│ [Breadcrumbs]                              [Notif] [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────┐ ┌───────────────────────────────────────────┐  │
│ │         │ │                                           │  │
│ │ Sidebar │ │              Main Content                 │  │
│ │ (256px) │ │                                           │  │
│ │         │ │                                           │  │
│ │         │ │                                           │  │
│ └─────────┘ └───────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dimensions (Same as Learner Shell)

| Element | Desktop | Tablet (≤1024px) | Mobile (≤768px) |
|---------|---------|------------------|-----------------|
| Header Height | 64px | 64px | 56px |
| Sidebar Width | 256px | Collapsible drawer | Hidden (drawer) |
| Sidebar Collapsed | 64px | — | — |
| Content Max Width | 1536px (wider for editor) | 100% | 100% |
| Content Padding | 24px | 20px | 16px |
| Content Gap | 24px | 20px | 16px |

---

## Header Specification

### Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────┐
│ Dashboard / Editor / Lesson Title    [Quick Actions] [🔔] [👤]   │
└────────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Breadcrumbs | Dynamic: `Dashboard > Editor > "Lesson Title"` |
| Quick Actions | New Content, Import, Sync (context-aware) |
| Notifications | Validation alerts, review assignments, factory jobs |
| Profile | Avatar, name, role, switch to Learner/Admin if permitted |

---

## Sidebar Specification

### Desktop — Expanded (Default)

```
┌────────────────────┐
│ Dashboard          │  → /studio
├────────────────────┤
│ EDITOR         ▼   │
│   Studio / Editor  │  → /studio/editor/:contentId
│   Templates        │  → /studio/templates
│   Media Library    │  → /studio/media
├────────────────────┤
│ CONTENT FACTORY    │
│   Content Factory  │  → /studio/factory
├────────────────────┤
│ VALIDATION & REVIEW ▼│
│   Validation Center│  → /studio/validation
│   Review Queue     │  → /studio/review
│   Published        │  → /studio/published
├────────────────────┤
│ INSIGHTS           │
│   Analytics        │  → /studio/analytics
├────────────────────┤
│ SETTINGS           │
│   Settings         │  → /studio/settings
└────────────────────┘
```

### Desktop — Collapsed (64px)

Icon-only with tooltips matching section labels.

### Mobile/Tablet — Drawer

Full expanded content, overlay backdrop, swipe/hamburger to open.

---

## Editor Layout (Key Studio View)

The editor is the primary workspace and requires a specialized three-panel layout:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header (Breadcrumbs + Actions)                                      │
├──────────────┬────────────────────────────┬────────────────────────┤
│              │                            │                        │
│  Outline     │       Canvas / Editor      │  Properties / AI       │
│  (280px)     │       (flexible)           │  Copilot (320px)       │
│              │                            │                        │
│  - Blocks    │  - Block editor            │  - Block settings      │
│  - Search    │  - Drag & drop             │  - Style controls      │
│  - Filter    │  - Inline editing          │  - AI actions          │
│              │                            │  - Validation panel    │
├──────────────┴────────────────────────────┴────────────────────────┤
│ Footer: Status, Word count, Version, Save state, Publish          │
└─────────────────────────────────────────────────────────────────────┘
```

### Editor Panel Specs

| Panel | Width | Behavior |
|-------|-------|----------|
| Outline (Left) | 280px | Collapsible, resizable, shows block tree |
| Canvas (Center) | Flexible | Min 600px, max 1200px content width |
| Properties/AI (Right) | 320px | Collapsible, tabbed: Settings / AI / Validation |

---

## Validation Center Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Validation Center                                        [Filters]  │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────┐ ┌───────────────────────────────────────┐ │
│ │                     │ │                                       │ │
│ │   Queue List        │ │     Review Detail (selected)          │ │
│ │   (400px)           │ │     (flexible)                        │ │
│ │                     │ │                                       │ │
│ │  - Status badges    │ │  - Content preview                    │ │
│ │  - Risk indicators  │ │  - Validation results                 │ │
│ │  - Assignee         │ │  - Citations / references             │ │
│ │  - Due date         │ │  - Reviewer notes                     │ │
│ │                     │ │  - Actions: Approve / Revise / Reject │ │
│ └─────────────────────┘ └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Content Factory Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Content Factory                                          [New Job]  │
├─────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Job Queue                                                      │ │
│ │  ┌────┬──────────────┬──────────┬─────────┬────────┬────────┐  │ │
│ │  │ #  │ Title        │ Type     │ Status  │ Progress│ Actions│  │ │
│ │  ├────┼──────────────┼──────────┼─────────┼────────┼────────┤  │ │
│ │  │ 1  │ Math Ch 1    │ Lessons  │ Running │  67%   │ [⋯]    │  │ │
│ │  │ 2  │ Physics Lab  │ 3D Sims  │ Queued  │   —    │ [⋯]    │  │ │
│ │  └────┴──────────────┴──────────┴─────────┴────────┴────────┘  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints (Same as Learner)

| Breakpoint | Behavior |
|------------|----------|
| `≥1280px` (xl) | Full sidebar, three-panel editor |
| `1024px–1279px` (lg) | Full sidebar, two-panel editor (properties in drawer) |
| `768px–1023px` (md) | Collapsible sidebar, stacked editor panels |
| `<768px` (sm) | Hidden sidebar, single-panel editor, properties in modal |

---

## Creator AI Integration

**Creator AI is embedded in Studio, not a separate nav item.**

### Access Points

| Location | AI Capability |
|----------|---------------|
| Editor — Right Panel (Copilot tab) | Single-content generation, refinement |
| Editor — Block-level actions | Generate block, rewrite, translate |
| Content Factory — New Job | Batch generation configuration |
| Templates — Create from template | Template-based generation |
| Validation — Auto-fix suggestions | Validation-driven corrections |

### AI Panel States

```
┌─────────────────────────────────────┐
│ 🤖 Creator AI              [⚙️]    │
├─────────────────────────────────────┤
│                                     │
│  [Generate Lesson]                  │
│  [Generate Quiz]                    │
│  [Generate Diagram]                 │
│  [Adapt for Age/Level]              │
│                                     │
│  ─────────────────                  │
│                                     │
│  Recent Generations                 │
│  • "Photosynthesis Lesson" — 2h ago │
│  • "Cell Quiz" — 1d ago             │
│                                     │
│  [View History]                     │
└─────────────────────────────────────┘
```

---

## Implementation Contract (B1.2+)

| File | Responsibility |
|------|----------------|
| `src/app/layouts/StudioLayout.tsx` | Shell composition |
| `src/app/layouts/StudioHeader.tsx` | Header with breadcrumbs |
| `src/app/layouts/StudioSidebar.tsx` | Sidebar component |
| `src/app/navigation/studioNavigation.ts` | Navigation data |
| `src/studio/editor/EditorLayout.tsx` | Three-panel editor shell |
| `src/studio/validation/ValidationLayout.tsx` | Two-panel validation |
| `src/studio/factory/FactoryLayout.tsx` | Factory dashboard |

---

## Legacy Compatibility

No legacy Studio equivalent exists — this is a new surface. However:

- Existing `AdminDashboard` content must remain accessible during transition
- Admin → Studio migration happens in B1.3+ (decomposition phase)
- No admin features removed in B1.1