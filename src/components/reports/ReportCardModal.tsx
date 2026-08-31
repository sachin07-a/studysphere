import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Flame, 
  CheckSquare, 
  Calendar,
  Zap
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useAuth } from '../../context/AuthContext';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { 
    sessions, 
    habits, 
    tasks, 
    subjects, 
    productivity,
    triggerConfetti 
  } = useStudy();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculate Past 7 Days Metrics
  const now = new Date();
  const weekStart = new Date();
  weekStart.setDate(now.getDate() - 6);

  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = now.toISOString().split('T')[0];

  const weeklySessions = sessions.filter(s => s.date >= weekStartStr && s.date <= weekEndStr);
  const totalWeeklyStudyMinutes = weeklySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalWeeklyStudyHours = (totalWeeklyStudyMinutes / 60).toFixed(1);

  const completedWeeklyTasks = tasks.filter(t => t.completed && t.completedAt && t.completedAt.split('T')[0] >= weekStartStr).length;
  const totalWeeklyTasks = tasks.filter(t => t.dueDate >= weekStartStr && t.dueDate <= weekEndStr).length || 1;

  // Overall Weekly Letter Grade Evaluation
  let weeklyGrade = 'A';
  let gradeRemarks = 'Exceptional cognitive discipline and target execution.';
  if (productivity.score >= 90) {
    weeklyGrade = 'A+';
    gradeRemarks = 'Summa Cum Laude performance! All study milestones surpassed.';
  } else if (productivity.score >= 82) {
    weeklyGrade = 'A';
    gradeRemarks = 'Outstanding focus depth and consistent habit adherence.';
  } else if (productivity.score >= 74) {
    weeklyGrade = 'B+';
    gradeRemarks = 'Strong momentum. Elevate review time on secondary subjects.';
  } else if (productivity.score >= 65) {
    weeklyGrade = 'B';
    gradeRemarks = 'Good effort. Solidify daily study routine consistency.';
  } else {
    weeklyGrade = 'C+';
    gradeRemarks = 'Building initial momentum. Increase daily Pomodoro sessions.';
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# StudySphere Academic Report Card\n` +
      `**Student**: ${user?.name || 'Scholar'} (${user?.major || 'General Studies'})\n` +
      `**Period**: ${weekStartStr} to ${weekEndStr}\n` +
      `**Weekly Grade**: ${weeklyGrade} (Productivity Score: ${productivity.score}/100)\n` +
      `**Total Study Time**: ${totalWeeklyStudyHours} Hours\n` +
      `**Daily Streak**: ${user?.streakCount || 0} Days Unbroken\n` +
      `**Tasks Completed**: ${completedWeeklyTasks} / ${totalWeeklyTasks}\n\n` +
      `*Generated with StudySphere 3D Academic Suite*`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-white/20 shadow-glass-3d space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-0 print:bg-white print:text-black">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">Official Weekly Academic Report</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied MD' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-glow-cyan transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Sheet */}
        <div className="space-y-6 print:space-y-4">
          {/* Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-white/10 print:bg-slate-100 print:text-black">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌌</span>
                <span className="font-extrabold text-base tracking-tight text-cyan-400 print:text-indigo-600">
                  StudySphere Academic Suite
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-100 print:text-black mt-1">
                {user?.name || 'Scholar'}
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-600 font-mono">
                {user?.major || 'Computer Science'} • {user?.academicYear || 'Freshman'} • Term 2026
              </p>
            </div>

            {/* Big Letter Grade Pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 print:text-slate-600">
                  Evaluated Grade
                </span>
                <p className="text-xs font-semibold text-emerald-400 print:text-emerald-700">
                  {productivity.tier.split(' ')[0]}
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-mono font-extrabold text-3xl flex items-center justify-center shadow-glow-amber print:shadow-none">
                {weeklyGrade}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-400 print:text-slate-600">Total Focus</span>
              <p className="text-xl font-bold font-mono text-cyan-400 print:text-indigo-700 mt-0.5">{totalWeeklyStudyHours}h</p>
              <span className="text-[9px] text-slate-500 print:text-slate-600">Past 7 Days</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-400 print:text-slate-600">Productivity</span>
              <p className="text-xl font-bold font-mono text-purple-400 print:text-purple-700 mt-0.5">{productivity.score}/100</p>
              <span className="text-[9px] text-slate-500 print:text-slate-600">Score Rating</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-400 print:text-slate-600">Daily Streak</span>
              <p className="text-xl font-bold font-mono text-amber-400 print:text-amber-700 mt-0.5">{user?.streakCount || 0}d</p>
              <span className="text-[9px] text-slate-500 print:text-slate-600">Unbroken 🔥</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-slate-300">
              <span className="text-[10px] font-mono uppercase text-slate-400 print:text-slate-600">Scholar XP</span>
              <p className="text-xl font-bold font-mono text-emerald-400 print:text-emerald-700 mt-0.5">+{user?.xp || 2400}</p>
              <span className="text-[9px] text-slate-500 print:text-slate-600">Total Points</span>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black">
              Subject Study Hours Distribution
            </h3>
            <div className="border border-white/10 rounded-2xl overflow-hidden print:border-slate-300">
              <div className="grid grid-cols-12 bg-slate-900/80 p-2.5 text-[11px] font-mono text-slate-400 font-bold border-b border-white/10 print:bg-slate-200 print:text-black">
                <div className="col-span-6">Subject / Course</div>
                <div className="col-span-3 text-center">Weekly Target</div>
                <div className="col-span-3 text-right">Hours Logged</div>
              </div>
              <div className="divide-y divide-white/5 print:divide-slate-200">
                {subjects.map((sub) => (
                  <div key={sub.id} className="grid grid-cols-12 p-2.5 text-xs text-slate-200 print:text-black items-center">
                    <div className="col-span-6 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }} />
                      <span>{sub.name}</span>
                    </div>
                    <div className="col-span-3 text-center font-mono text-slate-400 print:text-slate-600">{sub.weeklyGoalHours}h</div>
                    <div className="col-span-3 text-right font-mono font-bold text-cyan-400 print:text-indigo-700">
                      {(sub.completedMinutesThisWeek / 60).toFixed(1)}h
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Mentor Evaluation Summary */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5 print:bg-slate-100 print:border-slate-300">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 print:text-indigo-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Academic Mentor Evaluation</span>
            </div>
            <p className="text-xs text-slate-300 print:text-black leading-relaxed">
              "{gradeRemarks} Daily habit consistency is currently ranking in the top 5% of active scholars. Recommendation for upcoming term: allocate 1 additional 45-minute focus session toward core problem sets."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
