# Navigation & Information Architecture Contract

**Status: OFFICIAL — Derived from Approved Generated AKSA Designs**

This document formalizes the target Information Architecture for AKSA across all product surfaces. It aligns with the route map in [04-route-map.md](../04-route-map.md) and the module boundaries in [03-module-boundaries.md](../03-module-boundaries.md).

---

## Learner App Navigation

### Desktop — Primary Sidebar Navigation

```
BERANDA                    → /app

LEARN                      → /app/learn
├── My Path / Skill Map    → /app/path
├── Kelas Saya             → /app/learn (enrolled)
├── Library                → /app/library
└── Skills Labs            → /app/labs

PRACTICE                   → /app/practice
├── Projects               → /app/projects
├── Assessment Center      → /app/assessment
└── Partner Practice       → /app/partner-practice

SUPPORT                    → /app/support
├── AI Tutor               → /app/ai
├── Guru & Mentor          → /app/mentors
└── AKSA Live              → /app/live

GROWTH                     → /app/growth
├── Progress               → /app/progress
├── Portfolio              → /app/portfolio
├── Skills Passport        → /app/passport
└── Career                 → /app/career

COMMUNITY                  → /app/community
├── Community              → /app/community (feed)
└── Rewards                → /app/rewards

UTILITIES
├── Calendar               → /app/calendar
├── Wallet & Payments      → /app/wallet
├── Downloads              → /app/downloads
├── Settings               → /app/settings
└── Help Center            → /app/help
```

### Header (Global, All Pages)

| Element | Behavior |
|---------|----------|
| Global Search | Cmd+K / Ctrl+K opens command palette |
| Notifications / Inbox | Bell icon, dropdown with unread count |
| Profile Menu | Avatar, name, role badge, links to profile/settings/logout |

### Mobile — Bottom Navigation (5 items max)

| Index | Label | Route | Icon |
|-------|-------|-------|------|
| 0 | Home | `/app` | House |
| 1 | Learn | `/app/learn` | BookOpen |
| 2 | Labs | `/app/labs` | FlaskConical |
| 3 | AI | `/app/ai` | Bot |
| 4 | Profile | `/app/profile` | User |

> **Note:** Mobile uses a "More" drawer for Utilities, Community, Growth sections.

### Mobile — Hamburger / Drawer (Full IA)

Same grouping as desktop sidebar, accessible via avatar/menu button in header.

---

## AKSA Studio Navigation

### Desktop — Primary Sidebar Navigation

```
Dashboard                  → /studio

EDITOR
├── Studio / Editor        → /studio/editor/:contentId
├── Templates              → /studio/templates
└── Media Library          → /studio/media

CONTENT FACTORY
└── Content Factory        → /studio/factory

VALIDATION & REVIEW
├── Validation Center      → /studio/validation
├── Review Queue           → /studio/review
└── Published Content      → /studio/published

INSIGHTS
└── Analytics              → /studio/analytics

SETTINGS
└── Settings               → /studio/settings
```

### Creator AI Placement

**Creator AI lives INSIDE Studio** — it is not a separate primary navigation item.

- Accessible within Editor (copilot panel)
- Accessible within Content Factory (batch generation)
- Not exposed in Learner navigation

### Header (Studio)

| Element | Behavior |
|---------|----------|
| Breadcrumbs | Context-aware: Dashboard > Editor > Content Title |
| Quick Actions | New Content, Import, Sync |
| Notifications | Validation alerts, review assignments |
| Profile Menu | Role-aware: switches to Learner/Admin if permitted |

---

## Public Web Navigation

### Header

| Item | Route |
|------|-------|
| AKSA Logo | `/` |
| Programs | `/programs` |
| Mentors | `/mentors` |
| Blog | `/blog` |
| Contact | `/contact` |
| Login | `/login` |
| Register | `/register` |
| Language | Dropdown |
| Theme | Toggle |

### Footer

| Column | Links |
|--------|-------|
| Product | Programs, Mentors, Pricing, Features |
| Company | About, Blog, Careers, Press |
| Resources | Help Center, Community, API Docs, Status |
| Legal | Privacy, Terms, Cookie Policy, Security |

---

## Educator App Navigation (Future)

```
/educator
/educator/students
/educator/classes
/educator/questions
/educator/sessions
/educator/calendar
/educator/materials
/educator/assessments
/educator/reviews
/educator/earnings
/educator/settings
```

---

## Academic / Platform Admin Navigation (Future)

```
/admin
/admin/curriculum
/admin/skills
/admin/sources
/admin/assessment-bank
/admin/educators
/admin/institutions
/admin/partners
/admin/credentials
/admin/access-fund
/admin/audit
/admin/settings
```

---

## Navigation Data Contract (TypeScript)

See implementation in:
- `src/app/navigation/learnerNavigation.ts`
- `src/app/navigation/studioNavigation.ts`

### Core Types

```typescript
export interface NavItem {
  id: string;
  label: string;
  path?: string;              // Optional for section headers
  icon?: string;              // Lucide icon name
  badge?: string | number;    // Notification count
  children?: NavItem[];       // Nested items
  section?: boolean;          // True if this is a section header
  requiredCapabilities?: string[]; // Future: permission checks
  mobilePriority?: number;    // For mobile bottom nav (0-4)
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface NavigationConfig {
  sections: NavSection[];
  headerActions: NavItem[];   // Search, notifications, profile
  mobileBottomNav: NavItem[]; // Max 5 items
}
```

---

## IA Principles

1. **Group by capability, not feature** — Learners see "Learn", "Practice", "Support", not individual pages
2. **Progressive disclosure** — Collapsible sections, mobile drawer for secondary items
3. **Role-aware** — Navigation adapts to user capabilities (future)
4. **Consistent patterns** — Same section/group/item structure across surfaces
5. **Search-first** — Global search as primary discovery for power users
6. **Context preservation** — Breadcrumbs, active states, deep linking

---

## Implementation Phases

| Phase | Scope |
|-------|-------|
| B1.1 | Data contracts only (this doc + TypeScript files) |
| B1.2 | Production router + learner shell + studio shell |
| B1.3 | Sidebar components, mobile nav, header |
| B1.4 | Role-aware navigation, guards, breadcrumbs |

---

## Do Not Implement Yet (B1.1)

- ❌ Router migration
- ❌ Sidebar components
- ❌ Mobile bottom nav
- ❌ Header with search/notifications
- ❌ Breadcrumbs
- ❌ Role-aware filtering

✅ **Do:** Create the typed navigation data contracts in `src/app/navigation/`