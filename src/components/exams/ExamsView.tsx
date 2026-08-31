import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  MapPin,
  ListOrdered
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Exam, SyllabusUnit } from '../../types';

export const ExamsView: React.FC = () => {
  const { exams, subjects, addExam, deleteExam, toggleSyllabusUnit } = useStudy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [examSubjectId, setExamSubjectId] = useState(subjects[0]?.id || '');
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('09:00');
  const [examLocation, setExamLocation] = useState('');
  const [examTargetGrade, setExamTargetGrade] = useState('A');
  const [examWeight, setExamWeight] = useState(30);
  const [syllabusInput, setSyllabusInput] = useState('');

  // Live timer tick for countdowns
  const [nowTime, setNowTime] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateCountdown = (targetDateStr: string, timeStr = '09:00') => {
    const target = new Date(`${targetDateStr}T${timeStr}:00`).getTime();
    const diff = target - nowTime;

    if (diff <= 0) {
      return { days: 0, hours: 0, mins: 0, secs: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, mins, secs, isPast: false };
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !examDate) return;

    const subject = subjects.find(s => s.id === examSubjectId);

    const units: SyllabusUnit[] = syllabusInput
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((name, i) => ({
        id: 'u_' + Date.now() + '_' + i,
        name,
        completed: false,
        estimatedHours: 4
      }));

    addExam({
      subjectId: examSubjectId,
      subjectName: subject?.name || 'General Course',
      title: examTitle.trim(),
      examDate,
      startTime: examTime,
      location: examLocation.trim() || undefined,
      targetGrade: examTargetGrade,
      weightPercent: examWeight,
      syllabusUnits: units
    });

    setExamTitle('');
    setExamDate('');
    setExamLocation('');
    setSyllabusInput('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
            EXAM COUNTDOWN & SYLLABUS ROADMAP
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            High-Stakes Examination Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track live exam countdowns, syllabus unit mastery, and calculated exam readiness scores.
          </p>
        </div>

        <button
          onClick={() => {
            if (subjects.length > 0) setExamSubjectId(subjects[0].id);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs font-bold shadow-glow-rose flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Exam</span>
        </button>
      </div>

      {/* Exams Grid */}
      {exams.length === 0 ? (
        <div className="rounded-3xl glass-panel p-12 text-center border border-white/10 shadow-glass-3d space-y-4">
          <Target className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-100">No Target Exams Scheduled</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add your upcoming midterms, finals, or certification tests to unlock real-time countdown tickers and syllabus checklists.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-glow-rose transition-all"
          >
            Add Your First Exam
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {exams.map((exam) => {
            const cd = calculateCountdown(exam.examDate, exam.startTime);
            const totalUnits = exam.syllabusUnits.length;
            const completedUnits = exam.syllabusUnits.filter(u => u.completed).length;
            const syllabusProgress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

            const isUrgent = !cd.isPast && cd.days <= 3;
            const isApproaching = !cd.isPast && cd.days > 3 && cd.days <= 7;

            return (
              <div
                key={exam.id}
                className={`rounded-3xl glass-panel p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden shadow-glass-3d ${
                  isUrgent 
                    ? 'border-rose-500/50 bg-gradient-to-r from-rose-950/20 via-slate-900/80 to-slate-900/90 shadow-glow-rose'
                    : isApproaching
                    ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900/90 shadow-glow-amber'
                    : 'border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Exam Details & Live Countdown Ticker */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          {exam.subjectName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          Weight: {exam.weightPercent}%
                        </span>
                      </div>

                      <button
                        onClick={() => deleteExam(exam.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                        title="Delete exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-slate-100">{exam.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{exam.examDate}</span>
                        </span>
                        {exam.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>{exam.startTime}</span>
                          </span>
                        )}
                        {exam.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-purple-400" />
                            <span>{exam.location}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Countdown Ticker Box */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex items-center justify-around text-center">
                      {cd.isPast ? (
                        <span className="text-xs font-bold text-slate-400 font-mono">Exam Concluded</span>
                      ) : (
                        <>
                          <div>
                            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
                              {cd.days}
                            </span>
                            <span className="block text-[9px] font-mono uppercase text-slate-400">Days</span>
                          </div>
                          <span className="text-xl text-slate-600 font-mono">:</span>
                          <div>
                            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">
                              {String(cd.hours).padStart(2, '0')}
                            </span>
                            <span className="block text-[9px] font-mono uppercase text-slate-400">Hours</span>
                          </div>
                          <span className="text-xl text-slate-600 font-mono">:</span>
                          <div>
                            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
                              {String(cd.mins).padStart(2, '0')}
                            </span>
                            <span className="block text-[9px] font-mono uppercase text-slate-400">Mins</span>
                          </div>
                          <span className="text-xl text-slate-600 font-mono">:</span>
                          <div>
                            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">
                              {String(cd.secs).padStart(2, '0')}
                            </span>
                            <span className="block text-[9px] font-mono uppercase text-slate-400">Secs</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Syllabus Checklist & Readiness Progress */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span>Syllabus Mastery Checklist</span>
                      </span>
                      <span className="font-mono font-bold text-cyan-400">
                        {syllabusProgress}% Complete ({completedUnits}/{totalUnits})
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${syllabusProgress}%` }}
                      />
                    </div>

                    {/* Syllabus Units List */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {exam.syllabusUnits.map((unit) => (
                        <div
                          key={unit.id}
                          onClick={() => toggleSyllabusUnit(exam.id, unit.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            unit.completed
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <span className={`truncate mr-2 ${unit.completed ? 'line-through opacity-75' : 'font-semibold text-slate-200'}`}>
                            {unit.name}
                          </span>
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                            unit.completed ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600'
                          }`}>
                            {unit.completed ? '✓' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Exam */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <form onSubmit={handleCreateExam} className="w-full max-w-lg rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <span>Schedule Target Exam</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <select
                value={examSubjectId}
                onChange={(e) => setExamSubjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Title</label>
              <input
                type="text"
                required
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="e.g. Final Examination & Coding Project"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Date</label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                <input
                  type="time"
                  value={examTime}
                  onChange={(e) => setExamTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Room</label>
                <input
                  type="text"
                  value={examLocation}
                  onChange={(e) => setExamLocation(e.target.value)}
                  placeholder="e.g. Hall 402 / Online"
                  className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Grade Weight (%)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={examWeight}
                  onChange={(e) => setExamWeight(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Syllabus Chapters / Units (One per line)
              </label>
              <textarea
                rows={4}
                value={syllabusInput}
                onChange={(e) => setSyllabusInput(e.target.value)}
                placeholder="Unit 1: Graph Traversal & Topological Sort&#10;Unit 2: Dynamic Programming Recurrences&#10;Unit 3: Greedy Proofs & Matroids"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-400 font-mono text-[11px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-glow-rose hover:scale-105 transition-all"
              >
                Save Exam
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
