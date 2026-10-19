/**
 * Admin Review domain — barrel
 * ============================
 * B1.4D-T6 — Review / Inquiries + Testimonials extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/16-b1.4d-t6-review.md
 *
 * The Review domain deliberately holds TWO FOCUSED domains, not one giant Review
 * store:
 *
 *   - `inquiries`    -> `/admin/review/inquiries`
 *   - `testimonials` -> `/admin/review/testimonials`
 *
 * Each has exactly ONE canonical hook, invoked once by the persistent
 * `AdminDashboard`, and its own view-only page. There is intentionally NO
 * `AdminReviewWorkspacePage` and no combined Review store.
 */

export * from './inquiries';
export * from './testimonials';
