import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'glassmorphism' | 'liquid-glass' | 'minimalism' | 'skeuomorphism' | 'light';
export type AccentColor = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'gold';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  accentColor: string;
  gradient: string;
  badge: string;
}

export interface AccentConfig {
  id: AccentColor;
  name: string;
  subtitle: string;
  primary: string;
  secondary: string;
  gradient: string;
  glow: string;
  icon: string;
}

export const THEME_CONFIGS: ThemeConfig[] = [
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    subtitle: 'Cyberpunk Frosted Glass',
    description: 'Frosted translucent glass, neon border highlights, glowing depth shadows, and cosmic space navy backdrops.',
    icon: '🌌',
    accentColor: '#06b6d4',
    gradient: 'from-cyan-500 to-indigo-600',
    badge: 'Classic 3D'
  },
  {
    id: 'liquid-glass',
    name: 'Liquid-Glass UI',
    subtitle: 'Iridescent Fluid Specular',
    description: 'Fluid iridescent glass reflections, prismatic gradient borders, cosmic purple radiance, and high-gloss specular shine.',
    icon: '🔮',
    accentColor: '#d946ef',
    gradient: 'from-fuchsia-500 via-purple-500 to-cyan-400',
    badge: 'Next-Gen FX'
  },
  {
    id: 'minimalism',
    name: 'Minimalism',
    subtitle: 'Zen Monochrome Focus',
    description: 'Distraction-free matte obsidian surfaces, Swiss typography, clean subtle borders, and zero cognitive clutter.',
    icon: '⚪',
    accentColor: '#e4e4e7',
    gradient: 'from-zinc-100 to-zinc-400',
    badge: 'Pure Focus'
  },
  {
    id: 'skeuomorphism',
    name: 'Skeuomorphism',
    subtitle: 'Tactile 3D Embossed Hardware',
    description: 'Physical beveled hardware panels, embossed tactile buttons, realistic dual drop-shadows, and retro-futuristic mechanical feel.',
    icon: '🎛️',
    accentColor: '#38bdf8',
    gradient: 'from-slate-700 to-slate-900',
    badge: 'Tactile Neo'
  },
  {
    id: 'light',
    name: 'Light Modern',
    subtitle: 'Crisp Studio Paper',
    description: 'Daylight mode with clean bright paper backgrounds, indigo focal highlights, and high-contrast readable typography.',
    icon: '☀️',
    accentColor: '#4f46e5',
    gradient: 'from-indigo-500 to-cyan-500',
    badge: 'Day Mode'
  }
];

export const ACCENT_CONFIGS: AccentConfig[] = [
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    subtitle: 'Electric Blue & Ice',
    primary: '#06b6d4',
    secondary: '#6366f1',
    gradient: 'from-cyan-400 via-sky-500 to-indigo-500',
    glow: 'rgba(6, 182, 212, 0.45)',
    icon: '🌊'
  },
  {
    id: 'purple',
    name: 'Cosmic Violet',
    subtitle: 'Radiant Magenta & Nebula',
    primary: '#d946ef',
    secondary: '#8b5cf6',
    gradient: 'from-fuchsia-400 via-purple-500 to-indigo-500',
    glow: 'rgba(217, 70, 239, 0.45)',
    icon: '🔮'
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    subtitle: 'Bioluminescent Neon Mint',
    primary: '#10b981',
    secondary: '#06b6d4',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    glow: 'rgba(16, 185, 129, 0.45)',
    icon: '🍃'
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    subtitle: 'Warm Sunset & Energy',
    primary: '#f59e0b',
    secondary: '#f43f5e',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    glow: 'rgba(245, 158, 11, 0.45)',
    icon: '🔥'
  },
  {
    id: 'rose',
    name: 'Sakura Rose',
    subtitle: 'Lofi Pastel & Neo Pink',
    primary: '#f43f5e',
    secondary: '#c084fc',
    gradient: 'from-rose-400 via-pink-500 to-purple-400',
    glow: 'rgba(244, 63, 94, 0.45)',
    icon: '🌸'
  },
  {
    id: 'gold',
    name: 'Electric Gold',
    subtitle: 'Cyber Honey & Crown',
    primary: '#eab308',
    secondary: '#ea580c',
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
    glow: 'rgba(234, 179, 8, 0.45)',
    icon: '⚡'
  }
];

interface ThemeContextType {
  theme: ThemeMode;
  accent: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  cycleTheme: () => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('studysphere_theme') as ThemeMode;
    if (saved && ['glassmorphism', 'liquid-glass', 'minimalism', 'skeuomorphism', 'light'].includes(saved)) {
      return saved;
    }
    if (saved === ('dark' as any)) return 'glassmorphism';
    return 'glassmorphism';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('studysphere_accent') as AccentColor;
    if (saved && ['cyan', 'purple', 'emerald', 'amber', 'rose', 'gold'].includes(saved)) {
      return saved;
    }
    return 'cyan';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous theme and accent classes
    root.classList.remove(
      'theme-glassmorphism', 
      'theme-liquid-glass', 
      'theme-minimalism', 
      'theme-skeuomorphism', 
      'theme-light',
      'dark',
      'light',
      'accent-cyan',
      'accent-purple',
      'accent-emerald',
      'accent-amber',
      'accent-rose',
      'accent-gold'
    );

    // Apply current theme and accent classes
    root.classList.add(`theme-${theme}`);
    root.classList.add(`accent-${accent}`);

    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }

    localStorage.setItem('studysphere_theme', theme);
    localStorage.setItem('studysphere_accent', accent);
  }, [theme, accent]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  const cycleTheme = () => {
    const order: ThemeMode[] = ['glassmorphism', 'liquid-glass', 'minimalism', 'skeuomorphism', 'light'];
    const currentIndex = order.indexOf(theme);
    const nextIndex = (currentIndex + 1) % order.length;
    setThemeState(order[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      accent,
      setTheme, 
      setAccent,
      cycleTheme,
      isThemeModalOpen, 
      setIsThemeModalOpen 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
