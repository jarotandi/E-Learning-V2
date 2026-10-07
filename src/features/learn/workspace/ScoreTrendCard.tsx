/**
 * Score Trend Chart Card
 * ======================
 * B1.4C — LearningPage decomposition
 *
 * Renders the area chart showing score progression.
 * Chart colours migrated to AKSA design tokens.
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { LegacyLearnerAccess } from './learningWorkspaceModel';
import { Card } from '@/design-system/components';
import { colors } from '@/design-system/tokens/brand';

const scoreData = [
  { name: 'Tryout 1', score: 450 },
  { name: 'Tryout 2', score: 520 },
  { name: 'Tryout 3', score: 610 },
  { name: 'Tryout 4', score: 580 },
  { name: 'Tryout 5', score: 690 },
  { name: 'Tryout 6', score: 720 },
];

export function ScoreTrendCard({ access }: { access: LegacyLearnerAccess }) {
  // Generate gradient ID using AKSA teal/mint family
  const gradientId = 'aksa-score-gradient';

  if (!access.hasPremiumAccess) {
    return (
      <Card variant="default" padding="lg">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="font-bold text-brand-navy mb-1">Perkembangan Skor</p>
          <p className="text-sm text-slate-500 mb-4">Tersedia untuk pengguna Premium</p>
          <button className="px-4 py-2 bg-brand-teal text-white text-xs font-bold rounded-xl uppercase tracking-wider">
            Upgrade untuk akses
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-brand-navy">Perkembangan Skor</h3>
        <select className="text-xs bg-slate-50 border-none rounded-lg p-1.5 focus:ring-0 focus:outline-none">
          <option>30 Hari Terakhir</option>
          <option>Semua Waktu</option>
        </select>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={scoreData}>
            <defs>
              <linearGradient id="aksa-score-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.brand.tealAccessible} stopOpacity={0.15} />
                <stop offset="95%" stopColor={colors.brand.tealAccessible} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.neutral[200]} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.neutral[500] }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: colors.neutral[500] }} />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.surface.white,
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              labelStyle={{ color: colors.brand.emerald, fontWeight: 600 }}
              itemStyle={{ color: colors.brand.tealAccessible }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={colors.brand.tealAccessible}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#aksa-score-gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ScoreTrendCard;