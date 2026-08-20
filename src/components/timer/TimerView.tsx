import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Maximize2, 
  Volume2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  CloudRain, 
  Trees, 
  Coffee, 
  Radio, 
  Headphones,
  History,
  Star
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Timer3DRing } from '../3d/Timer3DRing';
import { TimerMode } from '../../types';

export const TimerView: React.FC = () => {
  const {
    timerMode,
    setTimerMode,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    finishSession,
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    selectedTopic,
    setSelectedTopic,
    setIsFocusMode,
    activeAmbient,
    ambientVolume,
    setAmbientSound,
    setAmbientVol,
    sessions,
    sessionCount
  } = useStudy();

  const [customMinutes, setCustomMinutes] = useState(45);
  const [sessionNotes, setSessionNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timerMode === 'stopwatch' 
    ? (timeLeft % 3600) / 3600
    : timerDuration > 0 ? (timerDuration - timeLeft) / timerDuration : 0;

  const modes: { id: TimerMode; label: string; durationLabel: string }[] = [
    { id: 'pomodoro', label: 'Pomodoro', durationLabel: '25m' },
    { id: 'short_break', label: 'Short Break', durationLabel: '5m' },
    { id: 'long_break', label: 'Long Break', durationLabel: '15m' },
    { id: 'custom', label: 'Custom', durationLabel: `${customMinutes}m` },
    { id: 'stopwatch', label: 'Stopwatch', durationLabel: 'Count Up' },
  ];

  const ambientSoundscapes = [
    { type: 'rain' as const, label: 'Rain', icon: CloudRain },
    { type: 'forest' as const, label: 'Forest', icon: Trees },
    { type: 'cafe' as const, label: 'Café', icon: Coffee },
    { type: 'whitenoise' as const, label: 'Deep Space', icon: Radio },
    { type: 'binaural' as const, label: '40Hz Gamma', icon: Headphones },
  ];

  const handleCustomDurationChange = (mins: number) => {
    setCustomMinutes(mins);
    setTimerDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  const handleCompleteSession = () => {
    finishSession(rating, sessionNotes);
    setIsLoggingModalOpen(false);
    setSessionNotes('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Focus Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            IMMERSIVE 3D STUDY TIMER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Deep Cognitive Focus Chamber
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select your subject, topic, and optimal study rhythm.
          </p>
        </div>

        <button
          onClick={() => setIsFocusMode(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-purple flex items-center gap-2 transition-all hover:scale-105"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Enter Zen Focus Mode</span>
        </button>
      </div>

      {/* Main Grid: Left (3D Timer & Controls) | Right (Subject Picker, Ambient Player, Recent Sessions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Timer Engine */}
        <div className="lg:col-span-7 flex flex-col items-center rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 shadow-glass-3d relative overflow-hidden">
          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-white/5 mb-8 max-w-full">
            {modes.map((m) => {
              const isActive = timerMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setTimerMode(m.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-glow-cyan font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="ml-1.5 opacity-75 font-mono text-[10px]">({m.durationLabel})</span>
                </button>
              );
            })}
          </div>

          {/* Custom Duration Slider (When Custom Mode is active) */}
          {timerMode === 'custom' && (
            <div className="w-full max-w-xs mb-6 p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Duration</span>
                <span className="font-bold text-cyan-400">{customMinutes} Minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={customMinutes}
                onChange={(e) => handleCustomDurationChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* 3D Circular Clock */}
          <div className="relative flex items-center justify-center my-4">
            <Timer3DRing
              progress={progress}
              size={320}
              strokeWidth={15}
              isRunning={isTimerRunning}
              color={currentSubject?.color || '#06b6d4'}
              glowColor={currentSubject?.color || '#22d3ee'}
            />

            {/* Center Digital Clock readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-white drop-shadow-2xl">
                {formatTime(timeLeft)}
              </span>
              <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentSubject?.color || '#06b6d4' }}
                />
                <span className="text-[11px] font-semibold text-slate-300 max-w-[140px] truncate">
                  {currentSubject?.name || 'General Focus'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {!isTimerRunning ? (
              <button
                onClick={startTimer}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-base shadow-glow-cyan flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Session</span>
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-base shadow-glow-amber flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
              >
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause Session</span>
              </button>
            )}

            <button
              onClick={() => setIsLoggingModalOpen(true)}
              className="p-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 transition-all hover:scale-105 active:scale-95"
              title="Finish & Save Session"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Session completed count */}
          <p className="text-xs text-slate-400 font-mono mt-6">
            🔥 Completed <span className="text-cyan-400 font-bold">{sessionCount}</span> focus cycles today
          </p>
        </div>

        {/* Right Column: Configuration, Soundscapes & Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Subject & Topic Setup Card */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100">Focus Target Configuration</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Focus Topic or Goal</label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g. Graph Algorithms, Midterm Practice..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Procedural Ambient Soundscapes Card */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Ambient Focus Soundscapes</h3>
              </div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Procedural 100% Offline
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ambientSoundscapes.map((opt) => {
                const Icon = opt.icon;
                const isActive = activeAmbient === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setAmbientSound(opt.type)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-glow-cyan font-bold'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {activeAmbient && (
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-300 font-medium">Volume</span>
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVol(parseFloat(e.target.value))}
                  className="w-32 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Recent Study Sessions Log */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Recent Sessions Telemetry</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Past 24h</span>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {sessions.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-slate-200 truncate">{s.topic || s.subjectName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{s.subjectName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-cyan-400">{s.durationMinutes}m</span>
                    <div className="flex items-center justify-end text-amber-400 text-[10px]">
                      {Array.from({ length: s.productivityRating }).map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Session Modal */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">Log Study Session</h3>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">How productive was your focus?</label>
              <div className="flex items-center justify-center gap-3 py-2 bg-slate-900/60 rounded-2xl border border-white/5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Session Takeaways or Reflection</label>
              <textarea
                rows={3}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="What concepts did you master or conquer today?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLoggingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteSession}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:scale-105 transition-transform"
              >
                Save & Claim XP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
