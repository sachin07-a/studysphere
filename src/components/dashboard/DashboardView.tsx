import React from 'react';
import { 
  Flame, 
  Clock, 
  CheckSquare, 
  Sparkles, 
  TrendingUp, 
  Play, 
  Plus, 
  Zap, 
  ArrowRight, 
  BookOpen, 
  Calendar as CalendarIcon,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudy } from '../../context/StudyContext';
import { ProductivityOrb } from '../3d/ProductivityOrb';
import { getDailyQuote } from '../../lib/productivity';

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { 
    sessions, 
    tasks, 
    habits, 
    subjects, 
    productivity, 
    aiInsights, 
    setActiveView, 
    setIsQuickCaptureOpen, 
    setIsFocusMode, 
    toggleHabit, 
    toggleTask,
    startTimer 
  } = useStudy();

  const todayStr = new Date().toISOString().split('T')[0];
  const quote = getDailyQuote();

  // Greeting based on hour
  const hour = new Date().getHours();
  let greetingTime = 'Good Morning';
  if (hour >= 12 && hour < 17) greetingTime = 'Good Afternoon';
  else if (hour >= 17) greetingTime = 'Good Evening';

  const todaySessions = sessions.filter(s => s.date === todayStr);
  const totalStudyMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const studyHours = (totalStudyMinutesToday / 60).toFixed(1);
  const goalHours = ((user?.dailyGoalMinutes || 240) / 60).toFixed(1);
  const studyProgressPercent = Math.min(100, Math.round((totalStudyMinutesToday / (user?.dailyGoalMinutes || 240)) * 100));

  const todayTasks = tasks.filter(t => t.dueDate === todayStr || t.completedAt?.startsWith(todayStr));
  const completedTasksCount = todayTasks.filter(t => t.completed).length;
  const totalTasksCount = Math.max(todayTasks.length, 1);

  const completedHabitsCount = habits.filter(h => h.completions && h.completions[todayStr]).length;
  const totalHabitsCount = habits.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-glass-3d bg-gradient-to-r from-navy-850 via-slate-900 to-indigo-950/40">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wide">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[11px] font-mono">
                Academic Term 2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {greetingTime}, <span className="gradient-text-cyan">{user?.name ? user.name.split(' ')[0] : 'Scholar'}</span> 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300/90 italic max-w-xl">
              "{quote.text}" — <span className="font-semibold text-slate-200">{quote.author}</span>
            </p>
          </div>

          {/* Quick Action Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveView('timer');
                startTimer();
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-cyan flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 25m Focus</span>
            </button>

            <button
              onClick={() => setIsFocusMode(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/15 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Maximize2 className="w-4 h-4 text-purple-400" />
              <span>Zen Room</span>
            </button>

            <button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/15 text-slate-300 hover:text-white transition-all hover:scale-105"
              title="Quick Capture (Ctrl+K)"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Study Time Today */}
        <div 
          onClick={() => setActiveView('timer')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Study Time</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-slate-100">{studyHours}h</span>
            <span className="text-xs text-slate-400 font-mono">/ {goalHours}h Goal</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-700"
                style={{ width: `${studyProgressPercent}%` }}
              />
            </div>
            <span className="block text-[11px] text-cyan-400 font-mono mt-1 text-right">
              {studyProgressPercent}% accomplished
            </span>
          </div>
        </div>

        {/* Card 2: Current Streak */}
        <div 
          onClick={() => setActiveView('habits')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform shadow-glow-amber">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-amber-300">{user?.streakCount || 0}</span>
            <span className="text-xs text-slate-400">Days Unbroken 🔥</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Best: {user?.longestStreak || 0} Days</span>
            <span className="text-amber-400 font-bold">Top 5% Rank</span>
          </div>
        </div>

        {/* Card 3: Tasks Completed */}
        <div 
          onClick={() => setActiveView('tasks')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tasks Completed</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-slate-100">{completedTasksCount}</span>
            <span className="text-xs text-slate-400 font-mono">/ {totalTasksCount} Due Today</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                style={{ width: `${Math.round((completedTasksCount / totalTasksCount) * 100)}%` }}
              />
            </div>
            <span className="block text-[11px] text-indigo-300 font-mono mt-1 text-right">
              {Math.round((completedTasksCount / totalTasksCount) * 100)}% Done
            </span>
          </div>
        </div>

        {/* Card 4: Habits Checked */}
        <div 
          onClick={() => setActiveView('habits')}
          className="glass-card glass-card-hover p-5 rounded-2xl cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Habits</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-emerald-300">{completedHabitsCount}</span>
            <span className="text-xs text-slate-400 font-mono">/ {totalHabitsCount} Complete</span>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
                style={{ width: `${Math.round((completedHabitsCount / totalHabitsCount) * 100)}%` }}
              />
            </div>
            <span className="block text-[11px] text-emerald-400 font-mono mt-1 text-right">
              {completedHabitsCount === totalHabitsCount ? 'All Habits Done! 🌟' : `${totalHabitsCount - completedHabitsCount} remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (3D Productivity Core & Subject Progress) | Right (AI Insights & Action Timeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 3D Productivity Core */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Productivity Engine
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                {productivity.tier}
              </span>
            </div>

            {/* 3D Glowing Energy Orb Canvas */}
            <div className="py-2">
              <ProductivityOrb score={productivity.score} tier={productivity.tier} />
            </div>

            {/* Score Breakdown Bars */}
            <div className="w-full space-y-2.5 mt-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Study Duration</span>
                <span className="font-mono font-semibold text-cyan-400">{productivity.studyTimeScore} / 35</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Task Completion</span>
                <span className="font-mono font-semibold text-indigo-400">{productivity.tasksScore} / 25</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Habit Adherence</span>
                <span className="font-mono font-semibold text-emerald-400">{productivity.habitsScore} / 20</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Consistency & Streak</span>
                <span className="font-mono font-semibold text-amber-400">{productivity.consistencyScore} / 20</span>
              </div>
            </div>

            {/* Actionable dynamic recommendation */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 leading-relaxed w-full text-left">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Coach Advice:</span>
              </div>
              <p>{productivity.primaryRecommendation}</p>
            </div>
          </div>

          {/* Subjects Progress Widget */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-100">Subject Study Goals</h3>
              </div>
              <button
                onClick={() => setActiveView('subjects')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {subjects.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                  <p>No subjects added yet.</p>
                  <button
                    onClick={() => setActiveView('subjects')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30"
                  >
                    + Add Your First Subject
                  </button>
                </div>
              ) : (
                subjects.slice(0, 3).map((sub) => {
                  const completedHours = (sub.completedMinutesThisWeek / 60).toFixed(1);
                  const percent = Math.min(100, Math.round((sub.completedMinutesThisWeek / (sub.weeklyGoalHours * 60)) * 100));
                  return (
                    <div key={sub.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: sub.color, boxShadow: `0 0 10px ${sub.color}` }}
                          />
                          <span className="text-xs font-bold text-slate-200">{sub.name}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {completedHours}h / {sub.weeklyGoalHours}h
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%`, backgroundColor: sub.color }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & Today's Schedule Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Futuristic AI Insights Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">AI Intelligence & Telemetry</h3>
              </div>
              <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                Live Analysis
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {aiInsights.slice(0, 2).map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-2xl p-4 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/30 border border-white/10 shadow-glass-card space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {insight.impact}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 mb-1">{insight.title}</h4>
                    <p className="text-xs text-slate-300/80 leading-relaxed">{insight.description}</p>
                  </div>

                  {insight.actionLabel && (
                    <button
                      onClick={() => setActiveView((insight.actionView as any) || 'timer')}
                      className="self-start text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1"
                    >
                      <span>{insight.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Action Timeline: Habits & Tasks */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Today's Action Plan</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {todayTasks.filter(t => !t.completed).length} Tasks Pending
              </span>
            </div>

            {/* Quick Habit Check-in Row */}
            <div>
              <p className="text-[11px] font-mono uppercase text-slate-400 tracking-wider mb-2.5">
                Daily Habit Check-in
              </p>
              {habits.length === 0 ? (
                <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 text-center">
                  <span>No habits tracked yet. </span>
                  <button onClick={() => setActiveView('habits')} className="text-cyan-400 font-bold underline">
                    Add daily habits
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {habits.slice(0, 3).map((habit) => {
                    const isDone = !!(habit.completions && habit.completions[todayStr]);
                    return (
                      <button
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-cyan-500/40'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <p className="text-xs font-semibold truncate">{habit.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{habit.currentStreak} 🔥 streak</p>
                        </div>
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                          isDone ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'
                        }`}>
                          {isDone && '✓'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Priority Tasks List */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  High Impact Tasks
                </p>
                <button
                  onClick={() => setIsQuickCaptureOpen(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {tasks.filter(t => !t.completed).length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 text-center">
                  <span>All caught up! No pending tasks. </span>
                  <button onClick={() => setIsQuickCaptureOpen(true)} className="text-indigo-400 font-bold underline">
                    Create a task
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.filter(t => !t.completed).slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/15 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="w-5 h-5 rounded-lg border border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center shrink-0 transition-colors"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-[10px] text-slate-400 truncate">{task.description}</p>
                          )}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        task.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : task.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
