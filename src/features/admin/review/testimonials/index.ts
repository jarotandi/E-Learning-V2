/**
 * Admin Review / Testimonials domain — barrel
 * ===========================================
 * B1.4D-T6 — Review / Testimonials extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/16-b1.4d-t6-review.md
 *
 * Import from this barrel, not the individual files.
 *
 * NOTE: this barrel exposes the TESTIMONIALS surface only
 * (`/admin/review/testimonials`). Inquiries live in `../inquiries`.
 */

export * from './useAdminTestimonialsDomain';
export * from './AdminTestimonialsPage';
