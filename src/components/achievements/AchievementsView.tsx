import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Crown, 
  Zap, 
  Shield, 
  Flame, 
  Compass, 
  Gem,
  CheckCircle,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useAuth } from '../../context/AuthContext';
import { Badge3D } from '../3d/Badge3D';
import { Achievement, AchievementTier } from '../../types';

export const AchievementsView: React.FC = () => {
  const { achievements, triggerConfetti } = useStudy();
  const { user } = useAuth();
  
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  if (!user) return null;

  // Level & XP math
  const levelNames = [
    'Novice Explorer',
    'Curious Apprentice',
    'Focused Scholar',
    'Deep Work Specialist',
    'Master of Intellect',
    'Grandmaster Polymath',
    'Diamond Titan',
  ];
  const levelTitle = levelNames[Math.min(user.level - 1, levelNames.length - 1)];

  const currentLevelXP = (user.level - 1) * 1000;
  const xpInCurrentLevel = Math.max(0, user.xp - currentLevelXP);
  const xpRequiredForNext = 1000;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100));

  const unlockedCount = achievements.filter(a => !!a.unlockedAt).length;

  const filteredAchievements = achievements.filter((a) => {
    if (tierFilter === 'unlocked') return !!a.unlockedAt;
    if (tierFilter === 'in_progress') return !a.unlockedAt;
    if (tierFilter !== 'all') return a.tier === tierFilter;
    return true;
  });

  const handleBadgeClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    if (achievement.unlockedAt) {
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
            GAMIFICATION & SCHOLAR RANKS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Achievement Vault & Honors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Earn experience points (XP) for every focused minute and conquered assignment.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl glass-panel border border-white/10 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-amber-300 px-3 py-1 bg-amber-500/10 rounded-xl border border-amber-500/20">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>
      </div>

      {/* Level Progression Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-glass-3d bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/60">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-glow-purple flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Crown className="w-8 h-8 text-amber-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
                  Level {user.level}
                </span>
                <span className="text-xs text-slate-400 font-mono">Rank Tier</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-0.5">
                {levelTitle}
              </h2>
            </div>
          </div>

          {/* XP Gauge */}
          <div className="md:w-72 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Total Score</span>
              <span className="text-cyan-400 font-bold">{user.xp.toLocaleString()} XP</span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-700 shadow-glow-cyan"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{xpInCurrentLevel} XP</span>
              <span>{xpRequiredForNext - xpInCurrentLevel} XP to Level {user.level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'unlocked', 'in_progress', 'bronze', 'silver', 'gold', 'diamond'] as const).map((tier) => (
          <button
            key={tier}
            onClick={() => setTierFilter(tier)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              tierFilter === tier
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-glow-purple font-bold'
                : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tier.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* 3D Holographic Tilt Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement) => (
          <Badge3D
            key={achievement.id}
            achievement={achievement}
            onClick={() => handleBadgeClick(achievement)}
          />
        ))}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d text-center space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAchievement(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-glow-purple flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-cyan-300">
                <Award className="w-10 h-10" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {selectedAchievement.tier} Tier • +{selectedAchievement.xpReward} XP
              </span>
              <h3 className="text-xl font-extrabold text-slate-100 mt-3">{selectedAchievement.title}</h3>
              <p className="text-xs text-slate-300/90 mt-2 leading-relaxed">
                {selectedAchievement.description}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Progress</span>
                <span className="text-cyan-400 font-bold">{selectedAchievement.progress} / {selectedAchievement.maxProgress}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
                  style={{ width: `${Math.min(100, Math.round((selectedAchievement.progress / selectedAchievement.maxProgress) * 100))}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
