/**
 * Curriculum Panel
 * ================
 * B1.4C-R1 — LearningPage decomposition
 *
 * Right sidebar showing module list with progress, lessons, bookmarks.
 * Designed to work inside LearnerLayout (not as app chrome).
 */

import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Bookmark 
} from 'lucide-react';
import { 
  deriveLessonAccess, 
  calculateModuleProgress, 
  FREE_LESSON_LIMIT,
  isLessonAccessible,
  isLessonLocked,
} from './learningWorkspaceModel';
import { Badge, Button, Card } from '@/design-system/components';
import { useMemo } from 'react';
import type { Module } from '@/types';

interface CurriculumPanelProps {
  curriculum: Module[];
  activeLessonId: string;
  bookmarkedLessons: string[];
  isPremium: boolean;
  onLessonClick: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onUpgrade: () => void;
}

export function CurriculumPanel({
  curriculum,
  activeLessonId,
  bookmarkedLessons,
  isPremium,
  onLessonClick,
  onToggleBookmark,
  onUpgrade,
}: CurriculumPanelProps) {
  const access = useMemo(
    () => deriveLessonAccess(curriculum, isPremium, FREE_LESSON_LIMIT),
    [curriculum, isPremium]
  );

  const totalLessons = curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = curriculum.reduce((acc, mod) =>
    acc + mod.lessons.filter(l => l.isCompleted).length, 0
  );
  const remainingLessons = totalLessons - completedLessons;

  return (
    <aside className="w-full lg:w-96 border-l border-slate-100 bg-white overflow-y-auto">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="font-bold text-brand-navy">Daftar Modul</h3>
        <span className="bg-blue-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md">
          {remainingLessons} Materi Lagi
        </span>
      </div>

      <div className="p-4 space-y-6">
        {curriculum.map((mod) => {
          const modPercent = calculateModuleProgress(curriculum, mod.id);

          return (
            <div key={mod.id}>
              <div className="px-2 mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mod.title}</h4>
                  <span className="text-[10px] font-bold text-slate-500">{modPercent}%</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-teal/30 transition-all duration-500" style={{ width: `${modPercent}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                {mod.lessons.map((lesson) => {
                  const isLocked = isLessonLocked(lesson.id, access);

                  const lessonIcon = isLocked ? (
                    <div className="w-7 h-7 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  ) : lesson.isCompleted ? (
                    <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      activeLessonId === lesson.id ? 'bg-brand-teal text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  );

                  return (
                    <div key={lesson.id} className={`flex items-center gap-1 group pr-2 ${isLocked ? 'opacity-60' : ''}`}>
                      <button
                        onClick={() => {
                          if (isLocked) return;
                          onLessonClick(lesson.id);
                        }}
                        disabled={isLocked}
                        className={`flex-1 flex items-center gap-3 p-3 rounded-2xl text-left transition-colors ${
                          activeLessonId === lesson.id
                            ? 'bg-blue-50 text-emerald-700 border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lessonIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold truncate leading-snug">{lesson.title}</p>
                          <p className="text-[10px] font-medium opacity-60 mt-0.5">{isLocked ? 'Premium' : lesson.duration}</p>
                        </div>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleBookmark(lesson.id); }}
                        className={`p-2 rounded-xl transition-all min-w-11 min-h-11 flex items-center justify-center ${bookmarkedLessons.includes(lesson.id) ? 'bg-amber-50 text-amber-500' : 'text-slate-300 hover:bg-slate-50 hover:text-slate-400'}`}
                        aria-label={bookmarkedLessons.includes(lesson.id) ? 'Hapus bookmark' : 'Simpan bookmark'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarkedLessons.includes(lesson.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked Module Example */}
      <div className="opacity-50 pointer-events-none">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Matematika Intensif</h4>
        <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Persiapan Berhitung Cepat</p>
            <p className="text-[10px] font-medium text-slate-400">Tersedia 01 Mei 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CurriculumPanel;