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
import type { UseAdminFinanceDomainResult } from './useAdminFinanceDomain';

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
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${financeSubView === item.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-400 hover:text-brand-blue'}`}
            aria-pressed={financeSubView === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      {financeSubView === 'payments' && <AdminFinancePaymentsView domain={domain} />}
      {financeSubView === 'inputs' && <AdminFinanceInputsView domain={domain} />}
      {financeSubView === 'realization' && <AdminFinanceRealizationView domain={domain} />}
      {financeSubView === 'assets' && <AdminFinanceAssetsView domain={domain} />}
      {financeSubView === 'accounting' && <AdminFinanceAccountingView domain={domain} />}
      {financeSubView === 'reports' && <AdminFinanceReportsView domain={domain} />}
      {financeSubView === 'audit' && <AdminFinanceAuditView domain={domain} auditEvents={auditEvents} notificationEvents={notificationEvents} />}
    </div>
  );
}

// Payments View
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
                      {paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id)) ? (
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
      </div>
    </div>
  );
}

// Inputs View
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
                <td className="px-6 py-4 font-mono text-sm font-black text-brand-navy">{formatRupiah(entry.amount)}</td>
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

// Other subviews (minimal implementations)
function AdminFinanceRealizationView({ domain }: { domain: any }) { return <div className="p-8 text-center text-slate-500">Realization View - implementation continues</div>; }
function AdminFinanceAssetsView({ domain }: { domain: any }) { return <div className="p-8 text-center text-slate-500">Assets View - implementation continues</div>; }
function AdminFinanceAccountingView({ domain }: { domain: any }) { return <div className="p-8 text-center text-slate-500">Accounting View - implementation continues</div>; }
function AdminFinanceReportsView({ domain }: { domain: any }) { return <div className="p-8 text-center text-slate-500">Reports View - implementation continues</div>; }
function AdminFinanceAuditView({ domain, auditEvents, notificationEvents }: { domain: any; auditEvents: any[]; notificationEvents: any[] }) { return <div className="p-8 text-center text-slate-500">Audit View - implementation continues</div>; }

export default AdminFinancePage;