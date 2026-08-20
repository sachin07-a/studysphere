/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#0f172a',
        },
        navy: {
          800: '#0b0f19',
          850: '#0d1322',
          900: '#070a13',
          950: '#030712',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00f0ff',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          glow: '#d946ef',
        },
        surface: {
          dark: 'rgba(15, 23, 42, 0.75)',
          'dark-card': 'rgba(23, 32, 54, 0.65)',
          'dark-border': 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(255, 255, 255, 0.85)',
          'light-card': 'rgba(255, 255, 255, 0.75)',
          'light-border': 'rgba(0, 0, 0, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45)',
        'glow-blue': '0 0 25px -5px rgba(99, 102, 241, 0.45)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.45)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.45)',
        'glass-3d': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(6, 182, 212, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
