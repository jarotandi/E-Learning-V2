/**
 * Learner Dashboard Page
 * ======================
 * B1.4B — StudentDashboard decomposition
 *
 * The main dashboard page component that composes all feature components.
 * This is the CONTENT ONLY — no sidebar, no header, no app shell.
 * It is designed to be rendered inside LearnerLayout.
 */

import { useMemo } from 'react';
import type { View, User } from '@/types';
import { CURRICULUM, TRYOUT_SUBTEST_RESULTS } from '@/constants';
import { useLegacyLearnerAccess, type LegacyLearnerAccess, type RecommendedLesson } from './legacyLearnerAccess';
import { DashboardWelcome } from './DashboardWelcome';
import { DashboardStats } from './DashboardStats';
import { ScoreTrendCard } from './ScoreTrendCard';
import { ContinueLearningCard } from './ContinueLearningCard';
import { FeedbackCard } from './FeedbackCard';
import { TodayScheduleCard } from './TodayScheduleCard';
import { LearningRecommendationsCard } from './LearningRecommendationsCard';
import { colors, layout, spacing } from '@/design-system/tokens/brand';

interface LearnerDashboardPageProps {
  user: User | null;
  setView: (view: View) => void;
  onUpgrade: () => void;
}

export function LearnerDashboardPage({ user, setView, onUpgrade }: LearnerDashboardPageProps) {
  // Derive all legacy access state
  const access = useLegacyLearnerAccess(user);

  // Calculate progress
  const progressData = useMemo(() => {
    const totalLessons = CURRICULUM.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const completedLessons = CURRICULUM.reduce((acc, mod) =>
      acc + mod.lessons.filter((l) => l.isCompleted).length, 0
    );
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);

    // Recommended lessons from weakest tryout subjects
    const weakestSubjects = [...TRYOUT_SUBTEST_RESULTS].sort((a, b) => a.score - b.score).slice(0, 2);
    const lessonLookup = new Map(
      CURRICULUM.flatMap((mod) =>
        mod.lessons.map((lesson) => [
          lesson.id,
          {
            moduleTitle: mod.title,
            title: lesson.title,
            duration: lesson.duration,
            isCompleted: lesson.isCompleted,
          } as const,
        ])
      )
    );

    const recommendedLessons: RecommendedLesson[] = weakestSubjects.flatMap((subject) =>
      subject.recommendedLessonIds
        .map((lessonId) => {
          const lesson = lessonLookup.get(lessonId);
          return lesson ? { ...lesson, id: lessonId, subjectName: subject.name, score: subject.score } : null;
        })
        .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
    ).slice(0, 3);

    return { progressPercent, recommendedLessons };
  }, []);

  const { progressPercent, recommendedLessons } = progressData;

  return (
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
        {/* Welcome + Account Status */}
        <DashboardWelcome user={user} access={access} />

        {/* Stats Grid */}
        <DashboardStats access={access} progressPercent={progressPercent} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Chart + Continue Learning + Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <ScoreTrendCard access={access} />
            <div className="grid md:grid-cols-2 gap-6">
              <ContinueLearningCard progressPercent={progressPercent} onNavigate={setView} />
              <FeedbackCard onNavigate={setView} />
            </div>
          </div>

          {/* Right Column - Schedule + Recommendations */}
          <div className="space-y-6">
            <TodayScheduleCard access={access} onNavigate={setView} onUpgrade={onUpgrade} />
            <LearningRecommendationsCard recommendedLessons={recommendedLessons} onNavigate={setView} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnerDashboardPage;