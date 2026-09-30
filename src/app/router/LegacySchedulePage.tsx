/**
 * Legacy Schedule Page
 * ====================
 * B1.3 — Production Router + AKSA App Shell
 *
 * BEFORE B1.3: this markup was inline JSX inside the `view === 'schedule'`
 * branch of `src/App.tsx`. Because a router needs components, not conditionals,
 * it was lifted into this file.
 *
 * This is a LIFT, not a rewrite. The markup, the `user?.isPremium` gate, the
 * `LIVE_SESSIONS` data, the calendar/GMeet links, the upgrade CTA and the
 * back-to-dashboard control are all unchanged from `App.tsx`. The only
 * difference is that navigation is now passed as `onBack` / `onUpgrade`
 * callbacks supplied by the route bridge instead of reaching for `setView`.
 *
 * Route: `/app/calendar`
 */

import { Calendar, ChevronLeft, ExternalLink, Mail, Video } from 'lucide-react';
import { LIVE_SESSIONS } from '../../constants';
import type { User } from '../../types';

export interface LegacySchedulePageProps {
  user: User | null;
  onBack: () => void;
  onUpgrade: () => void;
}

export function LegacySchedulePage({
  user,
  onBack,
  onUpgrade,
}: LegacySchedulePageProps) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-navy font-bold text-sm mb-8 transition-colors"
        >
          <ChevronLeft size={18} />
          Kembali ke Dashboard
        </button>

        {user?.isPremium ? (
          <>
            <div className="mb-8">
              {/* `text-brand-blue` is #009688 (~3.67:1 on white) and fails AA for
                  this 12px label. Accessible teal #00796b (~5.32:1) is the
                  contract remedy for normal-size text (B1.3R1). */}
              <p className="text-xs font-black uppercase tracking-widest text-[#00796b] mb-2">
                Google Calendar Sync
              </p>
              <h1 className="text-4xl font-black text-brand-navy mb-3">
                Semua Jadwal Kelas
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Jadwal ini tersinkron dengan data Live Session. Reminder dikirim
                melalui Gmail, link GMeet tersedia, dan rekaman tersimpan di
                Kelas Saya setelah sesi selesai.
              </p>
            </div>

            <div className="space-y-4">
              {LIVE_SESSIONS.map((session) => (
                <div key={session.id} className="card-premium p-6 bg-white">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex gap-5">
                      {/* Teal is kept for the graphical Calendar icon and the
                          tinted tile, but the 10px time label is text: it uses
                          accessible teal so it passes AA on blue-50 (~4.89:1). */}
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex flex-col items-center justify-center shrink-0">
                        <Calendar size={22} />
                        <span className="text-[10px] font-black mt-1 text-[#00796b]">
                          {session.startTime}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          {session.date}
                        </p>
                        <h2 className="text-xl font-bold text-brand-navy mb-2">
                          {session.title}
                        </h2>
                        <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                          {/* Icon keeps brand teal (graphical); the mode label is
                              text and needs the accessible teal on blue-50. */}
                          <span className="px-2 py-1 rounded-md bg-blue-50 text-brand-blue flex items-center gap-1">
                            <Video size={12} />
                            <span className="text-[#00796b]">{session.mode}</span>
                          </span>
                          <span className="px-2 py-1 rounded-md bg-red-50 text-red-500 flex items-center gap-1">
                            <Mail size={12} />
                            {session.gmailStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                          {session.recordingStatus}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[320px]">
                      <a
                        href={session.calendarUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 text-brand-navy text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                      >
                        Tambah Calendar
                        <Calendar size={16} />
                      </a>
                      {/* Filled control with normal-size (12px) white text.
                          White on #009688 is ~3.67:1 and fails AA; the contract
                          remedy is the accessible teal fill (~5.32:1). The
                          hover already used blue-600 (~5.17:1) and passes. */}
                      <a
                        href={session.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-4 py-3 rounded-xl bg-[#00796b] text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
                      >
                        Masuk GMeet
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card-premium p-10 bg-white text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
              <Calendar size={32} />
            </div>
            <h1 className="text-3xl font-black text-brand-navy mb-3">
              Jadwal Kelas Premium
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto mb-8">
              Akun gratis belum mendapat akses jadwal live session, Google
              Calendar, dan link GMeet. Upgrade paket untuk membuka jadwal
              kelas.
            </p>
            <button onClick={onUpgrade} className="btn-primary mx-auto">
              Upgrade Paket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
