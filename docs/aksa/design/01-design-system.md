# AKSA Design System

**Status: OFFICIAL — Derived from Approved Generated AKSA Designs**

This document defines the typed design token contract and component primitives for AKSA. It is additive to the existing Tailwind + CSS setup and must not break current styling.

---

## Token Contract (`src/design-system/tokens/brand.ts`)

The token contract is the single source of truth for AKSA design values. All new components should reference these tokens.

### Color Tokens

```typescript
export const colors = {
  // Brand
  brand: {
    teal: '#009688',
    tealHover: '#00796b',
    tealActive: '#00695c',
    emerald: '#064e3b',
    emeraldHover: '#065f46',
    gold: '#ffc107',
    goldHover: '#ffb300',
    goldSoft: '#fff8e1',
  },

  // Surfaces
  surface: {
    white: '#ffffff',
    mint: '#f0fdfa',
    mintSecondary: '#ccfbf1',
    mintTertiary: '#a7f3d0',
  },

  // Semantic
  semantic: {
    success: '#059669',
    successSoft: '#d1fae5',
    warning: '#d97706',
    warningSoft: '#fef3c7',
    error: '#dc2626',
    errorSoft: '#fee2e2',
    info: '#0284c7',
    infoSoft: '#e0f2fe',
  },

  // Neutral (extend existing)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
} as const;
```

### Spacing Scale

```typescript
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px,
} as const;
```

### Border Radius

```typescript
export const radius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
  card: '1rem',     // Default card radius
  button: '0.5rem', // Default button radius
} as const;
```

### Shadows

```typescript
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
  cardHover: '0 4px 12px 0 rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
} as const;
```

### Typography

```typescript
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
```

### Layout Dimensions

```typescript
export const layout = {
  // Navigation
  nav: {
    headerHeight: '4rem',      // 64px
    sidebarWidth: '16rem',     // 256px
    sidebarCollapsed: '4rem',  // 64px
    mobileNavHeight: '3.5rem', // 56px
  },
  // Content
  content: {
    maxWidth: '80rem',      // 1280px
    maxWidthWide: '96rem',  // 1536px
    padding: '1.5rem',      // 24px
    gap: '1.5rem',          // 24px
  },
  // Breakpoints (aligned with Tailwind)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;
```

### Z-Index Scale

```typescript
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
  nav: 1000,
} as const;
```

---

## Component Primitives (Planned)

These are the foundational components to be built in B1.2+. Documented here for contract alignment.

| Component | Purpose | Status |
|-----------|---------|--------|
| `Button` | Primary, secondary, ghost, danger variants | Planned |
| `Card` | Rounded card with subtle shadow, hover states | Planned |
| `Input` | Form input with label, error, helper states | Planned |
| `Select` | Styled select with search/grouping | Planned |
| `Tabs` | Horizontal/vertical tab navigation | Planned |
| `Badge` | Status, count, label indicators | Planned |
| `Avatar` | User/brand avatar with fallback | Planned |
| `Dropdown` | Menu, select, combobox patterns | Planned |
| `Modal` | Dialog, drawer, sheet patterns | Planned |
| `Tooltip` | Hover/focus contextual info | Planned |
| `Table` | Data table with sorting, selection | Planned |
| `Progress` | Linear, circular, step progress | Planned |

---

## Migration Strategy

1. **B1.1** — Token contract created, existing CSS/Tailwind unchanged
2. **B1.2** — Component primitives built, consumed by new shells
3. **B1.3** — Legacy components incrementally migrated
4. **B1.4** — Full design system documentation + Storybook

---

## Usage Rule

New code in `src/app`, `src/features`, `src/studio` should import the tokens rather than hardcoding values.

> **Import path note (CONF-01).** The repository `@/*` alias currently resolves to the **project root**, not `src/` (`tsconfig.json` → `"@/*": ["./*"]`, `vite.config.ts` → `path.resolve(__dirname, '.')`). Therefore `@/design-system/tokens/brand` does **not** resolve today. Until B1.2 realigns the alias to `src/*`, use a relative import — matching the existing `src/components/*` convention.

```typescript
// ✅ Correct (B1.1 — relative import from inside src/)
import { colors, spacing, radius } from '../../design-system/tokens/brand';
// or, from src/app/navigation/ specifically:
import { layout, zIndex } from '../../design-system/tokens/brand';

// ❌ Does not resolve in B1.1 (alias points at repo root)
import { colors } from '@/design-system/tokens/brand';

// ❌ Avoid in new code
style={{ backgroundColor: '#009688', borderRadius: '8px' }}
```

Tracked as CONF-01 in `docs/aksa/b1/02-b1-subbatch-plan.md`.