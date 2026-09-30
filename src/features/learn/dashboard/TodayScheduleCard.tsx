/**
 * Today Schedule Card
 * ===================
 * B1.4B — StudentDashboard decomposition
 *
 * Renders today's live session schedule.
 */

import { ChevronRight, Lock } from 'lucide-react';
import type { View } from '@/types';
import { Card, Button, Badge } from '@/design-system/components';
import { LIVE_SESSIONS } from '@/constants';
import type { LegacyLearnerAccess } from './legacyLearnerAccess';

interface TodayScheduleCardProps {
  access: LegacyLearnerAccess;
  onNavigate: (view: View) => void;
  onUpgrade: () => void;
}

export function TodayScheduleCard({ access, onNavigate, onUpgrade }: TodayScheduleCardProps) {
  if (!access.hasPremiumAccess) {
    return (
      <Card variant="default" padding="lg">
        <h3 className="font-bold text-brand-navy mb-4">Jadwal Kelas Hari Ini</h3>
        <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
          <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={20} />
          </div>
          <p className="text-sm font-bold text-brand-navy mb-1">Jadwal tersedia untuk Premium</p>
          <p className="text-xs text-slate-500 mb-4">Akun gratis belum memiliki akses live session dan Google Calendar.</p>
          <Button variant="primary" size="sm" className="w-full" onClick={onUpgrade}>
            Upgrade Paket
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg">
      <h3 className="font-bold text-brand-navy mb-4">Jadwal Kelas Hari Ini</h3>
      <div className="space-y-4">
        {LIVE_SESSIONS.map((item, i) => (
          <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
            <div className="text-center min-w-[50px] flex-shrink-0">
              <p className="text-xs font-bold text-brand-teal">{item.startTime}</p>
              <div className="w-1 h-8 bg-blue-50 mx-auto my-1 rounded-full relative">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-teal rounded-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-brand-navy mb-1">{item.title}</h4>
              <p className="text-[10px] text-slate-500 mb-2">Mentor: {item.instructor}</p>
              <Badge variant="info" size="sm">{item.mode}</Badge>
              <p className="text-[10px] text-emerald-600 font-bold mt-2">{item.gmailStatus}</p>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-6 text-sm text-slate-400 flex items-center justify-center gap-1 hover:text-brand-teal transition-colors"
        onClick={() => onNavigate('schedule')}
      >
        Lihat Semua Jadwal <ChevronRight size={14} />
      </Button>
    </Card>
  );
}

export default TodayScheduleCard;