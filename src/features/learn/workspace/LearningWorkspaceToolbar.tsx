/**
 * Learning Workspace Toolbar
 * ==========================
 * B1.4C — LearningPage decomposition
 *
 * Inner workspace toolbar (not app chrome) containing:
 * - Back to dashboard
 * - Course label
 * - Active lesson title
 * - Course progress
 * - Finish learning action
 */

import { ChevronLeft } from 'lucide-react';
import type { View } from '@/types';
import { Button } from '@/design-system/components';

interface LearningWorkspaceToolbarProps {
  activeLessonTitle: string;
  progressPercent: number;
  onBackToDashboard: () => void;
  onFinishLearning: () => void;
}

export function LearningWorkspaceToolbar({
  activeLessonTitle,
  progressPercent,
  onBackToDashboard,
  onFinishLearning,
}: LearningWorkspaceToolbarProps) {
  return (
    <div
      className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between gap-4"
      role="toolbar"
      aria-label="Navigasi ruang belajar"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToDashboard}
          aria-label="Kembali ke dashboard"
          className="p-2 rounded-full hover:bg-slate-100 min-w-11 min-h-11"
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">SNBT KEDOKTERAN</p>
          <h1 className="text-sm md:text-lg font-bold truncate max-w-[200px] md:max-w-md">{activeLessonTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 md:ml-auto flex-shrink-0">
        <div className="hidden sm:flex flex-col items-end mr-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progres Kursus</p>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-brand-teal transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs font-bold text-brand-navy">{progressPercent}%</span>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onFinishLearning}
          className="whitespace-nowrap"
        >
          Selesai Belajar
        </Button>
      </div>
    </div>
  );
}

export default LearningWorkspaceToolbar;