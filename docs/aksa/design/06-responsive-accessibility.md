# Responsive & Accessibility Contract

**Status: OFFICIAL — Derived from Approved Generated AKSA Designs**

This document defines the responsive breakpoints, accessibility standards, and contrast requirements for AKSA.

---

## Breakpoints

Aligned with Tailwind CSS defaults for seamless integration.

| Name | Min Width | Target Devices | Sidebar Behavior |
|------|-----------|----------------|------------------|
| `sm` | 640px | Large phones | Hidden (drawer), bottom nav |
| `md` | 768px | Tablets | Hidden (drawer), bottom nav |
| `lg` | 1024px | Laptops | Collapsible (drawer on md) |
| `xl` | 1280px | Desktops | Full, persistent |
| `2xl` | 1536px | Large desktops | Full, persistent, wider content max |

### Breakpoint Tokens (TypeScript)

```typescript
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
```

### Media Query Helpers

```typescript
export const mediaQueries = {
  sm: '@media (min-width: 640px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
  '2xl': '@media (min-width: 1536px)',
  // Downward
  'max-sm': '@media (max-width: 639px)',
  'max-md': '@media (max-width: 767px)',
  'max-lg': '@media (max-width: 1023px)',
  'max-xl': '@media (max-width: 1279px)',
  'max-2xl': '@media (max-width: 1535px)',
  // Touch
  hover: '@media (hover: hover)',
  'no-hover': '@media (hover: none)',
  pointer: '@media (pointer: fine)',
  'coarse-pointer': '@media (pointer: coarse)',
  // Reduced motion
  'reduce-motion': '@media (prefers-reduced-motion: reduce)',
  // High contrast
  'high-contrast': '@media (prefers-contrast: high)',
  // Dark mode
  dark: '@media (prefers-color-scheme: dark)',
} as const;
```

---

## Responsive Patterns

### Navigation

| Breakpoint | Learner | Studio |
|------------|---------|--------|
| `≥xl` | Persistent sidebar | Persistent sidebar |
| `lg` | Persistent sidebar | Persistent sidebar |
| `md` | Drawer + hamburger | Drawer + hamburger |
| `sm` | Drawer + hamburger + bottom nav | Drawer + hamburger |

### Content Width

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| `≥2xl` | 1536px (Studio), 1280px (Learner) | 32px |
| `xl` | 1280px | 24px |
| `lg` | 100% | 24px |
| `md` | 100% | 20px |
| `sm` | 100% | 16px |

### Grid Layouts

| Pattern | `≥xl` | `lg` | `md` | `sm` |
|---------|-------|------|------|------|
| Dashboard cards | 4-col | 3-col | 2-col | 1-col |
| Course grid | 4-col | 3-col | 2-col | 1-col |
| Editor panels | 3-panel | 3-panel | 2-panel (L+C / P drawer) | 1-panel (P modal) |
| Validation | 2-panel (60/40) | 2-panel | Stacked | Stacked |
| Tables | Full | Full | Horizontal scroll | Card layout |

### Typography Scaling

| Size | `≥xl` | `lg` | `md` | `sm` |
|------|-------|------|------|------|
| Display XL | 3.5rem | 3rem | 2.5rem | 2rem |
| Display LG | 2.5rem | 2.25rem | 2rem | 1.75rem |
| Display MD | 2rem | 1.75rem | 1.5rem | 1.25rem |
| Body MD | 1rem | 1rem | 1rem | 1rem |
| Body SM | 0.875rem | 0.875rem | 0.875rem | 0.875rem |

---

## Accessibility Standards

### WCAG 2.1 Level AA (Minimum)

All new UI must meet WCAG 2.1 AA.

#### Color Contrast

| Element | Minimum Ratio | AKSA Target |
|---------|---------------|-------------|
| Normal text | 4.5:1 | 7:1 (AAA) |
| Large text (≥18px/14px bold) | 3:1 | 4.5:1 |
| UI components (borders, icons) | 3:1 | 4.5:1 |
| Focus indicators | 3:1 | 4.5:1 |

