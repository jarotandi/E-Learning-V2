/**
 * Continue Learning Card
 * ======================
 * B1.4B — StudentDashboard decomposition
 *
 * Renders the "Lanjutkan Belajar" section with progress.
 */

import { Play } from 'lucide-react';
import type { View } from '@/types';
import { Card } from '@/design-system/components';
import { colors, spacing, radius } from '@/design-system/tokens/brand';

interface ContinueLearningCardProps {
  progressPercent: number;
  onNavigate: (view: View) => void;
}

export function ContinueLearningCard({ progressPercent, onNavigate }: ContinueLearningCardProps) {
  return (
    <Card variant="default" padding="lg">
      <h3 className="font-bold text-brand-navy mb-4">Lanjutkan Belajar</h3>
      <button
        onClick={() => onNavigate('learning')}
        className="w-full flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group cursor-pointer hover:bg-brand-teal/5 transition-colors"
        style={{ border: `1px solid ${colors.neutral[200]}` }}
      >
        <div className="relative flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=200"
            className="w-16 h-16 rounded-xl object-cover"
            alt="Materi SNBT Kedokteran"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={24} className="text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-brand-teal mb-1 uppercase tracking-wider">SNBT KEDOKTERAN</p>
          <h4 className="font-bold text-brand-navy truncate">Logika Dasar & Penarikan Kesimpulan</h4>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-bold w-12 text-right">{progressPercent}%</span>
          </div>
        </div>
      </button>
    </Card>
  );
}

export default ContinueLearningCard;