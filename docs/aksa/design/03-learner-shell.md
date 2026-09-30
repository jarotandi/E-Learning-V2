# Learner App Shell Contract

**Status: OFFICIAL — Derived from Approved Generated AKSA Designs**

This document defines the shell/layout contract for the Learner App. Implementation occurs in B1.3 (router + shell). Component primitives it depends on land in B1.4.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header (64px)                                               │
│ [Logo] [Global Search]                    [Notif] [Profile] │
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

### Dimensions

| Element | Desktop | Tablet (≤1024px) | Mobile (≤768px) |
|---------|---------|------------------|-----------------|
| Header Height | 64px | 64px | 56px |
| Sidebar Width | 256px | Collapsible drawer | Hidden (drawer) |
| Sidebar Collapsed | 64px | — | — |
| Content Max Width | 1280px | 100% | 100% |
| Content Padding | 24px | 20px | 16px |
| Content Gap | 24px | 20px | 16px |

---

## Header Specification

### Desktop (≥1024px)

```
┌────────────────────────────────────────────────────────────────────┐
│ AKSA                    [Global Search Input          ] [🔔] [👤] │
│ Belajar Tanpa Batas                                               │
└────────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Logo | AKSA wordmark + monogram, links to `/app` |
| Tagline | "Belajar Tanpa Batas" — muted, small |
| Global Search | Cmd+K / Ctrl+K focus, 320px wide, command palette |
| Notifications | Bell icon, badge count, dropdown panel (320px) |
| Profile | Avatar, name, role badge, dropdown menu |

### Mobile (≤768px)

```
┌─────────────────────────────────────────┐
│ ☰  AKSA                    [🔔] [👤]    │
└─────────────────────────────────────────┘
```

- Hamburger menu opens sidebar drawer
- Search moved to drawer or separate screen
- Tagline hidden

---

## Sidebar Specification

### Desktop — Expanded (Default)

```
┌────────────────────┐
│ BERANDA            │  → /app
├────────────────────┤
│ LEARN          ▼   │  → Section header, collapsible
│   My Path          │  → /app/path
│   Kelas Saya       │  → /app/learn
│   Library          │  → /app/library
│   Skills Labs      │  → /app/labs
├────────────────────┤
│ PRACTICE       ▼   │
│   Projects         │  → /app/projects
│   Assessment       │  → /app/assessment
│   Partner Practice │  → /app/partner-practice
├────────────────────┤
│ SUPPORT        ▼   │
│   AI Tutor         │  → /app/ai
│   Guru & Mentor    │  → /app/mentors
│   AKSA Live        │  → /app/live
├────────────────────┤
│ GROWTH         ▼   │
│   Progress         │  → /app/progress
│   Portfolio        │  → /app/portfolio
│   Skills Passport  │  → /app/passport
│   Career           │  → /app/career
├────────────────────┤
│ COMMUNITY      ▼   │
│   Community        │  → /app/community
│   Rewards          │  → /app/rewards
├────────────────────┤
│ UTILITIES          │
│   Calendar         │  → /app/calendar
│   Wallet           │  → /app/wallet
│   Downloads        │  → /app/downloads
│   Settings         │  → /app/settings
│   Help Center      │  → /app/help
└────────────────────┘
```

### Desktop — Collapsed (64px)

```
┌──────┐
│ 🏠   │  → Tooltip: "Beranda"
├──────┤
│ 📚   │  → Tooltip: "Learn"
├──────┤
│ 🎯   │  → Tooltip: "Practice"
├──────┤
│ 💬   │  → Tooltip: "Support"
├──────┤
│ 📈   │  → Tooltip: "Growth"
├──────┤
│ 👥   │  → Tooltip: "Community"
├──────┤
│ ⚙️   │  → Tooltip: "Utilities"
└──────┘
```

### Mobile/Tablet — Drawer

- Full expanded sidebar content
- Overlay backdrop
- Swipe from left edge or hamburger to open
- Auto-close on route change

---

## Main Content Area

### Container

```css
/* Conceptual */
.main-content {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

### Page Structure Pattern

```tsx
// Conceptual page component structure
export function LearnerPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-mint flex flex-col">
      <LearnerHeader />
      <div className="flex flex-1">
        <LearnerSidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1280px] mx-auto p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `≥1280px` (xl) | Full sidebar, full header, max-width content |
| `1024px–1279px` (lg) | Full sidebar, full header, fluid content |
| `768px–1023px` (md) | Collapsible sidebar (drawer), full header |
| `<768px` (sm) | Hidden sidebar (drawer), compact header, bottom nav |

---

## State Management (Future)

| State | Persisted | Scope |
|-------|-----------|-------|
| Sidebar collapsed | localStorage | User preference |
| Active section | URL + localStorage | Session + restore |
| Mobile drawer open | — | Ephemeral |
| Search query | URL | Shareable |

---

## Accessibility

- Sidebar: `nav` landmark, `aria-label="Main navigation"`
- Sections: `section` with `aria-labelledby` pointing to section header
- Items: `button` or `a` with `aria-current="page"` when active
- Collapsed tooltips: `aria-label` on icon-only buttons
- Focus management: Trap in drawer, restore on close
- Skip link: "Skip to main content" at top of page

---

## Implementation Contract (B1.2+)

| File | Responsibility |
|------|----------------|
| `src/app/layouts/LearnerLayout.tsx` | Shell composition |
| `src/app/layouts/LearnerHeader.tsx` | Header component |
| `src/app/layouts/LearnerSidebar.tsx` | Sidebar component |
| `src/app/navigation/learnerNavigation.ts` | Navigation data |
| `src/app/providers/NavigationProvider.tsx` | State/context |
| `src/app/guards/learnerGuard.ts` | Route protection |

---

## Legacy Compatibility

During B1 transition, existing pages must continue working:

| Legacy View | Shell Integration |
|-------------|-------------------|
| `dashboard` | Render inside LearnerLayout main |
| `learning` | Render inside LearnerLayout main |
| `exam` | Render inside LearnerLayout main |
| `profile` | Render inside LearnerLayout main |

No legacy page should be deleted or rewritten in B1.1.