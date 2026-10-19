/**
 * Admin Commerce / Programs domain — barrel
 * =========================================
 * B1.4D-T7A — Commerce Programs extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/17-b1.4d-t7a-commerce-programs-leads.md
 *
 * Import from this barrel, not the individual files.
 *
 * NOTE: this barrel exposes the PROGRAMS surface only
 * (`/admin/commerce/programs`). Leads live in `../leads`.
 */

export * from './useAdminProgramsDomain';
export * from './AdminProgramsPage';
export * from './AdminProgramEditorDialog';
export * from './AdminProgramSaveConfirmDialog';
