import React, { useState } from 'react';
import { 
  User, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sparkles, 
  Check, 
  Copy, 
  Sliders,
  Flame,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { storage } from '../../lib/storage';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured, updateSupabaseCredentials } from '../../lib/supabase';
import { useStudy } from '../../context/StudyContext';

export const SettingsView: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { triggerConfetti } = useStudy();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [major, setMajor] = useState(user?.major || '');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 240);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Supabase states
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('studysphere_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('studysphere_supabase_key') || '');
  const [isCopiedSchema, setIsCopiedSchema] = useState(false);

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

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseCredentials(supabaseUrl, supabaseKey);
    alert('Supabase credentials successfully updated! Live synchronization enabled.');
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
    if (confirm('Load sample pre-filled demo data (Sachin with 12 days streak)?')) {
      storage.loadDemoData();
      window.location.reload();
    }
  };

  const handleStartFreshSlate = () => {
    if (confirm('Wipe all current progress and start fresh with 0 streaks and clean habits?')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  const copySqlSchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setIsCopiedSchema(true);
    setTimeout(() => setIsCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          WORKSPACE & INTEGRATIONS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          System Preferences & Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your student identity, visual appearance, database connections, and personal streak management.
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

      {/* 2. Theme & Appearance */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Sliders className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-bold text-slate-100">Theme & UI Appearance</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-glow-purple font-bold'
                : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Dark 3D (Default)</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-glow-purple font-bold'
                : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Light Modern</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-glow-purple font-bold'
                : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xs">System Auto</span>
          </button>
        </div>
      </div>

      {/* 3. Supabase Cloud Database Configuration */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">Supabase Cloud Sync</h2>
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
            isSupabaseConfigured()
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border-white/10'
          }`}>
            {isSupabaseConfigured() ? 'Connected' : 'Local Storage Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-300/80 leading-relaxed">
          StudySphere operates with a zero-latency hybrid storage engine. You can connect your personal Supabase project for real-time PostgreSQL database synchronization and multi-device persistence.
        </p>

        <form onSubmit={handleSaveSupabase} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Anon Public API Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={copySqlSchema}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
            >
              {isCopiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedSchema ? 'Schema Copied!' : 'Copy Supabase SQL Schema'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:scale-105 transition-all"
            >
              Connect Cloud Database
            </button>
          </div>
        </form>
      </div>

      {/* 4. Data Portability, Clean Slate & Reset */}
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
