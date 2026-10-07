import React from 'react';
import type { View, User } from '@/types';
import { LearningWorkspacePage } from '@/features/learn/workspace';

/**
 * LearningPage — B1.4C Compatibility Wrapper
 * =========================================
 *
 * This is now a THIN compatibility boundary that delegates to the new
 * LearningWorkspacePage feature component.
 *
 * B1.4C removed the legacy self-contained workspace shell from
 * LearningPage. The learning workspace content now lives in
 * `src/features/learn/workspace/` and is rendered inside LearnerLayout.
 *
 * The legacy prop surface is preserved for LegacyRouteBridge compatibility:
 *   - setView: router-backed navigation adapter
 *   - user: current user
 *   - onUpgrade: opens the upgrade program flow
 */
export const LearningPage: React.FC<{
  setView: (v: View) => void;
  user: User | null;
  onUpgrade: () => void;
}> = ({ setView, user, onUpgrade }) => {
  return <LearningWorkspacePage user={user} setView={setView} onUpgrade={onUpgrade} />;
};

export default LearningPage;