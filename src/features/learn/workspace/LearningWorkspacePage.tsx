/**
 * Learning Workspace Page
 * =======================
 * B1.4C-R1 — LearningPage decomposition into AKSA LearnerLayout
 *
 * Main workspace page component that composes all feature components.
 * This is CONTENT ONLY — no app shell, no header, no sidebar.
 * Designed to be rendered inside LearnerLayout.
 */

import { useState, useMemo, useEffect } from 'react';
import type { View, User } from '@/types';
import { CURRICULUM, LIVE_SESSIONS } from '@/constants';
import { 
  deriveLessonAccess, 
  calculateCourseProgress,
  getLessonById,
  FREE_LESSON_LIMIT,
} from './learningWorkspaceModel';
import { motion } from 'motion/react';
import { LearningWorkspaceToolbar } from './LearningWorkspaceToolbar';
import { LessonVideoPlayer } from './LessonVideoPlayer';
import { LessonContentPanel } from './LessonContentPanel';
import { LessonFeedbackCard } from './LessonFeedbackCard';
import { SupportMaterialsCard } from './SupportMaterialsCard';
import { LiveSessionPanel } from './LiveSessionPanel';
import { CurriculumPanel } from './CurriculumPanel';
import { LessonFeedbackDialog } from './LessonFeedbackDialog';
import { colors, layout } from '@/design-system/tokens/brand';
import { Tabs, TabsPanel } from '@/design-system/components';

interface LearningWorkspacePageProps {
  user: User | null;
  setView: (view: View) => void;
  onUpgrade: () => void;
}

export function LearningWorkspacePage({ user, setView, onUpgrade }: LearningWorkspacePageProps) {
  // Curriculum state - mutable, derived from current state
  const [curriculum, setCurriculum] = useState(CURRICULUM);
  const [activeLesson, setActiveLesson] = useState(CURRICULUM[0].lessons[0]);

  // Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Feedback Modal States
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  // Bookmarks
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'content' | 'live'>('content');

  // Progress calculations - use current curriculum state
  const progressPercent = useMemo(
    () => calculateCourseProgress(curriculum),
    [curriculum]
  );

  // Access data - use current curriculum state
  const accessData = useMemo(
    () => deriveLessonAccess(curriculum, Boolean(user?.isPremium), FREE_LESSON_LIMIT),
    [curriculum, user?.isPremium]
  );

  const { isPremium, freeLessonLimit, accessibleLessonIds } = accessData;
  const isActiveLessonLocked = !accessibleLessonIds.has(activeLesson.id);

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

  const handleLessonClick = (lessonId: string) => {
    const lesson = getLessonById(curriculum, lessonId);
    if (lesson) setActiveLesson(lesson);
  };

  // Open feedback dialog - legacy "Beri Rating Pelajaran" action
  const openFeedbackDialog = () => {
    setIsFeedbackDialogOpen(true);
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

  const tabItems = [
    { id: 'content', label: 'Video & Materi', disabled: false },
    { id: 'live', label: user?.isPremium ? 'Live Session' : 'Live Session � Memerlukan akses Premium', disabled: !user?.isPremium },
  ];

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
            progressPercent={progressPercent}
            onBackToDashboard={() => setView('dashboard')}
            onFinishLearning={() => setView('dashboard')}
            onOpenFeedbackDialog={openFeedbackDialog}
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

              {/* Tabs - using design-system Tabs primitive */}
              <Tabs
                items={tabItems}
                activeId={activeTab}
                onChange={(id: string) => setActiveTab(id as 'content' | 'live')}
                ariaLabel="Materi pembelajaran"
              />

              <TabsPanel id="content" activeId={activeTab}>
                {/* Free account notice */}
                {!user?.isPremium && (
                  <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-brand-navy mb-1">Akun Gratis</p>
                      <p className="text-xs text-slate-600">
                        Kamu bisa mencoba 2 video/modul pertama. Materi lanjutan dan live session tersedia untuk akun premium.
                      </p>
                    </div>
                    <button onClick={onUpgrade} className="px-4 py-3 bg-emerald-700 text-white rounded-xl text-xs font-black">Upgrade Paket</button>
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
                    onUpgrade={onUpgrade}
                  />

                {/* Feedback */}
                <LessonFeedbackCard
                  onSubmit={(r, f) => {
                    // Minimal callback - card owns its own state
                  }}
                />

                {/* Downloads */}
                <SupportMaterialsCard
                  materials={[
                    { id: 1, name: 'Modul Penalaran Umum PDF', size: '2.4 MB' },
                    { id: 2, name: 'Latihan Soal & Kunci Jawaban', size: '1.2 MB' }
                  ]}
                />
              </TabsPanel>

              <TabsPanel id="live" activeId={activeTab}>
                <LiveSessionPanel isPremium={Boolean(user?.isPremium)} />
              </TabsPanel>
            </div>

            {/* Curriculum Panel - inside grid, stacks on mobile */}
            <div className="lg:col-span-1 space-y-6">
              <CurriculumPanel
                curriculum={curriculum}
                activeLessonId={activeLesson.id}
                bookmarkedLessons={bookmarkedLessons}
                isPremium={Boolean(user?.isPremium)}
                onLessonClick={handleLessonClick}
                onToggleBookmark={toggleBookmark}
                onUpgrade={onUpgrade}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Feedback Dialog - legacy "Beri Rating Pelajaran" capability */}
      <LessonFeedbackDialog
        isOpen={isFeedbackDialogOpen}
        onClose={() => setIsFeedbackDialogOpen(false)}
        lessonTitle={activeLesson.title}
        onSubmit={(rating, question) => {
          // Dialog owns its own state, parent only tracks open/close
        }}
      />
    </>
  );
}

export default LearningWorkspacePage;