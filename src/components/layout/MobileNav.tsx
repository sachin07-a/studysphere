import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  Flame, 
  CheckSquare, 
  BarChart3, 
  Menu, 
  BookOpen, 
  Target, 
  Calendar, 
  FileText, 
  Award, 
  Settings, 
  Brain,
  FileSpreadsheet,
  Calculator,
  Users,
  ScrollText,
  X 
} from 'lucide-react';
import { useStudy, ActiveView } from '../../context/StudyContext';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, isTimerRunning, setIsReportCardOpen } = useStudy();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainTabs: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'exams', label: 'Exams', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  const moreTabs: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'pdf-reader', label: 'PDF Reader', icon: FileSpreadsheet },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'achievements', label: 'Badges', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* More Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="absolute bottom-20 left-4 right-4 rounded-3xl glass-panel p-5 border border-white/15 shadow-2xl max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-sm font-bold text-slate-100">All Academic Tools</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Report Card Action */}
            <button
              onClick={() => {
                setIsReportCardOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full mb-3 py-2 px-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <ScrollText className="w-4 h-4" />
              <span>Open Weekly Report Card 📜</span>
            </button>

            <div className="grid grid-cols-3 gap-2.5">
              {moreTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveView(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow-cyan font-bold'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-medium truncate w-full">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Glass Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-panel border-t border-white/10 px-3 py-2">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            const isTimer = tab.id === 'timer';

            if (isTimer) {
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView('timer')}
                  className="relative -top-5 flex flex-col items-center"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                    isTimerRunning
                      ? 'bg-gradient-to-tr from-cyan-500 to-indigo-600 border-cyan-300 shadow-glow-cyan animate-pulse text-slate-950 font-bold'
                      : 'bg-gradient-to-tr from-cyan-600 to-indigo-700 border-white/20 text-white shadow-xl hover:scale-105'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-cyan-400">
                    {isTimerRunning ? 'RUNNING' : 'TIMER'}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  isActive ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isMenuOpen ? 'text-purple-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </div>
    </>
  );
};
