import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Clock, 
  BookOpen, 
  Sparkles, 
  CloudRain, 
  Trees, 
  Coffee, 
  Radio, 
  Headphones,
  History,
  Star,
  Disc,
  Zap,
  Music2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Timer3DRing } from '../3d/Timer3DRing';
import { TimerMode } from '../../types';
import { AmbientType } from '../../lib/audio';
import { CURATED_YOUTUBE_STATIONS, parseYouTubeVideoId, YouTubeTrack, YouTubeIcon } from '../../types/music';

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
    sessionCount,
    currentYouTubeTrack,
    isYouTubePlaying,
    playYouTubeTrack,
    stopYouTubeTrack,
    toggleYouTubePlayback,
    setIsYouTubeModalOpen,
    addCustomYouTubeUrl
  } = useStudy();

  const [customMinutes, setCustomMinutes] = useState(45);
  const [sessionNotes, setSessionNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);
  const [inlineYouTubeUrl, setInlineYouTubeUrl] = useState('');
  const [audioTab, setAudioTab] = useState<'ambient' | 'youtube'>('ambient');

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

  const ambientSoundscapes: { type: AmbientType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'lofi', label: 'Lo-Fi Chords', icon: Disc },
    { type: 'rain', label: 'Rain', icon: CloudRain },
    { type: 'synthwave', label: 'Synthwave', icon: Zap },
    { type: 'forest', label: 'Forest', icon: Trees },
    { type: 'piano', label: 'Solo Piano', icon: Music2 },
    { type: 'cafe', label: 'Café', icon: Coffee },
    { type: 'whitenoise', label: 'Deep Space', icon: Radio },
    { type: 'binaural', label: '40Hz Gamma', icon: Headphones },
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

  const handlePlayInlineYouTube = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = parseYouTubeVideoId(inlineYouTubeUrl);
    if (videoId) {
      const customTrack: YouTubeTrack = {
        id: 'inline_' + Date.now(),
        title: 'Custom YouTube Stream',
        channel: 'Personal Stream',
        videoId,
        category: 'lofi',
        description: inlineYouTubeUrl
      };
      addCustomYouTubeUrl(inlineYouTubeUrl);
      playYouTubeTrack(customTrack);
      setInlineYouTubeUrl('');
    } else {
      alert('Please paste a valid YouTube video or stream link.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Focus Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            IMMERSIVE 3D STUDY TIMER & LO-FI LOUNGE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Deep Cognitive Focus Chamber
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Select your subject, topic, and optimal study soundscapes or YouTube Lo-Fi streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsYouTubeModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            <YouTubeIcon className="w-4 h-4 text-rose-400" />
            <span>YouTube Lounge</span>
          </button>

          <button
            onClick={() => setIsFocusMode(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-purple flex items-center gap-2 transition-all hover:scale-105"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Zen Mode</span>
          </button>
        </div>
      </div>

      {/* Main Focus Chamber Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Timer Ring & Controls */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 shadow-glass-3d flex flex-col items-center justify-center relative overflow-hidden">
          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setTimerMode(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timerMode === m.id
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{m.label}</span>
                <span className="ml-1.5 opacity-60 text-[10px]">({m.durationLabel})</span>
              </button>
            ))}
          </div>

          {/* Custom Duration Slider */}
          {timerMode === 'custom' && (
            <div className="w-full max-w-xs mb-6 space-y-2 text-center animate-in fade-in duration-200">
              <div className="flex justify-between text-xs text-slate-300">
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
                className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-cyan-400"
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

        {/* Right Column: Configuration, Lo-Fi Audio & YouTube */}
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
                {subjects.length === 0 ? (
                  <option value="sub_general">General Study</option>
                ) : (
                  subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))
                )}
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

          {/* Soundscapes & YouTube Lounge Combined Card */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
            {/* Tab Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => setAudioTab('ambient')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    audioTab === 'ambient'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Offline Ambient & Lo-Fi</span>
                </button>

                <button
                  onClick={() => setAudioTab('youtube')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    audioTab === 'youtube'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-glow-rose'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <YouTubeIcon className="w-3.5 h-3.5 text-rose-400" />
                  <span>YouTube Stream</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Procedural Offline Ambient & Lo-Fi */}
            {audioTab === 'ambient' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ambientSoundscapes.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = activeAmbient === opt.type;
                    return (
                      <button
                        key={opt.type}
                        onClick={() => setAmbientSound(opt.type)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-glow-cyan font-bold scale-105'
                            : 'bg-slate-900/60 border-white/5 text-slate-300 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1 shrink-0" />
                        <span className="truncate text-[11px]">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {activeAmbient && (
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-300 font-medium">Synth Volume</span>
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={ambientVolume}
                      onChange={(e) => setAmbientVol(parseFloat(e.target.value))}
                      className="w-32 h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: YouTube Study Player & Custom Link */}
            {audioTab === 'youtube' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                {/* Inline Paste YouTube URL Input */}
                <form onSubmit={handlePlayInlineYouTube} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inlineYouTubeUrl}
                      onChange={(e) => setInlineYouTubeUrl(e.target.value)}
                      placeholder="Paste any YouTube video / stream URL..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-glow-rose flex items-center gap-1 shrink-0 transition-all hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play</span>
                    </button>
                  </div>
                </form>

                {/* Curated YouTube Station Presets */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {CURATED_YOUTUBE_STATIONS.slice(0, 4).map((station) => {
                    const isPlayingThis = currentYouTubeTrack?.videoId === station.videoId && isYouTubePlaying;
                    return (
                      <button
                        key={station.id}
                        onClick={() => playYouTubeTrack(station)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isPlayingThis
                            ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow-glow-rose'
                            : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="truncate mr-1.5">
                          <p className="truncate text-[11px] font-bold">{station.title.split('-')[0]}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-mono">{station.category}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          isPlayingThis ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isPlayingThis ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setIsYouTubeModalOpen(true)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Browse All Study Stations & Playlists</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Study Sessions Log */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Recent Focus Sessions</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Past 24h</span>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {sessions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 italic">
                  No sessions recorded yet. Start your first session above!
                </p>
              ) : (
                sessions.slice(0, 3).map((s) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Session Modal */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-slate-100">Log Completed Focus Session</h3>
              <button
                onClick={() => setIsLoggingModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  How focused were you? (Productivity Rating)
                </label>
                <div className="flex items-center gap-2 justify-center py-2 bg-slate-900/80 rounded-2xl border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1.5 transition-transform hover:scale-125 ${
                        rating >= star ? 'text-amber-400' : 'text-slate-600'
                      }`}
                    >
                      <Star className={`w-6 h-6 ${rating >= star ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Session Reflection & Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Key concepts reviewed, theorems solved, obstacles encountered..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoggingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompleteSession}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:scale-105 transition-all"
                >
                  Save & Award XP ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
