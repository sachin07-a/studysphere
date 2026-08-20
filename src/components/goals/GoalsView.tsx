import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Sparkles, 
  Calendar, 
  Trash2, 
  Check, 
  TrendingUp, 
  Hourglass,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Goal } from '../../types';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, triggerConfetti } = useStudy();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState(100);
  const [unit, setUnit] = useState('Hours');
  const [type, setType] = useState<Goal['type']>('hours');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title: title.trim(),
      description: description.trim(),
      type,
      currentValue: 0,
      targetValue,
      unit,
      deadline,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const adjustProgress = (goalId: string, delta: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const nextVal = Math.max(0, goal.currentValue + delta);
    const completed = nextVal >= goal.targetValue;
    if (completed && !goal.completed) {
      triggerConfetti();
    }

    updateGoal(goalId, {
      currentValue: nextVal,
      completed,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
            ACADEMIC MILESTONES & TARGETS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Long & Short Term Study Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Set ambitious targets and watch your progress compound automatically.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-purple flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
          const isDone = goal.completed || goal.currentValue >= goal.targetValue;

          // Days remaining
          const now = new Date();
          const targetDate = new Date(goal.deadline);
          const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

          return (
            <div
              key={goal.id}
              className={`rounded-3xl glass-panel p-6 border transition-all duration-300 flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/20 shadow-glow-emerald'
                  : 'border-white/10 hover:border-purple-500/40 shadow-glass-card'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    }`}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{goal.title}</h3>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {goal.type.replace('_', ' ')} target
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {goal.description && (
                  <p className="text-xs text-slate-300/80 mb-4 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* Progress Bar & Value Counters */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-sm font-mono font-bold text-slate-100">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isDone
                          ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                          : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className={isDone ? 'text-emerald-400 font-bold' : ''}>
                      {percent}% Accomplished
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Hourglass className="w-3 h-3 text-cyan-400" />
                      <span>{diffDays > 0 ? `${diffDays} days left` : 'Deadline Today'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Adjust Progress Controls */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400">Manual Adjust</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustProgress(goal.id, -1)}
                    className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <button
                    onClick={() => adjustProgress(goal.id, 1)}
                    className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1"
                  >
                    <span>+1 {goal.unit}</span>
                  </button>
                  <button
                    onClick={() => adjustProgress(goal.id, 5)}
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1"
                  >
                    <span>+5</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">Set New Academic Goal</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master 50 LeetCode Hard Problems"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Strategy</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is your focus plan?"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Number</label>
                  <input
                    type="number"
                    min="1"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 10)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. Hours, Problems, Days"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                />
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs shadow-glow-purple hover:scale-105 transition-transform"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
