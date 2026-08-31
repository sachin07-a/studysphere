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
  Brain,
  Layers,
  Calculator,
  Users,
  ScrollText,
  FileSpreadsheet
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
    flashcards,
    exams,
    setIsFocusMode,
    setIsReportCardOpen
  } = useStudy();
  
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingHabitsCount = habits.filter(h => !h.completions || !h.completions[todayStr]).length;
  const dueCardsCount = flashcards.filter(c => !c.dueDate || c.dueDate <= todayStr).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'timer', 
      label: 'Study Timer', 
      icon: Timer, 
      badge: isTimerRunning ? 'ACTIVE' : undefined,
      badgeColor: 'bg-cyan-500 text-slate-950 animate-pulse font-bold'
    },
    { 
      id: 'flashcards', 
      label: 'Flashcards (SM-2)', 
      icon: Brain,
      badge: dueCardsCount > 0 ? `${dueCardsCount} due` : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300'
    },
    { 
      id: 'exams', 
      label: 'Exams & Syllabus', 
      icon: Target,
      badge: exams.length > 0 ? exams.length : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    { id: 'pdf-reader', label: 'PDF Lecture Reader', icon: FileSpreadsheet },
    { id: 'gpa-calc', label: 'GPA & Grade Simulator', icon: Calculator },
    { id: 'study-room', label: 'Virtual Study Lobby', icon: Users },
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
    { id: 'goals', label: 'Goals', icon: Layers },
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
      <div className="p-4 space-y-4 max-h-[calc(100vh-65px)] overflow-y-auto pr-2">
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
        ) : null}

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Weekly Report Card Trigger */}
        {!isCollapsed && (
          <button
            onClick={() => setIsReportCardOpen(true)}
            className="w-full py-2 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            <ScrollText className="w-4 h-4 text-amber-400" />
            <span>Weekly Report Card 📜</span>
          </button>
        )}
      </div>

      {/* Collapse / Expand Toggle Button */}
      <div className="p-3 border-t border-white/10 flex items-center justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors border border-white/5"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
};
