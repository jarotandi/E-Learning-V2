/**
 * Legacy Route Bridge
 * ===================
 * B1.3 — Production Router + AKSA App Shell
 *
 * This is the compatibility layer that keeps all 21 legacy capabilities
 * rendering exactly as they did before the router existed. It is the ONLY
 * place in B1.3 that decides which legacy component renders for which URL.
 *
 * Design rules observed here:
 *
 *  1. Every legacy component receives the SAME props it received in
 *     `App.tsx`, with `setView` swapped for the router-backed adapter. No
 *     component's public API changed.
 *
 *  2. Business logic is untouched. Payment gating, premium gating, tryout
 *     scoring, lead capture and consultation all still live inside the
 *     legacy components and/or the state provider.
 *
 *  3. The per-view fade/slide from `App.tsx` is preserved, keyed on the
 *     derived legacy view, so navigation still feels the same. The exit half
 *     of that transition was REMOVED during B1.3 verification because
 *     `AnimatePresence mode="wait"` silently swallowed router navigation; see
 *     the comment at the render site below for the measured evidence.
 *
 *  4. `schedule` was inline JSX inside `App.tsx`. It is extracted verbatim to
 *     `LegacySchedulePage` so it can participate in routing. No behavioural
 *     change; see that file.
 */

import { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';

import { PROGRAMS } from '../../constants';
import { useLegacyAppState } from '../providers/LegacyAppStateProvider';

/* ------------------------------------------------------------------ */
/* Route-level lazy loading                                            */
/*                                                                     */
/* Legacy screens are large; AdminDashboard alone is 408.8 KB. Loading */
/* them through `React.lazy` splits the bundle so a visitor on the      */
/* landing page never downloads the admin surface. Measured results are */
/* recorded in docs/aksa/b1/04-b1.3-router-migration.md.                */
/* ------------------------------------------------------------------ */

const LandingPage = lazy(() =>
  import('../../components/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const ProgramListingPage = lazy(() =>
  import('../../components/ProgramListingPage').then((m) => ({
    default: m.ProgramListingPage,
  })),
);
const ProgramDetailPage = lazy(() =>
  import('../../components/ProgramDetailPage').then((m) => ({
    default: m.ProgramDetailPage,
  })),
);
const MentorProfilePage = lazy(() =>
  import('../../components/MentorProfilePage').then((m) => ({
    default: m.MentorProfilePage,
  })),
);
const BlogListingPage = lazy(() =>
  import('../../components/BlogListingPage').then((m) => ({
    default: m.BlogListingPage,
  })),
);
const BlogPostPage = lazy(() =>
  import('../../components/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
);
const TestimonialsPage = lazy(() =>
  import('../../components/TestimonialsPage').then((m) => ({
    default: m.TestimonialsPage,
  })),
);
const ContactPage = lazy(() =>
  import('../../components/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const LoginPage = lazy(() =>
  import('../../components/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const PaymentPage = lazy(() =>
  import('../../components/PaymentPage').then((m) => ({ default: m.PaymentPage })),
);
const FinalRegistrationPage = lazy(() =>
  import('../../components/FinalRegistrationPage').then((m) => ({
    default: m.FinalRegistrationPage,
  })),
);
const StudentDashboard = lazy(() =>
  import('../../components/StudentDashboard').then((m) => ({
    default: m.StudentDashboard,
  })),
);
const LearningPage = lazy(() =>
  import('../../components/LearningPage').then((m) => ({ default: m.LearningPage })),
);
const TryoutListingPage = lazy(() =>
  import('../../components/TryoutListingPage').then((m) => ({
    default: m.TryoutListingPage,
  })),
);
const TryoutExamPage = lazy(() =>
  import('../../components/TryoutExamPage').then((m) => ({
    default: m.TryoutExamPage,
  })),
);
const TryoutResultPage = lazy(() =>
  import('../../components/TryoutResultPage').then((m) => ({
    default: m.TryoutResultPage,
  })),
);
const ProfilePage = lazy(() =>
  import('../../components/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const AdminDashboard = lazy(() =>
  import('../../components/AdminDashboard').then((m) => ({
    default: m.AdminDashboard,
  })),
);
const LegacySchedulePage = lazy(() =>
  import('./LegacySchedulePage').then((m) => ({ default: m.LegacySchedulePage })),
);

/* ------------------------------------------------------------------ */
/* Fallback while a lazy chunk loads                                   */
/* ------------------------------------------------------------------ */

function RouteFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 animate-pulse" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Memuat halaman
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bridge                                                              */
/* ------------------------------------------------------------------ */

export function LegacyRouteBridge() {
  const {
    user,
    setUser,
    editablePrograms,
    editableBlogPosts,
    selectedProgramId,
    selectedPackageId,
    selectedMentorId,
    selectedBlogId,
    selectedTryoutId,
    tryoutResults,
    setTryoutResults,
    upgradeReturnToResult,
    setSelectedProgramId,
    setSelectedPackageId,
    setSelectedMentorId,
    setSelectedTryoutId,
    setView,
    openBlogPost,
    openUpgradeProgram,
    openConsultation,
    requestLogout,
    updateEditablePrograms,
    updateEditableBlogPosts,
    currentView,
  } = useLegacyAppState();

  const params = useParams();

  /* Deep-link initialisation for the parameterised routes. The provider
     already syncs state from the pathname; this covers the case where a
     route param is present but the state write has not flushed yet on the
     very first render of a cold deep link. */
  const programId = params.programId
    ? decodeURIComponent(params.programId)
    : selectedProgramId;
  const mentorId = params.mentorId
    ? decodeURIComponent(params.mentorId)
    : selectedMentorId;
  const blogId = params.blogId
    ? decodeURIComponent(params.blogId)
    : selectedBlogId;
  const tryoutId = params.tryoutId
    ? decodeURIComponent(params.tryoutId)
    : selectedTryoutId;

  // `finalRegistration` fell back through the same chain in `App.tsx`.
  const finalRegistrationProgram =
    editablePrograms.find((program) => program.id === selectedProgramId) ||
    editablePrograms[0] ||
    PROGRAMS[0];

  return (
    <Suspense fallback={<RouteFallback />}>
      {/* Per-view fade/slide, keyed on the derived legacy view.

          B1.3 DEFECT FOUND AND FIXED HERE (evidence below).

          `App.tsx` before B1.3 used `AnimatePresence mode="wait"` and it worked,
          because `view` was component state: changing the key always remounted
          through the presence protocol.

          Under the router this DOES NOT WORK, and it fails silently in the worst
          possible way: the URL updates, but the rendered page never changes.
          Measured on the built bundle (vite preview, Chrome):

            /programs  --click program card-->  /programs/snbt-kedokteran
              location.pathname = /programs/snbt-ked社会学 ... renders LISTING
              still mounted at opacity 1 / transform none, >10s later
            /  --click Navbar "E-Learning Program"-->  /programs
              renders LANDING, still mounted

          Cause: consecutive legacy routes live in the SAME layout branch, so
          React reconciles `LegacyRouteBridge` in place. The `motion.div` key
          changes, `AnimatePresence mode="wait"` keeps the EXITING child mounted
          until its exit animation reports completion — and that completion
          never arrives here (React 19.2.5 + motion 12.38.0, with the children
          being `React.lazy`). The exiting child therefore stays mounted at its
          `animate` values forever, permanently shadowing the new route.

          Cross-branch navigation (`/programs` -> `/admin`) still worked, which
          is why this was easy to miss: there React replaces the whole subtree
          and `initial={false}` renders instantly.

          THE FIX: drop the presence protocol entirely and keep the ENTER
          animation. React unmounts the old child and mounts the new one
          directly on the key change, so navigation cannot be swallowed, and the
          0.3s fade/slide-in the user actually sees is preserved. Only the
          fade-OUT is dropped. Correctness of navigation outranks a cosmetic
          exit transition.

          Restoring the exit animation requires the presence mechanism to be
          reliable under `React.lazy` + `Suspense` + `StrictMode`; that is a
          B1.4 concern alongside the rest of the visual migration, and it must
          not be reintroduced without a working browser test. */}
      <motion.div
        key={currentView ?? 'none'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentView === 'landing' && (
          <LandingPage setView={setView} programs={editablePrograms} />
        )}

        {currentView === 'login' && (
          <LoginPage
            setView={setView}
            setUser={setUser}
            setSelectedTryoutId={setSelectedTryoutId}
            setSelectedProgramId={setSelectedProgramId}
            setSelectedPackageId={setSelectedPackageId}
            programs={editablePrograms}
          />
        )}

        {currentView === 'register' && (
          <LoginPage
            setView={setView}
            setUser={setUser}
            setSelectedTryoutId={setSelectedTryoutId}
            setSelectedProgramId={setSelectedProgramId}
            setSelectedPackageId={setSelectedPackageId}
            isRegisteringDefault={true}
            initialProgramId={selectedProgramId}
            initialPackageId={selectedPackageId}
            initialUser={user}
            programs={editablePrograms}
          />
        )}

        {currentView === 'guestRegistration' && (
          <LoginPage
            setView={setView}
            setUser={setUser}
            setSelectedTryoutId={setSelectedTryoutId}
            setSelectedProgramId={setSelectedProgramId}
            setSelectedPackageId={setSelectedPackageId}
            isGuestModeDefault={true}
            programs={editablePrograms}
          />
        )}

        {currentView === 'programs' && (
          <ProgramListingPage
            setView={setView}
            setSelectedProgramId={(id: string) => {
              setSelectedProgramId(id);
              setSelectedPackageId(null);
            }}
            programs={editablePrograms}
          />
        )}

        {currentView === 'programDetail' && (
          <ProgramDetailPage
            programId={programId}
            setView={setView}
            programs={editablePrograms}
            selectedPackageId={selectedPackageId}
            setSelectedPackageId={setSelectedPackageId}
            returnToResult={upgradeReturnToResult && user?.id === 'u_guest'}
            setSelectedMentorId={setSelectedMentorId}
          />
        )}

        {currentView === 'mentorProfile' && (
          <MentorProfilePage
            mentorId={mentorId}
            setView={setView}
            setSelectedProgramId={setSelectedProgramId}
          />
        )}

        {currentView === 'blogListing' && (
          <BlogListingPage
            setView={setView}
            setSelectedBlogId={openBlogPost}
            posts={editableBlogPosts}
          />
        )}

        {currentView === 'blogPost' && (
          <BlogPostPage
            blogId={blogId}
            setView={setView}
            setSelectedBlogId={openBlogPost}
            posts={editableBlogPosts}
          />
        )}

        {currentView === 'testimonials' && <TestimonialsPage setView={setView} />}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'payment' && (
          <PaymentPage
            setView={setView}
            selectedProgramId={selectedProgramId}
            selectedPackageId={selectedPackageId}
            user={user}
            programs={editablePrograms}
          />
        )}

        {currentView === 'finalRegistration' && (
          <FinalRegistrationPage
            setView={setView}
            user={user}
            selectedProgram={finalRegistrationProgram}
            selectedPackage={
              finalRegistrationProgram.packages?.find(
                (pkg) => pkg.id === selectedPackageId,
              ) || null
            }
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            setView={setView}
            user={user}
            logout={requestLogout}
            onUpgrade={() => openUpgradeProgram(false)}
          />
        )}

        {currentView === 'learning' && (
          <LearningPage
            setView={setView}
            user={user}
            onUpgrade={() => openUpgradeProgram(false)}
          />
        )}

        {currentView === 'tryoutListing' && (
          <TryoutListingPage setView={setView} user={user} />
        )}

        {currentView === 'exam' && (
          <TryoutExamPage
            setView={setView}
            setTryoutResults={setTryoutResults}
            selectedTryoutId={tryoutId}
          />
        )}

        {currentView === 'result' && (
          <TryoutResultPage
            setView={setView}
            tryoutResults={tryoutResults}
            user={user}
            selectedTryoutId={tryoutId}
            onUpgrade={() => openUpgradeProgram(true)}
            onConsult={() => openConsultation('Konsultasi Hasil Tryout')}
          />
        )}

        {currentView === 'profile' && <ProfilePage setView={setView} user={user} />}

        {currentView === 'schedule' && (
          <LegacySchedulePage
            user={user}
            onBack={() => setView('dashboard')}
            onUpgrade={() => openUpgradeProgram(false)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            logout={requestLogout}
            setView={setView}
            programs={editablePrograms}
            onProgramsChange={updateEditablePrograms}
            blogPosts={editableBlogPosts}
            onBlogPostsChange={updateEditableBlogPosts}
          />
        )}
      </motion.div>
    </Suspense>
  );
}
