/**
 * Dashboard Stats Cards
 * =====================
 * B1.4C — LearningPage decomposition
 *
 * Renders the four metric cards: Progress, Last Score, Ranking, Completed Tryouts.
 */

import { BookOpen, Trophy, TrendingUp, CheckCircle2, Lock } from 'lucide-react';
import type { LegacyLearnerAccess } from './learningWorkspaceModel';
import { Card } from '@/design-system/components';
import { CURRICULUM, TRYOUT_SUBTEST_RESULTS } from '@/constants';

interface DashboardStatsProps {
  access: LegacyLearnerAccess;
  progressPercent: number;
}

interface StatConfig {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number }>;
  colorClass: string;
  showLock?: boolean;
}

export function DashboardStats({ access, progressPercent }: DashboardStatsProps) {
  const stats: StatConfig[] = [
    {
      label: 'Progress Belajar',
      value: access.hasPremiumAccess ? `${progressPercent}%` : access.isScholarshipReview ? 'Review' : '8%',
      icon: BookOpen,
      colorClass: 'text-brand-teal',
    },
    {
      label: 'Skor Terakhir',
      value: access.hasPremiumAccess ? '720' : '-',
      icon: Trophy,
      colorClass: 'text-amber-500',
      showLock: !access.hasPremiumAccess,
    },
    {
      label: 'Ranking Cohort',
      value: access.hasPremiumAccess ? '#12' : '-',
      icon: TrendingUp,
      colorClass: 'text-emerald-500',
      showLock: !access.hasPremiumAccess,
    },
    {
      label: 'Tryout Selesai',
      value: access.hasPremiumAccess ? '06' : '01',
      icon: CheckCircle2,
      colorClass: 'text-indigo-500',
      showLock: !access.hasPremiumAccess,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} variant="default" padding="md" className="group">
          <div className={`p-2 rounded-lg bg-slate-50 inline-block mb-3 transition-colors ${stat.colorClass} group-hover:bg-brand-teal group-hover:text-white`}>
            <stat.icon size={20} />
          </div>
          <p className="text-xs text-slate-500">{stat.label}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xl font-bold text-brand-navy">{stat.value}</p>
            {stat.showLock && <Lock size={12} className="text-slate-300" />}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default DashboardStats;