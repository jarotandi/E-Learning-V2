/**
 * Legacy Learner Access Model
 * ============================
 * B1.4B — StudentDashboard decomposition into AKSA LearnerLayout
 * B1.4B-R1 — Entitlement parity & profile accessibility correction
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
 * PURE derivation function — no side effects, no hooks, no localStorage.
 *
 * This is the single source of truth for all legacy learner entitlement
 * calculations. It can be used by the hook, by tests, and by any
 * consumer that already has the user and directory record.
 *
 * @param user The authenticated user from LegacyAppStateProvider
 * @param directoryUser The matching record from `theprams_demo_users` (or null)
 * @returns The complete derived access surface
 */
export function deriveLegacyLearnerAccess(
  user: User | null,
  directoryUser: DirectoryUser | null,
): LegacyLearnerAccess {
  const accountType = ((
    directoryUser?.accountType ||
    user?.accountType ||
    (user?.isPremium ? 'Paid' : 'Free')
  ) as 'Free' | 'Paid' | 'Scholarship' | 'Staff');

  const packageName =
    directoryUser?.packageName ||
    user?.packageName ||
    (accountType === 'Free' ? 'Gratis' : accountType === 'Scholarship' ? 'Beasiswa' : 'Premium');

  const paymentStatus =
    directoryUser?.paymentStatus ||
    user?.paymentStatus ||
    (accountType === 'Free' ? 'Free Active' : user?.isPremium ? 'Payment Approved' : 'Limited');

  const approvedStatus = /approved|success/i.test(String(paymentStatus));

  const hasPremiumAccess =
    Boolean(user?.isPremium) ||
    (accountType === 'Paid' && approvedStatus) ||
    (accountType === 'Scholarship' && approvedStatus);

  const isScholarshipReview = accountType === 'Scholarship' && !hasPremiumAccess;

  const isPaidPending = accountType === 'Paid' && !hasPremiumAccess;

  const accountLabel =
    accountType === 'Scholarship'
      ? hasPremiumAccess
        ? 'BEASISWA APPROVED'
        : 'BEASISWA REVIEW'
      : accountType === 'Paid'
      ? hasPremiumAccess
        ? 'MEMBER BERBAYAR'
        : 'PAYMENT REVIEW'
      : 'FREE USER';

  const premiumUntil =
    directoryUser?.premiumUntil || user?.premiumUntil || (hasPremiumAccess ? '31 Des 2025' : '-');

  const accessLabel = hasPremiumAccess
    ? 'Premium Aktif'
    : isScholarshipReview || isPaidPending
    ? 'Menunggu Verifikasi'
    : 'Akses Terbatas';

  const nextActionLabel = isPaidPending
    ? 'Tunggu verifikasi pembayaran'
    : isScholarshipReview
    ? 'Tunggu review beasiswa'
    : hasPremiumAccess
    ? 'Lanjutkan belajar'
    : 'Upgrade untuk akses penuh';

  const accountDescription = isScholarshipReview
    ? 'Pengajuan beasiswa kamu sedang direview admin. Akses premium aktif setelah disetujui.'
    : isPaidPending
    ? 'Pendaftaran berbayar kamu sedang menunggu verifikasi admin. Akses premium aktif setelah pembayaran disetujui.'
    : hasPremiumAccess
    ? 'Ayo lanjutkan belajarmu. Jadwal, kelas, dan tryout premium sudah tersedia.'
    : 'Akun gratis aktif. Upgrade paket untuk membuka kelas live, jadwal, dan tryout premium.';

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

  // Delegate all calculations to the pure derivation function
  return deriveLegacyLearnerAccess(user, directoryUser);
}

/**
 * Re-export the hook as the default for convenience.
 */
export { useLegacyLearnerAccess as default };