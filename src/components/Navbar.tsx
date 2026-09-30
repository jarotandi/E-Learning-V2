/**
 * @deprecated Removed from the application in B1.4A — DO NOT IMPORT.
 *
 * ---------------------------------------------------------------------------
 * B1.4A DEPRECATION NOTICE
 * ---------------------------------------------------------------------------
 * This component has been superseded by `src/app/layouts/PublicHeader.tsx`.
 *
 * It is RETAINED, not deleted, for two reasons:
 *
 *  1. Rollback. `PublicHeader` is the first real migration of legacy chrome
 *     onto the AKSA design system. If a behaviour turns out to be missing,
 *     this file is the reference for what the behaviour was.
 *  2. It still carries the ONLY record of the legacy public-navigation
 *     inventory, including the two defects B1.4A corrected (the 768–1023px
 *     navigation dead zone, and the mobile drawer having no signed-in state).
 *     Deleting it would delete that record.
 *
 * ## Proof that nothing imports it
 *
 * Verified with a repository-wide search across `src/`, `scripts/`, `docs/`,
 * and `index.html` at commit time. The only remaining occurrences of the
 * identifier "Navbar" are:
 *
 *   - this file itself
 *   - prose in `app/router/*` and `app/layouts/*` describing the chrome rule
 *   - `showsLegacyNavbar` / `NAVBAR_HIDDEN_LEGACY_VIEWS` in
 *     `router/legacyViewRoutes.ts` — a chrome-VISIBILITY function, unrelated to
 *     this component, and still the live rule used by `PublicLayout`
 *   - the word "navbar" inside `AdminDashboard` CMS copy, which is unrelated
 *
 * There is no `import` statement for this module anywhere in the codebase, so
 * it is not in the production bundle.
 *
 * ## Why it was not deleted outright
 *
 * B1.4A STEP 5 permits deletion once every behaviour is proven migrated.
 * Migration is proven for the eight public destinations, the mobile drawer,
 * and the signed-in Dashboard/Logout flow. What is NOT proven is
 * visual-parity acceptance, which is B1.5 work and has not run yet. Keeping
 * the file costs nothing at runtime and removes the risk of deleting the
 * reference before the thing it is a reference for has been signed off.
 *
 * Removal is a candidate for B1.5, once visual acceptance has passed.
 *
 * ## What PublicHeader changed
 *
 *   - Wordmark: "Bimbel The Prams" -> `AksaBrandMark` (AKSA / Belajar Tanpa
 *     Batas), the approved AKSA shell brand migration.
 *   - Destinations are now real `<a href>` elements, so middle-click and
 *     cmd/ctrl-click work. A plain left click is still delegated to the
 *     router-backed `setView`, so the in-memory demo session survives.
 *   - One breakpoint (`lg`) for both desktop clusters, closing the dead zone.
 *   - The mobile drawer now reflects the signed-in state.
 *   - Contrast: no `#009688` normal-size text, and no white normal-size text
 *     on `#009688`.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from 'react';
import { Menu, X, BookOpen, GraduationCap, Users, LayoutDashboard, Search, Home, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { View, User } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  logout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'landing' as View, icon: Home },
    { label: 'E-Learning Program', view: 'programs' as View, icon: BookOpen },
    { label: 'Tryout Gratis', view: 'guestRegistration' as View, icon: Star, badge: 'Baru' },
    { label: 'Info Menarik', view: 'blogListing' as View, icon: Search },
    { label: 'Testimoni', view: 'testimonials' as View, icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('landing')}
          >
            <div className="p-2 bg-brand-blue rounded-xl text-white group-hover:rotate-6 transition-all shadow-lg shadow-brand-blue/20">
              <GraduationCap size={28} />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight leading-none block">Bimbel The Prams</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => setView(link.view)}
                className={`text-[13px] font-bold transition-all hover:text-brand-blue relative flex items-center gap-1.5 ${
                  currentView === link.view ? 'text-brand-blue' : 'text-slate-700'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-red-100 animate-pulse">
                    {link.badge}
                    <span className="text-xs">🔥</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 pl-2 pr-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100 transition-all group"
                >
                   <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="" />
                   <span className="text-sm font-bold text-brand-navy group-hover:text-brand-blue transition-colors">Dashboard</span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                    <button 
                      onClick={() => { setView('dashboard'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-4" />
                    <button 
                      onClick={() => { logout(); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setView('login')}
                  className="px-6 py-2.5 rounded-xl border-2 border-brand-blue text-brand-blue font-bold text-sm hover:bg-brand-blue/5 transition-all"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => setView('register')}
                  className="px-6 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { setView(link.view); setIsOpen(false); }}
                  className="flex items-center justify-between w-full p-4 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all font-bold text-sm"
                >
                  <div className="flex items-center gap-4">
                    <link.icon size={20} className="text-slate-400" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-red-100">
                      {link.badge} 🔥
                    </span>
                  )}
                </button>
              ))}
              
              <div className="pt-6 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setView('login'); setIsOpen(false); }}
                  className="px-6 py-4 rounded-2xl border-2 border-brand-blue text-brand-blue font-bold text-sm"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => { setView('register'); setIsOpen(false); }}
                  className="px-6 py-4 rounded-2xl bg-brand-blue text-white font-bold text-sm shadow-lg shadow-brand-blue/20"
                >
                  Daftar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
