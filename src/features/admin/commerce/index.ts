/**
 * Admin Commerce domain — barrel
 * ===============================
 * B1.4D-T7A — Commerce Programs + Leads extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * The Commerce domain deliberately holds TWO FOCUSED domains (T7A):
 *
 *   - `programs` -> `/admin/commerce/programs`
 *   - `leads`    -> `/admin/commerce/leads`
 *
 * There is intentionally NO giant Commerce workspace page and NO combined store.
 * Programs is the canonical editable program list shared by the Users domain,
 * the Content Library editor, the Leads domain and the Programs page.
 *
 * T7B (Marketing / Campaigns) is NOT extracted — it still lives in
 * `AdminDashboard`.
 */

export * from './programs';
export * from './leads';
