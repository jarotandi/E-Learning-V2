/**
 * Feedback Card
 * =============
 * B1.4C — LearningPage decomposition
 *
 * Renders the feedback section with recent feedback and actions.
 */

import { MessageSquare } from 'lucide-react';
import type { View } from '@/types';
import { Card, Button, ButtonLink } from '@/design-system/components';
import { colors } from '@/design-system/tokens/brand';

interface FeedbackCardProps {
  onNavigate: (view: View) => void;
}

export function FeedbackCard({ onNavigate }: FeedbackCardProps) {
  return (
    <Card variant="default" padding="lg">
      <h3 className="font-bold text-brand-navy mb-4 flex items-center justify-between text-sm">
        Feedback Terbaru
        <MessageSquare size={16} className="text-brand-teal" />
      </h3>
      <div className="space-y-3">
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-[10px] text-slate-400 mb-1 font-bold">2 Jam Yang Lalu</p>
          <p className="text-xs text-slate-600 line-clamp-2">"Video Penalaran Umum part 2 sangat membantu! Penjelasannya to the point banget..."</p>
        </div>
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <ButtonLink
            href="/app/learn"
            variant="ghost"
            size="sm"
            className="text-[10px] font-bold text-brand-teal hover:underline text-left p-0"
          >
            Lihat Feedback Semua Materi
          </ButtonLink>
          <Button
            variant="outline"
            size="sm"
            className="w-full py-2 text-[10px] font-black uppercase tracking-widest"
            onClick={() => onNavigate('testimonials')}
          >
            Tulis Testimoni Alumni
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default FeedbackCard;