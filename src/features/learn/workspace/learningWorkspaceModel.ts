/**
 * Learning Workspace Pure Helpers
 * ================================
 * B1.4C — LearningPage decomposition into AKSA LearnerLayout
 *
 * Authority: docs/aksa/design/01-design-system.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *
 * This module exports:
 * 1. Pure helper functions (no React hooks) - for use in components and tests
 * 2. useLegacyLearnerAccess hook - for React components
 *
 * It preserves EXACTLY the existing semantics — no behavioural change.
 * The `theprams_demo_users` localStorage key is NOT renamed.
 * This remains browser-local entitlement state until B2.
 */

import { useMemo } from 'react';
import type { User } from '@/types';
import { CURRICULUM, TRYOUT_SUBTEST_RESULTS } from '@/constants';

/**
 * Result of lesson accessibility calculation.
 */
export interface LessonAccessResult {
  /** Raw user from localStorage if found. */
  directoryUser: DirectoryUser | null;

  /** Account classification: 'Free' | 'Paid' | 'Scholarship' | 'Staff'. */
  accountType: 'Free' | 'Paid' | 'Scholarship' | 'Staff';

  /** Human-readable package name. */
  packageName: string;

  /** Payment status string as stored. */
  paymentStatus: string;

  /** Whether the payment is approved/success. */
  approvedStatus: boolean;

  /** Whether the user has active premium access. */
  hasPremiumAccess: boolean;

  /** Scholarship application under review (no access yet). */
  isScholarshipReview: boolean;

  /** Paid registration awaiting verification (no access yet). */
  isPaidPending: boolean;

  /** Display label for the account status badge. */
  accountLabel: string;

  /** Premium expiry date string. */
  premiumUntil: string;

  /** Human-readable access status. */
  accessLabel: string;

  /** Next action guidance for the user. */
  nextActionLabel: string;

  /** Explanatory description for the account state. */
  accountDescription: string;
}

/** Shape of a user record in `theprams_demo_users`. */
export interface DirectoryUser {
  email: string;
  accountType?: string;
  packageName?: string;
  paymentStatus?: string;
  premiumUntil?: string;
  isPremium?: boolean;
  [key: string]: unknown;
}

/** Legacy access type alias for backward compatibility */
export type LegacyLearnerAccess = LessonAccessResult;

/** Number of free lessons available without premium */
export const FREE_LESSON_LIMIT = 2;

/** Message shown when premium content is locked */
export const PREMIUM_LOCK_MESSAGE = 'Materi ini tersedia untuk akun premium. Upgrade untuk akses penuh.';

/**
 * Pure helper functions (no React hooks) - for use in components and tests
 * ======================================================================
 */

/**
 * Derives lesson accessibility from user premium status and curriculum.
 *
 * @param isPremium Whether user has premium access
 * @param freeLessonLimit Number of free lessons (default 2)
 * @returns Accessible lesson IDs and metadata
 */
