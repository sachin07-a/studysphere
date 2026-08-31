import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Award, 
  TrendingUp, 
  Sliders, 
  Check, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  Target,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { CourseGrade, CourseAssignment } from '../../types';

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D': 1.0,
  'F': 0.0
};

export const GPACalculatorView: React.FC = () => {
  const { gpaCourses, addGPACourse, deleteGPACourse, updateGPACourse } = useStudy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSimulatorCourseId, setSelectedSimulatorCourseId] = useState<string>(gpaCourses[0]?.id || '');
  
  // New course form state
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newTargetGrade, setNewTargetGrade] = useState('A');

  // Simulator state for active course
  const selectedCourse = gpaCourses.find(c => c.id === selectedSimulatorCourseId) || gpaCourses[0];

  // Calculate Cumulative Semester GPA
  let totalCredits = 0;
  let totalQualityPoints = 0;

  gpaCourses.forEach((c) => {
    const pts = GRADE_POINTS[c.targetGrade] ?? 3.5;
    totalCredits += c.credits;
    totalQualityPoints += pts * c.credits;
  });

  const calculatedGPA = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : '4.00';

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    addGPACourse({
      courseName: newCourseName.trim(),
      courseCode: newCourseCode.trim() || 'ACAD 100',
      credits: newCredits,
      targetGrade: newTargetGrade,
      assignments: [
        { id: 'asg_1', name: 'Midterm Examination', weight: 30, score: 88, maxScore: 100 },
        { id: 'asg_2', name: 'Projects & Labs', weight: 30, score: 92, maxScore: 100 },
        { id: 'asg_3', name: 'Quizzes & Participation', weight: 10, score: 95, maxScore: 100 },
        { id: 'asg_4', name: 'Final Examination', weight: 30, score: 0, maxScore: 100 }
      ]
    });

    setNewCourseName('');
    setNewCourseCode('');
    setIsAddModalOpen(false);
  };

  const handleAssignmentScoreChange = (assignmentId: string, newScore: number) => {
    if (!selectedCourse) return;
    const updatedAssignments = selectedCourse.assignments.map(a => 
      a.id === assignmentId ? { ...a, score: newScore } : a
    );
    updateGPACourse(selectedCourse.id, { assignments: updatedAssignments });
  };

  // Calculate Current Weighted Score & Required Final Exam Score for Target Grade
  let currentWeightedSum = 0;
  let completedWeightTotal = 0;
  let finalExamWeight = 0;

  if (selectedCourse) {
    selectedCourse.assignments.forEach(a => {
      if (a.name.toLowerCase().includes('final')) {
        finalExamWeight += a.weight;
      } else {
        completedWeightTotal += a.weight;
        currentWeightedSum += (a.score / a.maxScore) * a.weight;
      }
    });
  }

  // Target threshold (e.g. A = 93%, A- = 90%, B+ = 87%, B = 83%)
  const targetThresholdMap: Record<string, number> = {
    'A+': 97,
    'A': 93,
    'A-': 90,
    'B+': 87,
    'B': 83,
    'B-': 80,
    'C+': 77,
    'C': 73
  };

  const targetPercentage = targetThresholdMap[selectedCourse?.targetGrade || 'A'] || 90;
  const neededFromFinal = targetPercentage - currentWeightedSum;
  const requiredFinalExamScore = finalExamWeight > 0 
    ? Math.max(0, Math.min(100, Math.round((neededFromFinal / finalExamWeight) * 100)))
    : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            ACADEMIC GPA & GRADE SIMULATOR
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            GPA Calculator & "What-If" Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Calculate credit-weighted GPA and simulate the exact final exam scores needed to hit your target grades.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-glow-emerald flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Top GPA Overview Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-3xl glass-panel p-6 border border-emerald-500/30 bg-emerald-950/20 shadow-glow-emerald flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-emerald-400">Projected GPA</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold font-mono text-white">{calculatedGPA}</span>
              <span className="text-xs text-slate-400 font-mono">/ 4.00</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">Total Credits</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold font-mono text-white">{totalCredits}</span>
              <span className="text-xs text-slate-400 font-mono">Enrolled Credits</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/40">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-purple-400">Academic Standing</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold font-mono text-white">Dean's Honors List 🌟</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/40">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Enrolled Courses List */}
        <div className="lg:col-span-6 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">Enrolled Courses & Credit Weights</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{gpaCourses.length} Courses</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {gpaCourses.map((course) => {
              const isSelected = selectedSimulatorCourseId === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedSimulatorCourseId(course.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/25 border-emerald-500/40 shadow-glow-emerald'
                      : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="truncate mr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/10">
                        {course.courseCode}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {course.credits} Credits
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 truncate">{course.courseName}</h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        Target: {course.targetGrade}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGPACourse(course.id);
                      }}
                      className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                      title="Delete course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: "What-If" Grade Simulator */}
        {selectedCourse ? (
          <div className="lg:col-span-6 rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 shadow-glass-3d space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    Grade Simulator: {selectedCourse.courseName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Adjust assignments to calculate final exam score required for target grade.
                  </p>
                </div>
              </div>

              <select
                value={selectedCourse.targetGrade}
                onChange={(e) => updateGPACourse(selectedCourse.id, { targetGrade: e.target.value })}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-xs font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
              >
                {Object.keys(GRADE_POINTS).map(g => (
                  <option key={g} value={g}>Target {g}</option>
                ))}
              </select>
            </div>

            {/* Target Goal Required Score Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-indigo-300 font-bold">
                  Required Final Exam Score
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  To achieve your target grade of <strong className="text-white">{selectedCourse.targetGrade}</strong> ({targetPercentage}% overall)
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold font-mono text-cyan-400">
                  {requiredFinalExamScore}%
                </span>
                <span className="block text-[9px] font-mono text-slate-400">on Final Exam</span>
              </div>
            </div>

            {/* Assignment Score Sliders */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-300">Assignment Weight Breakdown</span>
              {selectedCourse.assignments.map((asg) => (
                <div key={asg.id} className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {asg.name} <span className="text-slate-500 font-mono">({asg.weight}%)</span>
                    </span>
                    <span className="font-mono font-bold text-cyan-400">{asg.score}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={asg.score}
                    onChange={(e) => handleAssignmentScoreChange(asg.id, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-6 rounded-3xl glass-panel p-12 text-center border border-white/10 shadow-glass-3d space-y-3">
            <Calculator className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-100">Select a course to simulate grades</h3>
          </div>
        )}
      </div>

      {/* Modal: Add Course */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <form onSubmit={handleCreateCourse} className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Add Enrolled Course</span>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course Name</label>
              <input
                type="text"
                required
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="e.g. Distributed Operating Systems"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  placeholder="e.g. CS 450"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Hours</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newCredits}
                  onChange={(e) => setNewCredits(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Letter Grade</label>
              <select
                value={newTargetGrade}
                onChange={(e) => setNewTargetGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-emerald-400"
              >
                {Object.keys(GRADE_POINTS).map(g => (
                  <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)} GPA)</option>
                ))}
              </select>
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:scale-105 transition-all"
              >
                Save Course
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