#### AKSA Color Contrast Verification

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `#064e3b` (emerald) | `#ffffff` | 8.9:1 | ✅ AAA |
| `#009688` (teal) | `#ffffff` | 3.9:1 | ⚠️ AA Large only |
| `#ffffff` | `#009688` (teal) | 3.9:1 | ⚠️ AA Large only |
| `#064e3b` (emerald) | `#f0fdfa` (mint) | 6.8:1 | ✅ AAA |
| `#ffffff` | `#064e3b` (emerald) | 8.9:1 | ✅ AAA |
| `#ffc107` (gold) | `#064e3b` (emerald) | 8.2:1 | ✅ AAA |
| `#404040` (neutral-700) | `#ffffff` | 10.4:1 | ✅ AAA |
| `#737373` (neutral-500) | `#ffffff` | 4.9:1 | ✅ AA |

> **Note:** Teal `#009688` on white is **3.9:1** — only passes AA for large text (≥18px or 14px bold). For body text on teal, use white text. For teal text on white, use emerald `#064e3b` instead.

### Focus Management

| Requirement | Implementation |
|-------------|----------------|
| Visible focus | `outline: 2px solid #009688; outline-offset: 2px;` |
| Focus order | Logical, matches visual order |
| Skip links | "Skip to main content" at page top |
| Focus trap | Modals, drawers, dropdowns |
| Focus restoration | Return to trigger on close |

### Keyboard Navigation

| Pattern | Keys |
|---------|------|
| Navigation | Tab / Shift+Tab |
| Activate | Enter / Space |
| Menus | Arrow keys, Escape to close |
| Tabs | Arrow keys, Home/End |
| Tables | Arrow keys (grid), Tab (row) |
| Slider | Arrow keys, Home/End, Page Up/Down |

### ARIA Patterns

| Component | Required ARIA |
|-----------|---------------|
| Sidebar nav | `nav role="navigation" aria-label="Main navigation"` |
| Collapsible sections | `aria-expanded`, `aria-controls` |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Dropdown | `role="menu"`, `aria-haspopup`, `aria-expanded` |
| Tooltip | `role="tooltip"`, `aria-describedby` |
| Progress | `role="progressbar"`, `aria-valuemin/max/now` |
| Status | `role="status"`, `aria-live="polite"` |
| Alert | `role="alert"`, `aria-live="assertive"` |

### Screen Reader Support

- All images: meaningful `alt` or `alt=""` for decorative
- Icons: `aria-hidden="true"` + visible label or `aria-label`
- Form inputs: associated `<label>` or `aria-label`
- Error messages: `aria-describedby` linking to error text
- Live regions: validation progress, toast notifications

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  :root {
    --border-width: 2px;
    --focus-ring: 3px;
  }
  .card { border: 2px solid currentColor; }
  .button { border: 2px solid currentColor; }
}
```

---

## Touch Targets

| Element | Minimum Size | Recommended |
|---------|--------------|-------------|
| Buttons | 44×44px | 48×48px |
| Links (tap) | 44×44px | 48×48px |
| Form controls | 44×44px | 48×48px |
| Navigation items | 44×44px | 48×48px |

---

## Dark Mode (Future)

Color tokens support dark mode but not implemented in B1.

```typescript
// Future extension
export const colorsDark = {
  surface: {
    white: '#171717',        // neutral-950
    mint: '#064e3b',         // emerald-900
    mintSecondary: '#065f46', // emerald-800
  },
  // ... inverted semantic colors
};
```

---

## Implementation Checklist (B1.2+)

| Item | Status |
|------|--------|
| Breakpoint tokens exported | Planned |
| Media query helpers exported | Planned |
| Focus styles global | Planned |
| Skip link component | Planned |
| Focus trap hook | Planned |
| ARIA component primitives | Planned |
| Reduced motion global CSS | Planned |
| High contrast global CSS | Planned |
| Dark mode tokens | Future |

---

## Testing Requirements

| Test | Tool | Frequency |
|------|------|-----------|
| Automated a11y | axe-core / Lighthouse | CI |
| Keyboard nav | Manual | Per feature |
| Screen reader | NVDA / VoiceOver | Per release |
| Color contrast | axe / manual | Per design |
| Responsive | Browser devtools | Per feature |
| Zoom 200% | Browser | Per release |

---

## Do Not Implement Yet (B1.1)

- ❌ Breakpoint hooks
- ❌ Focus trap components
- ❌ ARIA primitives
- ❌ Dark mode

✅ **Do:** Document the contract (this file), create token structure