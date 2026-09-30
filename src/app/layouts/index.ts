/**
 * AKSA Application Layouts — barrel
 * ================================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Four shell boundaries, one per surface:
 *
 *   PublicLayout   hosts the legacy `Navbar` (single public chrome owner)
 *   LearnerLayout  the AKSA learner shell — header, 256px sidebar, drawer,
 *                  5-item mobile bottom bar
 *   StudioLayout   the AKSA Studio shell — desktop-first, no mobile bar
 *   AdminLayout    structural host only; `AdminDashboard` owns its own chrome
 *
 * The chrome-assignment rule that keeps any of them from doubling up on
 * navigation is documented in `../router/AppRouter.tsx`.
 */

export { AksaBrandMark, type AksaBrandMarkProps } from './AksaBrandMark';
export { PublicLayout } from './PublicLayout';
export { LearnerLayout, type LearnerLayoutProps } from './LearnerLayout';
export { StudioLayout } from './StudioLayout';
export { AdminLayout } from './AdminLayout';
