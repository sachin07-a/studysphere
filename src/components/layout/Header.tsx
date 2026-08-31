import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Sun, 
  Moon, 
  Zap, 
  Bot, 
  Plus, 
  Compass, 
  LogOut, 
  Sliders, 
  Music, 
  Radio,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    productivity, 
    setIsQuickCaptureOpen, 
    setIsAIChatOpen,
    setActiveView,
    setIsYouTubeModalOpen,
    setIsReportCardOpen,
    currentYouTubeTrack,
    isYouTubePlaying,
    activeAmbient
  } = useStudy();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!user) return null;

  // Calculate XP towards next level
  const currentLevelXP = (user.level - 1) * 1000;
  const xpInCurrentLevel = Math.max(0, user.xp - currentLevelXP);
  const xpRequiredForNext = 1000;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100));

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isAudioActive = isYouTubePlaying || !!activeAmbient;

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Brand / Title on Mobile & Desktop Breadcrumb */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070a13] rounded-[10px] flex items-center justify-center">
              <span className="text-xl">🌌</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight gradient-text-cyan font-sans">
                StudySphere
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO 3D
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Scholar Workspace</p>
          </div>
        </div>
      </div>

      {/* Center Interactive Stats Bar (Desktop) */}
      <div className="hidden md:flex items-center gap-4 bg-slate-900/60 border border-white/5 px-4 py-1.5 rounded-full shadow-inner">
        {/* Streak Indicator */}
        <div 
          onClick={() => setActiveView('habits')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 cursor-pointer hover:bg-amber-500/20 transition-colors"
          title="Current Daily Study Streak"
        >
          <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400" />
          <span className="text-xs font-mono font-bold">{user.streakCount} Day Streak</span>
        </div>

        {/* Level & XP Gauge */}
        <div 
          onClick={() => setActiveView('achievements')}
          className="flex items-center gap-2 px-2 cursor-pointer group"
          title={`Level ${user.level} Scholar (${user.xp} Total XP)`}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center shadow-glow-purple">
            {user.level}
          </div>
          <div className="w-24">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-0.5">
              <span>LVL {user.level}</span>
              <span>{xpInCurrentLevel}/1k XP</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Productivity Score Pill */}
        <div 
          onClick={() => setActiveView('analytics')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold cursor-pointer hover:bg-cyan-500/20 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{productivity.score}/100</span>
        </div>
      </div>

      {/* Action Controls & User Profile Menu */}
      <div className="flex items-center gap-2">
        {/* YouTube & Lo-Fi Lounge Trigger */}
        <button
          onClick={() => setIsYouTubeModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            isAudioActive
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose font-bold'
              : 'bg-slate-800/80 hover:bg-slate-700/80 border-white/10 text-slate-300 hover:text-white'
          }`}
          title="Open Lo-Fi Music & YouTube Study Lounge"
        >
          {isAudioActive ? (
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          ) : (
            <Music className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className="hidden sm:inline">
            {currentYouTubeTrack ? currentYouTubeTrack.title.split('-')[0].slice(0, 12) + '...' : 'Lo-Fi Hub'}
          </span>
        </button>

        {/* Quick Capture Button */}
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-cyan transition-all transform active:scale-95"
          title="Quick Capture Task or Note (Ctrl+K)"
        >
          <Plus className="w-4 h-4" />
          <span>Capture</span>
          <kbd className="hidden lg:inline-block px-1 py-0.5 text-[9px] bg-black/30 rounded font-mono">
            ⌘K
          </kbd>
        </button>

        {/* AI Mentor Chatbot Trigger */}
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-purple-300 transition-all hover:scale-105 shadow-glow-purple"
          title="Open AI Study Mentor"
        >
          <Bot className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition-all"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 border border-white/10 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 shadow-sm"
            />
          </button>

          {showProfileMenu && (
            <div 
              className="absolute right-0 mt-2 w-60 rounded-2xl glass-panel p-2 shadow-glass-3d border border-white/15 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-sm font-bold text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                  <Sparkles className="w-3 h-3" />
                  <span>{user.major}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveView('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Account & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('achievements');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Achievements & XP</span>
                </button>

                <button
                  onClick={() => {
                    setIsReportCardOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Weekly Report Card 📜</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors border-t border-white/5 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
