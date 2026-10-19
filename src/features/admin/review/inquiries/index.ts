/**
 * Admin Review / Inquiries domain — barrel
 * ========================================
 * B1.4D-T6 — Review / Inquiries extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/16-b1.4d-t6-review.md
 *
 * Import from this barrel, not the individual files.
 *
 * NOTE: this barrel exposes the INQUIRIES surface only
 * (`/admin/review/inquiries`). Testimonials live in `../testimonials`.
 */

export * from './useAdminInquiriesDomain';
export * from './AdminInquiriesPage';
