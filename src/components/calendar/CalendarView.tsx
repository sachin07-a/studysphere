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
  X,
  Target,
  CheckSquare,
  AlertCircle,
  Tag,
  Trash2,
  Flame,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Priority } from '../../types';

export const CalendarView: React.FC = () => {
  const { sessions, tasks, subjects, exams, addTask, toggleTask, deleteTask, triggerConfetti } = useStudy();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // New Event / Task Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventPriority, setEventPriority] = useState<Priority>('high');
  const [eventSubjectId, setEventSubjectId] = useState(subjects[0]?.id || '');
  const [eventDescription, setEventDescription] = useState('');

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
  const selectedExams = exams.filter(e => e.examDate === selectedDate);
  const selectedSubjectExams = subjects.filter(sub => sub.examDate === selectedDate);

  const handleOpenAddEventModal = (presetDate?: string) => {
    const targetDate = presetDate || selectedDate || new Date().toISOString().split('T')[0];
    setEventDate(targetDate);
    if (subjects.length > 0 && !eventSubjectId) {
      setEventSubjectId(subjects[0].id);
    }
    setIsAddEventOpen(true);
  };

  const handleCreateEventAsTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) return;

    addTask({
      title: eventTitle.trim(),
      description: eventDescription.trim() || undefined,
      dueDate: eventDate,
      priority: eventPriority,
      subjectId: eventSubjectId || undefined,
      completed: false,
      subtasks: []
    });

    triggerConfetti();
    setSelectedDate(eventDate);
    setEventTitle('');
    setEventDescription('');
    setIsAddEventOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            ACADEMIC SCHEDULE & CALENDAR
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Study Schedule & Event Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Schedule upcoming academic events, milestones, and track tasks directly on your calendar.
          </p>
        </div>

        {/* Action Controls: Add Event & Month Navigator */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => handleOpenAddEventModal()}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event / Task</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel border border-white/10">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-100 min-w-[130px] text-center font-mono">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Calendar Grid | Right Selected Day Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Grid (8 cols) */}
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
                return <div key={`blank-${idx}`} className="h-20 sm:h-24 rounded-2xl bg-slate-900/20 border border-transparent" />;
              }

              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const dayNum = parseInt(dateStr.split('-')[2]);

              const daySessions = sessions.filter(s => s.date === dateStr);
              const dayTasks = tasks.filter(t => t.dueDate === dateStr);
              const dayExams = exams.filter(e => e.examDate === dateStr);
              const daySubjectExams = subjects.filter(s => s.examDate === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  onDoubleClick={() => handleOpenAddEventModal(dateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden cursor-pointer group ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-glow-cyan'
                      : isToday
                      ? 'bg-indigo-950/40 border-indigo-500/40'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                  title="Click to view details, double-click to schedule event"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${
                      isToday ? 'text-cyan-400 font-extrabold' : isSelected ? 'text-white font-extrabold' : 'text-slate-300'
                    }`}>
                      {dayNum}
                    </span>
                    <div className="flex items-center gap-1">
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAddEventModal(dateStr);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-opacity"
                        title="Add event on this day"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Event Badges */}
                  <div className="space-y-1 overflow-hidden w-full">
                    {(dayExams.length > 0 || daySubjectExams.length > 0) && (
                      <div className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-500/40 truncate font-semibold">
                        🎯 {dayExams[0]?.title || 'Target Exam'}
                      </div>
                    )}
                    {dayTasks.length > 0 && (
                      <div className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 truncate font-mono flex items-center gap-1">
                        <span>📋</span>
                        <span className="truncate">{dayTasks[0].title}</span>
                        {dayTasks.length > 1 && <span className="opacity-75">+{dayTasks.length - 1}</span>}
                      </div>
                    )}
                    {daySessions.length > 0 && (
                      <div className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 truncate font-mono">
                        ⏱ {daySessions.reduce((acc, s) => acc + s.durationMinutes, 0)}m focus
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Timeline Details & Action List (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Selected Date</span>
              <h3 className="text-base font-bold text-slate-100 font-mono">
                {selectedDate}
              </h3>
            </div>
            <button
              onClick={() => handleOpenAddEventModal(selectedDate)}
              className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          {/* Scheduled Tasks & Deadlines (Stored in User Data) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks & Events ({selectedTasks.length})</span>
              </span>
            </div>

            {selectedTasks.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-center space-y-2">
                <p className="text-xs text-slate-400 italic">No tasks or events scheduled for this date.</p>
                <button
                  onClick={() => handleOpenAddEventModal(selectedDate)}
                  className="text-xs text-cyan-400 font-semibold hover:underline"
                >
                  + Schedule an event now
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedTasks.map((t) => {
                  const subject = subjects.find(s => s.id === t.subjectId);
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 text-xs flex items-center justify-between gap-2 group hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                        <button
                          onClick={() => toggleTask(t.id)}
                          className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                          title={t.completed ? 'Mark incomplete' : 'Mark completed'}
                        >
                          {t.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                          )}
                        </button>

                        <div className="truncate">
                          <p className={`font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-slate-100'} truncate`}>
                            {t.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {subject && (
                              <span className="text-[9px] font-mono text-cyan-300">
                                {subject.name}
                              </span>
                            )}
                            <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                              t.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : t.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {t.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(t.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scheduled Target Exams */}
          {selectedExams.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-bold uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Target Exams ({selectedExams.length})</span>
              </span>
              {selectedExams.map(exam => (
                <div key={exam.id} className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs space-y-1">
                  <p className="font-bold">{exam.title}</p>
                  <p className="text-[10px] opacity-75 font-mono">{exam.subjectName} • Target: {exam.targetGrade}</p>
                </div>
              ))}
            </div>
          )}

          {/* Completed Study Sessions */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[11px] font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Study Sessions Logged</span>
            </span>
            {selectedSessions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No study sessions recorded on this date.</p>
            ) : (
              selectedSessions.map(s => (
                <div key={s.id} className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate">{s.topic || s.subjectName}</span>
                    <span className="font-mono text-cyan-400 font-bold">{s.durationMinutes}m</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{s.subjectName} • Rating: {s.productivityRating}★</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Schedule Event (Treated as Task and Stored in User Data) */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <form onSubmit={handleCreateEventAsTask} className="w-full max-w-md rounded-3xl glass-panel p-6 sm:p-7 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                <span>Schedule Academic Event & Task</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Event Title / Milestone Name
              </label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Operating Systems Project Presentation"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={eventPriority}
                  onChange={(e) => setEventPriority(e.target.value as Priority)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-bold"
                >
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Linked Course / Subject</label>
              <select
                value={eventSubjectId}
                onChange={(e) => setEventSubjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="">General Academic Task</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Notes (Optional)</label>
              <textarea
                rows={3}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Include room location, submission requirements, deliverables..."
                className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                This event will automatically be recorded as an active task in your persistent user data, synced with your streak tracker, and scheduled onto your calendar grid.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-glow-cyan hover:scale-105 transition-all"
              >
                Save Event & Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
