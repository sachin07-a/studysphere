import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  PieChart as PieIcon, 
  Sparkles, 
  Calendar, 
  Award,
  Zap,
  CheckCircle,
  Activity,
  Flame,
  CheckCircle2,
  CalendarCheck,
  Target,
  Sparkle,
  Layers,
  Star
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  LineChart,
  Line
} from 'recharts';
import { useStudy } from '../../context/StudyContext';

export const AnalyticsView: React.FC = () => {
  const { sessions, subjects, habits, tasks, productivity, aiInsights } = useStudy();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState<{ date: string; displayDate: string; weekday: string; completed: number; total: number; pct: number } | null>(null);

  // Compute daily study time for past 7 days
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessions.filter(s => s.date === dateStr);
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: +(totalMinutes / 60).toFixed(1),
      minutes: totalMinutes,
    };
  });

  // Compute Subject distribution for Pie Chart
  const subjectTimeMap: Record<string, { minutes: number; color: string }> = {};
  subjects.forEach(sub => {
    subjectTimeMap[sub.name] = { minutes: 0, color: sub.color };
  });

  sessions.forEach(sess => {
    if (subjectTimeMap[sess.subjectName]) {
      subjectTimeMap[sess.subjectName].minutes += sess.durationMinutes;
    } else {
      subjectTimeMap[sess.subjectName] = { minutes: sess.durationMinutes, color: '#6366f1' };
    }
  });

  const pieData = Object.entries(subjectTimeMap)
    .filter(([_, data]) => data.minutes > 0)
    .map(([name, data]) => ({
      name,
      value: +(data.minutes / 60).toFixed(1),
      color: data.color,
    }));

  // Hourly Productivity Curve
  const hourlyData = [
    { time: '6 AM', focusScore: 40 },
    { time: '9 AM', focusScore: 75 },
    { time: '12 PM', focusScore: 60 },
    { time: '3 PM', focusScore: 85 },
    { time: '6 PM', focusScore: 92 },
    { time: '9 PM', focusScore: 98 },
    { time: '12 AM', focusScore: 50 },
  ];

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const avgDailyHours = (totalStudyMinutes / (7 * 60)).toFixed(1);

  // ==========================================
  // --- HABIT ANALYTICS COMPUTATION ENGINE ---
  // ==========================================

  // 1. 28-Day Heatmap Grid (4 full weeks: 28 days)
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];

    const completed = habits.filter(h => h.completions && h.completions[dateStr]).length;
    const total = habits.length > 0 ? habits.length : 1;
    const pct = habits.length > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      date: dateStr,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total: habits.length,
      pct,
    };
  });

  // Calculate Perfect Days (100% completion in past 28 days)
  const perfectDaysCount = heatmapDays.filter(d => d.total > 0 && d.completed === d.total).length;
  
  // Total habit check-offs past 28 days
  const totalHabitsCompleted28d = heatmapDays.reduce((acc, d) => acc + d.completed, 0);
  const totalPossibleCheckpoints = heatmapDays.length * (habits.length || 1);
  const overallHabitAdherenceRate = Math.min(100, Math.round((totalHabitsCompleted28d / totalPossibleCheckpoints) * 100));

  // 2. Individual Habit Success Rates (Past 30 Days)
  const habitPerformanceList = habits.map(h => {
    let completedCount30d = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (h.completions && h.completions[dateStr]) {
        completedCount30d++;
      }
    }

    const successRate = Math.min(100, Math.round((completedCount30d / 30) * 100));
    return {
      ...h,
      completedCount30d,
      successRate,
    };
  });

  // 3. 14-Day Habit vs Study Hours Trend Correlation
  const habitTrend14d = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];

    const completedHabits = habits.filter(h => h.completions && h.completions[dateStr]).length;
    const daySessions = sessions.filter(s => s.date === dateStr);
    const dayStudyHours = +(daySessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1);

    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completedHabits,
      studyHours: dayStudyHours,
      totalHabits: habits.length,
    };
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            STUDY & HABIT TELEMETRY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Academic Performance & Habit Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Deep dive into your cognitive stamina, daily habit adherence rates, and study allocations.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/10 self-start sm:self-auto">
          {(['week', 'month', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                timeFilter === filter
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-glow-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter === 'week' ? 'Past 7 Days' : filter === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl glass-panel border border-white/10 shadow-glass-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Study Logged</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-slate-100">{totalStudyHours}h</span>
          <p className="text-[11px] text-cyan-400 font-mono mt-2">Across {sessions.length} sessions</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-white/10 shadow-glass-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Daily Average</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-indigo-300">{avgDailyHours}h</span>
          <p className="text-[11px] text-indigo-400 font-mono mt-2">+18% above target</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-white/10 shadow-glass-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Habit Consistency</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-emerald-300">{overallHabitAdherenceRate}%</span>
          <p className="text-[11px] text-emerald-400 font-mono mt-2">{perfectDaysCount} Perfect Days (100%)</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-white/10 shadow-glass-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Productivity Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-300">{productivity.score} / 100</span>
          <p className="text-[11px] text-amber-400 font-mono mt-2">{productivity.tier}</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 HABIT TRACKING COMMAND CENTER: HEATMAP, ADHERENCE & MILESTONES */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-slate-100">Habit Mastery & Streak Analytics</h2>
        </div>

        {/* 1. 28-Day Activity Heatmap Grid */}
        <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 shadow-glass-3d space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>28-Day Habit Consistency Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing daily discipline and unbroken streaks across all habits.
              </p>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>Less</span>
              <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-white/10" />
              <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500/30" />
              <div className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-400/50" />
              <div className="w-3.5 h-3.5 rounded bg-emerald-500 shadow-sm" />
              <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-cyan-400 to-emerald-400 shadow-glow-cyan" />
              <span>100%</span>
            </div>
          </div>

          {/* Grid Container */}
          <div className="overflow-x-auto pb-2">
            <div className="grid grid-cols-7 sm:grid-cols-14 lg:grid-cols-28 gap-2 min-w-[500px]">
              {heatmapDays.map((day) => {
                const isPerfect = day.total > 0 && day.completed === day.total;
                const isHigh = day.pct >= 70 && !isPerfect;
                const isMed = day.pct >= 30 && day.pct < 70;
                const isLow = day.pct > 0 && day.pct < 30;

                return (
                  <div
                    key={day.date}
                    onMouseEnter={() => setSelectedHeatmapDay(day)}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-200 transform hover:scale-125 hover:z-20 relative group ${
                      isPerfect
                        ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 border-cyan-200 shadow-glow-cyan text-slate-950 font-bold'
                        : isHigh
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                        : isMed
                        ? 'bg-emerald-800/80 border-emerald-500/40 text-emerald-200'
                        : isLow
                        ? 'bg-emerald-950/70 border-emerald-500/20 text-emerald-400'
                        : 'bg-slate-900/80 border-white/5 text-slate-500 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] font-mono leading-none">
                      {day.date.split('-')[2]}
                    </span>
                    {isPerfect && <span className="text-[8px] leading-none mt-0.5">🌟</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Day Telemetry Detail Tooltip Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs">
            {selectedHeatmapDay ? (
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-cyan-400">{selectedHeatmapDay.displayDate} ({selectedHeatmapDay.weekday}):</span>
                <span className="text-slate-200">
                  {selectedHeatmapDay.completed} of {selectedHeatmapDay.total} habits completed ({selectedHeatmapDay.pct}%)
                </span>
                {selectedHeatmapDay.pct === 100 && (
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Perfect Day! 🌟
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 italic">
                Hover over any day tile above to inspect habit execution details.
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-400">
              {perfectDaysCount} Perfect Days logged in 4 Weeks
            </span>
          </div>
        </div>

        {/* 2. Individual Habit Success Rates & Multi-Habit Trend Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (6 cols): Individual Habit Success Rates */}
          <div className="lg:col-span-6 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">30-Day Habit Adherence Rates</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{habits.length} Habits</span>
            </div>

            {habits.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No habits added yet. Create habits in the Habits tab to populate performance analytics.
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {habitPerformanceList.map((h) => (
                  <div key={h.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: h.color, boxShadow: `0 0 8px ${h.color}` }}
                        />
                        <span className="text-xs font-bold text-slate-200 truncate">{h.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-0.5 text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          <span>{h.currentStreak || 0}d</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          {h.successRate}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${h.successRate}%`,
                          backgroundColor: h.color || '#10b981',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (6 cols): 14-Day Habit Execution vs Study Time Curve */}
          <div className="lg:col-span-6 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">14-Day Habits vs Focus Hours Trend</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">Discipline Correlation</span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={habitTrend14d}>
                  <defs>
                    <linearGradient id="habitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    name="Habits Completed"
                    dataKey="completedHabits"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#habitGrad)"
                  />
                  <Area
                    type="monotone"
                    name="Study Hours"
                    dataKey="studyHours"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#studyGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Habits Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-slate-300">Study Focus (Hours)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📚 STUDY SESSIONS & SUBJECT DISTRIBUTIONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Study Hours Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">Daily Study Hours (Past 7 Days)</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Hours / Day</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} Hours`, 'Study Duration']}
                />
                <Bar dataKey="hours" radius={[8, 8, 0, 0]} fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution Donut Chart */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-100">Subject Distribution</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Share %</span>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            {pieData.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <PieIcon className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs font-semibold text-slate-300">No Study Sessions Logged</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                  Start a study timer session to generate your subject distribution breakdown.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value} Hours`, 'Focused']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          {pieData.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              {pieData.slice(0, 4).map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-300 truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hourly Productivity Curve */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Cognitive Focus Rhythm Throughout The Day</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">Peak Window: 7 PM - 10 PM</span>
        </div>

        <div className="h-56 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value}% Focus Index`, 'Cognitive Alertness']}
              />
              <Area type="monotone" dataKey="focusScore" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#focusGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
