/**
 * Admin platform dashboard data
 * =============================
 * B1.4D-T3 — Platform (overview) extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/12-b1.4d-t3-platform-users.md
 *
 * Static chart data and the shared chart palette. Both were private constants
 * inside `AdminDashboard`. They are lifted here so the extracted
 * `AdminOverviewPage` and the still-legacy Reports charts share ONE definition
 * instead of duplicating it.
 *
 *   - `programData` — used only by the Overview "Program Popularity" pie.
 *   - `COLORS`      — the chart palette, used by Overview AND Reports.
 */

export const programData = [
  { name: 'SNBT Kedokteran', value: 420 },
  { name: 'SKD CPNS', value: 215 },
  { name: 'Sekolah Kedinasan', value: 180 },
  { name: 'OSN Matematika', value: 95 },
];

export const COLORS = ['#2563eb', '#1e3a8a', '#f59e0b', '#10b981', '#6366f1'];
