/**
 * Admin Commerce / Finance domain hook
 * ====================================
 * B1.4D-T8 — Financial Center extraction (`/admin/commerce/finance`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/19-b1.4d-t8-finance.md
 *
 * The Financial Center state used to live inline inside `AdminDashboard.tsx`.
 * It now lives here, and the hook is invoked ONCE by the PERSISTENT
 * `AdminDashboard` — never by the route-mounted `AdminFinancePage` — so
 * transient state (subview, filters, modal flags) survives client-side tab
 * changes exactly as the legacy inline state did.
 *
 * Finance owns FIVE canonical storage keys (exact, unchanged):
 *   theprams_demo_transactions
 *   theprams_demo_payment_proofs
 *   theprams_demo_finance_entries
 *   theprams_demo_finance_realizations
 *   theprams_demo_assets
 *
 * Finance owns ZERO audit/notification keys:
 *   theprams_demo_audit_events (owned by AdminDashboard)
 *   theprams_demo_notifications (owned by AdminDashboard)
 *
 * Cross-domain dependencies (injected, never imported):
 *   - users / persistUsers (from Users domain) for student auto-create
 *   - notify / recordAudit / queueNotification / downloadTextFile (shared adapters)
 *
 * This module never imports `AdminDashboard` (no cycle) and owns no
 * audit/notification infrastructure state.
 */

import { useEffect, useMemo, useState } from 'react';
import type { UserAccount } from '../../../../types';
import {
  FINANCE_STORAGE_KEYS,
  defaultFinanceEntries,
  defaultAssetEntries,
  defaultFinanceForm,
  defaultRealizationForm,
  defaultAssetForm,
  parseRupiah,
  formatRupiah,
  budgetDirections,
  nonDepreciableFixedAssetCategories,
  demoFinanceRows,
  FINANCE_SUBVIEWS,
  FINANCIAL_REPORT_PERIODS,
  paymentStatusOptions,
  paymentTypeFilterOptions,
} from './adminFinanceData';
import { readStorageArray } from '../../adminStorage';
import { isApprovedStudentRecord, userFromStudentRecord } from '../../../users';
import type { FinanceEntry, FinanceRealization, AssetEntry, FinanceTransaction, PaymentProof } from './adminFinanceTypes';

export type FinanceSubView = 'payments' | 'inputs' | 'realization' | 'assets' | 'accounting' | 'reports' | 'audit';
export type FinancialReportPeriod = 'monthly' | 'quarterly' | 'yearly';

export interface UseAdminFinanceDomainOptions {
  /** Canonical users list (from Users domain) for student auto-create. */
  users: UserAccount[];
  /** Canonical users persistence adapter (from Users domain). */
  persistUsers: (users: UserAccount[]) => void;
  /** Toast adapter (shared, stays owned by AdminDashboard). */
  notify: (message: string) => void;
  /** Audit adapter (shared, stays owned by AdminDashboard). */
  recordAudit: (module: string, action: string, detail: string) => void;
  /** Notification queue adapter (shared, stays owned by AdminDashboard). */
  queueNotification: (channel: 'Email' | 'WhatsApp' | 'System', recipient: string, subject: string, message: string) => void;
  /** CSV download adapter (shared, stays owned by AdminDashboard). */
  downloadTextFile: (filename: string, content: string, mime?: string) => void;
}

export interface UseAdminFinanceDomainResult {
  // Canonical Finance state
  financeTransactions: FinanceTransaction[];
  paymentProofs: PaymentProof[];
  financeEntries: FinanceEntry[];
  financeRealizations: FinanceRealization[];
  assetEntries: AssetEntry[];

  // View state (survives client-side tab navigation)
  financeSubView: FinanceSubView;
  setFinanceSubView: React.Dispatch<React.SetStateAction<FinanceSubView>>;
  financialReportPeriod: FinancialReportPeriod;
  setFinancialReportPeriod: React.Dispatch<React.SetStateAction<FinancialReportPeriod>>;
  paymentSearchTerm: string;
  setPaymentSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  paymentStatusFilter: string;
  setPaymentStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  paymentTypeFilter: string;
  setPaymentTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  financeMetricDetail: { title: string; rows: any[]; description: string } | null;
  setFinanceMetricDetail: React.Dispatch<React.SetStateAction<{ title: string; rows: any[]; description: string } | null>>;
  selectedFinanceRecord: { tx: any; proof?: any } | null;
  setSelectedFinanceRecord: React.Dispatch<React.SetStateAction<{ tx: any; proof?: any } | null>>;

