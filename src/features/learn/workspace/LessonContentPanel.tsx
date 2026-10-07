/**
 * Lesson Content Panel
 * ====================
 * B1.4C — LearningPage decomposition
 *
 * Displays active lesson title, description, completion action,
 * and share/bookmark actions.
 */

import { 
  Play, 
  CheckCircle2, 
  Lock, 
  Share2,
  Bookmark,
} from 'lucide-react';
import { Button, Badge } from '@/design-system/components';
import { formatTime as formatDuration } from './learningWorkspaceModel';

interface LessonContentPanelProps {
  title: string;
  description: string;
  duration: string;
  isLocked: boolean;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onShare: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
}

export function LessonContentPanel({
  title,
  description,
  duration,
  isLocked,
  isCompleted,
  onToggleComplete,
  onShare,
  onToggleBookmark,
  isBookmarked,
}: LessonContentPanelProps) {
  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-brand-navy truncate">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="md"
            onClick={description !== 'locked' ? onToggleComplete : undefined}
            disabled={!description || description === 'locked'}
            aria-label={description === 'locked' ? 'Materi Premium' : (isCompleted ? 'Sudah Dipelajari' : 'Tandai Selesai')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={18} fill="currentColor" />
                Sudah Dipelajari
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                Tandai Selesai
              </>
            )}
          </Button>
          <button
            onClick={onShare}
            aria-label="Bagikan materi"
            className="p-3 bg-white rounded-2xl text-slate-500 hover:text-brand-teal border border-slate-100 shadow-sm transition-all hover:scale-110 active:scale-90 min-w-11 min-h-11"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed font-medium">
        {description === 'locked' ? (
          <div className="p-8 bg-white border border-amber-100 rounded-3xl text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mx-auto text-amber-500 mb-4"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <p className="font-bold text-brand-navy mb-2">Materi ini tersedia untuk akun premium.</p>
            <p className="text-sm text-slate-500 mb-5">Upgrade paket untuk membuka semua video, modul pembelajaran, live session, jadwal, dan rekaman kelas.</p>
            <button className="btn-primary mx-auto">Upgrade Paket</button>
          </div>
        ) : (
          <p>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default LessonContentPanel;