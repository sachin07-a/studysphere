import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Sparkles,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const CalendarView: React.FC = () => {
  const { sessions, tasks, subjects } = useStudy();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Blank padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Days of month
  for (let d = 1; d <= totalDays; d++) {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = d.toString().padStart(2, '0');
    calendarDays.push(`${year}-${monthStr}-${dayStr}`);
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get events for selected date
  const selectedSessions = sessions.filter(s => s.date === selectedDate);
  const selectedTasks = tasks.filter(t => t.dueDate === selectedDate || t.completedAt?.startsWith(selectedDate));
  const selectedExams = subjects.filter(sub => sub.examDate === selectedDate);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            ACADEMIC SCHEDULE & CALENDAR
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Study Schedule & Deadlines
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            View upcoming exams, deadlines, and past study session telemetry.
          </p>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel border border-white/10">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-100 min-w-[130px] text-center font-mono">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Calendar Grid | Right Selected Day Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center pb-2 border-b border-white/10 text-xs font-mono font-semibold text-slate-400">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`blank-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-slate-900/20" />;
              }

              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const dayNum = parseInt(dateStr.split('-')[2]);

              const daySessions = sessions.filter(s => s.date === dateStr);
              const dayTasks = tasks.filter(t => t.dueDate === dateStr);
              const dayExams = subjects.filter(s => s.examDate === dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-glow-cyan'
                      : isToday
                      ? 'bg-indigo-950/40 border-indigo-500/40'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${
                      isToday ? 'text-cyan-400' : isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  {/* Event Badges */}
                  <div className="space-y-1 overflow-hidden w-full">
                    {dayExams.length > 0 && (
                      <div className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-500/40 truncate font-semibold">
                        Exam: {dayExams[0].code}
                      </div>
                    )}
                    {daySessions.length > 0 && (
                      <div className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 truncate font-mono">
                        ⏱ {daySessions.reduce((acc, s) => acc + s.durationMinutes, 0)}m focus
                      </div>
                    )}
                    {dayTasks.length > 0 && (
                      <div className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 truncate font-mono">
                        📋 {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Timeline Details */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Selected Schedule</span>
              <h3 className="text-base font-bold text-slate-100 font-mono">
                {selectedDate}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
              {selectedSessions.length + selectedTasks.length + selectedExams.length} Events
            </span>
          </div>

          {/* Exams */}
          {selectedExams.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-rose-400 tracking-wider">
                Exams & Milestones
              </span>
              {selectedExams.map(exam => (
                <div key={exam.id} className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs space-y-1">
                  <p className="font-bold">{exam.name} Exam</p>
                  <p className="text-[10px] opacity-75">Target: 95%+ Mastery</p>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Due Today */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider">
              Tasks & Deadlines
            </span>
            {selectedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No tasks due on this date.</p>
            ) : (
              selectedTasks.map(t => (
                <div key={t.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs flex items-center justify-between">
                  <div className="truncate mr-2">
                    <p className={`font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'} truncate`}>
                      {t.title}
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{t.priority} Priority</span>
                  </div>
                  {t.completed && <span className="text-emerald-400 font-bold text-xs">✓</span>}
                </div>
              ))
            )}
          </div>

          {/* Completed Study Sessions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase text-cyan-400 tracking-wider">
              Study Sessions Logged
            </span>
            {selectedSessions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No study sessions recorded.</p>
            ) : (
              selectedSessions.map(s => (
                <div key={s.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{s.topic || s.subjectName}</span>
                    <span className="font-mono text-cyan-400 font-bold">{s.durationMinutes}m</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{s.subjectName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