  // Forms
  financeForm: any;
  setFinanceForm: React.Dispatch<React.SetStateAction<any>>;
  realizationForm: any;
  setRealizationForm: React.Dispatch<React.SetStateAction<any>>;
  assetForm: any;
  setAssetForm: React.Dispatch<React.SetStateAction<any>>;

  // Derived data
  financeRows: any[];
  paymentStatusOptions: string[];
  filteredFinanceRows: any[];
  financeSummary: any;
  accountingRows: any[];
  financialReports: any;

  // Operations
  refreshFinanceCenter: () => void;
  saveFinanceEntries: (nextEntries: any[]) => void;
  addFinanceEntry: () => void;
  deleteFinanceEntry: (id: string) => void;
  saveFinanceRealizations: (nextRows: any[]) => void;
  addFinanceRealization: () => void;
  saveAssetEntries: (nextRows: any[]) => void;
  addAssetEntry: () => void;

  // Invoice/Proof viewers
  openStoredInvoice: (tx: any) => void;
  openStoredProof: (proof: any) => void;

  // Payment status workflow
  updateFinanceRecordStatus: (invoiceId: string, nextStatus: string) => void;

  // Review notification workflow
  buildReviewTemplate: (tx: any) => string;
  openReviewEmail: (tx: any) => void;
  openReviewWhatsapp: (tx: any) => void;

  // CSV export
  downloadTextFile: (filename: string, content: string, mime?: string) => void;

  // Constants
  FINANCE_SUBVIEWS: typeof import('./adminFinanceData').FINANCE_SUBVIEWS;
  FINANCIAL_REPORT_PERIODS: typeof import('./adminFinanceData').FINANCIAL_REPORT_PERIODS;
  paymentStatusOptions: string[];
  paymentTypeFilterOptions: string[];
  budgetDirections: typeof import('./adminFinanceData').budgetDirections;
  nonDepreciableFixedAssetCategories: string[];
  demoFinanceRows: any[];
  parseRupiah: typeof import('./adminFinanceData').parseRupiah;
  formatRupiah: typeof import('./adminFinanceData').formatRupiah;

  // Shared adapters (re-exposed for dialogs)
  notify: (message: string) => void;
  recordAudit: (module: string, action: string, detail: string) => void;
  queueNotification: (channel: 'Email' | 'WhatsApp' | 'System', recipient: string, subject: string, message: string) => void;
}

