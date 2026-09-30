/**
 * Learner Dashboard Feature Boundary
 * ==================================
 * B1.4B — StudentDashboard decomposition
 *
 * Public API for the migrated learner dashboard.
 */

export { LearnerDashboardPage } from './LearnerDashboardPage';
export { DashboardWelcome } from './DashboardWelcome';
export { DashboardStats } from './DashboardStats';
export { ScoreTrendCard } from './ScoreTrendCard';
export { ContinueLearningCard } from './ContinueLearningCard';
export { FeedbackCard } from './FeedbackCard';
export { TodayScheduleCard } from './TodayScheduleCard';
export { LearningRecommendationsCard } from './LearningRecommendationsCard';
export { useLegacyLearnerAccess, type LegacyLearnerAccess, type DirectoryUser } from './legacyLearnerAccess';