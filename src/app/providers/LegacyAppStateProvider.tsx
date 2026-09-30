/**
 * Legacy Application State Provider
 * =================================
 * B1.3 — Production Router + AKSA App Shell
 *
 * Authority: docs/aksa/b1/01-legacy-compatibility-map.md
 *            docs/aksa/b1/02-b1-subbatch-plan.md
 *
 * ## Purpose
 *
 * `src/App.tsx` before B1.3 held ALL top-level application state in one
 * component and rendered every screen with a `view` string comparison. B1.3
 * makes the URL the source of truth for "which screen", but the *business*
 * state must be preserved exactly.
 *
 * This provider is the extracted equivalent of that `App` component's state
 * and behaviour. It is a MOVE, not a rewrite:
 *
 *   - The same `localStorage` keys are used, with the same read/write
 *    semantics and the same `PROGRAMS` / `BLOG_POSTS` fallbacks.
 *   - The same lead and website-question capture payloads are written.
 *   - The same consultation behaviour (including the direct-WhatsApp fast
 *    path for guest users) is preserved.
 *   - The same upgrade / return-to-result behaviour is preserved.
 *   - `localStorage` is NOT migrated to a server. That is B2.
 *
 * ## The one deliberate change
 *
 * `setView` now performs ROUTER NAVIGATION instead of setting a `view`
 * string. It is the same `(v: View) => void` signature every legacy component
 * already expects, so no component's public props changed.
 *
 * ## Why selection ids are mirrored into refs
 *
 * The dominant legacy navigation idiom is:
 *
 *   setSelectedProgramId(program.id);
 *   setView('programDetail');
 *
 * Both calls happen in the same React event handler, so `setView` closes
 * over the PREVIOUS `selectedProgramId`. If the adapter read React state it
 * would build the wrong URL. Mirroring each selection into a ref that the
 * setter updates SYNCHRONOUSLY lets `setView` read the id that was just
 * chosen. This is the mechanism that makes canonical parameterised URLs
 * correct without touching a single call site.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BLOG_POSTS, PROGRAMS } from '../../constants';
import type {
  BlogPost,
  Program,
  TryoutSubtestResult,
  User,
  View,
  WebsiteQuestion,
} from '../../types';
import { legacyViewToPath, pathToLegacyView } from '../router/legacyViewRoutes';
import { blogPostPath } from '../router/routePaths';

/* ------------------------------------------------------------------ */
/* localStorage readers — copied verbatim from App.tsx                */
/* ------------------------------------------------------------------ */

const PROGRAM_STORAGE_KEY = 'theprams_demo_programs';
const BLOG_STORAGE_KEY = 'theprams_demo_blog_posts';
const WEBSITE_QUESTION_STORAGE_KEY = 'theprams_demo_website_questions';
const LEAD_STORAGE_KEY = 'theprams_demo_leads';

const readStoredPrograms = (): Program[] => {
  try {
    const raw = localStorage.getItem(PROGRAM_STORAGE_KEY);
    if (!raw) return PROGRAMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : PROGRAMS;
  } catch {
    return PROGRAMS;
  }
};

const readStoredBlogPosts = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) return BLOG_POSTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : BLOG_POSTS;
  } catch {
    return BLOG_POSTS;
  }
};

/* ------------------------------------------------------------------ */
/* Context shape                                                      */
/* ------------------------------------------------------------------ */

export interface ConsultationState {
  isOpen: boolean;
  name: string;
  phone: string;
  message: string;
  context: string;
  /** Drag position, in px from the right/bottom viewport edges. */
  pos: { x: number; y: number };
  didDrag: boolean;
}

export interface LegacyAppState {
  /* --- identity ------------------------------------------------- */
  user: User | null;
  setUser: (user: User | null) => void;
  isLogoutConfirmOpen: boolean;
  /** Opens the legacy logout confirmation dialog. */
  requestLogout: () => void;
  cancelLogout: () => void;
  confirmLogout: () => void;

  /* --- content collections -------------------------------------- */
  editablePrograms: Program[];
  updateEditablePrograms: (next: Program[]) => void;
  editableBlogPosts: BlogPost[];
  updateEditableBlogPosts: (next: BlogPost[]) => void;

  /* --- selections ------------------------------------------------ */
  selectedProgramId: string | null;
  setSelectedProgramId: (id: string | null) => void;
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
  selectedMentorId: string | null;
  setSelectedMentorId: (id: string | null) => void;
  selectedBlogId: string | null;
  setSelectedBlogId: (id: string | null) => void;
  selectedTryoutId: string | null;
  setSelectedTryoutId: (id: string | null) => void;
  tryoutResults: TryoutSubtestResult[] | null;
  setTryoutResults: (results: TryoutSubtestResult[]) => void;
  /** True when an upgrade flow intends to return the guest to their result. */
  upgradeReturnToResult: boolean;

  /* --- navigation ------------------------------------------------ */
  /**
   * The legacy navigation adapter. Signature is identical to the pre-router
   * `setView`, so every existing component keeps working unchanged.
   */
  setView: (view: View) => void;
  /** Legacy blog opener. Navigates to the canonical blog URL. */
  openBlogPost: (id: string) => void;
  /** Opens the program detail page for an upgrade flow. */
  openUpgradeProgram: (returnToResult?: boolean) => void;

  /* --- consultation --------------------------------------------- */
  consultation: ConsultationState;
  setConsultation: Dispatch<SetStateAction<ConsultationState>>;
  openConsultation: (context?: string) => void;
  submitConsultation: (event: FormEvent) => void;

  /* --- derived -------------------------------------------------- */
  /** Legacy `View` for the current URL, or `null` for non-legacy routes. */
  currentView: View | null;
  /** True when the current URL corresponds to a legacy capability. */
  isLegacyRoute: boolean;
}

const LegacyAppStateContext = createContext<LegacyAppState | null>(null);

export function useLegacyAppState(): LegacyAppState {
  const context = useContext(LegacyAppStateContext);
  if (!context) {
    throw new Error(
      'useLegacyAppState must be used inside <LegacyAppStateProvider>.',
    );
  }
  return context;
}

/* ------------------------------------------------------------------ */
/* Provider                                                           */
/* ------------------------------------------------------------------ */

export interface LegacyAppStateProviderProps {
  children: ReactNode;
}