function deriveLessonAccess(
  isPremium: boolean,
  freeLessonLimit: number = 2
): { accessibleLessonIds: Set<string>; freeLessonLimit: number; isPremium: boolean } {
  const accessibleLessonIds = new Set(
    isPremium
      ? CURRICULUM.flatMap((mod) => mod.lessons.map((lesson) => lesson.id))
      : CURRICULUM.flatMap((mod) => mod.lessons).slice(0, freeLessonLimit).map((lesson) => lesson.id)
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
function isLessonAccessible(lessonId: string, access: { accessibleLessonIds: Set<string> }): boolean {
  return access.accessibleLessonIds.has(lessonId);
}

/**
 * Checks if a lesson is locked based on access.
 */
function isLessonLocked(lessonId: string, access: { accessibleLessonIds: Set<string> }): boolean {
  return !access.accessibleLessonIds.has(lessonId);
}

/**
 * Calculates course progress percentage.
 */
function calculateCourseProgress(): number {
  const totalLessons = CURRICULUM.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = CURRICULUM.reduce((acc, mod) =>
    acc + mod.lessons.filter(l => l.isCompleted).length, 0
  );
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
}

/**
 * Calculates module progress percentage.
 */
function calculateModuleProgress(moduleId: string): number {
  const module = CURRICULUM.find(m => m.id === moduleId);
  if (!module) return 0;
  const total = module.lessons.length;
  const completed = module.lessons.filter(l => l.isCompleted).length;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/**
 * Gets lesson by ID across all modules.
 */
function getLessonById(lessonId: string) {
  for (const mod of CURRICULUM) {
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

/**
 * Gets module by ID.
 */
function getModuleById(moduleId: string) {
  return CURRICULUM.find(m => m.id === moduleId);
}

/**
 * Checks if a lesson is the active one.
 */
function isActiveLesson(lessonId: string, activeLessonId: string): boolean {
  return lessonId === activeLessonId;
}

/**
 * Formats duration in minutes to "X:YY" format.
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `${mins}:00`;
}

/**
 * Formats time in minutes to "X:YY" format (alias for formatDuration).
 */
function formatTime(minutes: number): string {
  return formatDuration(minutes);
}

/**
 * Hook that derives the complete legacy access surface from the current user.
 *
 * @param user The authenticated user (from LegacyAppStateProvider)
 * @returns The complete derived access object
 */
export function useLegacyLearnerAccess(user: User | null): LessonAccessResult {
  const directoryUser = useMemo((): DirectoryUser | null => {
    try {
      const rows = JSON.parse(localStorage.getItem('theprams_demo_users') || '[]');
      return Array.isArray(rows) ? rows.find((item: any) => item.email === user?.email) ?? null : null;
    } catch {
      return null;
    }
  }, [user?.email]);

  const accountType = useMemo((): 'Free' | 'Paid' | 'Scholarship' | 'Staff' => {
    return (directoryUser?.accountType || user?.accountType || (user?.isPremium ? 'Paid' : 'Free')) as
      | 'Free'
      | 'Paid'
      | 'Scholarship'
      | 'Staff';
  }, [directoryUser, user]);

  const packageName = useMemo((): string => {
    return directoryUser?.packageName || user?.packageName || (accountType === 'Free' ? 'Gratis' : accountType === 'Scholarship' ? 'Beasiswa' : 'Premium');
  }, [directoryUser, user, accountType]);

  const paymentStatus = useMemo((): string => {
    return directoryUser?.paymentStatus || user?.paymentStatus || (accountType === 'Free' ? 'Free Active' : user?.isPremium ? 'Payment Approved' : 'Limited');
  }, [directoryUser, user, accountType]);

  const approvedStatus = useMemo((): boolean => {
    return /approved|success/i.test(String(paymentStatus));
  }, [paymentStatus]);

  const hasPremiumAccess = useMemo((): boolean => {
    return Boolean(user?.isPremium) || (accountType === 'Paid' && approvedStatus) || (accountType === 'Scholarship' && approvedStatus);
  }, [user, accountType, approvedStatus]);

  const isScholarshipReview = useMemo((): boolean => {
    return accountType === 'Scholarship' && !hasPremiumAccess;
  }, [accountType, hasPremiumAccess]);

  const isPaidPending = useMemo((): boolean => {
    return accountType === 'Paid' && !hasPremiumAccess;
  }, [accountType, hasPremiumAccess]);

  const accountLabel = useMemo((): string => {
    return accountType === 'Scholarship'
      ? hasPremiumAccess
        ? 'BEASISWA APPROVED'
        : 'BEASISWA REVIEW'
      : accountType === 'Paid'
      ? hasPremiumAccess
        ? 'MEMBER BERBAYAR'
        : 'PAYMENT REVIEW'
      : 'FREE USER';
  }, [accountType, hasPremiumAccess]);

  const premiumUntil = useMemo((): string => {
    return directoryUser?.premiumUntil || user?.premiumUntil || (hasPremiumAccess ? '31 Des 2025' : '-');
  }, [directoryUser, user, hasPremiumAccess]);

  const accessLabel = useMemo((): string => {
    return hasPremiumAccess
      ? 'Premium Aktif'
      : isScholarshipReview || isPaidPending
      ? 'Menunggu Verifikasi'
      : 'Akses Terbatas';
  }, [hasPremiumAccess, isScholarshipReview, isPaidPending]);

  const nextActionLabel = useMemo((): string => {
    if (isPaidPending) return 'Tunggu verifikasi pembayaran';
    if (isScholarshipReview) return 'Tunggu review beasiswa';
    if (hasPremiumAccess) return 'Lanjutkan belajar';
    return 'Upgrade untuk akses penuh';
  }, [isPaidPending, isScholarshipReview, hasPremiumAccess]);

  const accountDescription = useMemo((): string => {
    if (isScholarshipReview) {
      return 'Pengajuan beasiswa kamu sedang direview admin. Akses premium aktif setelah disetujui.';
    }
    if (isPaidPending) {
      return 'Pendaftaran berbayar kamu sedang menunggu verifikasi admin. Akses premium aktif setelah pembayaran disetujui.';
    }
    if (hasPremiumAccess) {
      return 'Ayo lanjutkan belajarmu. Jadwal, kelas, dan tryout premium sudah tersedia.';
    }
    return 'Akun gratis aktif. Upgrade paket untuk membuka kelas live, jadwal, dan tryout premium.';
  }, [isScholarshipReview, isPaidPending, hasPremiumAccess]);

  return {
    directoryUser,
    accountType,
    packageName,
    paymentStatus,
    approvedStatus,
    hasPremiumAccess,
    isScholarshipReview,
    isPaidPending,
    accountLabel,
    premiumUntil,
    accessLabel,
    nextActionLabel,
    accountDescription,
  };
}

/**
 * Re-export all pure functions and the hook
 */
export { 
  useLegacyLearnerAccess as default,
  deriveLessonAccess,
  calculateCourseProgress,
  calculateModuleProgress,
  formatTime,
  formatDuration,
  isLessonAccessible,
  isLessonLocked,
  getLessonById,
  getModuleById,
  isActiveLesson,
};