import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Clock, 
  Calendar, 
  Play, 
  Trash2, 
  Sparkles, 
  Award,
  CheckCircle,
  X
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Subject } from '../../types';

export const SubjectsView: React.FC = () => {
  const { subjects, addSubject, deleteSubject, setActiveView, setSelectedSubjectId, tasks } = useStudy();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('BookOpen');
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(12);
  const [examDate, setExamDate] = useState('');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSubject({
      name: name.trim(),
      code: code.trim().toUpperCase() || 'SUB-101',
      color,
      icon,
      weeklyGoalHours,
      examDate: examDate || undefined,
    });

    setName('');
    setCode('');
    setIsAddModalOpen(false);
  };

  const startSubjectTimer = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveView('timer');
  };

  const colorPresets = ['#6366f1', '#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#ec4899'];
  const iconPresets = ['BookOpen', 'Code', 'Brain', 'Cpu', 'Globe', 'Sigma', 'Compass', 'Atom'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            CURRICULUM & SUBJECT MATRIX
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Academic Subjects & Targets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track your weekly study allocations, exam dates, and course mastery.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-glow-cyan flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Subject</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (Icons as any)[sub.icon] || Icons.BookOpen;
          const completedHours = (sub.completedMinutesThisWeek / 60).toFixed(1);
          const totalHours = (sub.totalStudyMinutes / 60).toFixed(1);
          const percent = Math.min(100, Math.round((sub.completedMinutesThisWeek / (sub.weeklyGoalHours * 60)) * 100));
          const remainingMinutes = Math.max(0, sub.weeklyGoalHours * 60 - sub.completedMinutesThisWeek);
          const remainingHours = (remainingMinutes / 60).toFixed(1);

          const subjectPendingTasks = tasks.filter(t => t.subjectId === sub.id && !t.completed).length;

          return (
            <div
              key={sub.id}
              className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-cyan-500/40 shadow-glass-card hover:shadow-glow-cyan transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Top Row */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: `${sub.color}25`, color: sub.color, border: `1px solid ${sub.color}50` }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {sub.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 line-clamp-1">{sub.name}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSubject(sub.id)}
                    className="text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Exam Alert Tag (If exists) */}
                {sub.examDate && (
                  <div className="mb-4 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Exam Date: {sub.examDate}</span>
                    </span>
                  </div>
                )}

                {/* Progress Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Weekly Target</span>
                    <span className="text-sm font-mono font-bold text-slate-100">
                      {completedHours}h / {sub.weeklyGoalHours}h
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${percent}%`, backgroundColor: sub.color }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{percent}% Finished</span>
                    <span>{remainingHours}h remaining</span>
                  </div>
                </div>

                {/* Subject Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/60 border border-white/5 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Focus</span>
                    <span className="font-mono font-bold text-cyan-300">{totalHours} Hours</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pending Tasks</span>
                    <span className="font-mono font-bold text-indigo-300">{subjectPendingTasks} Tasks</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Launch Timer */}
              <button
                onClick={() => startSubjectTimer(sub.id)}
                className="w-full py-2.5 rounded-2xl bg-slate-800/90 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-600 hover:text-white text-slate-200 border border-white/10 hover:border-transparent text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-glow-cyan"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Focus Session</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Add Academic Subject</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CS-440"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Weekly Target (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={weeklyGoalHours}
                    onChange={(e) => setWeeklyGoalHours(parseInt(e.target.value) || 10)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upcoming Exam Date (Optional)</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color Theme</label>
                <div className="flex items-center gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-xl transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-glow-cyan hover:scale-105 transition-transform"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
