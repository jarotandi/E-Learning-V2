/**
 * Dashboard Welcome + Account Status
 * ==================================
 * B1.4C — LearningPage decomposition
 *
 * Renders the greeting and the account status card that was previously
 * in the LearningPage header area.
 */

import { ShieldCheck } from 'lucide-react';
import type { LegacyLearnerAccess } from './learningWorkspaceModel';
import { Card, Badge } from '@/design-system/components';

interface DashboardWelcomeProps {
  user: { name: string } | null;
  access: LegacyLearnerAccess;
}

export function DashboardWelcome({ user, access }: DashboardWelcomeProps) {
  const firstName = user?.name.split(' ')[0] ?? 'User';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Selamat pagi, {firstName}! 👋</h1>
        <p className="text-slate-600 mt-1">{access.accountDescription}</p>
      </div>

      <Card variant="muted" padding="lg" className="border-l-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0">
            <Badge variant={access.hasPremiumAccess ? 'success' : access.isScholarshipReview ? 'info' : 'warning'} size="sm" className="mb-3">
              {access.accountLabel}
            </Badge>
            <p className="text-lg font-bold text-brand-navy truncate">{access.packageName}</p>
          </div>

          <div className="flex items-center gap-4 md:ml-auto md:shrink-0">
            <div className="grid grid-cols-2 gap-3 text-sm md:w-[320px]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</p>
                <p className="font-bold text-brand-navy truncate">{access.paymentStatus}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Akses</p>
                <p className="font-bold text-brand-navy">{access.accessLabel}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Berlaku</p>
                <p className="font-bold text-brand-navy">{access.premiumUntil}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tindakan</p>
                <p className="font-bold text-brand-navy truncate">{access.nextActionLabel}</p>
              </div>
            </div>

            <div className="flex items-center justify-center w-12 h-12 rounded-xl">
              <ShieldCheck size={20} className="text-brand-emerald" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DashboardWelcome;