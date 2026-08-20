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
  Activity
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
  Area 
} from 'recharts';
import { useStudy } from '../../context/StudyContext';

export const AnalyticsView: React.FC = () => {
  const { sessions, subjects, productivity, aiInsights } = useStudy();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');

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

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            STUDY TELEMETRY & METRICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Academic Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Deep dive into your cognitive stamina, focus trends, and subject allocations.
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
            <span className="text-xs font-semibold text-slate-400 uppercase">Productivity Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-300">{productivity.score} / 100</span>
          <p className="text-[11px] text-amber-400 font-mono mt-2">{productivity.tier}</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel border border-white/10 shadow-glass-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Top Subject</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-lg font-bold text-purple-200 line-clamp-1">{pieData[0]?.name || 'Algorithms'}</span>
          <p className="text-[11px] text-purple-400 font-mono mt-2">{pieData[0]?.value || 16.5}h Focused</p>
        </div>
      </div>

      {/* Main Charts Grid */}
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
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            {pieData.slice(0, 4).map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
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