export function useAdminFinanceDomain({
  users,
  persistUsers,
  notify,
  recordAudit,
  queueNotification,
  downloadTextFile,
}: UseAdminFinanceDomainOptions): UseAdminFinanceDomainResult {
  // --- Canonical Finance State (5 storage keys) ---
  const [financeTransactions, setFinanceTransactions] = useState<any[]>(() =>
    readStorageArray(FINANCE_STORAGE_KEYS.TRANSACTIONS)
  );
  const [paymentProofs, setPaymentProofs] = useState<any[]>(() =>
    readStorageArray(FINANCE_STORAGE_KEYS.PAYMENT_PROOFS)
  );
  const [financeEntries, setFinanceEntries] = useState<any[]>(() =>
    readStorageArray(FINANCE_STORAGE_KEYS.FINANCE_ENTRIES, defaultFinanceEntries)
  );
  const [financeRealizations, setFinanceRealizations] = useState<any[]>(() =>
    readStorageArray(FINANCE_STORAGE_KEYS.FINANCE_REALIZATIONS)
  );
  const [assetEntries, setAssetEntries] = useState<any[]>(() =>
    readStorageArray(FINANCE_STORAGE_KEYS.ASSETS, defaultAssetEntries)
  );

  // --- View State (survives client-side tab navigation) ---
  const [financeSubView, setFinanceSubView] = useState<'payments' | 'inputs' | 'realization' | 'assets' | 'accounting' | 'reports' | 'audit'>('payments');
  const [financialReportPeriod, setFinancialReportPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('All');
  const [financeMetricDetail, setFinanceMetricDetail] = useState<null | { title: string; rows: any[]; description: string }>(null);
  const [selectedFinanceRecord, setSelectedFinanceRecord] = useState<null | { tx: any; proof?: any }>(null);

  // --- Forms ---
  const [financeForm, setFinanceForm] = useState({
    type: 'fixed',
    name: '',
    category: 'Operasional',
    amount: '',
    period: 'Bulanan',
    note: '',
  });
  const [realizationForm, setRealizationForm] = useState({
    financeEntryId: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });
  const [assetForm, setAssetForm] = useState({
    type: 'fixed_asset',
    name: '',
    category: 'Peralatan Kantor',
    acquisitionValue: '',
    currentValue: '',
    acquisitionDate: new Date().toISOString().slice(0, 10),
    usefulLifeMonths: '36',
    note: '',
  });

  // --- Derived data ---
  const financeRows = useMemo(() => {
    const demoRows = demoFinanceRows;
    return [...financeTransactions, ...demoRows];
  }, [financeTransactions]);

  const paymentStatusOptions = useMemo(() => ['All', ...Array.from(new Set(financeRows.map((tx) => tx.status || 'Unknown')))], [financeRows]);

  const filteredFinanceRows = useMemo(() => {
    const keyword = paymentSearchTerm.toLowerCase();
    return financeRows.filter((tx) => {
      const matchesSearch = `${tx.student || ''} ${tx.email || ''} ${tx.phone || ''} ${tx.program || ''} ${tx.packageName || ''} ${tx.invoiceNumber || tx.id || ''}`.toLowerCase().includes(keyword);
      const matchesStatus = paymentStatusFilter === 'All' || tx.status === paymentStatusFilter;
      const rowType = String(tx.type || (String(tx.status).toLowerCase().includes('scholarship') ? 'scholarship' : String(tx.status).toLowerCase().includes('free') ? 'free' : 'paid'));
      const matchesType = paymentTypeFilter === 'All' || rowType === paymentTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [financeRows, paymentSearchTerm, paymentStatusFilter, paymentTypeFilter]);

  const financeSummary = useMemo(() => {
    const paidRevenue = financeRows
      .filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free') && parseRupiah(tx.amount) > 0)
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const pendingRevenue = financeRows
      .filter((tx) => String(tx.status).toLowerCase().includes('pending'))
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const scholarshipApplications = financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).length;

    const fixedCost = financeRealizations
      .filter((r) => financeEntries.find((e) => e.id === r.financeEntryId)?.type === 'fixed')
      .reduce((sum, r) => sum + r.amount, 0);
    const variableCost = financeRealizations
      .filter((r) => financeEntries.find((e) => e.id === r.financeEntryId)?.type === 'variable')
      .reduce((sum, r) => sum + r.amount, 0);
    const budget = financeEntries.filter((e) => e.type === 'budget').reduce((sum, e) => sum + e.amount, 0);
    const netProfit = paidRevenue - fixedCost - variableCost;

    return {
      paidRevenue,
      pendingRevenue,
      netProfit,
      scholarshipApplications,
      fixedCost,
      variableCost,
      budget,
    };
  }, [financeRows, financeRealizations, financeEntries]);

  const accountingRows = useMemo(() => {
    const paymentRows = financeRows.map((tx) => {
      const amount = parseRupiah(tx.amount);
      const isScholarship = String(tx.status).toLowerCase().includes('scholarship');
      const isFree = String(tx.status).toLowerCase().includes('free') || String(tx.type).toLowerCase() === 'free';
      return {
        id: `ledger-${tx.id || tx.invoiceNumber}`,
        date: tx.createdAt || tx.date || '-',
        source: tx.invoiceNumber || tx.id || '-',
        description: `Pendaftaran ${tx.program || '-'} - ${tx.packageName || '-'}`,
        account: isScholarship ? 'Piutang/Kuota Beasiswa' : isFree ? 'Akun Gratis' : 'Pendapatan Kelas',
        debit: amount > 0 && !isScholarship && !isFree ? amount : 0,
        credit: 0,
        status: tx.status || '-',
      };
    });

    const realizationRows = financeRealizations.map((row) => {
      const entry = financeEntries.find((e) => e.id === row.financeEntryId);
      return {
        id: `ledger-real-${row.id}`,
        date: row.date,
        source: row.id,
        description: `${row.name}${row.note ? ` - ${row.note}` : ''}`,
        account: entry?.type === 'budget' ? `Realisasi Anggaran - ${row.category}` : entry?.type === 'fixed' ? `Realisasi Biaya Tetap - ${row.category}` : `Realisasi Biaya Variabel - ${row.category}`,
        credit: row.amount,
        status: 'Realized',
      };
    });

    const assetRows = assetEntries.flatMap((asset) => {
      const rows = [{
        id: `ledger-asset-${asset.id}`,
        date: asset.acquisitionDate,
        source: asset.id,
        description: `Pencatatan Aset: ${asset.name}`,
        account: asset.type === 'fixed_asset' ? `Aset Tetap - ${asset.category}` : `Aset Lancar - ${asset.category}`,
        debit: asset.currentValue,
        credit: 0,
        status: 'Asset Registered',
      }];
      if (asset.type === 'fixed_asset' && asset.depreciationPerMonth > 0 && !nonDepreciableFixedAssetCategories.includes(asset.category)) {
        rows.push({
          id: `ledger-dep-${asset.id}`,
          date: new Date().toISOString().slice(0, 10),
          source: asset.id,
          description: `Depresiasi bulanan ${asset.name}`,
          account: `Beban Depresiasi - ${asset.category}`,
          credit: asset.depreciationPerMonth,
          status: 'Depreciation',
        });
      }
      return rows;
    });

    return [...paymentRows, ...realizationRows, ...assetRows];
  }, [financeRows, financeRealizations, assetEntries, financeEntries]);

  const financialReports = useMemo(() => {
    const now = new Date();
    const revenue = financeRows
      .filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free') && parseRupiah(tx.amount) > 0)
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const realizedExpenses = financeRealizations.reduce((sum, row) => sum + row.amount, 0);
    const depreciationExpense = assetEntries
      .filter((a) => a.type === 'fixed_asset' && a.depreciationPerMonth > 0 && !nonDepreciableFixedAssetCategories.includes(a.category))
      .reduce((sum, a) => sum + a.depreciationPerMonth, 0);
    const fixedAssets = assetEntries
      .filter((a) => a.type === 'fixed_asset')
      .reduce((sum, a) => sum + a.currentValue, 0);
    const currentAssets = assetEntries
      .filter((a) => a.type === 'current_asset')
      .reduce((sum, a) => sum + a.currentValue, 0);
    const pendingReceivable = financeRows.filter((tx) => String(tx.status).toLowerCase().includes('pending')).reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const scholarshipReserve = financeEntries.filter((entry) => entry.type === 'budget' && entry.category.toLowerCase().includes('beasiswa')).reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = realizedExpenses + depreciationExpense;
    const netIncome = revenue - totalExpenses;
    const totalAssets = currentAssets + fixedAssets + pendingReceivable;
    const liabilities = financeSummary.pendingRevenue;
    const equity = totalAssets - liabilities;

    let periodLabel: string;
    if (financialReportPeriod === 'monthly') {
      periodLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } else if (financialReportPeriod === 'quarterly') {
      periodLabel = `Kuartal ${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
    } else {
      periodLabel = `Tahun ${now.getFullYear()}`;
    }

    return {
      periodLabel,
      incomeStatement: [
        { label: 'Pendapatan Kelas Berbayar', amount: revenue },
        { label: 'Realisasi Biaya & Anggaran', amount: -realizedExpenses },
        { label: 'Beban Depresiasi Aset Tetap', amount: -depreciationExpense },
        { label: 'Laba/Rugi Bersih', amount: netIncome, total: true },
      ],
      balanceSheet: [
        { label: 'Aset Lancar', amount: currentAssets },
        { label: 'Piutang/Pending Payment', amount: pendingReceivable },
        { label: 'Aset Tetap Bersih', amount: fixedAssets },
        { label: 'Total Aset', amount: totalAssets, total: true },
        { label: 'Kewajiban/Pending Operasional', amount: liabilities },
        { label: 'Cadangan Beasiswa', amount: scholarshipReserve },
        { label: 'Ekuitas Demo', amount: equity, total: true },
      ],
      cashFlow: [
        { label: 'Kas Masuk dari Pembayaran', amount: financeRows.filter((tx) => parseRupiah(tx.amount) > 0).reduce((sum, tx) => sum + parseRupiah(tx.amount), 0) },
        { label: 'Kas Keluar Realisasi Biaya', amount: -realizedExpenses },
        { label: 'Investasi/Pencatatan Aset', amount: -assetEntries.reduce((sum, a) => sum + a.acquisitionValue, 0) },
        { label: 'Arus Kas Bersih Demo', amount: financeRows.filter((tx) => parseRupiah(tx.amount) > 0).reduce((sum, tx) => sum + parseRupiah(tx.amount), 0) - totalExpenses - assetEntries.reduce((sum, a) => sum + a.acquisitionValue, 0), total: true },
      ],
    };
  }, [financialReportPeriod, financeRows, financeRealizations, assetEntries, financeEntries, financeSummary.pendingRevenue]);

  // --- Refresh ---
  const refreshFinanceCenter = () => {
    setFinanceTransactions(readStorageArray(FINANCE_STORAGE_KEYS.TRANSACTIONS));
    setPaymentProofs(readStorageArray(FINANCE_STORAGE_KEYS.PAYMENT_PROOFS));
    setFinanceEntries(readStorageArray(FINANCE_STORAGE_KEYS.FINANCE_ENTRIES, defaultFinanceEntries));
    setFinanceRealizations(readStorageArray(FINANCE_STORAGE_KEYS.FINANCE_REALIZATIONS));
    setAssetEntries(readStorageArray(FINANCE_STORAGE_KEYS.ASSETS, defaultAssetEntries));
    notify('Financial Center disinkronkan dengan pembayaran dan dokumen terbaru.');
  };

  // --- Finance Plans ---
  const saveFinanceEntries = (nextEntries: any[]) => {
    setFinanceEntries(nextEntries);
    localStorage.setItem(FINANCE_STORAGE_KEYS.FINANCE_ENTRIES, JSON.stringify(nextEntries));
  };

  const addFinanceEntry = () => {
    if (!financeForm.name.trim() || !financeForm.category.trim() || parseRupiah(financeForm.amount) <= 0) {
      notify('Nama, kategori, dan nominal wajib diisi.');
      return;
    }
    const nextEntry = {
      id: `finance-${Date.now()}`,
      type: financeForm.type,
      name: financeForm.name.trim(),
      category: financeForm.category.trim(),
      amount: parseRupiah(financeForm.amount),
      period: financeForm.period.trim() || 'Bulanan',
      note: financeForm.note.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    saveFinanceEntries([nextEntry, ...financeEntries]);
    setFinanceForm({ type: 'fixed', name: '', category: 'Operasional', amount: '', period: 'Bulanan', note: '' });
    recordAudit('Financial Center', 'Create Finance Plan', `${nextEntry.name} - ${formatRupiah(nextEntry.amount)}`);
    notify('Input keuangan berhasil ditambahkan.');
  };

  const deleteFinanceEntry = (id: string) => {
    saveFinanceEntries(financeEntries.filter((entry) => entry.id !== id));
    recordAudit('Financial Center', 'Delete Finance Plan', id);
    notify('Input keuangan dihapus.');
  };

  // --- Realizations ---
  const saveFinanceRealizations = (nextRows: any[]) => {
    setFinanceRealizations(nextRows);
    localStorage.setItem(FINANCE_STORAGE_KEYS.FINANCE_REALIZATIONS, JSON.stringify(nextRows));
  };

  const addFinanceRealization = () => {
    const source = financeEntries.find((entry) => entry.id === realizationForm.financeEntryId);
    if (!source || parseRupiah(realizationForm.amount) <= 0) {
      notify('Pilih rencana biaya/anggaran dan isi nominal realisasi.');
      return;
    }
    const amount = parseRupiah(realizationForm.amount);
    const nextRow = {
      id: `realization-${Date.now()}`,
      financeEntryId: realizationForm.financeEntryId,
      name: source.name,
      category: source.category,
      amount,
      date: realizationForm.date,
      note: realizationForm.note.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    saveFinanceRealizations([nextRow, ...financeRealizations]);
    setRealizationForm({ financeEntryId: '', amount: '', date: new Date().toISOString().slice(0, 10), note: '' });
    recordAudit('Financial Center', 'Realize Budget/Cost', `${nextRow.name} - ${formatRupiah(nextRow.amount)}`);
    notify('Realisasi biaya/anggaran masuk pembukuan otomatis.');
  };

  // --- Assets ---
  const saveAssetEntries = (nextRows: any[]) => {
    setAssetEntries(nextRows);
    localStorage.setItem(FINANCE_STORAGE_KEYS.ASSETS, JSON.stringify(nextRows));
  };

  const addAssetEntry = () => {
    const acquisitionValue = parseRupiah(assetForm.acquisitionValue);
    const currentValue = parseRupiah(assetForm.currentValue) || acquisitionValue;
    const isNonDepreciableFixedAsset = assetForm.type === 'fixed_asset' && nonDepreciableFixedAssetCategories.includes(assetForm.category);
    const usefulLifeMonths = assetForm.type === 'fixed_asset' && !isNonDepreciableFixedAsset ? Number(assetForm.usefulLifeMonths) || 1 : 0;

    if (!assetForm.name.trim() || acquisitionValue <= 0) {
      notify('Nama aset dan nilai perolehan wajib diisi.');
      return;
    }

    const nextAsset = {
      id: `asset-${Date.now()}`,
      type: assetForm.type,
      name: assetForm.name.trim(),
      category: assetForm.category.trim() || (assetForm.type === 'fixed_asset' ? 'Aset Tetap' : 'Aset Lancar'),
      acquisitionValue,
      currentValue,
      acquisitionDate: assetForm.acquisitionDate,
      usefulLifeMonths,
      depreciationPerMonth: assetForm.type === 'fixed_asset' && !isNonDepreciableFixedAsset ? Math.round(acquisitionValue / usefulLifeMonths) : 0,
      note: assetForm.note.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    saveAssetEntries([nextAsset, ...assetEntries]);
    setAssetForm({
      type: 'fixed_asset',
      name: '',
      category: 'Peralatan Kantor',
      acquisitionValue: '',
      currentValue: '',
      acquisitionDate: new Date().toISOString().slice(0, 10),
      usefulLifeMonths: '36',
      note: '',
    });
    recordAudit('Financial Center', 'Register Asset', `${nextAsset.name} - ${formatRupiah(nextAsset.currentValue)}`);
    notify('Aset berhasil ditambahkan ke pembukuan.');
  };

  // --- Invoice / Proof viewers ---
  const openStoredInvoice = (tx: any) => {
    const invoiceNumber = tx.invoiceNumber || tx.id || 'INV/DEMO/TP/00000';
    const invoiceTime = tx.invoiceTime || tx.date || new Date().toLocaleString('id-ID');
    const methodLabel = tx.method || 'Manual/Admin';
    const amount = formatRupiah(parseRupiah(tx.amount));
    const program = tx.program || '-';
    const packageName = tx.packageName || '-';
    const email = tx.email || '-';
    const phone = tx.phone || '-';
    const student = tx.student || '-';
    const total = formatRupiah(parseRupiah(tx.amount));
    const invoiceHtml = tx.invoiceHtml || `
      <html>
        <head><title>${invoiceNumber}</title><style>
          body { font-family: sans-serif; padding: 20px; }
          .brand { font-weight: bold; font-size: 1.2em; color: #1e3a8a; }
          .muted { color: #64748b; font-size: 0.9em; }
          .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
        </style></head>
        <body>
          <div class="head"><div class="brand">Bimbel The Prams</div><div class="muted">Invoice Pembayaran Program</div></div>
          <div class="box"><div class="muted">Calon Siswa</div><div><strong>${student}</strong></div>
          <div class="muted">Email: <strong>${email}</strong></div>
          <div class="muted">WhatsApp: <strong>${phone}</strong></div>
          <table><thead><tr><th>Program</th><th>Paket</th><th>Metode</th><th>Nominal</th></tr></thead>
          <tbody><tr><td>${program}</td><td>${packageName}</td><td>${methodLabel}</td><td>${amount}</td></tr></tbody></table>
          <div class="box"><div class="muted">No. Invoice</div><div><strong>${invoiceNumber}</strong></div>
          <div class="muted">Tanggal</div><div><strong>${invoiceTime}</strong></div></div>
          <div class="box">Status: <strong>${tx.status || '-'}</strong></div>
          <div class="box">Total: <strong>${total}</strong></div>
          <button onclick="window.print()">Cetak / Simpan PDF</button>
        </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(tx.invoiceHtml || invoiceHtml);
      w.document.close();
    }
  };

  const openStoredProof = (proof: any) => {
    if (!proof.fileData) {
      notify('Dokumen hanya tersedia sebagai metadata file.');
      return;
    }
    if (String(proof.fileType).includes('pdf')) {
      const w = window.open('', '_blank');
      if (w) w.document.write(`<iframe src="${proof.fileData}" style="border:0;width:100%;height:100vh"></iframe>`);
      w.document.close();
    } else {
      const w = window.open('', '_blank');
      if (w) w.document.write(`<img src="${proof.fileData}" style="max-width:100%;height:auto" alt="${proof.fileName || 'Bukti pembayaran'}" />`);
    }
  };

  // --- Payment status workflow ---
  const updateFinanceRecordStatus = (invoiceId: string, nextStatus: string) => {
    const nextTransactions = financeTransactions.map((tx) =>
      (tx.invoiceNumber || tx.id) === invoiceId ? { ...tx, status: nextStatus, reviewedAt: new Date().toISOString() } : tx
    );
    setFinanceTransactions(nextTransactions);
    localStorage.setItem(FINANCE_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(nextTransactions));

    const nextProofs = paymentProofs.map((proof) =>
      proof.invoiceId === invoiceId ? { ...proof, status: nextStatus, reviewedAt: new Date().toISOString() } : proof
    );
    setPaymentProofs(nextProofs);
    localStorage.setItem(FINANCE_STORAGE_KEYS.PAYMENT_PROOFS, JSON.stringify(nextProofs));

    if (selectedFinanceRecord) {
      setSelectedFinanceRecord((prev) => prev ? { ...prev, tx: { ...prev.tx, status: nextStatus }, proof: prev.proof ? { ...prev.proof, status: nextStatus } : prev.proof } : null);
    }

    const updatedTx = financeTransactions.find((tx) => (tx.invoiceNumber || tx.id) === invoiceId) || selectedFinanceRecord?.tx;

    recordAudit('Payment Workflow', 'Update Status', `${invoiceId} -> ${nextStatus}`);

    if (nextStatus === 'Needs Revision') {
      const template = buildReviewTemplate({ ...updatedTx, status: nextStatus });
      if (updatedTx?.email) {
        queueNotification('Email', updatedTx.email, 'Review Ulang Data Pendaftaran The Prams', template);
      }
      if (updatedTx?.phone) {
        queueNotification('WhatsApp', updatedTx.phone, 'Review Ulang Data Pendaftaran The Prams', template);
      }
    }

    if (nextStatus.includes('Approved')) {
      const template = `Halo ${updatedTx?.student || 'Calon Siswa'}, status kamu sudah diperbarui menjadi ${nextStatus}. Silakan lanjut mengikuti arahan admin The Prams.`;
      if (updatedTx?.email) {
        queueNotification('Email', updatedTx.email, 'Pendaftaran The Prams Disetujui', template);
      }

      const approvedTx = {
        ...updatedTx,
        status: nextStatus,
      };

      if (updatedTx && isApprovedStudentRecord(approvedTx)) {
        const studentUser = userFromStudentRecord(approvedTx, 'tx');
        const existing = users.find((u) => u.id === studentUser.id || (u.email && u.program && u.packageName && u.email === studentUser.email && u.program === studentUser.program && u.packageName === studentUser.packageName));
        if (!existing) {
          persistUsers([studentUser, ...users]);
          recordAudit('User & Roles', 'Auto Create Student', `${studentUser.name} - ${studentUser.accountType}`);
        }
      }
    }
  };

  // --- Review notification workflow ---
  const buildReviewTemplate = (tx: any) => {
    const isScholarship = String(tx.status || '').toLowerCase().includes('scholarship') || String(tx.packageName || '').toLowerCase().includes('beasiswa');
    const documentLabel = isScholarship ? 'dokumen beasiswa' : 'bukti pembayaran';
    const invoiceId = tx.invoiceNumber || tx.id || '-';
    return `Halo ${tx.student || '-'},
Terima kasih telah mendaftar di The Prams. Kami telah meninjau pendaftaran Anda.

Setelah pengecekan oleh admin, data pendaftaran kamu perlu direview ulang dengan detail berikut:

- No. Invoice: ${invoiceId}
- Program: ${tx.program}
- Paket: ${tx.packageName}
- Nominal: ${formatRupiah(parseRupiah(tx.amount))}
- Status saat ini: ${tx.status}
- Dokumen yang perlu diperbaiki: ${documentLabel}

Silakan periksa data Anda. Jika ada yang perlu diperbaiki, silakan balas email ini atau hubungi admin via WhatsApp.

Checklist verifikasi:
- Nama dan email sesuai dengan data pendaftaran
- WhatsApp nomor yang bisa dihubungi
- Dokumen ${documentLabel} sudah jelas dan valid
- Nomor invoice dan program/paket sesuai dengan pilihan

Salam,
Tim The Prams`;
  };

  const openReviewEmail = (tx: any) => {
    const template = buildReviewTemplate(tx);
    const subject = encodeURIComponent('Review Ulang Data Pendaftaran The Prams');
    const body = encodeURIComponent(template);
    const mailto = `mailto:${tx.email}?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
  };

  const openReviewWhatsapp = (tx: any) => {
    const phone = String(tx.phone || '').replace(/\D/g, '').replace(/^0/, '62') || '6281234567890';
    const template = buildReviewTemplate(tx);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(template)}`, '_blank');
  };

  // --- Return ---
  return {
    // Canonical state
    financeTransactions,
    paymentProofs,
    financeEntries,
    financeRealizations,
    assetEntries,

    // View state
    financeSubView,
    setFinanceSubView,
    financialReportPeriod,
    setFinancialReportPeriod,
    paymentSearchTerm,
    setPaymentSearchTerm,
    paymentStatusFilter,
    setPaymentStatusFilter,
    paymentTypeFilter,
    setPaymentTypeFilter,
    financeMetricDetail,
    setFinanceMetricDetail,
    selectedFinanceRecord,
    setSelectedFinanceRecord,

    // Forms
    financeForm,
    setFinanceForm,
    realizationForm,
    setRealizationForm,
    assetForm,
    setAssetForm,

    // Derived
    financeRows,
    paymentStatusOptions,
    filteredFinanceRows,
    financeSummary,
    accountingRows,
    financialReports,

    // Operations
    refreshFinanceCenter,
    saveFinanceEntries,
    addFinanceEntry,
    deleteFinanceEntry,
    saveFinanceRealizations,
    addFinanceRealization,
    saveAssetEntries,
    addAssetEntry,

    // Viewers
    openStoredInvoice,
    openStoredProof,

    // Workflow
    updateFinanceRecordStatus,
    buildReviewTemplate,
    openReviewEmail,
    openReviewWhatsapp,

    // Export
    downloadTextFile,

    // Constants
    FINANCE_SUBVIEWS,
    FINANCIAL_REPORT_PERIODS,
    paymentStatusOptions,
    paymentTypeFilterOptions,
    budgetDirections,
    nonDepreciableFixedAssetCategories,
    demoFinanceRows,
    parseRupiah,
    formatRupiah,

    // Shared adapters (re-exposed)
    notify,
    recordAudit,
    queueNotification,
  };
}