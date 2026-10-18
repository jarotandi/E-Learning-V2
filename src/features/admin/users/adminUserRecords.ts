/**
 * Admin user record adapters
 * ==========================
 * B1.4D-T3 — Users domain extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/12-b1.4d-t3-platform-users.md
 *
 * Student/registration/transaction records are converted to a canonical
 * `UserAccount` here. This conversion is shared by the two places that need
 * it:
 *
 *   - the Users domain hook (`useAdminUsersDomain`), via the
 *     "Sync Approved" action and its mount-time synchronization; and
 *   - the Finance approval flow in `AdminDashboard`, which auto-creates the
 *     matching student when a payment is approved.
 *
 * WHY NOT A "PURE MODEL": `userFromStudentRecord` falls back to `Date.now()`
 * and `new Date()` when a source record has no id/date. The legacy semantics
 * are preserved exactly, so calling this module pure would be a lie. It is a
 * record adapter, not a routing/permission model.
 *
 * The storage key `theprams_demo_users` is NOT renamed and still matches the
 * writers in `FinalRegistrationPage` and the reader in
 * `features/learn/dashboard/legacyLearnerAccess.ts`.
 */

import type { UserAccount } from '../../../types';

/** Canonical Users storage key. Never rename: learner access reads this key. */
export const USER_STORAGE_KEY = 'theprams_demo_users';

export const getAccountTypeFromRecord = (
  record: any,
): UserAccount['accountType'] => {
  const text = `${record.type || ''} ${record.status || ''} ${record.packageName || ''}`.toLowerCase();
  if (text.includes('scholar') || text.includes('beasiswa')) return 'Scholarship';
  if (text.includes('free') || text.includes('gratis')) return 'Free';
  return 'Paid';
};

export const isApprovedStudentRecord = (record: any) => {
  const type = getAccountTypeFromRecord(record);
  const status = String(record.status || '').toLowerCase();
  if (type === 'Free') return true;
  if (type === 'Scholarship') return status.includes('approved');
  return status.includes('approved') || status.includes('success');
};

export const userFromStudentRecord = (
  record: any,
  prefix = 'student',
): UserAccount => {
  const sourceId = record.invoiceNumber || record.id || `${prefix}-${Date.now()}`;
  const data = record.registrationData || {};
  const accountType = getAccountTypeFromRecord(record);
  return {
    id: `${prefix}-${sourceId}`,
    name: data.name || record.name || record.student || 'Siswa Baru',
    email: data.email || record.email || '-',
    role: 'Student',
    program: record.program || data.program || '-',
    status: 'Active',
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(sourceId)}`,
    joinedAt: String(record.createdAt || new Date().toISOString()).slice(0, 10),
    accountType,
    packageName: record.packageName || '-',
    paymentStatus: record.status || '-',
    source: accountType === 'Free' ? 'Paket Gratis' : accountType === 'Scholarship' ? 'Approval Beasiswa' : 'Approval Pembayaran',
  };
};
