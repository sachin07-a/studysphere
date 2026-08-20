import React, { useState } from 'react';
import { Sparkles, Play, ArrowRight, ShieldCheck, Zap, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthView: React.FC = () => {
  const { login, signup, loginAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden bg-radial-mesh">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-glow-cyan mb-2">
            <div className="w-full h-full bg-[#070a13] rounded-[22px] flex items-center justify-center">
              <span className="text-3xl">🌌</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight gradient-text-cyan">
            StudySphere
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Smart 3D Student Productivity & Habit Architecture
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 shadow-glass-3d space-y-6">
          {/* Quick Demo Access Bar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/40 to-slate-900/80 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-bold text-cyan-300">Quick Test Drive</span>
            </div>
            <button
              onClick={loginAsGuest}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow-cyan transition-all hover:scale-105"
            >
              Enter Guest Mode 🚀
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex-1 h-px bg-white/10" />
            <span>or continue with credentials</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sachin Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sachin@studysphere.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-glow-cyan flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 mt-2"
            >
              <span>{isSignUp ? 'Create Scholar Account' : 'Sign In To StudySphere'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Client-First Data Privacy • Hybrid Supabase Engine</span>
        </p>
      </div>
    </div>
  );
};
