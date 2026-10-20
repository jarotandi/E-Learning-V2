/**
 * Admin Commerce / Finance Record Detail Dialog
 * ============================================
 * B1.4D-T8 — Financial Center extraction (`/admin/commerce/finance`)
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/19-b1.4d-t8-finance.md
 *
 * The legacy finance record detail modal, moved verbatim.
 */

import { AnimatePresence, motion } from 'motion/react';
import { X, FileText, Upload } from 'lucide-react';
import type { UseAdminFinanceDomainResult } from './useAdminFinanceDomain';

export interface AdminFinanceRecordDialogProps {
  domain: UseAdminFinanceDomainResult;
}

export function AdminFinanceRecordDialog({ domain }: AdminFinanceRecordDialogProps) {
  const { selectedFinanceRecord, setSelectedFinanceRecord, updateFinanceRecordStatus, openStoredInvoice, openStoredProof, openReviewEmail, openReviewWhatsapp, notify } = domain;

  if (!selectedFinanceRecord) return null;

  const { tx, proof } = selectedFinanceRecord;
  const isScholarship = String(tx.status).toLowerCase().includes('scholarship');
  const isFree = String(tx.status).toLowerCase().includes('free') || String(tx.type).toLowerCase() === 'free';
  const uploadNotRequired = isScholarship || isFree;


  return (
    <AnimatePresence>
      {selectedFinanceRecord && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8"
          >
            <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Informasi Pendaftaran</h3>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Detail transaksi dan status pembayaran</p>
              </div>
              <button onClick={() => setSelectedFinanceRecord(null)} aria-label="Tutup detail pendaftaran" className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-full">
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="p-8 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    ['Nama', tx.student],
                    ['Email', tx.email],
                    ['WhatsApp', tx.phone],
                    ['Tanggal', tx.date],
                    ['Invoice', tx.invoiceNumber || tx.id],
                    ['Metode', tx.method || '-'],
                    ['Status', tx.status],
                    ['Invoice', tx.invoiceNumber || tx.id],
                    ['Tanggal', tx.date || '-'],
                  ].map(([label, value]) => (
                    <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-sm font-bold text-brand-navy break-words">{value || '-'}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg text-blue-700"><FileText size={18} aria-hidden="true" /></div>
                    <div>
                      <p className="text-sm font-black text-brand-navy mb-1">Program & Pembayaran</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{tx.program} - {tx.packageName}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-black text-brand-navy">Aksi Admin</h4>
                    {(proof || String(selectedFinanceRecord.tx.status).toLowerCase().includes('scholarship') || String(selectedFinanceRecord.tx.status).toLowerCase().includes('free')) ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => updateFinanceRecordStatus(selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id, String(selectedFinanceRecord.tx.status).toLowerCase().includes('scholarship') ? 'Scholarship Approved' : 'Payment Approved')} className="py-3 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 min-h-[44px]">
                          Approve
                        </button>
                        <button onClick={() => updateFinanceRecordStatus(selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id, 'Needs Revision')} className="py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 min-h-[44px]">
                          Tidak
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">Approve/tolak tersedia setelah lampiran diterima.</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button onClick={() => openReviewEmail(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-brand-blue text-xs font-black uppercase tracking-widest min-h-[44px]">
                        Email Review
                      </button>
                      <button onClick={() => openReviewWhatsapp(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-emerald-600 text-xs font-black uppercase tracking-widest min-h-[44px]">
                        WhatsApp Review
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                      Gunakan tombol review jika data ditolak atau lampiran belum sesuai. Pesan akan mengarahkan calon siswa untuk memverifikasi ulang data/dokumen.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200">
                    <h4 className="font-black text-brand-navy mb-4">Dokumen Lampiran</h4>
                    {proof ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-sm font-black text-brand-navy">{proof.fileName}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{proof.type || 'Payment Proof'} - {Math.ceil((proof.fileSize || 0) / 1024)} KB</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-2">Status: {proof.status || '-'}</p>
                        </div>
                        <button onClick={() => openStoredProof(proof)} className="w-full btn-secondary py-3 min-h-[44px]">
                          <Upload size={18} aria-hidden="true" /> Buka Lampiran
                        </button>
                      </div>
                    ) : (String(tx.status).toLowerCase().includes('scholarship') || String(tx.status).toLowerCase().includes('free') || String(tx.type).toLowerCase() === 'free') ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800">
                        Paket gratis/beasiswa tidak memerlukan upload bukti pembayaran. Review dilakukan dari data pendaftaran.
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-800">
                        Calon siswa belum melampirkan bukti pembayaran/dokumen beasiswa.
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-black text-brand-navy mb-4">Aksi Admin</h4>
                    {(proof || String(tx.status).toLowerCase().includes('scholarship') || String(tx.status).toLowerCase().includes('free')) ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => updateFinanceRecordStatus(tx.invoiceNumber || tx.id, String(tx.status).toLowerCase().includes('scholarship') ? 'Scholarship Approved' : 'Payment Approved')} className="py-3 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 min-h-[44px]">
                          Approve
                        </button>
                        <button onClick={() => updateFinanceRecordStatus(tx.invoiceNumber || tx.id, 'Needs Revision')} className="py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 min-h-[44px]">
                          Tidak
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">Approve/tolak tersedia setelah lampiran diterima.</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button onClick={() => openReviewEmail(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-brand-blue text-xs font-black uppercase tracking-widest min-h-[44px]">
                        Email Review
                      </button>
                      <button onClick={() => openReviewWhatsapp(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-emerald-600 text-xs font-black uppercase tracking-widest min-h-[44px]">
                        WhatsApp Review
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                      Gunakan tombol review jika data ditolak atau lampiran belum sesuai. Pesan akan mengarahkan calon siswa untuk memverifikasi ulang data/dokumen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AdminFinanceRecordDialog;