/**
 * Admin Commerce / Leads data
 * ============================
 * B1.4D-T7A — Commerce Leads extraction (`/admin/commerce/leads`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The demo lead seed and the canonical lead storage key used to live inline at
 * the top of `AdminDashboard.tsx`. They are moved here VERBATIM — same 3 seed
 * leads, same field values, same key string, no data correction.
 *
 * Canonical storage key (exact, unchanged): `theprams_demo_leads`.
 */

import type { Lead } from '../../../../types';

/** The canonical Leads storage key (exact; NOT renamed, no migration). */
export const LEAD_STORAGE_KEY = 'theprams_demo_leads';

/** Preserved legacy demo seed (exact). */
export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Rina Wijaya', email: 'rina@mail.com', phone: '0812345678', programOfInterest: 'SNBT Kedokteran', source: 'Instagram', status: 'Qualified', createdAt: '2026-04-20' },
  { id: '2', name: 'Andi Pratama', email: 'andi@mail.com', phone: '0819876543', programOfInterest: 'SKD CPNS', source: 'Google', status: 'New', createdAt: '2026-04-22' },
  { id: '3', name: 'Siska Putri', email: 'siska@mail.com', phone: '0811223344', programOfInterest: 'Kedinasan', source: 'TikTok', status: 'Contacted', createdAt: '2026-04-23' },
];
