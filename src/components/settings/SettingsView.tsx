import React, { useState } from 'react';
import { 
  User, 
  Download, 
  Upload, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sparkles, 
  Check, 
  Sliders,
  Flame,
  Bell,
  Volume2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, THEME_CONFIGS, ACCENT_CONFIGS } from '../../context/ThemeContext';
import { storage } from '../../lib/storage';
import { useStudy } from '../../context/StudyContext';

export const SettingsView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme, accent, setTheme, setAccent } = useTheme();
  const { triggerConfetti } = useStudy();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [major, setMajor] = useState(user?.major || '');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 240);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Focus & notification preferences
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breakReminders, setBreakReminders] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      major,
      dailyGoalMinutes,
    });
    setSavedSuccess(true);
    triggerConfetti();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    const json = storage.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudySphere_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const ok = storage.importBackup(content);
      if (ok) {
        alert('Data backup successfully restored! Reloading application...');
        window.location.reload();
      } else {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemoData = () => {
    if (confirm('Load sample pre-filled demo data for testing?')) {
      storage.loadDemoData();
      window.location.reload();
    }
  };

  const handleStartFreshSlate = () => {
    if (confirm('Wipe all current progress and start completely fresh with 0-day streaks and clean habits?')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          PREFERENCES & CONTROLS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Account & Study Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Personalize your student identity, visual appearance, focus timer options, and offline data backups.
        </p>
      </div>

      {/* 1. Student Profile Settings */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <User className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100">Student Profile Identity</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Major / Academic Focus</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Study Target (Minutes)</label>
              <input
                type="number"
                min="30"
                max="720"
                step="30"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value) || 240)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all hover:scale-105"
            >
              {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedSuccess ? 'Profile Updated!' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Theme & UI Appearance */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Theme & UI Appearance</h2>
              <p className="text-xs text-slate-400">Choose your sensory workspace styling</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            5 Styles Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {THEME_CONFIGS.map((config) => {
            const isSelected = theme === config.id;
            return (
              <button
                key={config.id}
                type="button"
                onClick={() => {
                  setTheme(config.id);
                  triggerConfetti();
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative group ${
                  isSelected
                    ? 'border-cyan-400 shadow-glow-cyan bg-cyan-500/15 ring-2 ring-cyan-400/30'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-1.5 rounded-xl bg-slate-800/80 border border-white/10">
                      {config.icon}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100">{config.name}</h3>
                    <p className="text-[11px] font-mono text-cyan-400">{config.subtitle}</p>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {config.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: config.accentColor }} 
                    />
                    <span>{config.badge}</span>
                  </span>
                  <span className={isSelected ? 'text-cyan-300 font-bold' : 'group-hover:text-slate-300'}>
                    {isSelected ? 'Selected' : 'Apply'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2B. Vibrant Accent Color Palettes */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Vibrant Accent Color Palettes
              </h3>
              <p className="text-[11px] text-slate-400">Personalize neon glows, buttons, and gradient highlights</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">6 Radiant Schemes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ACCENT_CONFIGS.map((acc) => {
              const isSelected = accent === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setAccent(acc.id);
                    triggerConfetti();
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-between gap-2 transition-all duration-200 group relative ${
                    isSelected
                      ? 'border-white shadow-lg ring-2 ring-white/40 scale-105 bg-slate-900/90'
                      : 'border-white/10 hover:border-white/20 bg-slate-900/50 hover:bg-slate-900/80 hover:scale-102'
                  }`}
                  style={{
                    borderColor: isSelected ? acc.primary : undefined,
                    boxShadow: isSelected ? `0 0 20px -5px ${acc.glow}` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">{acc.icon}</span>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-white text-slate-950 flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Gradient Color Swatch */}
                  <div
                    className="w-full h-2.5 rounded-full shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, ${acc.primary}, ${acc.secondary})`,
                    }}
                  />

                  <div className="text-center w-full">
                    <span className="text-xs font-bold text-slate-100 block truncate">{acc.name}</span>
                    <span className="text-[9px] font-mono text-slate-400 block truncate">{acc.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Focus & Productivity Preferences */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Study & Focus Sound Controls</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-xs font-bold text-slate-200">Procedural Ambient Sound Synthesis</p>
                <p className="text-[11px] text-slate-400">Offline Web Audio generator (Rain, Forest, Café, 40Hz Waves)</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-slate-200">Local-First Privacy & Zero Telemetry</p>
                <p className="text-[11px] text-slate-400">All data stays in your browser with offline persistence</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* 4. Data Portability & Clean Slate */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Download className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-slate-100">Data Portability & Clean Slate</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export JSON Backup</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Import Backup</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={handleStartFreshSlate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-colors ml-auto"
            title="Start your personal fresh streak from Day 1"
          >
            <Flame className="w-4 h-4 text-cyan-400" />
            <span>Start Fresh Clean Slate (0 Streaks)</span>
          </button>

          <button
            onClick={handleResetDemoData}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-400 border border-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Load Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
