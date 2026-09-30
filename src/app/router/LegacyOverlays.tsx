/**
 * Legacy Global Overlays
 * ======================
 * B1.3 — Production Router + AKSA App Shell
 *
 * These three overlays were rendered directly by `src/App.tsx` before B1.3
 * and are mounted here as a router-level sibling so they keep appearing on
 * every screen with identical behaviour and identical markup:
 *
 *   1. "DEMO ADMIN" toggle  — always visible, demo-only.
 *   2. Draggable consultation FAB — hidden on `exam` and `admin`.
 *   3. Consultation modal.
 *   4. Logout confirmation modal.
 *
 * B1.3 SCOPE NOTE — READ BEFORE COPYING ANY OF THIS
 * ------------------------------------------------
 * The "DEMO ADMIN" button is an unguarded shortcut to the admin surface. It is
 * retained because removing it would delete a legacy capability, and B1.3 is a
 * migration batch. It is NOT a security control and must not be described as
 * one. SEC-P1-03 (admin has no authentication gate) remains OPEN and is a B2
 * deliverable. See docs/aksa/b1/03-client-security-inventory.md.
 *
 * The consultation FAB writes leads and website questions to `localStorage`
 * and opens `wa.me`. That authority is deliberately NOT migrated in B1.3;
 * SEC-P1-02 remains OPEN for B2.
 */

import { MessageCircle, X } from 'lucide-react';
import { useLegacyAppState } from '../providers/LegacyAppStateProvider';

export function LegacyOverlays() {
  const {
    currentView,
    consultation,
    setConsultation,
    openConsultation,
    submitConsultation,
    isLogoutConfirmOpen,
    cancelLogout,
    confirmLogout,
    setView,
  } = useLegacyAppState();

  // Verbatim legacy rule: the FAB is hidden on exam and admin only.
  const showConsultFab = currentView !== 'exam' && currentView !== 'admin';

  return (
    <>
      {/* ---------------------------------------------------------- */}
      {/* Admin toggle (demo purposes only — NOT an auth control)      */}
      {/* ---------------------------------------------------------- */}
      <div className="fixed bottom-4 right-4 z-[999] flex gap-2">
        <button
          onClick={() =>
            setView(currentView === 'admin' ? 'landing' : 'admin')
          }
          className="p-3 bg-brand-navy text-white rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-transform flex items-center gap-2"
          title="Demo Admin View"
        >
          <span className="text-[10px] font-bold">DEMO ADMIN</span>
        </button>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Draggable consultation trigger                              */}
      {/* ---------------------------------------------------------- */}
      {showConsultFab && (
        <button
          type="button"
          onPointerDown={(event) => {
            setConsultation((previous) => ({ ...previous, didDrag: false }));
            event.currentTarget.setPointerCapture(event.pointerId);
            const startClientX = event.clientX;
            const startClientY = event.clientY;
            const startX = consultation.pos.x;
            const startY = consultation.pos.y;
            const move = (moveEvent: PointerEvent) => {
              const deltaX = moveEvent.clientX - startClientX;
              const deltaY = moveEvent.clientY - startClientY;
              if (Math.abs(deltaX) + Math.abs(deltaY) > 6) {
                setConsultation((previous) => ({ ...previous, didDrag: true }));
              }
              setConsultation((previous) => ({
                ...previous,
                pos: {
                  x: Math.max(8, startX - deltaX),
                  y: Math.max(8, startY - deltaY),
                },
              }));
            };
            const up = () => {
              window.removeEventListener('pointermove', move);
              window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
          }}
          onClick={() => {
            // A drag must not fire a click; that is the legacy behaviour.
            if (!consultation.didDrag) {
              openConsultation('Konsultasi via ikon WhatsApp');
            }
          }}
          style={{ right: consultation.pos.x, bottom: consultation.pos.y }}
          className="fixed z-[998] w-14 h-14 rounded-full bg-emerald-500 text-white shadow-2xl flex items-center justify-center border-4 border-white touch-none cursor-grab active:cursor-grabbing"
          title="Drag untuk pindah, klik untuk konsultasi"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Consultation modal                                          */}
      {/* ---------------------------------------------------------- */}
      {consultation.isOpen && (
        <div className="fixed inset-0 z-[1000] bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={submitConsultation}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-brand-navy">
                Konsultasi Gratis
              </h3>
              <button
                type="button"
                onClick={() =>
                  setConsultation((previous) => ({ ...previous, isOpen: false }))
                }
                className="p-2 rounded-xl bg-slate-50 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Nama
                </label>
                <input
                  required
                  value={consultation.name}
                  onChange={(event) =>
                    setConsultation((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Nomor WhatsApp
                </label>
                <input
                  required
                  value={consultation.phone}
                  onChange={(event) =>
                    setConsultation((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium"
                  placeholder="0812-xxxx-xxxx"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Pesan yang ingin disampaikan
                </label>
                <textarea
                  required
                  value={consultation.message}
                  onChange={(event) =>
                    setConsultation((previous) => ({
                      ...previous,
                      message: event.target.value,
                    }))
                  }
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium min-h-[120px]"
                  placeholder="Contoh: Saya ingin konsultasi program SNBT Kedokteran setelah tryout gratis."
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nomor WhatsApp pengirim akan direkap dari data tryout jika
                tersedia. Jika belum tersedia, nomor dicatat dari WhatsApp saat
                user mengirim pesan.
              </p>
              <button type="submit" className="w-full btn-primary py-4">
                Kirim Konsultasi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Logout confirmation                                         */}
      {/* ---------------------------------------------------------- */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[1001] bg-brand-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-brand-orange flex items-center justify-center mb-6">
              <X size={26} />
            </div>
            <h3 className="text-2xl font-black text-brand-navy mb-3">
              Yakin ingin keluar dari kelas?
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Progress belajarmu sudah berjalan. Tetap di kelas untuk lanjut
              mengejar target hari ini, atau keluar jika memang sudah selesai.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={cancelLogout}
                className="px-5 py-3 rounded-xl bg-brand-blue text-white text-sm font-black"
              >
                Tidak, lanjut belajar
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-600 text-sm font-black"
              >
                Iya, keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
