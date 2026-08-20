import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile,
  Subject, 
  StudySession, 
  Habit, 
  Task, 
  Goal, 
  Note, 
  Achievement, 
  TimerMode,
  ProductivityBreakdown,
  AIInsight
} from '../types';
import { storage } from '../lib/storage';
import { soundEngine } from '../lib/audio';
import { calculateProductivityScore, generateAIInsights } from '../lib/productivity';
import { useAuth } from './AuthContext';

export type ActiveView = 
  | 'dashboard'
  | 'timer'
  | 'habits'
  | 'tasks'
  | 'subjects'
  | 'goals'
  | 'analytics'
  | 'calendar'
  | 'notes'
  | 'achievements'
  | 'settings';

interface StudyContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Timer State
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  timerDuration: number; // in seconds
  setTimerDuration: (dur: number) => void;
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  isTimerRunning: boolean;
  selectedSubjectId: string;
  setSelectedSubjectId: (id: string) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  finishSession: (rating?: number, notes?: string) => void;
  sessionCount: number;

  // Distraction-free Focus Mode
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;

  // Quick Capture & Modals
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (val: boolean) => void;
  isAIChatOpen: boolean;
  setIsAIChatOpen: (val: boolean) => void;

  // Sound Engine
  activeAmbient: 'rain' | 'forest' | 'cafe' | 'whitenoise' | 'binaural' | null;
  ambientVolume: number;
  setAmbientSound: (type: 'rain' | 'forest' | 'cafe' | 'whitenoise' | 'binaural' | null) => void;
  setAmbientVol: (vol: number) => void;

  // Data Collections
  subjects: Subject[];
  sessions: StudySession[];
  habits: Habit[];
  tasks: Task[];
  goals: Goal[];
  notes: Note[];
  achievements: Achievement[];
  productivity: ProductivityBreakdown;
  aiInsights: AIInsight[];

  // Actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'completedMinutesThisWeek' | 'totalStudyMinutes'>) => void;
  updateSubject: (id: string, partial: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  toggleHabit: (habitId: string, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'currentStreak' | 'longestStreak' | 'userId'>) => void;
  updateHabit: (id: string, partial: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (id: string, partial: Partial<Task>) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (id: string) => void;

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'userId'>) => void;
  updateGoal: (id: string, partial: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateNote: (id: string, partial: Partial<Note>) => void;
  togglePinNote: (id: string) => void;
  deleteNote: (id: string) => void;

  triggerConfetti: () => void;
  newAchievementUnlock: Achievement | null;
  dismissAchievementPopup: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addXP } = useAuth();

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  // Timer states
  const [timerMode, setTimerModeState] = useState<TimerMode>('pomodoro');
  const [timerDuration, setTimerDuration] = useState<number>(25 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub_dsa');
  const [selectedTopic, setSelectedTopic] = useState<string>('Dynamic Programming & Tree Traversal');
  const [sessionCount, setSessionCount] = useState<number>(3);
  const timerIntervalRef = useRef<number | null>(null);

  // Ambient sound states
  const [activeAmbient, setActiveAmbient] = useState<'rain' | 'forest' | 'cafe' | 'whitenoise' | 'binaural' | null>(null);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.35);

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects());
  const [sessions, setSessions] = useState<StudySession[]>(() => storage.getSessions());
  const [habits, setHabits] = useState<Habit[]>(() => storage.getHabits());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [goals, setGoals] = useState<Goal[]>(() => storage.getGoals());
  const [notes, setNotes] = useState<Note[]>(() => storage.getNotes());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());
  const [newAchievementUnlock, setNewAchievementUnlock] = useState<Achievement | null>(null);

  // Confetti trigger
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981', '#f59e0b'],
      });
    } catch {
      // Ignored in test environments
    }
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for Quick Capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickCaptureOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mode change handler
  const setTimerMode = (mode: TimerMode) => {
    setTimerModeState(mode);
    setIsTimerRunning(false);
    if (mode === 'pomodoro') {
      setTimerDuration(25 * 60);
      setTimeLeft(25 * 60);
    } else if (mode === 'short_break') {
      setTimerDuration(5 * 60);
      setTimeLeft(5 * 60);
    } else if (mode === 'long_break') {
      setTimerDuration(15 * 60);
      setTimeLeft(15 * 60);
    } else if (mode === 'custom') {
      setTimerDuration(45 * 60);
      setTimeLeft(45 * 60);
    } else if (mode === 'stopwatch') {
      setTimerDuration(0);
      setTimeLeft(0);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        if (timerMode === 'stopwatch') {
          setTimeLeft(prev => prev + 1);
        } else {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerIntervalRef.current!);
              setIsTimerRunning(false);
              soundEngine.playTimerCompletion();
              triggerConfetti();
              finishSession(5, 'Completed standard timer duration.');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerMode]);

  const startTimer = () => {
    soundEngine.playClick();
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    soundEngine.playClick();
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    soundEngine.playClick();
    setIsTimerRunning(false);
    if (timerMode === 'stopwatch') {
      setTimeLeft(0);
    } else {
      setTimeLeft(timerDuration);
    }
  };

  // Session Logging
  const finishSession = (rating = 5, sessionNotes = '') => {
    let elapsedSeconds = 0;
    if (timerMode === 'stopwatch') {
      elapsedSeconds = timeLeft;
    } else {
      elapsedSeconds = timerDuration - timeLeft;
    }

    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const targetSub = subjects.find(s => s.id === selectedSubjectId);
    const subName = targetSub ? targetSub.name : 'General Study';

    const newSession: StudySession = {
      id: 'sess_' + Date.now(),
      userId: user?.id || 'usr_sachin_108',
      subjectId: selectedSubjectId,
      subjectName: subName,
      topic: selectedTopic || 'Core Study Session',
      durationMinutes: elapsedMinutes,
      mode: timerMode,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      productivityRating: rating,
      notes: sessionNotes,
    };

    const nextSessions = [newSession, ...sessions];
    setSessions(nextSessions);
    storage.setSessions(nextSessions);

    // Update subject study time
    if (selectedSubjectId) {
      setSubjects(prev => {
        const updated = prev.map(s => {
          if (s.id === selectedSubjectId) {
            return {
              ...s,
              completedMinutesThisWeek: s.completedMinutesThisWeek + elapsedMinutes,
              totalStudyMinutes: s.totalStudyMinutes + elapsedMinutes,
            };
          }
          return s;
        });
        storage.setSubjects(updated);
        return updated;
      });
    }

    // Award XP: 10 XP per minute studied + 50 XP completion bonus
    const xpEarned = elapsedMinutes * 10 + 50;
    addXP(xpEarned);

    setSessionCount(prev => prev + 1);
    soundEngine.playSuccess();
    triggerConfetti();

    // Reset timer
    setIsTimerRunning(false);
    setTimeLeft(timerMode === 'stopwatch' ? 0 : timerDuration);
  };

  // Ambient sound handlers
  const setAmbientSound = (type: 'rain' | 'forest' | 'cafe' | 'whitenoise' | 'binaural' | null) => {
    if (type === activeAmbient || type === null) {
      soundEngine.stopAmbient();
      setActiveAmbient(null);
    } else {
      soundEngine.startAmbient(type, ambientVolume);
      setActiveAmbient(type);
    }
  };

  const setAmbientVol = (vol: number) => {
    setAmbientVolume(vol);
    soundEngine.setAmbientVolume(vol);
  };

  // --- Habit Management ---
  const toggleHabit = (habitId: string, targetDate?: string) => {
    const today = targetDate || new Date().toISOString().split('T')[0];
    soundEngine.playStreakFire();

    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id === habitId) {
          const isDone = !!h.completions[today];
          const newCompletions = { ...h.completions, [today]: !isDone };
          const newStreak = !isDone ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
          const newLongest = Math.max(h.longestStreak, newStreak);

          return {
            ...h,
            completions: newCompletions,
            currentStreak: newStreak,
            longestStreak: newLongest,
          };
        }
        return h;
      });
      storage.setHabits(updated);
      return updated;
    });

    addXP(50);
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'currentStreak' | 'longestStreak' | 'userId'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'hab_' + Date.now(),
      userId: user?.id || 'usr_sachin_108',
      currentStreak: 0,
      longestStreak: 0,
      completions: {},
      createdAt: new Date().toISOString(),
    };
    const updated = [newHabit, ...habits];
    setHabits(updated);
    storage.setHabits(updated);
    soundEngine.playSuccess();
  };

  const updateHabit = (id: string, partial: Partial<Habit>) => {
    setHabits(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, ...partial } : h);
      storage.setHabits(updated);
      return updated;
    });
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id);
      storage.setHabits(updated);
      return updated;
    });
  };

  // --- Task Management ---
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
      userId: user?.id || 'usr_sachin_108',
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    storage.setTasks(updated);
    soundEngine.playSuccess();
  };

  const updateTask = (id: string, partial: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...partial } : t);
      storage.setTasks(updated);
      return updated;
    });
  };

  const toggleTask = (taskId: string) => {
    soundEngine.playSuccess();
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            triggerConfetti();
            addXP(75);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });
      storage.setTasks(updated);
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      storage.setTasks(updated);
      return updated;
    });
  };

  // --- Subject Management ---
  const addSubject = (subData: Omit<Subject, 'id' | 'createdAt' | 'completedMinutesThisWeek' | 'totalStudyMinutes'>) => {
    const newSub: Subject = {
      ...subData,
      id: 'sub_' + Date.now(),
      completedMinutesThisWeek: 0,
      totalStudyMinutes: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    storage.setSubjects(updated);
    soundEngine.playSuccess();
  };

  const updateSubject = (id: string, partial: Partial<Subject>) => {
    setSubjects(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...partial } : s);
      storage.setSubjects(updated);
      return updated;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => {
      const updated = prev.filter(s => s.id !== id);
      storage.setSubjects(updated);
      return updated;
    });
  };

  // --- Goal Management ---
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'userId'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: 'goal_' + Date.now(),
      userId: user?.id || 'usr_sachin_108',
      createdAt: new Date().toISOString(),
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    storage.setGoals(updated);
    soundEngine.playSuccess();
  };

  const updateGoal = (id: string, partial: Partial<Goal>) => {
    setGoals(prev => {
      const updated = prev.map(g => g.id === id ? { ...g, ...partial } : g);
      storage.setGoals(updated);
      return updated;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => {
      const updated = prev.filter(g => g.id !== id);
      storage.setGoals(updated);
      return updated;
    });
  };

  // --- Notes Management ---
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newNote: Note = {
      ...noteData,
      id: 'note_' + Date.now(),
      userId: user?.id || 'usr_sachin_108',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    storage.setNotes(updated);
    soundEngine.playSuccess();
  };

  const updateNote = (id: string, partial: Partial<Note>) => {
    setNotes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, ...partial, updatedAt: new Date().toISOString() } : n);
      storage.setNotes(updated);
      return updated;
    });
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
      storage.setNotes(updated);
      return updated;
    });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      storage.setNotes(updated);
      return updated;
    });
  };

  const dismissAchievementPopup = () => {
    setNewAchievementUnlock(null);
  };

  // Derived Productivity & AI Insights
  const fallbackUser: UserProfile = user || storage.getUser() || {
    id: 'usr_guest',
    name: 'Scholar',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    major: 'General Studies',
    academicYear: 'Freshman',
    level: 1,
    xp: 0,
    dailyGoalMinutes: 240,
    streakCount: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  const productivity = calculateProductivityScore(
    fallbackUser,
    sessions,
    habits,
    tasks
  );

  const aiInsights = generateAIInsights(
    fallbackUser,
    subjects,
    sessions,
    habits,
    tasks
  );

  return (
    <StudyContext.Provider
      value={{
        activeView,
        setActiveView,
        timerMode,
        setTimerMode,
        timerDuration,
        setTimerDuration,
        timeLeft,
        setTimeLeft,
        isTimerRunning,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedTopic,
        setSelectedTopic,
        startTimer,
        pauseTimer,
        resetTimer,
        finishSession,
        sessionCount,
        isFocusMode,
        setIsFocusMode,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        isAIChatOpen,
        setIsAIChatOpen,
        activeAmbient,
        ambientVolume,
        setAmbientSound,
        setAmbientVol,
        subjects,
        sessions,
        habits,
        tasks,
        goals,
        notes,
        achievements,
        productivity,
        aiInsights,
        addSubject,
        updateSubject,
        deleteSubject,
        toggleHabit,
        addHabit,
        updateHabit,
        deleteHabit,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        addGoal,
        updateGoal,
        deleteGoal,
        addNote,
        updateNote,
        togglePinNote,
        deleteNote,
        triggerConfetti,
        newAchievementUnlock,
        dismissAchievementPopup,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
