/**
 * AKSA Admin Layout
 * =================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/b1/02-b1-subbatch-plan.md
 *            docs/aksa/b1/01-legacy-compatibility-map.md
 *
 * ## B1.3 SCOPE — STRUCTURAL HOST ONLY
 *
 * This layout exists to give `/admin` a route boundary and a place to hang
 * future admin chrome. It deliberately adds NO navigation, NO header, and NO
 * shell of its own, because:
 *
 *   `AdminDashboard.tsx` already renders a complete 256px sidebar
 *   (`<aside className="w-64 bg-brand-navy ...">`) plus its own header and
 *   tab bar. Adding shell chrome here would produce a double sidebar and a
 *   double header — the exact failure mode B1.3 must avoid.
 *
 * Decomposing that 408.8 KB monolith into `AdminLayout` + admin sections is
 * **B1.4** work (eight target sections: platform dashboard, users/roles,
 * academic/curriculum, studio/content, validation/review, programs/commerce,
 * analytics, configuration).
 *
 * ## NO SECURITY CLAIM
 *
 * This layout provides ROUTING and a layout boundary. It is NOT a security
 * boundary and it does not authenticate anything.
 *
 * SEC-P1-03 ("admin view has no authentication gate") remains **OPEN**. The
 * legacy "DEMO ADMIN" floating button is an unguarded shortcut to this route
 * and is retained deliberately, because removing it would delete a legacy
 * capability and B1.3 is a migration batch. Real admin auth (identity, RLS,
 * authorization) is a **B2** deliverable.
 */

import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  // Deliberately minimal: no chrome. `AdminDashboard` owns its own.
  return <Outlet />;
}

export default AdminLayout;
