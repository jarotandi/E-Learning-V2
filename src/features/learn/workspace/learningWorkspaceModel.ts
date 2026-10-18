/**
 * Learning Workspace Pure Helpers
 * ================================
 * B1.4C-R1 — Pure learning workspace model
 *
 * Authority: docs/aksa/design/01-design-system.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *
 * This module exports ONLY pure helper functions for learning workspace.
 * NO React hooks, NO localStorage, NO entitlement logic.
 *
 * B1.4B entitlement authority remains at:
 * src/features/learn/dashboard/legacyLearnerAccess.ts
 *
 * Learning workspace premium semantics: Boolean(user?.isPremium)
 */

import type { Module, VideoLesson } from '@/types';

/**
 * Number of free lessons available without premium
 */
export const FREE_LESSON_LIMIT = 2;

/**
 * Message shown when premium content is locked
 */
export const PREMIUM_LOCK_MESSAGE = 'Materi ini tersedia untuk akun premium. Upgrade untuk akses penuh.';

/**
 * Derives lesson accessibility from user premium status and curriculum.
 *
 * @param curriculum Current curriculum state
 * @param isPremium Whether user has premium access
 * @param freeLessonLimit Number of free lessons (default 2)
 * @returns Accessible lesson IDs and metadata
 */
export function deriveLessonAccess(
  curriculum: Module[],
  isPremium: boolean,
  freeLessonLimit: number = FREE_LESSON_LIMIT
): { accessibleLessonIds: Set<string>; freeLessonLimit: number; isPremium: boolean } {
  const accessibleLessonIds = new Set(
    isPremium
      ? curriculum.flatMap((mod) => mod.lessons.map((lesson) => lesson.id))
      : curriculum.flatMap((mod) => mod.lessons).slice(0, freeLessonLimit).map((lesson) => lesson.id)
  );

  return {
    accessibleLessonIds,
    freeLessonLimit,
    isPremium,
  };
}

/**
 * Checks if a lesson is accessible given the access result.
 */
export function isLessonAccessible(lessonId: string, access: { accessibleLessonIds: Set<string> }): boolean {
  return access.accessibleLessonIds.has(lessonId);
}

/**
 * Checks if a lesson is locked based on access.
 */
export function isLessonLocked(lessonId: string, access: { accessibleLessonIds: Set<string> }): boolean {
  return !access.accessibleLessonIds.has(lessonId);
}

/**
 * Calculates course progress percentage from current curriculum state.
 */
export function calculateCourseProgress(curriculum: Module[]): number {
  const totalLessons = curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = curriculum.reduce((acc, mod) =>
    acc + mod.lessons.filter(l => l.isCompleted).length, 0
  );
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
}

/**
 * Calculates module progress percentage from current curriculum state.
 */
export function calculateModuleProgress(curriculum: Module[], moduleId: string): number {
  const module = curriculum.find(m => m.id === moduleId);
  if (!module) return 0;
  const total = module.lessons.length;
  const completed = module.lessons.filter(l => l.isCompleted).length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/**
 * Gets lesson by ID across all modules from current curriculum state.
 */
export function getLessonById(curriculum: Module[], lessonId: string): VideoLesson | null {
  for (const mod of curriculum) {
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

/**
 * Gets module by ID from current curriculum state.
 */
export function getModuleById(curriculum: Module[], moduleId: string): Module | undefined {
  return curriculum.find(m => m.id === moduleId);
}

/**
 * Checks if a lesson is the active one.
 */
export function isActiveLesson(lessonId: string, activeLessonId: string): boolean {
  return lessonId === activeLessonId;
}

/**
 * Formats duration in minutes to "X:YY" format.
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `${mins}:00`;
}

/**
 * Formats time in minutes to "X:YY" format (alias for formatDuration).
 */
export function formatTime(minutes: number): string {
  return formatDuration(minutes);
}