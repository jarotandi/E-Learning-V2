/**
 * Admin Commerce / Leads domain — barrel
 * ======================================
 * B1.4D-T7A — Commerce Leads extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * Import from this barrel, not the individual files.
 *
 * NOTE: this barrel exposes the LEADS surface only
 * (`/admin/commerce/leads`). Programs live in `../programs`.
 */

export * from './adminLeadsData';
export * from './useAdminLeadsDomain';
export * from './AdminLeadsPage';
export * from './AdminLeadEditorDialog';
export * from './AdminLeadConvertDialog';
export * from './AdminLeadDetailDialog';
