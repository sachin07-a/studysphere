import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  BookOpen, 
  Flame, 
  CheckSquare, 
  Target, 
  BarChart3, 
  Calendar, 
  FileText, 
  Award, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Volume2
} from 'lucide-react';
import { useStudy, ActiveView } from '../../context/StudyContext';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    isTimerRunning, 
    tasks, 
    habits, 
    setIsFocusMode,
    activeAmbient 
  } = useStudy();
  
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingHabitsCount = habits.filter(h => !h.completions || !h.completions[todayStr]).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'timer', 
      label: 'Study Timer', 
      icon: Timer, 
      badge: isTimerRunning ? 'RUNNING' : undefined,
      badgeColor: 'bg-cyan-500 text-slate-950 animate-pulse font-bold'
    },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { 
      id: 'habits', 
      label: 'Habits & Streaks', 
      icon: Flame, 
      badge: pendingHabitsCount > 0 ? `${pendingHabitsCount} left` : '✓',
      badgeColor: pendingHabitsCount > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: CheckSquare, 
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between border-r border-white/10 glass-panel transition-all duration-300 relative z-20 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="p-4 space-y-4">
        {/* Focus Mode & Ambient Quick Launcher Card */}
        {!isCollapsed ? (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900/80 border border-indigo-500/30 shadow-glow-blue flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Focus Zen Room</span>
              </div>
              <p className="text-[10px] text-slate-400">Zero distractions</p>
            </div>
            <button
              onClick={() => setIsFocusMode(true)}
              className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-all hover:scale-105"
            >
              Enter
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsFocusMode(true)}
            className="w-full p-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 flex items-center justify-center border border-indigo-500/30 transition-all hover:scale-105"
            title="Enter Focus Mode"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-glow-cyan" />
                )}

                <div className={`p-1 rounded-lg transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & Ambient Indicator */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {activeAmbient && !isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300 animate-pulse">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span className="capitalize">{activeAmbient} Playing</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border border-white/5 transition-colors text-xs"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
