/**
 * Admin Commerce / Finance data
 * ==============================
 * B1.4D-T8 — Financial Center extraction (`/admin/commerce/finance`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/19-b1.4d-t8-finance.md
 *
 * Finance-owned constants and helpers moved out of AdminDashboard.tsx.
 * These are the canonical definitions for the Finance domain.
 *
 * Storage keys (exact, unchanged):
 * - theprams_demo_transactions
 * - theprams_demo_payment_proofs
 * - theprams_demo_finance_entries
 * - theprams_demo_finance_realizations
 * - theprams_demo_assets
 *
 * Finance owns ZERO audit/notification keys:
 * - theprams_demo_audit_events (owned by AdminDashboard)
 * - theprams_demo_notifications (owned by AdminDashboard)
 */

import type { FinanceEntry, AssetEntry } from './adminFinanceTypes';

/** Exact Finance storage keys (unchanged, no migration). */
export const FINANCE_STORAGE_KEYS = {
  TRANSACTIONS: 'theprams_demo_transactions',
  PAYMENT_PROOFS: 'theprams_demo_payment_proofs',
  FINANCE_ENTRIES: 'theprams_demo_finance_entries',
  FINANCE_REALIZATIONS: 'theprams_demo_finance_realizations',
  ASSETS: 'theprams_demo_assets',
} as const;

/** Non-depreciable fixed asset categories (verbatim). */
export const nonDepreciableFixedAssetCategories = ['Tanah/Bangunan'];

/** Budget directions (verbatim from legacy). */
export const budgetDirections = [
  { value: 'Marketing', label: 'Anggaran Marketing', target: 'Digital Marketing' },
  { value: 'Digital Marketing', label: 'Anggaran Digital Marketing', target: 'Digital Marketing' },
  { value: 'Editor Konten', label: 'Anggaran Editor / Desain Konten', target: 'Website Editor & Content Library' },
  { value: 'Pembuatan Program', label: 'Anggaran Pembuatan Program', target: 'Program Inventory' },
  { value: 'Materi Program', label: 'Anggaran Materi Program', target: 'Perancangan Materi' },
  { value: 'Freelance', label: 'Anggaran Freelance', target: 'Vendor / Freelancer' },
  { value: 'Lainnya', label: 'Anggaran Lainnya', target: 'Operasional Lainnya' },
] as const;

/** Default Finance entries (verbatim from legacy). */
export const defaultFinanceEntries = [
  { id: 'fixed-mentor', type: 'fixed' as const, name: 'Honor Mentor Tetap', category: 'Gaji & Mentor', amount: 8500000, period: 'Bulanan', note: 'Biaya tetap operasional kelas', createdAt: '2026-04-01' },
  { id: 'fixed-tools', type: 'fixed' as const, name: 'Tools Pembelajaran', category: 'Software', amount: 1200000, period: 'Bulanan', note: 'LMS, meeting, dan storage', createdAt: '2026-04-01' },
  { id: 'var-ads', type: 'variable' as const, name: 'Iklan Tryout Gratis', category: 'Marketing', amount: 2500000, period: 'April 2026', note: 'Campaign pendaftaran', createdAt: '2026-04-18' },
  { id: 'budget-scholarship', type: 'budget' as const, name: 'Kuota Beasiswa Prams Scholar', category: 'Beasiswa', amount: 15000000, period: 'Batch berjalan', note: 'Subsidi akses siswa terpilih', createdAt: '2026-04-20' },
];

/** Default Asset entries (verbatim). */
export const defaultAssetEntries = [
  { id: 'asset-laptop', type: 'fixed_asset' as const, name: 'Laptop Editor Konten', category: 'Peralatan Kantor', acquisitionValue: 12000000, currentValue: 10800000, acquisitionDate: '2026-04-01', usefulLifeMonths: 36, depreciationPerMonth: 333333, note: 'Aset tetap untuk produksi materi', createdAt: '2026-04-01' },
  { id: 'asset-cash', type: 'current_asset' as const, name: 'Kas Operasional', category: 'Aset Lancar', acquisitionValue: 25000000, currentValue: 25000000, acquisitionDate: '2026-04-01', usefulLifeMonths: 0, depreciationPerMonth: 0, note: 'Saldo kas demo', createdAt: '2026-04-01' },
];

/**
 * Parse a rupiah-like string/number to a plain integer.
 * EXACT legacy semantic:
 * - if number: return value
 * - if falsy: return 0
 * - otherwise: strip non-digits, parse, fallback 0
 */
export const parseRupiah = (value: string | number | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return Number(String(value).replace(/[^\d]/g, '')) || 0;
};

/**
 * Format a number as Rupiah string.
 * EXACT legacy semantic: `Rp ${value.toLocaleString('id-ID')}`
 */
export const formatRupiah = (value: number): string => `Rp ${value.toLocaleString('id-ID')}`;

/** Default Finance form state (verbatim from legacy). */
export const defaultFinanceForm = {
  type: 'fixed' as const,
  name: '',
  category: 'Operasional',
  amount: '',
  period: 'Bulanan',
  note: '',
};

/** Default Realization form state (verbatim). */
export const defaultRealizationForm = {
  financeEntryId: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  note: '',
};

/** Default Asset form state (verbatim). */
export const defaultAssetForm = {
  type: 'fixed_asset' as const,
  name: '',
  category: 'Peralatan Kantor',
  acquisitionValue: '',
  currentValue: '',
  acquisitionDate: new Date().toISOString().slice(0, 10),
  usefulLifeMonths: '36',
  note: '',
};

/** Demo Finance rows (verbatim from legacy). */
export const demoFinanceRows = [
  { id: 'demo-1', student: 'Andi Pratama', program: 'Med-Express', packageName: 'Premium', amount: 'Rp 3.500.000', status: 'Success', method: 'Virtual Account', date: '25 Apr 2026', type: 'paid' },
  { id: 'demo-2', student: 'Salsabila Putri', program: 'SNBT Gold', packageName: 'Premium', amount: 'Rp 2.250.000', status: 'Success', method: 'E-Wallet', date: '25 Apr 2026', type: 'paid' },
  { id: 'demo-3', student: 'Dewi Lestari', program: 'CPNS Master', packageName: 'Beasiswa Prams Scholar', amount: 'Rp 0', status: 'Scholarship Review', method: 'Beasiswa', date: '24 Apr 2026', type: 'scholarship' },
];

/** Subview IDs (verbatim order). */
export const FINANCE_SUBVIEWS = [
  { id: 'payments', label: 'Data Sistem Pembayaran' },
  { id: 'inputs', label: 'Input Biaya & Anggaran' },
  { id: 'realization', label: 'Realisasi Anggaran & Biaya' },
  { id: 'assets', label: 'Aset' },
  { id: 'accounting', label: 'Pembukuan Otomatis' },
  { id: 'reports', label: 'Laporan Keuangan' },
  { id: 'audit', label: 'Audit & Notifikasi' },
] as const;

/** Financial report periods (verbatim). */
export const FINANCIAL_REPORT_PERIODS = [
  { id: 'monthly', label: 'Bulanan' },
  { id: 'quarterly', label: 'Kuartal' },
  { id: 'yearly', label: 'Tahunan' },
] as const;

/** Payment status filter options (verbatim). */
export const paymentStatusOptions = ['All', 'Paid', 'Pending', 'Scholarship', 'Free'];

/** Payment type filter options (verbatim). */
export const paymentTypeFilterOptions = ['All', 'paid', 'free', 'scholarship'];