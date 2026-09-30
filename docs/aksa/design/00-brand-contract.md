# AKSA Brand Contract

**Status: OFFICIAL — Derived from Approved Generated AKSA Designs**

---

## Brand Identity

| Property | Value |
|----------|-------|
| **Brand Name** | AKSA |
| **Tagline** | Belajar Tanpa Batas |
| **Identity Mark** | Minimal stylized "A" / AKSA monogram |
| **Tone** | Professional, warm, future-learning — not childish |

---

## Color Palette

### Primary Brand Colors

| Role | Hex | Usage |
|------|-----|-------|
| Primary Teal | `#009688` | Brand identity: navigation, boundaries, icons, focus rings, large text |
| Accessible Teal | `#00796b` | Filled primary controls carrying normal-size white text (~5.32:1) |
| Deep Emerald | `#064e3b` | Hover states, emphasis, dark mode primary |
| Gold Accent | `#ffc107` | Spark/highlight, rewards, premium indicators |

### Surface Colors

| Role | Hex | Usage |
|------|-----|-------|
| White | `#ffffff` | Primary canvas, cards |
| Mint Surface | `#f0fdfa` | Secondary canvas, subtle backgrounds |
| Mint Secondary | `#ccfbf1` | Tertiary backgrounds, hover states |

### Semantic Colors (to be extended in B1.2+)

| Role | Light | Dark | Notes |
|------|-------|------|-------|
| Success | `#059669` | `#34d399` | |
| Warning | `#d97706` | `#fbbf24` | Gold accent aligns |
| Error | `#dc2626` | `#f87171` | |
| Info | `#0284c7` | `#38bdf8` | |

---

## Typography

| Role | Font | Notes |
|------|------|-------|
| Primary | **Inter** (existing) | Retained in B1; no new font dependency introduced |
| Monospace | System UI monospace | For code/data display |

### Type Scale (Reference)

| Size | Rem | Usage |
|------|-----|-------|
| Display XL | 3.5rem / 56px | Hero, major headlines |
| Display LG | 2.5rem / 40px | Page titles |
| Display MD | 2rem / 32px | Section headers |
| Display SM | 1.5rem / 24px | Subsection headers |
| Body LG | 1.125rem / 18px | Lead paragraphs |
| Body MD | 1rem / 16px | Default body text |
| Body SM | 0.875rem / 14px | Secondary text, captions |
| Body XS | 0.75rem / 12px | Micro labels, badges |

---

## Visual Language

### Approved Design Direction

- **Premium modern EdTech** — clean, professional, trustworthy
- **Clean white/mint canvas** — light, airy, content-focused
- **Teal/emerald navigation and primary actions** — brand consistency
- **Restrained gold highlights** — premium feel, rewards, achievements
- **Rounded cards** — approachable, modern
- **Soft borders** — subtle separation, not heavy lines
- **Subtle shadows** — depth without drama
- **Generous whitespace** — breathing room, clear hierarchy
- **Clear information hierarchy** — scan-able, structured
- **Modern dashboard layout** — efficient, organized
- **Clean educational illustrations** — purposeful, not decorative
- **Nature / horizon / future-learning motif** — where appropriate
- **Desktop-first but responsive** — mobile considered from start
- **Accessible contrast** — WCAG AA minimum
- **No excessive gradients** — flat, clean
- **No glassmorphism-heavy UI** — solid surfaces
- **No random neon palette** — restrained, intentional
- **No unrelated redesign style** — consistent with approved direction

---

## Logo / Monogram Usage

| Context | Treatment |
|---------|-----------|
| App header | AKSA wordmark + minimal A monogram |
| Favicon | A monogram only |
| Mobile nav | A monogram only (space-constrained) |
| Marketing | Full lockup with tagline |

---

## Do Not Deviate

The following are **non-negotiable** without architect review:

1. Primary teal `#009688` must remain the primary brand color
2. Gold `#ffc107` must remain the accent/spark color
3. Inter font must not be replaced in B1
4. Rounded card aesthetic must be preserved
5. Clean white/mint canvas must remain the primary surface

## Accessibility Refinement (B1.2 / AR-02)

Item 1 above is a **brand identity** rule and is unchanged. Accessibility
refines **how** teal is applied, not which teal defines AKSA:

- `#009688` is ~3.67:1 against white. It is valid for navigation, borders, icons,
  focus rings, and sufficiently large text (≥18px, or ≥14px bold).
- For a filled primary control with normal-size white text, use `#00796b`
  (`brand.tealAccessible`, ~5.32:1) so the text meets WCAG AA.
- For normal-size body text on white, use emerald `#064e3b`.
- Gold `#ffc107` is accent only; never normal-size text on white.

This is an implementation refinement mandated by WCAG 2.1 AA. It does **not**
alter the approved generated AKSA visual direction. See
[06-responsive-accessibility.md](./06-responsive-accessibility.md).