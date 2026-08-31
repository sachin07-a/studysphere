import React from 'react';
import { 
  Minimize2, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  Sparkles,
  CloudRain,
  Trees,
  Coffee,
  Radio,
  Headphones,
  Disc,
  Zap,
  Music2
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Timer3DRing } from '../3d/Timer3DRing';
import { getDailyQuote } from '../../lib/productivity';
import { AmbientType } from '../../lib/audio';
import { YouTubeIcon } from '../../types/music';

export const FocusModeModal: React.FC = () => {
  const { 
    isFocusMode, 
    setIsFocusMode, 
    timerMode, 
    timeLeft, 
    timerDuration, 
    isTimerRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    finishSession,
    subjects,
    selectedSubjectId,
    selectedTopic,
    activeAmbient,
    ambientVolume,
    setAmbientSound,
    setAmbientVol,
    currentYouTubeTrack,
    isYouTubePlaying,
    toggleYouTubePlayback,
    setIsYouTubeModalOpen
  } = useStudy();

  if (!isFocusMode) return null;

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const quote = getDailyQuote();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timerMode === 'stopwatch' 
    ? (timeLeft % 3600) / 3600
    : timerDuration > 0 ? (timerDuration - timeLeft) / timerDuration : 0;

  const ambientOptions: { type: AmbientType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'lofi', label: 'Lo-Fi', icon: Disc },
    { type: 'rain', label: 'Rain', icon: CloudRain },
    { type: 'synthwave', label: 'Synthwave', icon: Zap },
    { type: 'forest', label: 'Forest', icon: Trees },
    { type: 'piano', label: 'Piano', icon: Music2 },
    { type: 'cafe', label: 'Café', icon: Coffee },
    { type: 'binaural', label: '40Hz', icon: Headphones },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#04060b] text-slate-100 flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none animate-in fade-in duration-300">
      {/* Animated Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              DISTRACTION-FREE FOCUS ROOM
            </span>
            <h2 className="text-lg font-bold text-slate-100">
              {currentSubject?.name || 'General Deep Study'}
            </h2>
          </div>
        </div>

        {/* YouTube Now Playing Pill in Zen Mode */}
        {currentYouTubeTrack && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
            <YouTubeIcon className="w-4 h-4 text-rose-400" />
            <span className="font-semibold truncate max-w-[160px]">{currentYouTubeTrack.title}</span>
            <button
              onClick={toggleYouTubePlayback}
              className="p-1 rounded-full bg-rose-500/30 hover:bg-rose-500 text-white transition-colors ml-1"
            >
              {isYouTubePlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            </button>
            <button
              onClick={() => setIsYouTubeModalOpen(true)}
              className="text-[10px] underline text-rose-400 hover:text-rose-200"
            >
              Change
            </button>
          </div>
        )}

        <button
          onClick={() => setIsFocusMode(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all hover:scale-105"
        >
          <Minimize2 className="w-4 h-4" />
          <span className="text-xs font-semibold">Exit Zen Room</span>
        </button>
      </div>

      {/* Center 3D Timer & Focus Topic */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        <div className="relative flex items-center justify-center">
          <Timer3DRing
            progress={progress}
            size={380}
            strokeWidth={16}
            isRunning={isTimerRunning}
            color={currentSubject?.color || '#06b6d4'}
            glowColor={currentSubject?.color || '#22d3ee'}
          />

          {/* Center Digital Clock Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl md:text-7xl font-extrabold font-mono tracking-tight text-white drop-shadow-2xl">
              {formatTime(timeLeft)}
            </span>
            <span className="mt-2 text-xs font-mono uppercase tracking-widest text-cyan-300/80 bg-slate-900/80 px-3 py-1 rounded-full border border-white/10">
              {timerMode.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Selected Topic Badge */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-xs uppercase font-mono tracking-wider text-slate-400">Current Focus Target</p>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            {selectedTopic || 'Deep Conceptual Problem Solving'}
          </h3>
        </div>

        {/* Primary Timer Controls */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-105"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {!isTimerRunning ? (
            <button
              onClick={startTimer}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-base shadow-glow-cyan flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Focus</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-base shadow-glow-amber flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause Focus</span>
            </button>
          )}

          <button
            onClick={() => finishSession(5, 'Completed in Focus Mode')}
            className="p-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 transition-all hover:scale-105"
            title="Finish & Save Session"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Bar: Ambient Audio Player & Daily Motivation */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        {/* Ambient Soundscape Controller */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
          {ambientOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = activeAmbient === opt.type;
            return (
              <button
                key={opt.type}
                onClick={() => setAmbientSound(opt.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsYouTubeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
          >
            <YouTubeIcon className="w-3.5 h-3.5" />
            <span>YouTube Hub</span>
          </button>

          {activeAmbient && (
            <div className="flex items-center gap-2 px-2 border-l border-white/10">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => setAmbientVol(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg cursor-pointer accent-cyan-400"
              />
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="text-center md:text-right max-w-md text-xs text-slate-400">
          <p className="italic">"{quote.text}"</p>
          <span className="font-semibold text-slate-300 font-mono">— {quote.author}</span>
        </div>
      </div>
    </div>
  );
};
