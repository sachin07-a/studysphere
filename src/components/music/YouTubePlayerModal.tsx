import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Music, 
  Sparkles, 
  Radio, 
  Plus, 
  Check, 
  Headphones, 
  Flame,
  Clock
} from 'lucide-react';
import { CURATED_YOUTUBE_STATIONS, YouTubeTrack, parseYouTubeVideoId, YouTubeIcon } from '../../types/music';
import { useStudy } from '../../context/StudyContext';

interface YouTubePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({ isOpen, onClose }) => {
  const {
    currentYouTubeTrack,
    isYouTubePlaying,
    youTubeVolume,
    playYouTubeTrack,
    toggleYouTubePlayback,
    setYouTubeVol,
    customYouTubeUrls,
    addCustomYouTubeUrl
  } = useStudy();

  const [inputUrl, setInputUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handlePlayCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const videoId = parseYouTubeVideoId(inputUrl);
    if (!videoId) {
      setUrlError('Invalid YouTube URL or Video ID. Please paste a valid YouTube link.');
      return;
    }

    const customTrack: YouTubeTrack = {
      id: 'custom_' + Date.now(),
      title: 'Custom YouTube Stream',
      channel: 'Personal Stream',
      videoId,
      category: 'lofi',
      description: inputUrl
    };

    addCustomYouTubeUrl(inputUrl);
    playYouTubeTrack(customTrack);
    setInputUrl('');
  };

  const handleSelectRecentUrl = (url: string) => {
    const videoId = parseYouTubeVideoId(url);
    if (videoId) {
      const customTrack: YouTubeTrack = {
        id: 'recent_' + Date.now(),
        title: 'Custom YouTube Stream',
        channel: 'Personal Stream',
        videoId,
        category: 'lofi',
        description: url
      };
      playYouTubeTrack(customTrack);
    }
  };

  const filteredStations = selectedCategory === 'all'
    ? CURATED_YOUTUBE_STATIONS
    : CURATED_YOUTUBE_STATIONS.filter(s => s.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-glass-3d space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <YouTubeIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>YouTube Study Lounge & Lo-Fi Hub</span>
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Paste any YouTube link or pick from curated 24/7 lo-fi study streams.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom YouTube URL Input */}
        <form onSubmit={handlePlayCustomUrl} className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Paste Any YouTube Song / Stream Link
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (urlError) setUrlError(null);
                }}
                placeholder="e.g. https://www.youtube.com/watch?v=jfKfPFi43Wo"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/15 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-rose flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Link</span>
            </button>
          </div>
          {urlError && <p className="text-[11px] text-rose-400 pl-1">{urlError}</p>}
        </form>

        {/* Recently Added Custom Links */}
        {customYouTubeUrls.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Recent Custom Links
            </span>
            <div className="flex flex-wrap gap-2">
              {customYouTubeUrls.slice(0, 3).map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRecentUrl(url)}
                  className="px-3 py-1 rounded-xl bg-slate-900/80 border border-white/10 hover:border-rose-400/40 text-[11px] text-slate-300 truncate max-w-[200px] flex items-center gap-1.5"
                >
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span className="truncate">{url}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
          {['all', 'lofi', 'synthwave', 'ambient', 'piano', 'jazz'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40 font-bold shadow-glow-rose'
                  : 'bg-slate-900/60 text-slate-400 border border-white/5 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Curated YouTube Stations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
          {filteredStations.map((station) => {
            const isPlayingThis = currentYouTubeTrack?.videoId === station.videoId && isYouTubePlaying;
            return (
              <div
                key={station.id}
                onClick={() => playYouTubeTrack(station)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                  isPlayingThis
                    ? 'bg-rose-500/15 border-rose-400/50 shadow-glow-rose'
                    : 'bg-slate-900/60 border-white/10 hover:border-rose-400/30 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                      {station.category}
                    </span>
                    {isPlayingThis && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>PLAYING</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-300 transition-colors line-clamp-1">
                    {station.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {station.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono">{station.channel}</span>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isPlayingThis ? 'bg-rose-500 text-white shadow-glow-rose' : 'bg-slate-800 text-slate-300 group-hover:bg-rose-600 group-hover:text-white'
                  }`}>
                    {isPlayingThis ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
