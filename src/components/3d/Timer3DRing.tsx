import React from 'react';
import { motion } from 'framer-motion';

interface Timer3DRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  isRunning?: boolean;
  color?: string;
  glowColor?: string;
}

export const Timer3DRing: React.FC<Timer3DRingProps> = ({
  progress,
  size = 320,
  strokeWidth = 14,
  isRunning = false,
  color = '#06b6d4',
  glowColor = '#22d3ee',
}) => {
  const center = size / 2;
  const radius = center - strokeWidth - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  // Calculate position of the orbital node on the circle
  const angle = progress * 2 * Math.PI - Math.PI / 2;
  const nodeX = center + radius * Math.cos(angle);
  const nodeY = center + radius * Math.sin(angle);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* 3D Depth Backing Rings */}
      <div 
        className="absolute inset-0 rounded-full bg-slate-900/60 shadow-glass-3d border border-white/10"
        style={{ width: size, height: size }}
      />

      <svg width={size} height={size} className="relative transform -rotate-90">
        <defs>
          <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <filter id="glow3D" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer subtle guide track */}
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />

        {/* Background Track with 3D groove */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
          className="transition-all duration-300"
        />

        {/* Active Animated Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#timerGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#glow3D)"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />

        {/* Inner dashed ring */}
        <circle
          cx={center}
          cy={center}
          r={radius - 12}
          fill="none"
          stroke="rgba(6, 182, 212, 0.15)"
          strokeWidth="1.5"
          strokeDasharray="2 6"
        />
      </svg>

      {/* Orbiting 3D Particle / Node */}
      {progress > 0 && (
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{
            left: nodeX - 10,
            top: nodeY - 10,
            width: 20,
            height: 20,
          }}
          animate={isRunning ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div 
            className="w-full h-full rounded-full bg-white shadow-lg border-2 border-cyan-400"
            style={{
              boxShadow: `0 0 16px 4px ${glowColor}`,
            }}
          />
        </motion.div>
      )}
    </div>
  );
};
