import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Sparkles, 
  Check, 
  Trash2, 
  Calendar as CalendarIcon, 
  Award,
  Zap,
  TrendingUp,
  X
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Habit } from '../../types';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabit, addHabit, deleteHabit } = useStudy();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>('study');
  const [newHabitColor, setNewHabitColor] = useState('#06b6d4');
  const [newHabitIcon, setNewHabitIcon] = useState('BookOpen');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to format day labels for the last 7 days
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayNumber: d.getDate(),
      isToday: i === 6,
    };
  });

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit({
      name: newHabitName.trim(),
      icon: newHabitIcon,
      color: newHabitColor,
      category: newHabitCategory,
      frequency: 'daily',
      targetDaysPerWeek: 7,
    });

    setNewHabitName('');
    setIsAddModalOpen(false);
  };

  const colorPresets = ['#6366f1', '#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#f43f5e'];
  const iconPresets = ['BookOpen', 'Code2', 'FileText', 'Sparkles', 'HeartPulse', 'Terminal', 'Brain', 'Target', 'Coffee'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            HABIT DISCIPLINE & STREAKS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Daily Academic Habits & Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Build compounding consistency through daily micro-disciplines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-glow-amber flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Habit</span>
        </button>
      </div>

      {/* Streak Matrix Table Card (7-Day Consistency Heatmap) */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 min-w-[500px]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">7-Day Consistency Heat Matrix</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Weekly Consistency</span>
        </div>

        <div className="min-w-[500px]">
          {/* Header row with Days */}
          <div className="grid grid-cols-12 gap-2 pb-3 text-xs font-mono text-slate-400 border-b border-white/5">
            <div className="col-span-5 pl-2">Habit Discipline</div>
            <div className="col-span-5 grid grid-cols-7 text-center">
              {past7Days.map((d) => (
                <div key={d.dateStr} className={`flex flex-col items-center ${d.isToday ? 'text-cyan-400 font-bold' : ''}`}>
                  <span>{d.dayName}</span>
                  <span className="text-[10px] opacity-75">{d.dayNumber}</span>
                </div>
              ))}
            </div>
            <div className="col-span-2 text-right pr-2">Current Streak</div>
          </div>

          {/* Habit Matrix Rows */}
          <div className="divide-y divide-white/5">
            {habits.map((habit) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Icon = (Icons as any)[habit.icon] || Icons.Sparkles;
              return (
                <div key={habit.id} className="grid grid-cols-12 gap-2 py-3.5 items-center hover:bg-white/5 transition-colors rounded-xl px-2">
                  <div className="col-span-5 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${habit.color}25`, color: habit.color, border: `1px solid ${habit.color}50` }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200 truncate">{habit.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{habit.category}</p>
                    </div>
                  </div>

                  {/* 7-Day Dots */}
                  <div className="col-span-5 grid grid-cols-7 gap-1">
                    {past7Days.map((d) => {
                      const isCompleted = !!(habit.completions && habit.completions[d.dateStr]);
                      return (
                        <button
                          key={d.dateStr}
                          onClick={() => toggleHabit(habit.id, d.dateStr)}
                          className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-glow-amber scale-105 font-bold'
                              : 'bg-slate-900/60 border border-white/5 text-slate-600 hover:border-white/20'
                          }`}
                          title={`${habit.name} on ${d.dateStr}: ${isCompleted ? 'Completed' : 'Missed'}`}
                        >
                          {isCompleted ? <Flame className="w-3.5 h-3.5 fill-white" /> : <span className="text-[10px]">•</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Streak Count */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5 pr-2">
                    <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                    <span className="text-sm font-bold font-mono text-amber-300">
                      {habit.currentStreak}d
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {habits.map((habit) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (Icons as any)[habit.icon] || Icons.Sparkles;
          const isDoneToday = !!(habit.completions && habit.completions[todayStr]);

          return (
            <div
              key={habit.id}
              className={`rounded-3xl glass-panel p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isDoneToday
                  ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-900/90 shadow-glow-emerald'
                  : 'border-white/10 hover:border-cyan-500/30 shadow-glass-card'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                    style={{ backgroundColor: `${habit.color}25`, color: habit.color, border: `1px solid ${habit.color}50` }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{habit.name}</h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {habit.category} • {habit.frequency}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  title="Delete habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Middle Stats */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="font-mono font-bold text-amber-300">{habit.currentStreak} Day Streak</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Best: {habit.longestStreak}d
                </span>
              </div>

              {/* Action Button: Check In Today */}
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  isDoneToday
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-glow-emerald'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-glow-amber'
                }`}
              >
                {isDoneToday ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Completed Today! 🔥</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Check In For Today</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">Create New Habit</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. Read 20 Pages, Solve 2 LeetCode..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="study">Study & Revision</option>
                  <option value="coding">Coding & Algorithms</option>
                  <option value="reading">Research & Reading</option>
                  <option value="discipline">Discipline & Active Recall</option>
                  <option value="wellness">Wellness & Health</option>
                </select>
              </div>

              {/* Color Preset Palette */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color Accent</label>
                <div className="flex items-center gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewHabitColor(c)}
                      className={`w-7 h-7 rounded-xl transition-transform ${
                        newHabitColor === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconPresets.map((iconName) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const IconComp = (Icons as any)[iconName] || Icons.Sparkles;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setNewHabitIcon(iconName)}
                        className={`p-2 rounded-xl border transition-all ${
                          newHabitIcon === iconName
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-amber'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-glow-amber hover:scale-105 transition-transform"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
