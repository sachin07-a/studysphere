import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Music, 
  Radio, 
  Sparkles, 
  ChevronUp, 
  ChevronDown
} from 'lucide-react';
import { YouTubeIcon } from '../../types/music';
import { useStudy } from '../../context/StudyContext';

export const FloatingMusicDock: React.FC = () => {
  const {
    currentYouTubeTrack,
    isYouTubePlaying,
    youTubeVolume,
    toggleYouTubePlayback,
    setYouTubeVol,
    stopYouTubeTrack,
    setIsYouTubeModalOpen,
    activeAmbient,
    setAmbientSound
  } = useStudy();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(youTubeVolume);

  // If nothing is playing and no YouTube track is loaded, don't show the floating dock
  if (!currentYouTubeTrack && !activeAmbient) return null;

  const handleToggleMute = () => {
    if (isMuted) {
      setYouTubeVol(previousVolume || 0.7);
      setIsMuted(false);
    } else {
      setPreviousVolume(youTubeVolume);
      setYouTubeVol(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5 duration-300">
      {/* Hidden/Persistent YouTube Iframe Engine */}
      {currentYouTubeTrack && (
        <div className="sr-only">
          <iframe
            id="studysphere-youtube-iframe"
            width="200"
            height="200"
            src={`https://www.youtube.com/embed/${currentYouTubeTrack.videoId}?autoplay=${isYouTubePlaying ? 1 : 0}&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
            title="StudySphere Music Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Visual Floating Player Widget */}
      <div className="relative rounded-3xl glass-panel p-3.5 sm:p-4 border border-white/20 shadow-glass-3d bg-slate-950/90 backdrop-blur-xl max-w-xs sm:max-w-sm">
        <div className="flex items-center gap-3">
          {/* Pulsing Album / Waveform Icon */}
          <div 
            onClick={() => setIsYouTubeModalOpen(true)}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 p-0.5 shrink-0 cursor-pointer shadow-glow-rose hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              {isYouTubePlaying ? (
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-rose-400 rounded-full animate-pulse h-full" />
                  <span className="w-1 bg-purple-400 rounded-full animate-pulse h-2/3" />
                  <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-4/5" />
                  <span className="w-1 bg-rose-400 rounded-full animate-pulse h-1/2" />
                </div>
              ) : (
                <Music className="w-5 h-5 text-rose-400" />
              )}
            </div>
          </div>

          {/* Track Details */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20 uppercase">
                {currentYouTubeTrack ? 'YouTube Lo-Fi' : 'Offline Ambient'}
              </span>
              {isYouTubePlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
            <p 
              onClick={() => setIsYouTubeModalOpen(true)}
              className="text-xs font-bold text-slate-100 truncate cursor-pointer hover:text-rose-300 transition-colors"
            >
              {currentYouTubeTrack?.title || (activeAmbient ? `${activeAmbient.toUpperCase()} Soundscape` : 'Study Station')}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentYouTubeTrack?.channel || 'StudySphere Ambient Synth'}
            </p>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {currentYouTubeTrack ? (
              <button
                onClick={toggleYouTubePlayback}
                className="w-8 h-8 rounded-xl bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center shadow-glow-rose transition-all hover:scale-105 active:scale-95"
                title={isYouTubePlaying ? 'Pause' : 'Play'}
              >
                {isYouTubePlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
            ) : (
              <button
                onClick={() => setAmbientSound(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                title="Stop Ambient"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsYouTubeModalOpen(true)}
              className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
              title="Open YouTube Lounge"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (currentYouTubeTrack) stopYouTubeTrack();
                if (activeAmbient) setAmbientSound(null);
              }}
              className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors"
              title="Close Player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Volume Slider Bar */}
        {!isMinimized && currentYouTubeTrack && (
          <div className="flex items-center gap-2 pt-2.5 mt-2.5 border-t border-white/10">
            <button 
              onClick={handleToggleMute}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isMuted || youTubeVolume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : youTubeVolume}
              onChange={(e) => {
                setIsMuted(false);
                setYouTubeVol(parseFloat(e.target.value));
              }}
              className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer accent-rose-400"
            />
            <span className="text-[9px] font-mono text-slate-400 w-6 text-right">
              {Math.round((isMuted ? 0 : youTubeVolume) * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
