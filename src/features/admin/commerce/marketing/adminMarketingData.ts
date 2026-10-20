/**
 * Admin Commerce / Marketing data
 * ================================
 * B1.4D-T7B — Commerce Marketing extraction (`/admin/commerce/marketing`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/18-b1.4d-t7b-commerce-marketing.md
 *
 * The currency options and the canonical campaign form defaults used to live
 * inline inside `AdminDashboard.tsx`. They are moved here VERBATIM — same
 * entries, same field values, same semantics.
 *
 * Marketing introduces ZERO storage keys. Campaign state is IN-MEMORY ONLY.
 */

export type CurrencyOption = {
  code: 'IDR' | 'USD' | 'SGD' | 'MYR';
  label: string;
  symbol: string;
  locale: string;
};

/** Exact currency options (verbatim from legacy AdminDashboard). */
export const currencyOptions: CurrencyOption[] = [
  { code: 'IDR', label: 'Rupiah Indonesia', symbol: 'Rp', locale: 'id-ID' },
  { code: 'USD', label: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM', locale: 'ms-MY' },
];

/**
 * Parse a currency-like string/number to a plain integer.
 * EXACT legacy semantic: strip all non-digits, coerce to number, fallback 0.
 */
export const parseCurrencyAmount = (value: string | number): number =>
  Number(String(value).replace(/[^\d]/g, '')) || 0;

/**
 * Format an amount with the given currency code.
 * EXACT legacy semantic:
 *  - lookup currency (fallback to first option)
 *  - amount = number directly OR parseCurrencyAmount(value)
 *  - return `${currency.symbol} ${amount.toLocaleString(currency.locale)}`
 */
export const formatCurrencyAmount = (value: string | number, currencyCode = 'IDR'): string => {
  const currency = currencyOptions.find((item) => item.code === currencyCode) || currencyOptions[0];
  const amount = typeof value === 'number' ? value : parseCurrencyAmount(value);
  return `${currency.symbol} ${amount.toLocaleString(currency.locale)}`;
};

/** Default campaign form state (verbatim from legacy AdminDashboard). */
export type CampaignForm = typeof defaultCampaignForm;

export const defaultCampaignForm = {
  name: 'Campaign Tryout Gratis',
  objective: 'Lead Generation',
  channel: 'Meta Ads',
  audience: 'Siswa kelas 12 dan gap year',
  currency: 'IDR' as 'IDR' | 'USD' | 'SGD' | 'MYR',
  totalBudget: '5000000',
  dailyBudget: '250000',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  landingPage: '/tryout-gratis',
  note: 'Fokus akuisisi lead WhatsApp dan pendaftaran tryout gratis.',
};

/** Demo landing page rows (verbatim). */
export const demoLandingPages = [
  { name: 'SNBT Intensive 2025', url: '/snbt-2025', status: 'Active' as const, hits: '12k' },
  { name: 'Kedokteran Special', url: '/kedokteran', status: 'Active' as const, hits: '8.5k' },
  { name: 'CPNS Masterclass', url: '/cpns', status: 'Draft' as const, hits: '0' },
];

/** Objective options (verbatim). */
export const objectiveOptions = [
  'Lead Generation',
  'Traffic',
  'Conversion',
  'Brand Awareness',
  'Retargeting',
] as const;

/** Channel options (verbatim). */
export const channelOptions = [
  'Meta Ads',
  'Google Ads',
  'TikTok Ads',
  'Instagram Organic',
  'WhatsApp Broadcast',
  'Email Campaign',
] as const;