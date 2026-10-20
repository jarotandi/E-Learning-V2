/**
 * Admin Commerce / Marketing domain — barrel
 * ==========================================
 * B1.4D-T7B — Commerce Marketing extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/18-b1.4d-t7b-commerce-marketing.md
 *
 * Import from this barrel, not the individual files.
 *
 * NOTE: this barrel exposes the MARKETING surface only
 * (`/admin/commerce/marketing`). Programs/Leads live in `../programs`/`../leads`.
 */

export * from './adminMarketingData';
export * from './useAdminMarketingDomain';
export * from './AdminMarketingPage';
export * from './AdminCampaignEditorDialog';