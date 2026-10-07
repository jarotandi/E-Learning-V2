/**
 * Learning Workspace Feature Boundary
 * ==================================
 * B1.4C — LearningPage decomposition into AKSA LearnerLayout
 *
 * Public API for the migrated learning workspace.
 */

export { LearningWorkspacePage } from './LearningWorkspacePage';
export { LearningWorkspaceToolbar } from './LearningWorkspaceToolbar';
export { LessonVideoPlayer } from './LessonVideoPlayer';
export { LessonContentPanel } from './LessonContentPanel';
export { LessonFeedbackCard } from './LessonFeedbackCard';
export { SupportMaterialsCard } from './SupportMaterialsCard';
export { LiveSessionPanel } from './LiveSessionPanel';
export { CurriculumPanel } from './CurriculumPanel';
export { LessonFeedbackDialog } from './LessonFeedbackDialog';
export { 
  deriveLessonAccess,
  calculateCourseProgress,
  calculateModuleProgress,
  formatTime as formatDuration,
  formatTime,
  isLessonAccessible,
  isLessonLocked,
  getLessonById,
  getModuleById,
  FREE_LESSON_LIMIT,
  PREMIUM_LOCK_MESSAGE,
} from './learningWorkspaceModel';