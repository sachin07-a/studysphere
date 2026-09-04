import React from 'react';
import { 
  Palette, 
  Sparkles, 
  Check, 
  X, 
  Layers, 
  Flame, 
  Zap, 
  SlidersHorizontal,
  Box,
  Eye
} from 'lucide-react';
import { useTheme, THEME_CONFIGS, ThemeMode } from '../../context/ThemeContext';
import { useStudy } from '../../context/StudyContext';

export const ThemeSelectorModal: React.FC = () => {
  const { theme, setTheme, isThemeModalOpen, setIsThemeModalOpen } = useTheme();
  const { triggerConfetti } = useStudy();

  if (!isThemeModalOpen) return null;

  const handleSelectTheme = (themeId: ThemeMode) => {
    setTheme(themeId);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-glass-3d space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-indigo-500 p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-[#070a13] rounded-[14px] flex items-center justify-center">
                <Palette className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Visual Theme Studio</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  5 Styles
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose your sensory workspace aesthetic (Liquid-Glass, Glassmorphism, Minimalism, Skeuomorphism)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEME_CONFIGS.map((config) => {
            const isSelected = theme === config.id;
            return (
              <div
                key={config.id}
                onClick={() => handleSelectTheme(config.id)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 shadow-glow-cyan ring-2 ring-cyan-400/40 bg-slate-900/90'
                    : 'border-white/10 hover:border-white/25 bg-slate-900/50 hover:bg-slate-900/80 hover:-translate-y-1'
                }`}
              >
                {/* Active Badge */}
                {isSelected && (
                  <span className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[10px] font-bold font-mono text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>ACTIVE</span>
                  </span>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-white/10 shrink-0">
                      {config.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-100">{config.name}</h3>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10">
                          {config.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-cyan-400">{config.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {config.description}
                  </p>
                </div>

                {/* Mini Visual Preview Pill */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: config.accentColor, boxShadow: `0 0 8px ${config.accentColor}` }} 
                    />
                    <span>{config.id === 'liquid-glass' ? 'Prismatic' : config.id === 'skeuomorphism' ? 'Tactile 3D' : config.id === 'minimalism' ? 'Monochrome' : 'Cyber-Glass'}</span>
                  </span>

                  <button
                    type="button"
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-white shadow-glow-cyan'
                        : 'bg-white/5 text-slate-300 group-hover:bg-white/15'
                    }`}
                  >
                    {isSelected ? 'Applied' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Theme preferences are saved automatically across sessions.</span>
          </span>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
