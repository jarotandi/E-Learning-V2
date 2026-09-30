/**
 * AKSA Application Layouts — barrel
 * ================================
 * B1.3 — Production Router + AKSA App Shell
 * B1.4A — Public header extraction
 *
 * Four shell boundaries, one per surface:
 *
 *   PublicLayout   hosts `PublicHeader` (single public chrome owner)
 *   LearnerLayout  the AKSA learner shell — header, 256px sidebar, drawer,
 *                  5-item mobile bottom bar
 *   StudioLayout   the AKSA Studio shell — desktop-first, no mobile bar
 *   AdminLayout    structural host only; `AdminDashboard` owns its own chrome
 *
 * The chrome-assignment rule that keeps any of them from doubling up on
 * navigation is documented in `../router/AppRouter.tsx`.
 *
 * B1.4A change: `PublicLayout` no longer imports the legacy
 * `src/components/Navbar.tsx`. The public header is now `PublicHeader`,
 * built on the design-system primitives and carrying the AKSA brand mark.
 */

export { AksaBrandMark, type AksaBrandMarkProps } from './AksaBrandMark';
export { PublicHeader, type PublicHeaderProps } from './PublicHeader';
export { PublicLayout } from './PublicLayout';
export { LearnerLayout, type LearnerLayoutProps } from './LearnerLayout';
export { StudioLayout } from './StudioLayout';
export { AdminLayout } from './AdminLayout';
