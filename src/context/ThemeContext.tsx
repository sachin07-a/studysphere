import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'glassmorphism' | 'liquid-glass' | 'minimalism' | 'skeuomorphism' | 'light';

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

export const THEME_CONFIGS: ThemeConfig[] = [
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    subtitle: 'Cyberpunk Frosted Glass',
    description: 'Frosted translucent glass, neon cyan highlights, glowing depth shadows, and cosmic space navy backdrops.',
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

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
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
    // Backward compatibility for legacy 'dark'
    if (saved === ('dark' as any)) return 'glassmorphism';
    return 'glassmorphism';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous theme classes
    root.classList.remove(
      'theme-glassmorphism', 
      'theme-liquid-glass', 
      'theme-minimalism', 
      'theme-skeuomorphism', 
      'theme-light',
      'dark',
      'light'
    );

    // Apply current theme
    root.classList.add(`theme-${theme}`);
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }

    localStorage.setItem('studysphere_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
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
      setTheme, 
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
