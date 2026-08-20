import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';
import { Achievement, AchievementTier } from '../../types';

interface Badge3DProps {
  achievement: Achievement;
  onClick?: () => void;
}

const TIER_STYLES: Record<AchievementTier, { border: string; glow: string; text: string; bg: string; badge: string }> = {
  bronze: {
    border: 'border-amber-700/50 hover:border-amber-500',
    glow: 'group-hover:shadow-glow-amber',
    text: 'text-amber-400',
    bg: 'from-amber-950/40 via-slate-900/60 to-slate-950/80',
    badge: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  },
  silver: {
    border: 'border-slate-400/40 hover:border-slate-200',
    glow: 'group-hover:shadow-glow-blue',
    text: 'text-slate-200',
    bg: 'from-slate-800/40 via-slate-900/60 to-slate-950/80',
    badge: 'bg-slate-800/60 text-slate-200 border-slate-700/60',
  },
  gold: {
    border: 'border-amber-400/50 hover:border-amber-300',
    glow: 'group-hover:shadow-glow-amber',
    text: 'text-amber-300',
    bg: 'from-yellow-950/50 via-slate-900/60 to-slate-950/80',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  platinum: {
    border: 'border-cyan-400/50 hover:border-cyan-300',
    glow: 'group-hover:shadow-glow-cyan',
    text: 'text-cyan-300',
    bg: 'from-cyan-950/50 via-slate-900/60 to-slate-950/80',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  diamond: {
    border: 'border-purple-400/60 hover:border-purple-300',
    glow: 'group-hover:shadow-glow-purple',
    text: 'text-purple-300',
    bg: 'from-purple-950/60 via-slate-900/70 to-slate-950/90',
    badge: 'bg-purple-500/20 text-purple-200 border-purple-500/50',
  },
};

export const Badge3D: React.FC<Badge3DProps> = ({ achievement, onClick }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);

  const isUnlocked = !!achievement.unlockedAt;
  const tierStyle = TIER_STYLES[achievement.tier] || TIER_STYLES.bronze;

  // Resolve Lucide Icon dynamically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[achievement.icon] || Icons.Award;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.maxProgress) * 100));

  return (
    <div
      style={{ perspective: 1000 }}
      className="group cursor-pointer select-none"
      onClick={onClick}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
        className={`relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-br ${tierStyle.bg} backdrop-blur-xl shadow-glass-card ${tierStyle.border} ${tierStyle.glow} transition-all duration-300 ${
          !isUnlocked ? 'opacity-70 grayscale-[0.6]' : ''
        }`}
      >
        {/* Dynamic Sheen Glare */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
          }}
        />

        {/* Header with tier badge & XP */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tierStyle.badge}`}>
            {achievement.tier}
          </span>
          <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
            <span>+{achievement.xpReward} XP</span>
          </span>
        </div>

        {/* 3D Icon Container */}
        <div className="flex items-center gap-3.5 mb-3">
          <div
            style={{ transform: 'translateZ(20px)' }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              isUnlocked
                ? 'bg-slate-800/90 border-white/20 text-cyan-400 shadow-glow-cyan'
                : 'bg-slate-900/80 border-white/5 text-slate-500'
            }`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
              {achievement.title}
            </h4>
            <p className="text-xs text-slate-400 line-clamp-1">
              {achievement.category}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300/80 mb-4 line-clamp-2 leading-relaxed min-h-[32px]">
          {achievement.description}
        </p>

        {/* Progress Bar & Status */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>{isUnlocked ? 'Unlocked ✨' : 'In Progress'}</span>
            <span>{achievement.progress} / {achievement.maxProgress}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isUnlocked
                  ? 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                  : 'bg-gradient-to-r from-slate-600 to-slate-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
