/**
 * Admin Commerce domain — barrel
 * ===============================
 * B1.4D-T7A/B/T8 — Commerce Programs + Leads + Marketing + Finance extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *            docs/aksa/b1/18-b1.4d-t7b-commerce-marketing.md
 *            docs/aksa/b1/19-b1.4d-t8-finance.md
 *
 * The Commerce domain deliberately holds FOUR FOCUSED domains:
 *
 *   - `programs`   -> `/admin/commerce/programs`
 *   - `leads`      -> `/admin/commerce/leads`
 *   - `marketing`  -> `/admin/commerce/marketing`
 *   - `finance`    -> `/admin/commerce/finance`
 *
 * There is intentionally NO giant Commerce workspace page and NO combined store.
 * Programs is the canonical editable program list shared by the Users domain,
 * the Content Library editor, the Leads domain and the Programs page.
 */

export * from './programs';
export * from './leads';
export * from './marketing';
export * from './finance';
