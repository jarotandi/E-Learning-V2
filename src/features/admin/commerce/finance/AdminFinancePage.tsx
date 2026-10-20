/**
 * Admin Commerce / Finance page
 * ============================
 * B1.4D-T8 — Financial Center extraction (`/admin/commerce/finance`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/19-b1.4d-t8-finance.md
 */

import {
  Award,
  Banknote,
  Calendar,
  Clock,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseAdminFinanceDomainResult } from './useAdminFinanceDomain';
import AdminFinanceMetricDialog from './AdminFinanceMetricDialog';
import AdminFinanceRecordDialog from './AdminFinanceRecordDialog';

export interface AdminFinancePageProps {
  domain: UseAdminFinanceDomainResult;
  auditEvents: any[];
  notificationEvents: any[];
}

export function AdminFinancePage({ domain, auditEvents, notificationEvents }: AdminFinancePageProps) {
  const {
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
    financeForm,
    setFinanceForm,
    realizationForm,
    setRealizationForm,
    assetForm,
    setAssetForm,
    financeRows,
    paymentStatusOptions,
    filteredFinanceRows,
    financeSummary,
    accountingRows,
    financialReports,
    refreshFinanceCenter,
    addFinanceEntry,
    deleteFinanceEntry,
    addFinanceRealization,
    addAssetEntry,
    openStoredInvoice,
    openStoredProof,
    updateFinanceRecordStatus,
    buildReviewTemplate,
    openReviewEmail,
    openReviewWhatsapp,
    downloadTextFile,
    FINANCE_SUBVIEWS,
    FINANCIAL_REPORT_PERIODS,
    paymentStatusOptions,
    paymentTypeFilterOptions,
    budgetDirections,
    nonDepreciableFixedAssetCategories,
    demoFinanceRows,
    parseRupiah,
    formatRupiah,
  } = domain;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Pusat Keuangan</h2>
          <p className="text-sm text-slate-500">Transaksi pendaftaran, invoice, bukti bayar, beasiswa, biaya, dan anggaran demo.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={refreshFinanceCenter} className="btn-secondary min-h-[44px] py-2 px-5 flex items-center gap-2" aria-label="Sinkronkan data keuangan">
            <RefreshCw size={18} aria-hidden="true" /> Sync Data
          </button>
          <button
            onClick={() => {
              const rows = [
                'type,name,program,package,amount,status,date',
                ...financeRows.filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free')).map((tx) => `transaction,"${tx.student || '-'}","${tx.program || '-'}","${tx.packageName || '-'}","${tx.amount || 0}","${tx.status || '-'}","${tx.date || tx.createdAt || '-'`),
                ...financeEntries.map((entry) => `entry,"${entry.name}","${entry.category}","${entry.period}",${entry.amount},"${entry.note}","${entry.createdAt}"`),
                ...paymentProofs.filter((p) => p).map((proof) => `document,"${proof.student || '-'}","${proof.program || '-'}","${proof.packageName || '-'}","${proof.fileName || '-'}","${proof.status || '-'}","${proof.createdAt || '-'}"`),
              ];
              downloadTextFile('finance-center-report.csv', rows.join('\n'));
            }}
            className="btn-secondary min-h-[44px] py-2 px-5 flex items-center gap-2"
            aria-label="Ekspor laporan keuangan"
          >
            <Download size={18} aria-hidden="true" /> Export Report
          </button>
          <button
            onClick={() => setFinanceSubView('payments')}
            className="btn-primary min-h-[44px] py-2 px-6 flex items-center gap-2"
          >
            <Plus size={18} aria-hidden="true" /> Kelola Pembayaran
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue Tercatat', value: formatRupiah(financeSummary.paidRevenue), color: 'text-blue-700', icon: Banknote, description: 'Transaksi berbayar yang tercatat sebagai pendapatan.', rows: financeRows.filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free') && parseRupiah(tx.amount) > 0) },
          { label: 'Pending Payment', value: formatRupiah(financeSummary.pendingRevenue), color: 'text-amber-700', icon: Clock, description: 'Transaksi yang masih menunggu pembayaran atau verifikasi admin.', rows: financeRows.filter((tx) => String(tx.status).toLowerCase().includes('pending')) },
          { label: 'Net Profit Demo', value: formatRupiah(financeSummary.netProfit), color: financeSummary.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700', icon: TrendingUp, description: 'Perhitungan demo: revenue tercatat dikurangi biaya tetap dan biaya variabel.', rows: [
            { student: 'Revenue Tercatat', program: 'Pendapatan', amount: formatRupiah(financeSummary.paidRevenue), status: 'Debit' },
            { student: 'Biaya Tetap', program: 'Pengeluaran', amount: formatRupiah(financeSummary.fixedCost), status: 'Kredit' },
            { student: 'Biaya Variabel', program: 'Pengeluaran', amount: formatRupiah(financeSummary.variableCost), status: 'Kredit' },
            { student: 'Net Profit Demo', program: 'Saldo', amount: formatRupiah(financeSummary.netProfit), status: financeSummary.netProfit >= 0 ? 'Profit' : 'Loss' }
          ] },
          { label: 'Pengajuan Beasiswa', value: String(financeSummary.scholarshipApplications), color: 'text-indigo-700', icon: Award, description: 'Semua transaksi dengan status pengajuan atau approval beasiswa.', rows: financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship') || String(tx.packageName || '').toLowerCase().includes('beasiswa')) },
        ].map((stat, i) => (
          <button key={i} type="button" onClick={() => setFinanceMetricDetail({ title: stat.label, rows: stat.rows, description: stat.description })} className="card-premium p-6 text-left hover:border-blue-400/40 transition-all min-h-[44px]">
            <stat.icon className={stat.color + ' mb-3'} size={20} aria-hidden="true" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-black text-brand-navy">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
        {FINANCE_SUBVIEWS.map((item) => (
          <button
            key={item.id}
            onClick={() => setFinanceSubView(item.id as typeof financeSubView)}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${financeSubView === item.id ? 'bg-blue-100 text-blue-900 shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-brand-blue'}`}
            aria-pressed={financeSubView === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      {financeSubView === 'payments' && (
        <AdminFinancePaymentsView domain={domain} />
      )}
      {financeSubView === 'inputs' && (
        <AdminFinanceInputsView domain={domain} />
      )}
      {financeSubView === 'realization' && (
        <AdminFinanceRealizationView domain={domain} />
      )}
      {financeSubView === 'assets' && (
        <AdminFinanceAssetsView domain={domain} />
      )}
      {financeSubView === 'accounting' && (
        <AdminFinanceAccountingView domain={domain} />
      )}
      {financeSubView === 'reports' && (
        <AdminFinanceReportsView domain={domain} />
      )}
      {financeSubView === 'audit' && (
        <AdminFinanceAuditView domain={domain} auditEvents={auditEvents} notificationEvents={notificationEvents} />
      )}

      <AdminFinanceMetricDialog domain={{ financeMetricDetail, setFinanceMetricDetail }} />
      <AdminFinanceRecordDialog domain={{ selectedFinanceRecord, setSelectedFinanceRecord, updateFinanceRecordStatus, openStoredInvoice, openStoredProof, openReviewEmail, openReviewWhatsapp, notify }} />
    </div>
  );
}

// ============================================================================
// Payments View
// ============================================================================
function AdminFinancePaymentsView({ domain }: { domain: any }) {
  const { filteredFinanceRows, paymentProofs, openStoredInvoice, openStoredProof, paymentSearchTerm, setPaymentSearchTerm, paymentStatusFilter, setPaymentStatusFilter, paymentTypeFilter, setPaymentTypeFilter, paymentStatusOptions, setSelectedFinanceRecord, formatRupiah, financeRows } = domain;

  return (
    <div className="space-y-6">
      <div className="card-premium overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-brand-navy">Data Sistem Pembayaran</h3>
              <p className="text-xs text-slate-500 mt-1">Semua pendaftaran yang masuk pembayaran akan tercatat di sini.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">{filteredFinanceRows.length}/{financeRows.length} Records</span>
          </div>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-100">
              <Search size={18} className="text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={paymentSearchTerm}
                onChange={(event) => setPaymentSearchTerm(event.target.value)}
                placeholder="Cari siswa, invoice, program, paket..."
                className="w-full bg-transparent outline-none text-sm font-medium"
                aria-label="Cari transaksi pembayaran"
              />
            </div>
            <select value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value)} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600 outline-none" aria-label="Filter status pembayaran">
              {paymentStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <select value={paymentTypeFilter} onChange={(event) => setPaymentTypeFilter(event.target.value)} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600 outline-none" aria-label="Filter tipe pembayaran">
              {['All', 'paid', 'free', 'scholarship'].map((type) => <option key={type} value={type}>{type === 'All' ? 'Semua Tipe' : type === 'paid' ? 'Berbayar' : type === 'free' ? 'Gratis' : 'Beasiswa'}</option>)}
            </select>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFinanceRows.map((tx, i) => {
              const proof = paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id));
              const isScholarship = String(tx.status).toLowerCase().includes('scholarship');
              const isFree = String(tx.status).toLowerCase().includes('free') || String(tx.type).toLowerCase() === 'free';
              const uploadNotRequired = isScholarship || isFree;
              return (
                <tr key={tx.id || i} className="hover:bg-slate-50/50 transition-colors align-top">
                  <td className="px-8 py-4">
                    <button type="button" onClick={() => setSelectedFinanceRecord({ tx, proof: paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id)) })} className="text-left text-sm font-bold text-brand-navy hover:text-brand-blue hover:underline" aria-label={'Lihat detail ' + tx.student}>
                      {tx.student}
                    </button>
                    <p className="text-[10px] text-slate-400">{tx.email || '-'}</p>
                    <p className="text-[10px] text-slate-400">{tx.phone || '-'}</p>
                  </td>
                  <td className="px-8 py-4 text-xs text-slate-500">
                    {tx.program}
                    {tx.method && <p className="text-[10px] text-slate-400 mt-1">{tx.method} {tx.packageName ? '- ' + tx.packageName : ''}</p>}
                    {tx.registrationData && (
                      <p className="text-[10px] text-slate-400 mt-1">Sekolah: {tx.registrationData?.school || '-'}</p>
                    )}
                  </td>
                  <td className="px-8 py-4 text-sm font-mono font-bold text-brand-navy">{tx.amount}</td>
                  <td className="px-8 py-4">
                    <span className={'px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ' + (isScholarship ? 'bg-indigo-50 text-indigo-700' : tx.status === 'Success' || tx.status === 'Free Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                      {tx.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-2">{tx.date || '-'}</p>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => openStoredInvoice(tx)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest min-h-[44px]" aria-label={'Buka invoice ' + tx.student}>
                        Invoice
                      </button>
                      {proof ? (
                        <button onClick={() => openStoredProof(paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id)))} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest min-h-[44px]" aria-label={'Buka bukti pembayaran ' + tx.student}>
                          {isScholarship ? 'Dokumen Beasiswa' : 'Bukti Bayar'}
                        </button>
                      ) : uploadNotRequired ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest">Tidak perlu upload</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300">Belum upload bukti</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredFinanceRows.length === 0 && (
          <div className="p-10 text-center text-sm font-bold text-slate-400">
            Tidak ada data pembayaran yang cocok dengan filter.
          </div>
        )}
        <div className="p-4 bg-slate-50 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Invoice dan bukti bayar dibaca dari database demo browser.
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="card-premium overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-brand-navy">Database Dokumen Bukti Pembayaran / Beasiswa</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {paymentProofs.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada dokumen yang diupload.</p>}
              {paymentProofs.map((proof) => (
                <div key={proof.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-brand-navy">{proof.fileName}</p>
                    <p className="text-[10px] text-slate-400">{proof.student} - {proof.program}</p>
                    <p className="text-[10px] text-slate-400">{proof.type || 'Payment Proof'} - {Math.ceil((proof.fileSize || 0) / 1024)} KB</p>
                  </div>
                  <button onClick={() => openStoredProof(proof)} className="px-3 py-2 rounded-xl bg-slate-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                    Buka
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card-premium p-6">
            <h3 className="font-bold text-brand-navy mb-4">Sistem Beasiswa</h3>
            <div className="space-y-4">
              {financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).map((tx) => {
                const proof = paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id));
                return (
                  <div key={tx.id} className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{tx.student}</p>
                        <p className="text-xs text-slate-500">{tx.program} - {tx.packageName}</p>
                        <p className="text-[10px] font-bold text-indigo-600 mt-2">{proof ? 'Dokumen sudah diterima, siap review admin.' : 'Tidak perlu upload dokumen. Review dari data pendaftaran.'}</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-white text-indigo-600 text-[10px] font-black uppercase">Review</span>
                    </div>
                  </div>
                );
              })}
              {financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).length === 0 && (
                <p className="text-sm text-slate-400 font-bold">Belum ada pengajuan beasiswa.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Inputs View
// ============================================================================
function AdminFinanceInputsView({ domain }: { domain: any }) {
  const { financeForm, setFinanceForm, financeEntries, deleteFinanceEntry, addFinanceEntry, financeSummary, formatRupiah, budgetDirections } = domain;
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card-premium p-6 lg:col-span-1">
        <h3 className="font-bold text-brand-navy mb-5">Input Keuangan Lain</h3>
        <div className="space-y-3">
          <select value={financeForm.type} onChange={(e) => setFinanceForm({ ...financeForm, type: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
            <option value="fixed">Biaya Tetap</option>
            <option value="variable">Biaya Variabel</option>
            <option value="budget">Anggaran</option>
          </select>
          <input value={financeForm.name} onChange={(e) => setFinanceForm({ ...financeForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nama item, misal Honor Mentor" />
          {financeForm.type === 'budget' ? (
            <div className="space-y-2">
              <select value={financeForm.category} onChange={(e) => setFinanceForm({ ...financeForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                {budgetDirections.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 font-bold px-1">
                Arah: {budgetDirections.find((item) => item.value === financeForm.category)?.target || 'Operasional Lainnya'}
              </p>
            </div>
          ) : (
            <input value={financeForm.category} onChange={(e) => setFinanceForm({ ...financeForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Kategori, misal Operasional" />
          )}
          <input value={financeForm.amount} onChange={(e) => setFinanceForm({ ...financeForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nominal, misal 2500000" inputMode="numeric" />
          <input value={financeForm.period} onChange={(e) => setFinanceForm({ ...financeForm, period: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Periode" />
          <textarea value={financeForm.note} onChange={(e) => setFinanceForm({ ...financeForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan" />
          <button onClick={addFinanceEntry} className="w-full btn-primary py-3">
            <Plus size={18} aria-hidden="true" /> Tambah Input
          </button>
        </div>
      </div>

      <div className="card-premium overflow-hidden lg:col-span-2">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-brand-navy">Biaya Tetap, Biaya Variabel, dan Anggaran</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {financeEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-brand-navy">{entry.name}</p>
                  <p className="text-[10px] text-slate-400">{entry.category} - {entry.period}</p>
                  {entry.note && <p className="text-[10px] text-slate-500 mt-1">{entry.note}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={'px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ' + (entry.type === 'fixed' ? 'bg-red-50 text-red-600' : entry.type === 'variable' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700')}>
                    {entry.type === 'fixed' ? 'Biaya Tetap' : entry.type === 'variable' ? 'Biaya Variabel' : 'Anggaran'}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-brand-navy">{formatRupiah(entry.amount)}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteFinanceEntry(entry.id)} aria-label={'Hapus ' + entry.name} className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100">
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid md:grid-cols-3 gap-4 p-6 bg-slate-50">
          <div><p className="text-[10px] font-black uppercase text-slate-400">Total Biaya Tetap</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.fixedCost)}</p></div>
          <div><p className="text-[10px] font-black uppercase text-slate-400">Total Biaya Variabel</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.variableCost)}</p></div>
          <div><p className="text-[10px] font-black uppercase text-slate-400">Total Anggaran</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.budget)}</p></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Realization View
// ============================================================================
function AdminFinanceRealizationView({ domain }: { domain: any }) {
  const { financeEntries, financeRealizations, realizationForm, setRealizationForm, addFinanceRealization, formatRupiah } = domain;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card-premium p-6">
        <h3 className="font-bold text-brand-navy mb-5">Realisasi Anggaran / Biaya</h3>
        <div className="space-y-3">
          <select value={realizationForm.financeEntryId} onChange={(e) => setRealizationForm({ ...realizationForm, financeEntryId: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
            <option value="">Pilih rencana biaya/anggaran</option>
            {financeEntries.map((entry) => (
              <option key={entry.id} value={entry.id}>{entry.name} - {entry.type === 'budget' ? 'Anggaran' : entry.type === 'fixed' ? 'Biaya Tetap' : 'Biaya Variabel'}</option>
            ))}
          </select>
          <input value={realizationForm.amount} onChange={(e) => setRealizationForm({ ...realizationForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nominal yang dipakai" inputMode="numeric" />
          <input type="date" value={realizationForm.date} onChange={(e) => setRealizationForm({ ...realizationForm, date: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
          <textarea value={realizationForm.note} onChange={(e) => setRealizationForm({ ...realizationForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan realisasi" />
          <button onClick={addFinanceRealization} className="w-full btn-primary py-3">
            <Plus size={18} /> Realisasikan
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">Input biaya/anggaran tidak masuk pembukuan sampai direalisasikan di halaman ini.</p>
      </div>
      <div className="card-premium overflow-hidden lg:col-span-2">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-brand-navy">Riwayat Realisasi</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {financeRealizations.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-brand-navy">{row.name}</p>
                  <p className="text-[10px] text-slate-400">{row.category} {row.note ? `- ${row.note}` : ''}</p>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.date}</td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-red-500">{formatRupiah(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {financeRealizations.length === 0 && <div className="p-10 text-center text-sm font-bold text-slate-400">Belum ada realisasi biaya/anggaran.</div>}
      </div>
    </div>
  );
}

// ============================================================================
// Assets View
// ============================================================================
function AdminFinanceAssetsView({ domain }: { domain: any }) {
  const { assetEntries, assetForm, setAssetForm, addAssetEntry, formatRupiah, nonDepreciableFixedAssetCategories } = domain;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card-premium p-6">
        <h3 className="font-bold text-brand-navy mb-5">Input Aset</h3>
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
          <p className="text-xs font-black text-brand-navy mb-2">Aturan pencatatan aset</p>
          <ul className="space-y-1 text-[11px] text-slate-600 font-medium leading-relaxed">
            <li>Aset lancar tidak memakai depresiasi.</li>
            <li>Aset tetap memakai depresiasi bulanan sesuai umur manfaat.</li>
            <li>Tanah/Bangunan dicatat sebagai aset tetap tanpa depresiasi.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <select value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value as any, category: e.target.value === 'fixed_asset' ? 'Peralatan Kantor' : 'Kas/Bank' })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
            <option value="fixed_asset">Aset Tetap</option>
            <option value="current_asset">Aset Lancar</option>
          </select>
          <input value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nama aset" />
          <select value={assetForm.category} onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
            {assetForm.type === 'fixed_asset' ? (
              <>
                <option>Kendaraan</option>
                <option>Tanah/Bangunan</option>
                <option>Peralatan Kantor</option>
                <option>Perlengkapan Kantor</option>
              </>
            ) : (
              <>
                <option>Kas/Bank</option>
                <option>Piutang</option>
                <option>Persediaan Modul</option>
              </>
            )}
          </select>
          <input value={assetForm.acquisitionValue} onChange={(e) => setAssetForm({ ...assetForm, acquisitionValue: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nilai perolehan" inputMode="numeric" />
          <input value={assetForm.currentValue} onChange={(e) => setAssetForm({ ...assetForm, currentValue: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nilai saat ini" inputMode="numeric" />
          <input type="date" value={assetForm.acquisitionDate} onChange={(e) => setAssetForm({ ...assetForm, acquisitionDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
          {assetForm.type === 'fixed_asset' && !nonDepreciableFixedAssetCategories.includes(assetForm.category) && (
            <input value={assetForm.usefulLifeMonths} onChange={(e) => setAssetForm({ ...assetForm, usefulLifeMonths: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Umur manfaat bulan" inputMode="numeric" />
          )}
          {assetForm.type === 'fixed_asset' && nonDepreciableFixedAssetCategories.includes(assetForm.category) && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-blue-700">
              Tanah/Bangunan dicatat sebagai aset tetap tanpa depresiasi.
            </div>
          )}
          {assetForm.type === 'current_asset' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
              Aset lancar masuk neraca tanpa depresiasi. Penyesuaian nilai dilakukan sebagai koreksi persediaan/piutang bila diperlukan.
            </div>
          )}
          <textarea value={assetForm.note} onChange={(e) => setAssetForm({ ...assetForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan aset" />
          <button onClick={addAssetEntry} className="w-full btn-primary py-3">
            <Plus size={18} /> Tambah Aset
          </button>
        </div>
      </div>
      <div className="card-premium overflow-hidden lg:col-span-2">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-brand-navy">Daftar Aset</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aset</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nilai</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Depresiasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assetEntries.map((asset) => (
              <tr key={asset.id}>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-brand-navy">{asset.name}</p>
                  <p className="text-[10px] text-slate-400">{asset.type === 'fixed_asset' ? 'Aset Tetap' : 'Aset Lancar'} - {asset.category}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-mono text-sm font-bold text-brand-navy">{formatRupiah(asset.currentValue)}</p>
                  <p className="text-[10px] text-slate-400">Perolehan {formatRupiah(asset.acquisitionValue)}</p>
                </td>
                <td className="px-6 py-4 text-sm font-mono font-bold text-red-500">
                  {asset.type === 'fixed_asset'
                    ? asset.depreciationPerMonth > 0 ? formatRupiah(asset.depreciationPerMonth) : 'Tanpa depresiasi'
                    : 'Tidak didepresiasi'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Accounting View
// ============================================================================
function AdminFinanceAccountingView({ domain }: { domain: any }) {
  const { accountingRows, formatRupiah } = domain;

  const totalDebit = accountingRows.reduce((sum, row) => sum + (row.debit || 0), 0);
  const totalCredit = accountingRows.reduce((sum, row) => sum + (row.credit || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-premium p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Debit Otomatis</p>
          <p className="text-2xl font-black text-emerald-600">{formatRupiah(totalDebit)}</p>
        </div>
        <div className="card-premium p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kredit Otomatis</p>
          <p className="text-2xl font-black text-red-500">{formatRupiah(totalCredit)}</p>
        </div>
        <div className="card-premium p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Saldo Akuntansi Demo</p>
          <p className="text-2xl font-black text-brand-navy">{formatRupiah(totalDebit - totalCredit)}</p>
        </div>
      </div>
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-brand-navy">Jurnal Pembukuan Otomatis</h3>
          <p className="text-xs text-slate-500 mt-1">Dibentuk otomatis dari transaksi pembayaran, pengajuan beasiswa, biaya tetap, biaya variabel, dan anggaran.</p>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Akun</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Debit</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kredit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accountingRows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.date}</td>
                <td className="px-6 py-4 text-sm font-black text-brand-navy">{row.account}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{row.description}<p className="text-[10px] text-slate-400 mt-1">{row.source} - {row.status}</p></td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-600">{row.debit ? formatRupiah(row.debit) : '-'}</td>
                <td className="px-6 py-4 font-mono text-sm font-bold text-red-500">{row.credit ? formatRupiah(row.credit) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Reports View
// ============================================================================
function AdminFinanceReportsView({ domain }: { domain: any }) {
  const { financialReports, setFinancialReportPeriod, FINANCIAL_REPORT_PERIODS, formatRupiah } = domain;

  return (
    <div className="space-y-6">
      <div className="card-premium p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-brand-navy">Laporan Keuangan</h3>
          <p className="text-xs text-slate-500 mt-1">Neraca, Laba Rugi, dan Arus Kas untuk periode {financialReports.periodLabel}.</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
          {FINANCIAL_REPORT_PERIODS.map((item) => (
            <button
              key={item.id}
              onClick={() => setFinancialReportPeriod(item.id as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${financialReportPeriod === item.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {[
          { title: 'Laporan Laba Rugi', rows: financialReports.incomeStatement, color: 'text-emerald-600' },
          { title: 'Neraca', rows: financialReports.balanceSheet, color: 'text-blue-700' },
          { title: 'Laporan Arus Kas', rows: financialReports.cashFlow, color: 'text-amber-700' },
        ].map((report) => (
          <div key={report.title} className="card-premium overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h4 className="font-bold text-brand-navy">{report.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{financialReports.periodLabel}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {report.rows.map((row) => (
                <div key={row.label} className={`p-5 flex items-center justify-between gap-4 ${row.total ? 'bg-slate-50' : ''}`}>
                  <span className={`text-sm ${row.total ? 'font-bold text-brand-navy' : 'font-bold text-slate-600'}`}>{row.label}</span>
                  <span className={`font-mono text-sm font-black ${row.total ? report.color : row.amount < 0 ? 'text-red-500' : 'text-brand-navy'}`}>
                    {row.amount < 0 ? `(${formatRupiah(Math.abs(row.amount))})` : formatRupiah(row.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Audit / Outbox View
// ============================================================================
function AdminFinanceAuditView({ domain, auditEvents, notificationEvents }: { domain: any; auditEvents: any[]; notificationEvents: any[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-brand-navy">Audit Trail Sistem</h3>
          <p className="text-xs text-slate-500 mt-1">Riwayat aksi admin untuk pembayaran, biaya, realisasi, aset, dan approval.</p>
        </div>
        <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
          {auditEvents.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada audit trail.</p>}
          {auditEvents.map((event) => (
            <div key={event.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-brand-navy">{event.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{event.detail}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{event.module} - {event.actor}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{event.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-brand-navy">Outbox Notifikasi</h3>
          <p className="text-xs text-slate-500 mt-1">Draft/queue pesan email, WhatsApp, dan sistem dari workflow admin.</p>
        </div>
        <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
          {notificationEvents.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada notifikasi.</p>}
          {notificationEvents.map((event) => (
            <div key={event.id} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-sm font-black text-brand-navy">{event.subject}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{event.channel} ke {event.recipient}</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase">{event.status}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">{event.message}</p>
              <p className="text-[10px] text-slate-400 mt-3">{event.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminFinancePage;