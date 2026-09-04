import React from 'react';
import { 
  Palette, 
  Sparkles, 
  Check, 
  X, 
  Flame, 
  Zap, 
  Droplet,
  Layers,
  Sun,
  Shield,
  Eye
} from 'lucide-react';
import { useTheme, THEME_CONFIGS, ACCENT_CONFIGS, ThemeMode, AccentColor } from '../../context/ThemeContext';
import { useStudy } from '../../context/StudyContext';

export const ThemeSelectorModal: React.FC = () => {
  const { 
    theme, 
    accent, 
    setTheme, 
    setAccent, 
    isThemeModalOpen, 
    setIsThemeModalOpen 
  } = useTheme();
  const { triggerConfetti } = useStudy();

  if (!isThemeModalOpen) return null;

  const handleSelectTheme = (themeId: ThemeMode) => {
    setTheme(themeId);
    triggerConfetti();
  };

  const handleSelectAccent = (accentId: AccentColor) => {
    setAccent(accentId);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-glass-3d space-y-7 max-h-[90vh] overflow-y-auto">
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
                <span>Visual Theme & Color Studio</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Customizable
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Mix & match your sensory workspace aesthetic (UI Surface + Vibrant Accent Colors)
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

        {/* SECTION 1: VIBRANT ACCENT COLOR PALETTES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5" />
              <span>Vibrant Accent Color Palettes</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">6 Radiant Schemes</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {ACCENT_CONFIGS.map((acc) => {
              const isSelected = accent === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectAccent(acc.id)}
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
                      <span className="w-4 h-4 rounded-full bg-white text-slate-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Gradient Color Swatch */}
                  <div
                    className="w-full h-3 rounded-full shadow-inner"
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

        {/* SECTION 2: UI SURFACE STYLING OPTIONS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>UI Surface Architecture & Physics</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">5 Distinct Styles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {THEME_CONFIGS.map((config) => {
              const isSelected = theme === config.id;
              return (
                <div
                  key={config.id}
                  onClick={() => handleSelectTheme(config.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 shadow-glow-cyan ring-2 ring-cyan-400/40 bg-slate-900/90'
                      : 'border-white/10 hover:border-white/25 bg-slate-900/50 hover:bg-slate-900/80 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Active Badge */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold font-mono text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>APPLIED</span>
                    </span>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl p-1.5 rounded-xl bg-slate-800/80 border border-white/10 shrink-0">
                        {config.icon}
                      </span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-100">{config.name}</h3>
                        <p className="text-[10px] font-mono text-cyan-400">{config.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Visual Indicator Footer */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300">
                      {config.badge}
                    </span>

                    <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {isSelected ? 'Active' : 'Switch'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>All sensory settings and colors persist in your encrypted local profile.</span>
          </span>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
