/**
 * Lesson Video Player
 * ===================
 * B1.4C — LearningPage decomposition
 *
 * Accessible video player mock with keyboard-operable controls.
 * Preserves mock behaviour (no real video provider).
 */

import { 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';

interface LessonVideoPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  progress: number;
  onSeek: (progress: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  currentTimeMinutes: number;
  durationMinutes: number;
  isLocked: boolean;
}

export function LessonVideoPlayer({
  isPlaying,
  onPlayPause,
  progress,
  onSeek,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  currentTimeMinutes,
  durationMinutes,
  isLocked,
}: LessonVideoPlayerProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);

  // Hide controls after 3s of inactivity when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = seekBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const newProgress = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, newProgress)));
  }, [onSeek, isLocked]);

  const handleKeySeek = useCallback((e: React.KeyboardEvent) => {
    if (isLocked) return;
    const step = 5;
    if (e.key === 'ArrowRight') {
      onSeek(Math.min(100, progress + 5));
    } else if (e.key === 'ArrowLeft') {
      onSeek(Math.max(0, progress - 5));
    }
  }, [progress, onSeek, isLocked]);

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}:${String(minutes % 60).padStart(2, '0')}` : `${minutes}:00`;
  };

  return (
    <div
      className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group mb-8"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onKeyDown={handleKeySeek}
      tabIndex={0}
      role="region"
      aria-label="Pemutar video pembelajaran"
    >
      <img
        src="https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=1200"
        className="w-full h-full object-cover opacity-60"
        alt="Video Thumbnail"
      />

      {/* Play/Pause Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <button
          onClick={onPlayPause}
          disabled={isLocked}
          aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
          className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          {isPlaying ? <Pause size={44} fill="white" /> : <Play size={44} className="ml-2" fill="white" />}
        </button>
      </div>

      {/* Custom Player Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${
          isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        {/* Seek Bar */}
        <div
          ref={seekBarRef}
          className="group/seek mb-4 relative cursor-pointer pt-2"
          onClick={(e) => {
            if (isLocked) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const newProgress = (x / rect.width) * 100;
            onSeek(Math.max(0, Math.min(100, newProgress)));
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              onSeek(Math.min(100, progress + 5));
            } else if (e.key === 'ArrowLeft') {
              onSeek(Math.max(0, progress - 5));
            }
          }}
          tabIndex={0}
          role="slider"
          aria-label="Posisi video"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-teal relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onPlayPause}
              disabled={isLocked}
              aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
              className="text-white hover:text-brand-teal transition-colors min-w-11 min-h-11 p-2 rounded-full hover:bg-white/10"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-2" />}
            </button>

            <div className="flex items-center gap-3 text-white">
              <button
                onClick={onMuteToggle}
                disabled={isLocked}
                aria-label={isMuted ? 'Aktifkan audio' : 'Bisukan audio'}
                className="text-white/70 hover:text-white transition-colors min-w-11 min-h-11 p-2 rounded-full hover:bg-white/10"
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onVolumeChange(val);
                  if (val > 0 && isMuted) onMuteToggle();
                }}
                disabled={isLocked}
                aria-label="Volume"
                className="w-20 h-1 accent-brand-teal cursor-pointer min-h-11"
              />
            </div>

            <span className="text-xs text-white/70 font-mono tracking-tighter min-w-11">
              {formatTime(Math.floor((durationMinutes * progress) / 100))} / {formatTime(durationMinutes)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-white">
            <button
              disabled={isLocked}
              aria-label="Caption (belum tersedia)"
              className="text-white/70 hover:text-white transition-colors min-w-11 min-h-11 p-2 rounded-full hover:bg-white/10"
            >
              CC
            </button>
            <button
              disabled={isLocked}
              aria-label="Kecepatan playback (belum tersedia)"
              className="text-white/70 hover:text-white transition-colors min-w-11 min-h-11 p-2 rounded-full hover:bg-white/10"
            >
              1.0x
            </button>
            <button
              disabled={isLocked}
              aria-label="Layar penuh (belum tersedia)"
              className="text-white/70 hover:text-white transition-colors min-w-11 min-h-11 p-2 rounded-full hover:bg-white/10"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-white">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="text-lg font-bold mb-2">Materi ini terkunci</p>
            <p className="text-sm text-white/70 mb-4">Upgrade ke premium untuk mengakses materi ini</p>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}:${String(minutes % 60).padStart(2, '0')}` : `${minutes}:00`;
}

export default LessonVideoPlayer;