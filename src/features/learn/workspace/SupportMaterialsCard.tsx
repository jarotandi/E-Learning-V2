/**
 * Support Materials Card
 * ======================
 * B1.4C — LearningPage decomposition
 *
 * Downloadable support materials with progress simulation.
 */

import { Download, CheckCircle2, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, Badge } from '@/design-system/components';

interface SupportMaterial {
  id: number;
  name: string;
  size: string;
}

interface SupportMaterialsCardProps {
  materials: Array<{ id: number; name: string; size: string }>;
}

export function SupportMaterialsCard({ materials }: SupportMaterialsCardProps) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState<number[]>([]);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState<string | null>(null);

  const startDownload = (id: number, name: string) => {
    setDownloadingId(id);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setIsDownloaded(old => [...old, id]);
          setShowDownloadSuccess(name);
          setTimeout(() => setShowDownloadSuccess(null), 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <>
      <Card variant="default" padding="lg">
        <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          Materi Pendukung
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {materials.map((doc) => (
            <button
              key={doc.id}
              type="button"
              disabled={downloadingId !== null || isDownloaded.includes(doc.id)}
              onClick={() => downloadingId === null && !isDownloaded.includes(doc.id) && startDownload(doc.id, doc.name)}
              className={`flex flex-col gap-4 p-6 rounded-3xl border transition-all text-left disabled:cursor-not-allowed relative overflow-hidden ${
                isDownloaded.includes(doc.id)
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-white border-slate-100 hover:border-brand-teal/30 hover:shadow-xl group'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-50 text-brand-teal rounded-2xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                {isDownloaded.includes(doc.id) ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : downloadingId === doc.id ? (
                  <span className="text-[10px] font-bold text-brand-teal">{downloadProgress}%</span>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 group-hover:text-brand-teal group-hover:rotate-6 transition-all">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-brand-navy mb-1">{doc.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doc.size}</p>
              </div>
              {downloadingId === doc.id && (
                <div className="absolute bottom-0 left-0 h-1.5 bg-brand-teal transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Download Success Toast */}
      {showDownloadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[200] px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10"
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="pr-4">
            <p className="text-sm font-bold">Download Berhasil!</p>
            <p className="text-[10px] text-slate-400 font-medium">"{showDownloadSuccess}" tersimpan.</p>
          </div>
          <button onClick={() => setShowDownloadSuccess(null)} className="p-1 hover:bg-white/10 rounded-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </>
  );
}

export default SupportMaterialsCard;