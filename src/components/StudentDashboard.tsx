import React from 'react';
import type { View, User } from '@/types';
import { LearnerDashboardPage } from '@/features/learn/dashboard';

/**
 * StudentDashboard — B1.4B Compatibility Wrapper
 * =============================================
 *
 * This is now a THIN compatibility boundary that delegates to the new
 * LearnerDashboardPage feature component.
 *
 * B1.4B removed the legacy "The Prams" sidebar, header, and app shell from
 * StudentDashboard. The dashboard content now lives in
 * `src/features/learn/dashboard/` and is rendered inside LearnerLayout.
 *
 * The legacy prop surface is preserved for LegacyRouteBridge compatibility:
 *   - setView: router-backed navigation adapter
 *   - user: current user
 *   - logout: requestLogout (kept for compatibility; LearnerLayout now owns the
 *     logout trigger in the profile disclosure)
 *   - onUpgrade: opens the upgrade program flow
 *
 * The `logout` prop is accepted but no longer rendered by this component.
 * Its removal from the LegacyRouteBridge signature is deferred to a future
 * cleanup pass.
 */
export const StudentDashboard: React.FC<{
  setView: (v: View) => void;
  user: User | null;
  logout: () => void;
  onUpgrade: () => void;
}> = ({ setView, user, onUpgrade }) => {
  // The `logout` prop is intentionally not used here.
  // LearnerLayout's profile disclosure now handles logout via requestLogout.
  // This avoids duplicating the logout trigger between the old sidebar and the
  // new shell. If the LegacyRouteBridge signature is changed later, this prop
  // can be removed from this component.

  return <LearnerDashboardPage user={user} setView={setView} onUpgrade={onUpgrade} />;
};

export default StudentDashboard;