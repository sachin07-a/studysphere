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
  AIInsight,
  FlashcardDeck,
  Flashcard,
  Exam,
  SyllabusUnit
} from '../types';
import { YouTubeTrack, CURATED_YOUTUBE_STATIONS, parseYouTubeVideoId } from '../types/music';
import { storage } from '../lib/storage';
import { soundEngine, AmbientType } from '../lib/audio';
import { calculateProductivityScore, generateAIInsights, calculateOverallStreak } from '../lib/productivity';
import { calculateSM2, ReviewRating } from '../lib/spacedRepetition';
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
  | 'settings'
  | 'flashcards'
  | 'exams'
  | 'pdf-reader';

interface StudyContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Timer State
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  timerDuration: number;
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
  isReportCardOpen: boolean;
  setIsReportCardOpen: (val: boolean) => void;

  // Sound Engine (Procedural Ambient & Lo-Fi)
  activeAmbient: AmbientType | null;
  ambientVolume: number;
  setAmbientSound: (type: AmbientType | null) => void;
  setAmbientVol: (vol: number) => void;

  // YouTube Study Lounge
  currentYouTubeTrack: YouTubeTrack | null;
  isYouTubePlaying: boolean;
  youTubeVolume: number;
  isYouTubeModalOpen: boolean;
  customYouTubeUrls: string[];
  playYouTubeTrack: (track: YouTubeTrack) => void;
  stopYouTubeTrack: () => void;
  toggleYouTubePlayback: () => void;
  setYouTubeVol: (vol: number) => void;
  setIsYouTubeModalOpen: (open: boolean) => void;
  addCustomYouTubeUrl: (url: string) => void;

  // Data Collections
  subjects: Subject[];
  sessions: StudySession[];
  habits: Habit[];
  tasks: Task[];
  goals: Goal[];
  notes: Note[];
  achievements: Achievement[];
  decks: FlashcardDeck[];
  flashcards: Flashcard[];
  exams: Exam[];
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

  // Flashcards CRUD & Spaced Repetition
  addDeck: (deck: Omit<FlashcardDeck, 'id' | 'createdAt' | 'userId'>) => void;
  deleteDeck: (deckId: string) => void;
  addFlashcard: (card: Omit<Flashcard, 'id' | 'createdAt' | 'userId' | 'interval' | 'repetition' | 'easeFactor' | 'dueDate'>) => void;
  updateFlashcard: (id: string, partial: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (cardId: string, rating: ReviewRating) => void;

  // Exams CRUD & Syllabus Units
  addExam: (exam: Omit<Exam, 'id' | 'createdAt' | 'userId'>) => void;
  updateExam: (id: string, partial: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  toggleSyllabusUnit: (examId: string, unitId: string) => void;

  triggerConfetti: () => void;
  newAchievementUnlock: Achievement | null;
  dismissAchievementPopup: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addXP, updateProfile } = useAuth();

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState<boolean>(false);

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
  const [activeAmbient, setActiveAmbient] = useState<AmbientType | null>(null);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.35);

  // YouTube Study Lounge states
  const [currentYouTubeTrack, setCurrentYouTubeTrack] = useState<YouTubeTrack | null>(null);
  const [isYouTubePlaying, setIsYouTubePlaying] = useState<boolean>(false);
  const [youTubeVolume, setYouTubeVolume] = useState<number>(0.7);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);
  const [customYouTubeUrls, setCustomYouTubeUrls] = useState<string[]>(() => storage.getCustomYouTubeUrls());

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>(() => storage.getSubjects());
  const [sessions, setSessions] = useState<StudySession[]>(() => storage.getSessions());
  const [habits, setHabits] = useState<Habit[]>(() => storage.getHabits());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [goals, setGoals] = useState<Goal[]>(() => storage.getGoals());
  const [notes, setNotes] = useState<Note[]>(() => storage.getNotes());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => storage.getDecks());
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => storage.getFlashcards());
  const [exams, setExams] = useState<Exam[]>(() => storage.getExams());
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

  // Global Streak Synchronizer across Study Time, Tasks, and Habits
  const syncStreak = useCallback((
    currSessions: StudySession[] = sessions, 
    currHabits: Habit[] = habits, 
    currTasks: Task[] = tasks
  ) => {
    if (!user) return;
    const { currentStreak, longestStreak } = calculateOverallStreak(currSessions, currHabits, currTasks, user);
    if (user.streakCount !== currentStreak || user.longestStreak !== longestStreak) {
      updateProfile({
        streakCount: currentStreak,
        longestStreak: longestStreak,
        lastActiveDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [user, updateProfile, sessions, habits, tasks]);

  // Sync on startup / user switch
  useEffect(() => {
    if (user) {
      syncStreak(sessions, habits, tasks);
    }
  }, [user?.id]);

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

    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const now = new Date();
    const startTime = new Date(now.getTime() - durationMinutes * 60000);
    const subject = subjects.find(s => s.id === selectedSubjectId);

    const newSession: StudySession = {
      id: 'sess_' + Date.now(),
      userId: user?.id || 'usr_guest',
      subjectId: selectedSubjectId,
      subjectName: subject?.name || 'General Study',
      topic: selectedTopic || 'Self Study',
      durationMinutes,
      mode: timerMode,
      productivityRating: rating,
      notes: sessionNotes,
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
      date: now.toISOString().split('T')[0],
    };

    // Update Sessions
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    storage.setSessions(updatedSessions);

    // Sync streak with new study session!
    syncStreak(updatedSessions, habits, tasks);

    // Update Subject Study Hours
    if (selectedSubjectId) {
      setSubjects(prev => {
        const updated = prev.map(s => {
          if (s.id === selectedSubjectId) {
            return {
              ...s,
              completedMinutesThisWeek: s.completedMinutesThisWeek + durationMinutes,
              totalStudyMinutes: s.totalStudyMinutes + durationMinutes,
            };
          }
          return s;
        });
        storage.setSubjects(updated);
        return updated;
      });
    }

    // Award XP
    const earnedXP = durationMinutes * 10 + rating * 15;
    const { leveledUp } = addXP(earnedXP);

    if (leveledUp) {
      triggerConfetti();
      soundEngine.playSuccess();
    }

    setSessionCount(prev => prev + 1);
    checkAchievementsAfterSession(durationMinutes, rating);
  };

  // Ambient sound controls
  const setAmbientSound = (type: AmbientType | null) => {
    if (type === activeAmbient) {
      soundEngine.stopAmbient();
      setActiveAmbient(null);
    } else if (type) {
      if (isYouTubePlaying) {
        setIsYouTubePlaying(false);
      }
      soundEngine.startAmbient(type, ambientVolume);
      setActiveAmbient(type);
    } else {
      soundEngine.stopAmbient();
      setActiveAmbient(null);
    }
  };

  const setAmbientVol = (vol: number) => {
    setAmbientVolume(vol);
    soundEngine.setAmbientVolume(vol);
  };

  // YouTube Lounge controls
  const playYouTubeTrack = (track: YouTubeTrack) => {
    if (activeAmbient) {
      soundEngine.stopAmbient();
      setActiveAmbient(null);
    }
    setCurrentYouTubeTrack(track);
    setIsYouTubePlaying(true);
  };

  const stopYouTubeTrack = () => {
    setIsYouTubePlaying(false);
    setCurrentYouTubeTrack(null);
  };

  const toggleYouTubePlayback = () => {
    setIsYouTubePlaying(prev => !prev);
  };

  const setYouTubeVol = (vol: number) => {
    setYouTubeVolume(vol);
  };

  const addCustomYouTubeUrl = (url: string) => {
    storage.saveCustomYouTubeUrl(url);
    setCustomYouTubeUrls(storage.getCustomYouTubeUrls());
  };

  // Subjects CRUD
  const addSubject = (sub: Omit<Subject, 'id' | 'createdAt' | 'completedMinutesThisWeek' | 'totalStudyMinutes'>) => {
    const newSub: Subject = {
      ...sub,
      id: 'sub_' + Date.now(),
      completedMinutesThisWeek: 0,
      totalStudyMinutes: 0,
      createdAt: new Date().toISOString(),
    };
    setSubjects(prev => {
      const updated = [...prev, newSub];
      storage.setSubjects(updated);
      return updated;
    });
    addXP(100);
  };

  const updateSubject = (id: string, partial: Partial<Subject>) => {
    setSubjects(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...partial } : s));
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

  // Habits CRUD & Streak Engine
  const toggleHabit = (habitId: string, dateStr?: string) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    
    setHabits(prev => {
      const updated = prev.map(habit => {
        if (habit.id === habitId) {
          const completions = { ...(habit.completions || {}) };
          const isCurrentlyDone = !!completions[targetDate];
          
          if (isCurrentlyDone) {
            delete completions[targetDate];
          } else {
            completions[targetDate] = true;
            soundEngine.playStreakFire();
            triggerConfetti();
            addXP(50);
          }

          // Calculate current streak for this specific habit
          const now = new Date();
          const todayKey = now.toISOString().split('T')[0];
          let streak = 0;

          const checkDateStr = (daysAgo: number) => {
            const d = new Date();
            d.setDate(now.getDate() - daysAgo);
            return d.toISOString().split('T')[0];
          };

          if (completions[todayKey]) {
            streak = 1;
            let day = 1;
            while (completions[checkDateStr(day)]) {
              streak++;
              day++;
            }
          } else {
            const yesterdayKey = checkDateStr(1);
            if (completions[yesterdayKey]) {
              let day = 1;
              while (completions[checkDateStr(day)]) {
                streak++;
                day++;
              }
            }
          }

          const longest = Math.max(habit.longestStreak || 0, streak);

          return {
            ...habit,
            completions,
            currentStreak: streak,
            longestStreak: longest,
          };
        }
        return habit;
      });

      storage.setHabits(updated);
      syncStreak(sessions, updated, tasks);
      return updated;
    });
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'currentStreak' | 'longestStreak' | 'userId'>) => {
    const newHabit: Habit = {
      ...habit,
      id: 'hab_' + Date.now(),
      userId: user?.id || 'usr_guest',
      currentStreak: 0,
      longestStreak: 0,
      completions: {},
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => {
      const updated = [...prev, newHabit];
      storage.setHabits(updated);
      syncStreak(sessions, updated, tasks);
      return updated;
    });
    addXP(75);
  };

  const updateHabit = (id: string, partial: Partial<Habit>) => {
    setHabits(prev => {
      const updated = prev.map(h => (h.id === id ? { ...h, ...partial } : h));
      storage.setHabits(updated);
      syncStreak(sessions, updated, tasks);
      return updated;
    });
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id);
      storage.setHabits(updated);
      syncStreak(sessions, updated, tasks);
      return updated;
    });
  };

  // Tasks CRUD
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    const newTask: Task = {
      ...task,
      id: 'tsk_' + Date.now(),
      userId: user?.id || 'usr_guest',
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => {
      const updated = [newTask, ...prev];
      storage.setTasks(updated);
      syncStreak(sessions, habits, updated);
      return updated;
    });
    addXP(30);
  };

  const updateTask = (id: string, partial: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...partial } : t));
      storage.setTasks(updated);
      syncStreak(sessions, habits, updated);
      return updated;
    });
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            soundEngine.playSuccess();
            triggerConfetti();
            addXP(60);
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
      syncStreak(sessions, habits, updated);
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      storage.setTasks(updated);
      syncStreak(sessions, habits, updated);
      return updated;
    });
  };

  // Goals CRUD
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'userId'>) => {
    const newGoal: Goal = {
      ...goal,
      id: 'gol_' + Date.now(),
      userId: user?.id || 'usr_guest',
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => {
      const updated = [...prev, newGoal];
      storage.setGoals(updated);
      return updated;
    });
    addXP(100);
  };

  const updateGoal = (id: string, partial: Partial<Goal>) => {
    setGoals(prev => {
      const updated = prev.map(g => (g.id === id ? { ...g, ...partial } : g));
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

  // Notes CRUD
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: 'not_' + Date.now(),
      userId: user?.id || 'usr_guest',
      createdAt: now,
      updatedAt: now,
    };
    setNotes(prev => {
      const updated = [newNote, ...prev];
      storage.setNotes(updated);
      return updated;
    });
    addXP(40);
  };

  const updateNote = (id: string, partial: Partial<Note>) => {
    setNotes(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, ...partial, updatedAt: new Date().toISOString() } : n));
      storage.setNotes(updated);
      return updated;
    });
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n));
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

  // --- Flashcards & Spaced Repetition CRUD ---
  const addDeck = (deck: Omit<FlashcardDeck, 'id' | 'createdAt' | 'userId'>) => {
    const newDeck: FlashcardDeck = {
      ...deck,
      id: 'deck_' + Date.now(),
      userId: user?.id || 'usr_guest',
      createdAt: new Date().toISOString(),
    };
    setDecks(prev => {
      const updated = [...prev, newDeck];
      storage.setDecks(updated);
      return updated;
    });
    addXP(80);
  };

  const deleteDeck = (deckId: string) => {
    setDecks(prev => {
      const updated = prev.filter(d => d.id !== deckId);
      storage.setDecks(updated);
      return updated;
    });
    // Also remove flashcards in this deck
    setFlashcards(prev => {
      const updated = prev.filter(c => c.deckId !== deckId);
      storage.setFlashcards(updated);
      return updated;
    });
  };

  const addFlashcard = (card: Omit<Flashcard, 'id' | 'createdAt' | 'userId' | 'interval' | 'repetition' | 'easeFactor' | 'dueDate'>) => {
    const newCard: Flashcard = {
      ...card,
      id: 'card_' + Date.now(),
      userId: user?.id || 'usr_guest',
      interval: 1,
      repetition: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setFlashcards(prev => {
      const updated = [newCard, ...prev];
      storage.setFlashcards(updated);
      return updated;
    });
    addXP(25);
  };

  const updateFlashcard = (id: string, partial: Partial<Flashcard>) => {
    setFlashcards(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...partial } : c));
      storage.setFlashcards(updated);
      return updated;
    });
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => {
      const updated = prev.filter(c => c.id !== id);
      storage.setFlashcards(updated);
      return updated;
    });
  };

  const reviewFlashcard = (cardId: string, rating: ReviewRating) => {
    setFlashcards(prev => {
      const updated = prev.map(c => {
        if (c.id === cardId) {
          const result = calculateSM2(c, rating);
          return {
            ...c,
            ...result,
            lastReviewedAt: new Date().toISOString()
          };
        }
        return c;
      });
      storage.setFlashcards(updated);
      return updated;
    });

    // Reward XP based on recall effort
    const xpMap: Record<ReviewRating, number> = { 1: 10, 2: 25, 3: 40, 4: 50 };
    addXP(xpMap[rating] || 25);
    if (rating >= 3) {
      soundEngine.playSuccess();
    }
  };

  // --- Exams & Syllabus CRUD ---
  const addExam = (exam: Omit<Exam, 'id' | 'createdAt' | 'userId'>) => {
    const newExam: Exam = {
      ...exam,
      id: 'exam_' + Date.now(),
      userId: user?.id || 'usr_guest',
      createdAt: new Date().toISOString(),
    };
    setExams(prev => {
      const updated = [...prev, newExam];
      storage.setExams(updated);
      return updated;
    });
    addXP(100);
  };

  const updateExam = (id: string, partial: Partial<Exam>) => {
    setExams(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...partial } : e));
      storage.setExams(updated);
      return updated;
    });
  };

  const deleteExam = (id: string) => {
    setExams(prev => {
      const updated = prev.filter(e => e.id !== id);
      storage.setExams(updated);
      return updated;
    });
  };

  const toggleSyllabusUnit = (examId: string, unitId: string) => {
    setExams(prev => {
      const updated = prev.map(exam => {
        if (exam.id === examId) {
          const updatedUnits = exam.syllabusUnits.map(u => 
            u.id === unitId ? { ...u, completed: !u.completed } : u
          );
          return { ...exam, syllabusUnits: updatedUnits };
        }
        return exam;
      });
      storage.setExams(updated);
      return updated;
    });
    soundEngine.playSuccess();
    triggerConfetti();
    addXP(35);
  };

  // Achievement unlock evaluator
  const checkAchievementsAfterSession = (sessionMinutes: number, rating: number) => {
    setAchievements(prev => {
      const updated = [...prev];
      const firstSess = updated.find(a => a.code === 'FIRST_SESSION');
      if (firstSess && !firstSess.unlockedAt) {
        firstSess.unlockedAt = new Date().toISOString();
        firstSess.progress = 100;
        setNewAchievementUnlock(firstSess);
        triggerConfetti();
        soundEngine.playSuccess();
      }

      if (rating === 5) {
        const perf = updated.find(a => a.code === 'PERFECT_SCORE');
        if (perf && !perf.unlockedAt) {
          perf.unlockedAt = new Date().toISOString();
          perf.progress = 100;
          setNewAchievementUnlock(perf);
          triggerConfetti();
          soundEngine.playSuccess();
        }
      }

      storage.setAchievements(updated);
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
        isReportCardOpen,
        setIsReportCardOpen,
        activeAmbient,
        ambientVolume,
        setAmbientSound,
        setAmbientVol,
        currentYouTubeTrack,
        isYouTubePlaying,
        youTubeVolume,
        isYouTubeModalOpen,
        customYouTubeUrls,
        playYouTubeTrack,
        stopYouTubeTrack,
        toggleYouTubePlayback,
        setYouTubeVol,
        setIsYouTubeModalOpen,
        addCustomYouTubeUrl,
        subjects,
        sessions,
        habits,
        tasks,
        goals,
        notes,
        achievements,
        decks,
        flashcards,
        exams,
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
        addDeck,
        deleteDeck,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        reviewFlashcard,
        addExam,
        updateExam,
        deleteExam,
        toggleSyllabusUnit,
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
