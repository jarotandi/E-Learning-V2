/**
 * Live Session Panel
 * ==================
 * B1.4C — LearningPage decomposition
 *
 * Displays upcoming live session info with external links.
 */

import { 
  Clock, 
  Video, 
  Mail, 
  Calendar, 
  Archive, 
  ExternalLink 
} from 'lucide-react';
import { LIVE_SESSIONS } from '@/constants';
import { Card, Button } from '@/design-system/components';

interface LiveSessionPanelProps {
  isPremium: boolean;
}

export function LiveSessionPanel({ isPremium }: LiveSessionPanelProps) {
  const liveSession = LIVE_SESSIONS[0];

  if (!isPremium) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-8 animate-bounce">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 17a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
            <path d="M8 5v14" />
            <path d="M16 5v14" />
            <path d="M12 5v14" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-brand-navy mb-4">Sesi Live Mendatang</h3>
        <p className="text-slate-500 mb-8">Nantikan diskusi materi intensif langsung bersama mentor terbaik setiap Sabtu malam melalui Google Meet.</p>
        <button className="btn-primary">Upgrade Paket</button>
      </div>
    );
  }

  return (
    <div className="card-premium p-6">
      <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-3">
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 17a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
            <path d="M8 5v14" />
            <path d="M16 5v14" />
            <path d="M12 5v14" />
          </svg>
        </div>
        Sesi Live Mendatang
      </h3>

      <div className="p-6 bg-slate-900 rounded-3xl text-white w-full space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{liveSession.date}</span>
          <span className="px-2 py-1 bg-red-500 text-[10px] font-black rounded-md">{liveSession.gmailStatus}</span>
        </div>
        <h4 className="text-lg font-bold">{liveSession.title}</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-orange">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{liveSession.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-teal">
              <polygon points="23 7 16 12 9 7 16 12 23 7" />
            </svg>
            <span>{liveSession.mode}</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Notifikasi Gmail
            </div>
            <p className="text-xs text-white/70 leading-relaxed">Reminder dan detail kelas dikirim ke email siswa H-1 dan 1 jam sebelum sesi.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Google Calendar
            </div>
            <p className="text-xs text-white/70 leading-relaxed">Jadwal otomatis tersimpan di Google Calendar dan halaman Schedule.</p>
          </div>
        </div>
        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 text-left">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
            Rekaman Kelas
          </div>
          <p className="text-xs text-white/70 leading-relaxed">Live session recording available. Rekaman bisa diputar ulang kapan saja.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <a
            href={LIVE_SESSIONS[0].calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-4 py-3 rounded-xl bg-white text-brand-navy text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
          >
            Tambah ke Calendar
            <Calendar size={16} />
          </a>
          <a
            href="https://meet.google.com/abc-defg-hij"
            target="_blank"
            rel="noreferrer"
            className="flex-1 px-4 py-3 rounded-xl bg-brand-blue text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
          >
            Masuk GMeet
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default LiveSessionPanel;