/**
 * Learning Workspace Page
 * =======================
 * B1.4C — LearningPage decomposition
 *
 * Main workspace page component that composes all feature components.
 * This is CONTENT ONLY — no app shell, no header, no sidebar.
 * Designed to be rendered inside LearnerLayout.
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import type { View, User } from '@/types';
import { CURRICULUM, LIVE_SESSIONS } from '@/constants';
import { 
  deriveLessonAccess, 
  calculateCourseProgress,
  calculateModuleProgress,
  FREE_LESSON_LIMIT,
  formatTime,
} from './learningWorkspaceModel';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { LearningWorkspaceToolbar } from './LearningWorkspaceToolbar';
import { LessonVideoPlayer } from './LessonVideoPlayer';
import { LessonContentPanel } from './LessonContentPanel';
import { LessonFeedbackCard } from './LessonFeedbackCard';
import { SupportMaterialsCard } from './SupportMaterialsCard';
import { LiveSessionPanel } from './LiveSessionPanel';
import { CurriculumPanel } from './CurriculumPanel';
import { LessonFeedbackDialog } from './LessonFeedbackDialog';
import { colors, layout, spacing } from '@/design-system/tokens/brand';

interface LearningWorkspacePageProps {
  user: User | null;
  setView: (view: View) => void;
  onUpgrade: () => void;
}

export function LearningWorkspacePage({ user, setView, onUpgrade }: LearningWorkspacePageProps) {
  // Derive all legacy access state
  const access = useMemo(
    () => ({ isPremium: Boolean(user?.isPremium) }),
    [user?.isPremium]
  );

  // Curriculum state
  const [curriculum, setCurriculum] = useState(CURRICULUM);
  const [activeLesson, setActiveLesson] = useState(CURRICULUM[0].lessons[0]);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  // Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Feedback Modal States
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [dialogRating, setDialogRating] = useState(0);
  const [dialogQuestion, setDialogQuestion] = useState('');
  const [isDialogSubmitted, setIsDialogSubmitted] = useState(false);

  // Download States
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState<number[]>([]);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState<string | null>(null);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'content' | 'live'>('content');

  // Progress calculations
  const progressData = useMemo(() => {
    const totalLessons = CURRICULUM.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedLessons = CURRICULUM.reduce((acc, mod) =>
      acc + mod.lessons.filter(l => l.isCompleted).length, 0
    );
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);

    return { progressPercent, totalLessons, completedLessons };
  }, [curriculum]);

  const { progressPercent } = progressData;

  const accessData = useMemo(() => ({
    isPremium: Boolean(user?.isPremium),
    freeLessonLimit: 2,
    accessibleLessonIds: new Set(
      Boolean(user?.isPremium)
        ? CURRICULUM.flatMap((mod) => mod.lessons.map((lesson) => lesson.id))
        : CURRICULUM.flatMap((mod) => mod.lessons).slice(0, 2).map((lesson) => lesson.id)
    ),
  }), [user?.isPremium]);

  const { isPremium, freeLessonLimit, accessibleLessonIds } = accessData;
  const isActiveLessonLocked = !accessibleLessonIds.has(activeLesson.id);
  const liveSession = LIVE_SESSIONS[0];

  const toggleComplete = (lessonId: string) => {
    if (!accessibleLessonIds.has(lessonId)) return;
    const updatedCurriculum = curriculum.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, isCompleted: !lesson.isCompleted } : lesson
      )
    }));
    setCurriculum(updatedCurriculum);

    if (activeLesson.id === lessonId) {
      setActiveLesson(prev => ({ ...prev, isCompleted: !prev.isCompleted }));
    }
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarkedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsFeedbackSubmitted(true);
    setTimeout(() => {
      setIsFeedbackSubmitted(false);
      setFeedback('');
      setRating(0);
    }, 4000);
  };

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

  const sendDialogQuestion = () => {
    if (dialogRating === 0) return;
    setIsDialogSubmitted(true);
    setTimeout(() => {
      setIsDialogSubmitted(false);
      setDialogRating(0);
      setDialogQuestion('');
      setIsFeedbackDialogOpen(false);
    }, 2000);
  };

  const handleLessonClick = (lessonId: string) => {
    const lesson = CURRICULUM.flatMap(mod => mod.lessons).find(l => l.id === lessonId);
    if (lesson) setActiveLesson(lesson);
  };

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  const currentTimeMinutes = Math.floor((typeof activeLesson.duration === 'number' ? activeLesson.duration : 10) * (progress / 100));
  const durationMinutes = typeof activeLesson.duration === 'number' ? activeLesson.duration : 5;

  return (
    <>
      <div
        className="flex-1 min-w-0"
        style={{
          backgroundColor: colors.surface.mint,
          padding: layout.content.padding,
          gap: layout.content.gap,
        }}
      >
        <div
          className="mx-auto w-full"
          style={{ maxWidth: layout.content.maxWidth }}
        >
          {/* Workspace Toolbar */}
          <LearningWorkspaceToolbar
            activeLessonTitle={activeLesson.title}
            progressPercent={progressData.progressPercent}
            onBackToDashboard={() => setView('dashboard')}
            onFinishLearning={() => setView('dashboard')}
          />

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <LessonVideoPlayer
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                progress={progress}
                onSeek={setProgress}
                volume={volume}
                onVolumeChange={setVolume}
                isMuted={isMuted}
                onMuteToggle={() => setIsMuted(!isMuted)}
                currentTimeMinutes={currentTimeMinutes}
                durationMinutes={durationMinutes}
                isLocked={isActiveLessonLocked}
              />

              {/* Tabs */}
              <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'content'
                      ? 'border-brand-teal text-brand-teal'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Video & Materi
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  disabled={!user?.isPremium}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'live'
                      ? 'border-brand-teal text-brand-teal'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                  aria-disabled={!Boolean(user?.isPremium)}
                >
                  {!user?.isPremium && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>}
                  Live Session {user?.isPremium ? '' : '(Premium)'}
                </button>
              </div>

              {activeTab === 'content' ? (
                <>
                  {/* Free account notice */}
                  {!user?.isPremium && (
                    <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-brand-navy mb-1">Akun Gratis</p>
                        <p className="text-xs text-slate-600">
                          Kamu bisa mencoba 2 video/modul pertama. Materi lanjutan dan live session tersedia untuk akun premium.
                        </p>
                      </div>
                      <button onClick={onUpgrade} className="px-4 py-3 bg-brand-orange text-white rounded-xl text-xs font-black">Upgrade Paket</button>
                    </div>
                  )}

                  {/* Lesson Content */}
                  <LessonContentPanel
                    title={activeLesson.title}
                    description={isActiveLessonLocked ? 'locked' : (
                      "Dalam pertemuan kali ini, kita akan membahas dasar-dasar logika yang sering keluar di soal SNBT Penalaran Umum. " +
                      "Memahami silogisme, modus ponens, dan modus tollens adalah kunci utama untuk menjawab soal tipe penarikan kesimpulan."
                    )}
                    duration={activeLesson.duration}
                    isLocked={isActiveLessonLocked}
                    isCompleted={activeLesson.isCompleted}
                    onToggleComplete={() => toggleComplete(activeLesson.id)}
                    onShare={() => {}}
                    onToggleBookmark={() => toggleBookmark(activeLesson.id)}
                    isBookmarked={bookmarkedLessons.includes(activeLesson.id)}
                  />

                  {/* Feedback */}
                  <LessonFeedbackCard
                    onSubmit={(r, f) => {
                      setRating(r);
                      setFeedback(f);
                      setIsFeedbackSubmitted(true);
                      setTimeout(() => {
                        setIsFeedbackSubmitted(false);
                        setRating(0);
                        setFeedback('');
                      }, 4000);
                    }}
                  />

                  {/* Downloads */}
                  <SupportMaterialsCard
                    materials={[
                      { id: 1, name: 'Modul Penalaran Umum PDF', size: '2.4 MB' },
                      { id: 2, name: 'Latihan Soal & Kunci Jawaban', size: '1.2 MB' }
                    ]}
                  />
                </>
              ) : (
                <LiveSessionPanel isPremium={Boolean(user?.isPremium)} />
              )}

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
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Curriculum Panel */}
        <CurriculumPanel
          curriculum={CURRICULUM}
          activeLessonId={activeLesson.id}
          bookmarkedLessons={bookmarkedLessons}
          isPremium={Boolean(user?.isPremium)}
          onLessonClick={handleLessonClick}
          onToggleBookmark={toggleBookmark}
          onFinishLearning={() => setView('dashboard')}
          onUpgrade={onUpgrade}
        />
      </div>
    </>
  );
}

export default LearningWorkspacePage;