export function LegacyAppStateProvider({
  children,
}: LegacyAppStateProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  /* --- identity (was useState in App.tsx) ------------------------ */
  const [user, setUser] = useState<User | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  /* --- content collections -------------------------------------- */
  const [editablePrograms, setEditablePrograms] =
    useState<Program[]>(readStoredPrograms);
  const [editableBlogPosts, setEditableBlogPosts] =
    useState<BlogPost[]>(readStoredBlogPosts);

  /* --- selections ------------------------------------------------ */
  const [selectedProgramId, setSelectedProgramIdState] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageIdState] = useState<string | null>(null);
  const [selectedMentorId, setSelectedMentorIdState] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogIdState] = useState<string | null>(null);
  const [selectedTryoutId, setSelectedTryoutIdState] = useState<string | null>(null);
  const [tryoutResults, setTryoutResults] = useState<TryoutSubtestResult[] | null>(null);
  const [upgradeReturnToResult, setUpgradeReturnToResult] = useState(false);

  /* --- consultation --------------------------------------------- */
  const [consultation, setConsultation] = useState<ConsultationState>({
    isOpen: false,
    name: '',
    phone: '',
    message: '',
    context: '',
    pos: { x: 24, y: 110 },
    didDrag: false,
  });

  /* ---------------------------------------------------------------- */
  /* Selection refs — the mechanism that makes setView URL-correct     */
  /* ---------------------------------------------------------------- */

  const programIdRef = useRef<string | null>(null);
  const packageIdRef = useRef<string | null>(null);
  const mentorIdRef = useRef<string | null>(null);
  const blogIdRef = useRef<string | null>(null);
  const tryoutIdRef = useRef<string | null>(null);
  const returnToResultRef = useRef(false);

  /**
   * Wraps a selection setter so React state AND the synchronous ref are
   * updated together. Components call these instead of raw state setters.
   */
  const makeSelectionSetter = useCallback(
    <T extends string | null>(
      ref: MutableRefObject<T>,
      setState: Dispatch<SetStateAction<T>>,
    ) =>
      (value: T) => {
        ref.current = value;
        setState(value);
      },
    [],
  );

  const setSelectedProgramId = useCallback(
    makeSelectionSetter(programIdRef, setSelectedProgramIdState),
    [makeSelectionSetter],
  );
  const setSelectedPackageId = useCallback(
    makeSelectionSetter(packageIdRef, setSelectedPackageIdState),
    [makeSelectionSetter],
  );
  const setSelectedMentorId = useCallback(
    makeSelectionSetter(mentorIdRef, setSelectedMentorIdState),
    [makeSelectionSetter],
  );
  const setSelectedBlogId = useCallback(
    makeSelectionSetter(blogIdRef, setSelectedBlogIdState),
    [makeSelectionSetter],
  );
  const setSelectedTryoutId = useCallback(
    makeSelectionSetter(tryoutIdRef, setSelectedTryoutIdState),
    [makeSelectionSetter],
  );

  /* ---------------------------------------------------------------- */
  /* Navigation adapter                                                */
  /* ---------------------------------------------------------------- */

  /**
   * The legacy `setView` adapter.
   *
   * Same signature as before. The only difference is that it now resolves to a
   * canonical URL and navigates. Ids are read from refs, so the common
   * `setSelectedX(id); setView(detail);` idiom produces the correct
   * parameterised URL.
   */
  const setView = useCallback(
    (view: View) => {
      const path = legacyViewToPath(view, {
        programId: programIdRef.current,
        packageId: packageIdRef.current,
        mentorId: mentorIdRef.current,
        blogId: blogIdRef.current,
        tryoutId: tryoutIdRef.current,
      });
      navigate(path);
    },
    [navigate],
  );

  const openBlogPost = useCallback(
    (id: string) => {
      blogIdRef.current = id;
      setSelectedBlogIdState(id);
      // Canonical URL. The legacy `#blog-<id>` share form is still accepted
      // by the router and redirects here, so old links keep working.
      navigate(blogPostPath(id));
    },
    [navigate],
  );

  /* ---------------------------------------------------------------- */
  /* Content mutation + localStorage                                   */
  /* ---------------------------------------------------------------- */

  const updateEditablePrograms = useCallback((nextPrograms: Program[]) => {
    setEditablePrograms(nextPrograms);
    localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(nextPrograms));
  }, []);

  const updateEditableBlogPosts = useCallback((nextPosts: BlogPost[]) => {
    setEditableBlogPosts(nextPosts);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(nextPosts));
  }, []);

  /* ---------------------------------------------------------------- */
  /* Lead / question capture — copied verbatim from App.tsx           */
  /* ---------------------------------------------------------------- */

  const saveLead = useCallback(
    (lead: {
      name: string;
      phone: string;
      email?: string;
      programOfInterest: string;
      source: string;
    }) => {
      const previous = JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '[]');
      localStorage.setItem(
        LEAD_STORAGE_KEY,
        JSON.stringify([
          {
            id: `local-${Date.now()}`,
            status: 'New',
            createdAt: new Date().toISOString().slice(0, 10),
            ...lead,
            email: lead.email || '-',
          },
          ...previous,
        ]),
      );
    },
    [],
  );

  const saveWebsiteQuestion = useCallback(
    (question: Omit<WebsiteQuestion, 'id' | 'status' | 'createdAt'>) => {
      const previous = JSON.parse(
        localStorage.getItem(WEBSITE_QUESTION_STORAGE_KEY) || '[]',
      );
      localStorage.setItem(
        WEBSITE_QUESTION_STORAGE_KEY,
        JSON.stringify([
          {
            id: `web-question-${Date.now()}`,
            status: 'Baru',
            createdAt: new Date().toLocaleString('id-ID'),
            ...question,
          },
          ...previous,
        ]),
      );
    },
    [],
  );

  /* ---------------------------------------------------------------- */
  /* Program resolution helpers — copied verbatim from App.tsx         */
  /* ---------------------------------------------------------------- */

  const resolveProgramIdForUser = useCallback(() => {
    const userProgram =
      `${user?.program ?? ''} ${user?.targetPTN ?? ''} ${user?.joinReason ?? ''}`.toLowerCase();
    if (
      userProgram.includes('cpns') ||
      userProgram.includes('skd') ||
      userProgram.includes('kedinasan')
    ) {
      return 'skd-cpns';
    }
    return 'snbt-kedokteran';
  }, [user]);

  const resolvePremiumPackageId = useCallback(
    (programId: string) => {
      const program = editablePrograms.find((item) => item.id === programId);
      return (
        program?.packages?.find((pkg) => pkg.isPopular)?.id ||
        program?.packages?.find((pkg) =>
          pkg.name.toLowerCase().includes('premium'),
        )?.id ||
        program?.packages?.[0]?.id ||
        null
      );
    },
    [editablePrograms],
  );

  const openUpgradeProgram = useCallback(
    (returnToResult = false) => {
      const programId = resolveProgramIdForUser();
      returnToResultRef.current = returnToResult;
      setUpgradeReturnToResult(returnToResult);
      setSelectedProgramId(programId);
      setSelectedPackageId(resolvePremiumPackageId(programId));
      setView('programDetail');
    },
    [
      resolveProgramIdForUser,
      resolvePremiumPackageId,
      setSelectedProgramId,
      setSelectedPackageId,
      setView,
    ],
  );

  /* ---------------------------------------------------------------- */
  /* Consultation — copied verbatim from App.tsx                       */
  /* ---------------------------------------------------------------- */

  const openConsultation = useCallback(
    (context = 'Konsultasi Website') => {
      if (user?.id === 'u_guest' && user.name && user.phone) {
        // Legacy direct-WhatsApp fast path. No modal, no form, no change.
        const programId = programIdRef.current || resolveProgramIdForUser();
        const program = editablePrograms.find((item) => item.id === programId);
        saveLead({
          name: user.name,
          phone: user.phone,
          email: user.email,
          programOfInterest:
            program?.title || user.program || 'Konsultasi Tryout Gratis',
          source: context,
        });
        saveWebsiteQuestion({
          name: user.name,
          phone: user.phone,
          email: user.email || '-',
          programOfInterest:
            program?.title || user.program || 'Konsultasi Tryout Gratis',
          question: `Saya ingin konsultasi setelah mencoba tryout gratis. Target saya: ${user.targetPTN || '-'}.`,
          source: `${context} - Direct WhatsApp`,
        });
        window.open(
          `https://wa.me/6281234567890?text=${encodeURIComponent(
            `Halo Admin The Prams, saya ${user.name}. Nomor WA saya ${user.phone}. Saya ingin konsultasi setelah mencoba tryout gratis. Target saya: ${user.targetPTN || '-'}.`,
          )}`,
          '_blank',
        );
        return;
      }

      setConsultation((previous) => ({
        ...previous,
        name: user?.id === 'u_guest' ? user.name : user?.name || '',
        phone: user?.phone || '',
        message: '',
        context,
        isOpen: true,
      }));
    },
    [user, editablePrograms, resolveProgramIdForUser, saveLead, saveWebsiteQuestion],
  );

  const submitConsultation = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const programId = programIdRef.current || resolveProgramIdForUser();
      const program = editablePrograms.find((item) => item.id === programId);
      const phone =
        consultation.phone.trim() ||
        user?.phone ||
        'Nomor dari WhatsApp saat user mengirim';
      saveLead({
        name: consultation.name,
        phone,
        email: user?.email,
        programOfInterest: program?.title || 'Konsultasi Program',
        source: `${consultation.context} - Pesan: ${consultation.message}`,
      });
      saveWebsiteQuestion({
        name: consultation.name || user?.name || 'Calon customer',
        email: user?.email || '-',
        phone,
        programOfInterest: program?.title || 'Konsultasi Program',
        question: consultation.message,
        source: `${consultation.context} - Direct WhatsApp`,
      });
      setConsultation((previous) => ({ ...previous, isOpen: false }));
      window.open(
        `https://wa.me/6281234567890?text=${encodeURIComponent(
          `Halo Admin The Prams, saya ${consultation.name || user?.name || 'calon customer'}. ${consultation.message}`,
        )}`,
        '_blank',
      );
    },
    [
      consultation,
      user,
      editablePrograms,
      resolveProgramIdForUser,
      saveLead,
      saveWebsiteQuestion,
    ],
  );

  /* ---------------------------------------------------------------- */
  /* Logout — copied verbatim from App.tsx                             */
  /* ---------------------------------------------------------------- */

  const requestLogout = useCallback(() => setIsLogoutConfirmOpen(true), []);
  const cancelLogout = useCallback(() => setIsLogoutConfirmOpen(false), []);

  const confirmLogout = useCallback(() => {
    setUser(null);
    setIsLogoutConfirmOpen(false);
    navigate('/');
  }, [navigate]);

  /* ---------------------------------------------------------------- */
  /* URL -> state synchronisation (deep links)                         */
  /* ---------------------------------------------------------------- */

  /**
   * Rehydrates selection state from the URL so a direct deep link or a
   * browser refresh renders the correct target.
   *
   * This is what makes `/programs/<id>`, `/mentors/<id>`, `/blog/<id>` and
   * `/app/assessment/<id>/exam` work without relying on a prior in-app click.
   */
  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const decode = (value?: string) => {
      if (!value) return null;
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    };

    if (segments[0] === 'programs' && segments[1]) {
      const programId = decode(segments[1]);
      programIdRef.current = programId;
      setSelectedProgramIdState(programId);
    } else if (segments[0] === 'mentors' && segments[1]) {
      const mentorId = decode(segments[1]);
      mentorIdRef.current = mentorId;
      setSelectedMentorIdState(mentorId);
    } else if (segments[0] === 'blog' && segments[1]) {
      const blogId = decode(segments[1]);
      blogIdRef.current = blogId;
      setSelectedBlogIdState(blogId);
    } else if (segments[0] === 'app' && segments[1] === 'assessment' && segments[2]) {
      const tryoutId = decode(segments[2]);
      tryoutIdRef.current = tryoutId;
      setSelectedTryoutIdState(tryoutId);
    }
  }, [location.pathname]);

  /* ---------------------------------------------------------------- */
  /* Effects carried over from App.tsx                                 */
  /* ---------------------------------------------------------------- */

  const currentView = useMemo(
    () => pathToLegacyView(location.pathname),
    [location.pathname],
  );

  // Smooth scroll to top on navigation. Was keyed on `view`; now keyed on
  // the path, which is the equivalent trigger.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Result-page lead capture. Behaviour identical to App.tsx; only the
  // trigger changed from a `view` string to the derived legacy view.
  useEffect(() => {
    if (!tryoutResults || !user || currentView !== 'result') return;
    const weakest = [...tryoutResults].sort((a, b) => a.score - b.score)[0];
    saveLead({
      name: user.name,
      phone: user.phone || '-',
      email: user.email,
      programOfInterest: `${
        user.program || 'Tryout'
      } - Skor ${Math.round(
        tryoutResults.reduce((sum, item) => sum + item.score, 0) /
          tryoutResults.length,
      )}/100`,
      source: `Hasil Tryout - Terlemah: ${weakest?.name || '-'} (${
        weakest?.score || 0
      }/100)`,
    });
  }, [tryoutResults, user, currentView, saveLead]);

  const value = useMemo<LegacyAppState>(
    () => ({
      user,
      setUser,
      isLogoutConfirmOpen,
      requestLogout,
      cancelLogout,
      confirmLogout,
      editablePrograms,
      updateEditablePrograms,
      editableBlogPosts,
      updateEditableBlogPosts,
      selectedProgramId,
      setSelectedProgramId,
      selectedPackageId,
      setSelectedPackageId,
      selectedMentorId,
      setSelectedMentorId,
      selectedBlogId,
      setSelectedBlogId,
      selectedTryoutId,
      setSelectedTryoutId,
      tryoutResults,
      setTryoutResults,
      upgradeReturnToResult,
      setView,
      openBlogPost,
      openUpgradeProgram,
      consultation,
      setConsultation,
      openConsultation,
      submitConsultation,
      currentView,
      isLegacyRoute: currentView !== null,
    }),
    [
      user,
      isLogoutConfirmOpen,
      requestLogout,
      cancelLogout,
      confirmLogout,
      editablePrograms,
      updateEditablePrograms,
      editableBlogPosts,
      updateEditableBlogPosts,
      selectedProgramId,
      setSelectedProgramId,
      selectedPackageId,
      setSelectedPackageId,
      selectedMentorId,
      setSelectedMentorId,
      selectedBlogId,
      setSelectedBlogId,
      selectedTryoutId,
      setSelectedTryoutId,
      tryoutResults,
      upgradeReturnToResult,
      setView,
      openBlogPost,
      openUpgradeProgram,
      consultation,
      openConsultation,
      submitConsultation,
      currentView,
    ],
  );

  return (
    <LegacyAppStateContext.Provider value={value}>
      {children}
    </LegacyAppStateContext.Provider>
  );
}
