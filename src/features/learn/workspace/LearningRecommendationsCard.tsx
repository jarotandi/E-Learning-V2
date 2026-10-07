/**
 * Learning Recommendations Card
 * =============================
 * B1.4C — LearningPage decomposition
 *
 * Renders personalized learning recommendations based on tryout results.
 */

import { BookOpen } from 'lucide-react';
import type { View } from '@/types';
import { Card, Button } from '@/design-system/components';
import { colors } from '@/design-system/tokens/brand';

interface RecommendedLesson {
  id: string;
  moduleTitle: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  subjectName: string;
  score: number;
}

interface LearningRecommendationsCardProps {
  recommendedLessons: RecommendedLesson[];
  onNavigate: (view: View) => void;
}

export function LearningRecommendationsCard({ recommendedLessons, onNavigate }: LearningRecommendationsCardProps) {
  return (
    <div className="card-premium p-6 bg-gradient-to-br from-brand-orange to-amber-500 text-white">
      <h3 className="font-bold mb-2">Rekomendasi Belajar</h3>
      <p className="text-xs text-white/80 mb-6">Tersinkron dari hasil tryout terakhir dan materi di Kelas Saya:</p>
      <div className="space-y-3">
        {recommendedLessons.length > 0 ? (
          recommendedLessons.map((lesson) => (
            <div key={lesson.title} className="bg-white/10 p-3 rounded-xl border border-white/20">
              <p className="text-xs font-bold">{lesson.title}</p>
              <p className="text-[10px] text-white/60">{lesson.subjectName} lemah: {lesson.score}% • {lesson.duration}</p>
              <p className="text-[10px] text-white/50 mt-1">{lesson.moduleTitle}</p>
            </div>
          ))
        ) : (
          <div className="bg-white/10 p-3 rounded-xl border border-white/20">
            <p className="text-xs font-bold">Semua materi sudah selesai</p>
            <p className="text-[10px] text-white/60">Cek Live Session atau ulangi materi penting.</p>
          </div>
        )}
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="w-full mt-6 py-2 text-xs font-bold rounded-xl shadow-lg"
        onClick={() => onNavigate('learning')}
      >
        Pelajari Materi Ini
      </Button>
    </div>
  );
}

export default LearningRecommendationsCard;