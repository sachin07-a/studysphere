import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  BookOpen, 
  Clock, 
  Flame, 
  User, 
  GraduationCap,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudy } from '../../context/StudyContext';

export const OnboardingWizard: React.FC = () => {
  const { completeOnboarding, user } = useAuth();
  const { triggerConfetti } = useStudy();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [major, setMajor] = useState(user?.major || 'Computer Science');
  const [academicYear, setAcademicYear] = useState('Freshman');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(240); // 4 hours
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics & Calculus',
    'Data Structures & Algorithms',
    'Computer Systems',
  ]);
  const [customSubjectInput, setCustomSubjectInput] = useState('');

  const [selectedHabits, setSelectedHabits] = useState<string[]>([
    'Deep Study 3+ Hours',
    'Solve Practice Problems',
    'Review Lecture Notes (20m)',
  ]);
  const [customHabitInput, setCustomHabitInput] = useState('');

  const subjectOptions = [
    'Mathematics & Calculus',
    'Data Structures & Algorithms',
    'Machine Learning & AI',
    'Computer Systems & OS',
    'Distributed Systems & Cloud',
    'Physics & Mechanics',
    'Chemistry & Biology',
    'Economics & Finance',
  ];

  const habitOptions = [
    'Deep Study 3+ Hours',
    'Solve Practice Problems',
    'Review Lecture Notes (20m)',
    'Anki Flashcards Active Recall',
    'Read Research Paper / Book',
    'Posture Stretch & Hydration',
  ];

  const toggleSubject = (sub: string) => {
    setSelectedSubjects(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const addCustomSubject = () => {
    if (customSubjectInput.trim() && !selectedSubjects.includes(customSubjectInput.trim())) {
      setSelectedSubjects(prev => [...prev, customSubjectInput.trim()]);
      setCustomSubjectInput('');
    }
  };

  const toggleHabit = (hab: string) => {
    setSelectedHabits(prev =>
      prev.includes(hab) ? prev.filter(h => h !== hab) : [...prev, hab]
    );
  };

  const addCustomHabit = () => {
    if (customHabitInput.trim() && !selectedHabits.includes(customHabitInput.trim())) {
      setSelectedHabits(prev => [...prev, customHabitInput.trim()]);
      setCustomHabitInput('');
    }
  };

  const handleFinish = () => {
    completeOnboarding(
      {
        name: name.trim() || 'Scholar',
        major,
        dailyGoalMinutes,
      },
      selectedSubjects.length > 0 ? selectedSubjects : ['Core Studies'],
      selectedHabits.length > 0 ? selectedHabits : ['Daily Focused Study']
    );
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070a13] select-none">
      {/* Background Mesh Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-10 border border-white/20 shadow-glass-3d space-y-6">
        {/* Step Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STEP {step} OF 5</span>
            </span>
            <span>{Math.round((step / 5) * 100)}% Completed</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">What is your name?</h2>
              <p className="text-xs text-slate-400 mt-1">
                StudySphere will personalize your daily productivity workspace and track your personal streak.
              </p>
            </div>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full px-5 py-3 rounded-2xl bg-slate-900/80 border border-white/15 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}

        {/* Step 2: Major & Academic Year */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">What are you studying?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Help us tailor your curriculum difficulty and telemetry models.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Major or Field of Study</label>
                <input
                  type="text"
                  autoFocus
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. Computer Science, Medicine, Engineering, High School"
                  className="w-full px-5 py-3 rounded-2xl bg-slate-900/80 border border-white/15 text-sm text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="Freshman">Freshman Year</option>
                  <option value="Sophomore">Sophomore Year</option>
                  <option value="Junior">Junior Year</option>
                  <option value="Senior Year">Senior Year</option>
                  <option value="Graduate">Graduate / Master's Degree</option>
                  <option value="PhD Candidate">PhD Candidate</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Subjects Selection */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">Select subjects to track</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose or add the subjects you are studying this term (starts with 0h logged).
              </p>
            </div>

            {/* Custom Subject Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSubjectInput}
                onChange={(e) => setCustomSubjectInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSubject())}
                placeholder="Type your own subject and press Add..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={addCustomSubject}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {Array.from(new Set([...subjectOptions, ...selectedSubjects])).map((sub) => {
                const isSelected = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-glow-blue font-bold'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span>{sub}</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-indigo-500 text-white' : 'border border-slate-600'
                    }`}>
                      {isSelected && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Daily Study Goal */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">Daily Study Target</h2>
              <p className="text-xs text-slate-400 mt-1">
                How many hours of focused deep study do you aim for every day?
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 text-center">
              <span className="text-4xl font-extrabold font-mono text-cyan-400">
                {(dailyGoalMinutes / 60).toFixed(1)} Hours
              </span>
              <p className="text-xs text-slate-400">({dailyGoalMinutes} Minutes of Deep Focus / Day)</p>
              <input
                type="range"
                min="60"
                max="600"
                step="30"
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1 Hour</span>
                <span>4 Hours (Recommended)</span>
                <span>10 Hours</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Habits to Build */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100">Select habits to build (0-day streak)</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose your daily disciplines. Your streak starts fresh from Day 1 today!
              </p>
            </div>

            {/* Custom Habit Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customHabitInput}
                onChange={(e) => setCustomHabitInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomHabit())}
                placeholder="Type your own custom habit and press Add..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/15 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={addCustomHabit}
                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {Array.from(new Set([...habitOptions, ...selectedHabits])).map((hab) => {
                const isSelected = selectedHabits.includes(hab);
                return (
                  <button
                    key={hab}
                    type="button"
                    onClick={() => toggleHabit(hab)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-amber font-bold'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span>{hab}</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'border border-slate-600'
                    }`}>
                      {isSelected && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan transition-all hover:scale-105"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-600 text-slate-950 font-extrabold text-xs shadow-glow-emerald hover:scale-105 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Launch My Fresh Workspace 🌌</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
