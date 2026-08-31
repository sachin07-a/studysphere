import React, { useState } from 'react';
import { 
  Users, 
  Flame, 
  Award, 
  Sparkles, 
  Radio, 
  Send, 
  Heart, 
  Zap, 
  Clock, 
  BookOpen, 
  Globe, 
  MessageSquare,
  Trophy,
  Medal
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useAuth } from '../../context/AuthContext';

export const StudyRoomView: React.FC = () => {
  const { user } = useAuth();
  const { peers, triggerConfetti } = useStudy();

  const [activeTab, setActiveTab] = useState<'lobby' | 'leaderboard'>('lobby');
  const [reactionsSent, setReactionsSent] = useState<Record<string, number>>({});
  const [cheerToast, setCheerToast] = useState<string | null>(null);

  const handleSendReaction = (peerId: string, emoji: string) => {
    setReactionsSent(prev => ({
      ...prev,
      [peerId]: (prev[peerId] || 0) + 1
    }));

    setCheerToast(`Sent ${emoji} encouragement!`);
    setTimeout(() => setCheerToast(null), 2000);
  };

  // Simulated leaderboard sorted by study minutes + XP
  const leaderboardList = [
    { rank: 1, name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', minutes: 1420, xp: 8900, streak: 21, major: 'Computer Science' },
    { rank: 2, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', minutes: 1280, xp: 7600, streak: 14, major: 'Neuroscience' },
    { rank: 3, name: user?.name || 'You (Scholar)', avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', minutes: 980, xp: user?.xp || 3450, streak: user?.streakCount || 5, major: user?.major || 'Computer Science', isUser: true },
    { rank: 4, name: 'Aaliyah Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', minutes: 890, xp: 4800, streak: 9, major: 'Mechanical Eng' },
    { rank: 5, name: 'Julian Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', minutes: 740, xp: 3900, streak: 5, major: 'Economics' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
            GLOBAL PEER FOCUS & SOCIAL ACCOUNTABILITY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Virtual Study Lobby & Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Study alongside scholars worldwide, cheer peers, and climb the weekly focus rankings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-white/10">
          <button
            onClick={() => setActiveTab('lobby')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lobby'
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Study Lobby</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Weekly Leaderboard</span>
            </span>
          </button>
        </div>
      </div>

      {/* Cheer Toast */}
      {cheerToast && (
        <div className="fixed top-20 right-8 z-50 p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-glow-purple animate-in fade-in slide-in-from-top-3 duration-200">
          {cheerToast}
        </div>
      )}

      {/* TAB 1: LIVE STUDY LOBBY */}
      {activeTab === 'lobby' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active Global Telemetry Bar */}
          <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 shadow-glass-3d bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>54 Active Scholars in Focus Chambers</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    LIVE
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time cognitive sync active. Silent peer presence elevates focus duration by +34%.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Quick Cheer All:</span>
              <button 
                onClick={() => {
                  triggerConfetti();
                  setCheerToast('Sent energy wave to all scholars! 🔥');
                  setTimeout(() => setCheerToast(null), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1 transition-all hover:scale-105"
              >
                <span>🔥 Keep Grinding!</span>
              </button>
            </div>
          </div>

          {/* Peer Focus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {peers.map((peer) => {
              const reactionsCount = reactionsSent[peer.id] || 0;
              return (
                <div
                  key={peer.id}
                  className="rounded-3xl glass-panel p-5 sm:p-6 border border-white/10 shadow-glass-card hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                        />
                        {peer.isStudying && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-100">{peer.name}</h4>
                          <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            <Flame className="w-3 h-3 fill-amber-400" />
                            <span>{peer.streak}d</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">{peer.major}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {peer.isStudying ? 'Studying Now' : 'Break'}
                      </span>
                    </div>
                  </div>

                  {/* Current Focus Target & Status */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-cyan-300 truncate">
                        📖 {peer.currentSubject}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {peer.focusMinutesToday}m logged
                      </span>
                    </div>
                    {peer.statusMessage && (
                      <p className="text-[11px] text-slate-400 italic">
                        "{peer.statusMessage}"
                      </p>
                    )}
                  </div>

                  {/* Encouragement Reactions Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {reactionsCount > 0 ? `Cheered ${reactionsCount}x ✨` : 'Send quick cheer:'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {['🔥', '👏', '💡', '🚀'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleSendReaction(peer.id, emoji)}
                          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 border border-white/10 text-sm flex items-center justify-center transition-all hover:scale-125"
                          title={`Send ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY SCHOLAR LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">Global Focus Rankings</h3>
                <p className="text-xs text-slate-400">Weekly leaderboard resets every Sunday at 00:00 UTC.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Season 1
            </span>
          </div>

          <div className="space-y-3">
            {leaderboardList.map((item) => {
              const isFirst = item.rank === 1;
              const isSecond = item.rank === 2;
              const isThird = item.rank === 3;

              return (
                <div
                  key={item.rank}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    item.isUser
                      ? 'bg-cyan-950/30 border-cyan-500/50 shadow-glow-cyan'
                      : isFirst
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-glow-amber'
                      : 'bg-slate-900/60 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-xl font-bold font-mono text-sm flex items-center justify-center ${
                      isFirst ? 'bg-amber-500 text-slate-950' : isSecond ? 'bg-slate-300 text-slate-950' : isThird ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.rank}
                    </div>

                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">
                          {item.name} {item.isUser && '(You)'}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] font-mono text-amber-400">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          <span>{item.streak}d</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">{item.major}</p>
                    </div>
                  </div>

                  {/* Focus Minutes & XP */}
                  <div className="text-right">
                    <span className="text-sm font-extrabold font-mono text-cyan-400">
                      {Math.floor(item.minutes / 60)}h {item.minutes % 60}m
                    </span>
                    <span className="block text-[10px] font-mono text-purple-300">
                      {item.xp} Total XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
