/**
 * Legacy Learner Access Model
 * ============================
 * B1.4B — StudentDashboard decomposition into AKSA LearnerLayout
 *
 * Authority: docs/aksa/design/01-design-system.md
 *            docs/aksa/design/06-responsive-accessibility.md
 *
 * This module extracts the existing account/entitlement logic from
 * StudentDashboard so it can be shared between the new dashboard features
 * and the LearnerLayout profile/account disclosure without duplication.
 *
 * It preserves EXACTLY the existing semantics — no behavioural change.
 * The `theprams_demo_users` localStorage key is NOT renamed.
 * This remains browser-local entitlement state until B2.
 */

import { useMemo } from 'react';
import type { User } from '@/types';
import { CURRICULUM, TRYOUT_SUBTEST_RESULTS } from '@/constants';

/** Shape of a recommended lesson derived from weak tryout subjects. */
export interface RecommendedLesson {
  id: string;
  moduleTitle: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  subjectName: string;
  score: number;
}

/**
 * The complete derived access surface for a learner user.
 *
 * Every field here mirrors the legacy StudentDashboard calculation
 * line-for-line. Do not rename or restructure without verifying against
 * the original implementation.
 */
export interface LegacyLearnerAccess {
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

/**
 * Hook that derives the complete legacy access surface from the current user.
 *
 * @param user The authenticated user (from LegacyAppStateProvider)
 * @returns The complete derived access object
 */
export function useLegacyLearnerAccess(user: User | null): LegacyLearnerAccess {
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
 * Re-export the hook as the default for convenience.
 */
export { useLegacyLearnerAccess as default };