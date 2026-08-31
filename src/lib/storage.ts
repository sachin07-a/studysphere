import { 
  UserProfile, 
  Subject, 
  StudySession, 
  Habit, 
  Task, 
  Goal, 
  Note, 
  Achievement,
  FlashcardDeck,
  Flashcard,
  Exam
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_SUBJECTS, 
  INITIAL_SESSIONS, 
  INITIAL_HABITS, 
  INITIAL_TASKS, 
  INITIAL_GOALS, 
  INITIAL_NOTES, 
  INITIAL_ACHIEVEMENTS 
} from './mockData';

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  user: UserProfile;
  subjects: Subject[];
  sessions: StudySession[];
  habits: Habit[];
  tasks: Task[];
  goals: Goal[];
  notes: Note[];
  achievements: Achievement[];
  decks?: FlashcardDeck[];
  flashcards?: Flashcard[];
  exams?: Exam[];
  customYouTubeUrls?: string[];
  createdAt: string;
}

const KEYS = {
  USER: 'studysphere_user',
  SUBJECTS: 'studysphere_subjects',
  SESSIONS: 'studysphere_sessions',
  HABITS: 'studysphere_habits',
  TASKS: 'studysphere_tasks',
  GOALS: 'studysphere_goals',
  NOTES: 'studysphere_notes',
  ACHIEVEMENTS: 'studysphere_achievements',
  DECKS: 'studysphere_decks',
  FLASHCARDS: 'studysphere_flashcards',
  EXAMS: 'studysphere_exams',
  ONBOARDED: 'studysphere_onboarded',
  AUTH_TOKEN: 'studysphere_auth_token',
  REGISTERED_ACCOUNTS: 'studysphere_registered_accounts',
  YOUTUBE_URLS: 'studysphere_custom_youtube_urls',
};

// Default Mock Data for Flashcards & Exams
export const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: 'deck_dsa',
    userId: 'usr_guest',
    subjectName: 'Computer Science',
    title: 'Data Structures & Algorithms Mastery',
    description: 'Core Big-O, Tree traversals, Graph heuristics, and Dynamic Programming fundamentals.',
    color: '#06b6d4',
    createdAt: new Date().toISOString()
  },
  {
    id: 'deck_ai',
    userId: 'usr_guest',
    subjectName: 'Machine Learning',
    title: 'Deep Learning & Neural Architectures',
    description: 'Backpropagation, Transformer self-attention, Loss functions, and Gradient Descent.',
    color: '#8b5cf6',
    createdAt: new Date().toISOString()
  },
  {
    id: 'deck_math',
    userId: 'usr_guest',
    subjectName: 'Mathematics',
    title: 'Linear Algebra & Vector Spaces',
    description: 'Eigenvalues, Singular Value Decomposition (SVD), Matrix transformations, and Dot products.',
    color: '#10b981',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'card_1',
    deckId: 'deck_dsa',
    userId: 'usr_guest',
    front: 'What is the time complexity of building a Binary Heap from an unordered array of N elements?',
    back: 'O(N) time complexity using Floyd\'s bottom-up heap construction algorithm, not O(N log N).',
    tags: ['DSA', 'Heaps', 'Big-O'],
    interval: 1,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: 'card_2',
    deckId: 'deck_dsa',
    userId: 'usr_guest',
    front: 'Explain the difference between Dijkstra\'s Algorithm and A* Search.',
    back: 'Dijkstra expands nodes purely by path cost g(n). A* expands by f(n) = g(n) + h(n), adding an admissible heuristic to guide search toward the target faster.',
    tags: ['Graphs', 'Algorithms'],
    interval: 3,
    repetition: 1,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: 'card_3',
    deckId: 'deck_ai',
    userId: 'usr_guest',
    front: 'What is the mathematical equation for Scaled Dot-Product Attention in Transformers?',
    back: 'Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V',
    tags: ['AI', 'Transformers', 'NLP'],
    interval: 1,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: 'card_4',
    deckId: 'deck_math',
    userId: 'usr_guest',
    front: 'What condition makes a square matrix invertible?',
    back: 'A matrix A is invertible if and only if det(A) ≠ 0, its columns are linearly independent, and 0 is not an eigenvalue.',
    tags: ['Math', 'Matrices'],
    interval: 6,
    repetition: 2,
    easeFactor: 2.6,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam_1',
    userId: 'usr_guest',
    subjectId: 'sub_dsa',
    subjectName: 'Advanced Data Structures & Algorithms',
    title: 'Comprehensive Midterm Examination',
    examDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    location: 'Turing Hall 301',
    targetGrade: 'A',
    weightPercent: 35,
    syllabusUnits: [
      { id: 'u1', name: 'Asymptotic Analysis & Master Theorem', completed: true, estimatedHours: 3 },
      { id: 'u2', name: 'Balanced Trees (AVL & Red-Black Trees)', completed: true, estimatedHours: 4 },
      { id: 'u3', name: 'Graph Algorithms (Dijkstra, Bellman-Ford, MST)', completed: false, estimatedHours: 6 },
      { id: 'u4', name: 'Dynamic Programming Recurrences & Memoization', completed: false, estimatedHours: 8 },
      { id: 'u5', name: 'Disjoint Set Union & Kruskal Algorithm', completed: false, estimatedHours: 3 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam_2',
    userId: 'usr_guest',
    subjectId: 'sub_ml',
    subjectName: 'Neural Networks & Deep Learning',
    title: 'Transformer Architectures Final Project & Oral Exam',
    examDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:30',
    location: 'Engineering Atrium',
    targetGrade: 'A+',
    weightPercent: 40,
    syllabusUnits: [
      { id: 'u21', name: 'Backpropagation & Loss Gradients', completed: true, estimatedHours: 4 },
      { id: 'u22', name: 'Multi-Head Self-Attention Mechanisms', completed: true, estimatedHours: 5 },
      { id: 'u23', name: 'Positional Encodings & LayerNorm', completed: false, estimatedHours: 4 },
      { id: 'u24', name: 'Beam Search & Temperature Sampling', completed: false, estimatedHours: 3 }
    ],
    createdAt: new Date().toISOString()
  }
];

// Simple fast SHA-256 hash using Web Crypto API or fallback
export const hashPassword = async (password: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_studysphere_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
};

export const storage = {
  // Multi-Account Registry
  getRegisteredAccounts: (): Record<string, UserAccount> => {
    const data = localStorage.getItem(KEYS.REGISTERED_ACCOUNTS);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  },

  saveRegisteredAccounts: (accounts: Record<string, UserAccount>) => {
    localStorage.setItem(KEYS.REGISTERED_ACCOUNTS, JSON.stringify(accounts));
  },

  findAccountByEmail: (email: string): UserAccount | null => {
    const accounts = storage.getRegisteredAccounts();
    const normalized = email.toLowerCase().trim();
    return accounts[normalized] || null;
  },

  registerAccount: async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string; account?: UserAccount }> => {
    const normalized = email.toLowerCase().trim();
    const existing = storage.findAccountByEmail(normalized);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const passwordHash = await hashPassword(password);
    const id = 'usr_' + Date.now();

    const newUser: UserProfile = {
      id,
      name: name.trim() || 'Scholar',
      email: normalized,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
      major: 'Computer Science',
      academicYear: 'Sophomore',
      level: 1,
      xp: 0,
      dailyGoalMinutes: 240,
      streakCount: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const newAccount: UserAccount = {
      id,
      email: normalized,
      passwordHash,
      name: name.trim() || 'Scholar',
      user: newUser,
      subjects: INITIAL_SUBJECTS.map(s => ({ ...s, id: 'sub_' + Math.random().toString(36).substr(2, 9) })),
      sessions: [],
      habits: INITIAL_HABITS.map(h => ({ ...h, id: 'hab_' + Math.random().toString(36).substr(2, 9), completions: {}, currentStreak: 0, longestStreak: 0 })),
      tasks: INITIAL_TASKS.map(t => ({ ...t, id: 'tsk_' + Math.random().toString(36).substr(2, 9), completed: false })),
      goals: INITIAL_GOALS.map(g => ({ ...g, id: 'gol_' + Math.random().toString(36).substr(2, 9), completed: false })),
      notes: INITIAL_NOTES.map(n => ({ ...n, id: 'not_' + Math.random().toString(36).substr(2, 9) })),
      achievements: INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlockedAt: undefined, progress: 0 })),
      decks: INITIAL_DECKS,
      flashcards: INITIAL_FLASHCARDS,
      exams: INITIAL_EXAMS,
      customYouTubeUrls: [],
      createdAt: new Date().toISOString()
    };

    const accounts = storage.getRegisteredAccounts();
    accounts[normalized] = newAccount;
    storage.saveRegisteredAccounts(accounts);

    // Set as active session
    storage.loadAccountData(newAccount);
    return { success: true, account: newAccount };
  },

  authenticateAccount: async (email: string, password: string): Promise<{ success: boolean; error?: string; account?: UserAccount }> => {
    const normalized = email.toLowerCase().trim();
    const account = storage.findAccountByEmail(normalized);
    if (!account) {
      return { success: false, error: 'No registered account found with this email.' };
    }

    const inputHash = await hashPassword(password);
    if (account.passwordHash !== inputHash) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Save and load active workspace
    storage.loadAccountData(account);
    return { success: true, account };
  },

  loadAccountData: (account: UserAccount) => {
    storage.setUser(account.user);
    storage.setSubjects(account.subjects || []);
    storage.setSessions(account.sessions || []);
    storage.setHabits(account.habits || []);
    storage.setTasks(account.tasks || []);
    storage.setGoals(account.goals || []);
    storage.setNotes(account.notes || []);
    storage.setAchievements(account.achievements || INITIAL_ACHIEVEMENTS);
    storage.setDecks(account.decks || INITIAL_DECKS);
    storage.setFlashcards(account.flashcards || INITIAL_FLASHCARDS);
    storage.setExams(account.exams || INITIAL_EXAMS);
    if (account.customYouTubeUrls) {
      localStorage.setItem(KEYS.YOUTUBE_URLS, JSON.stringify(account.customYouTubeUrls));
    }
    storage.setOnboarded(true);
    storage.setAuthToken('token_' + account.id + '_' + Date.now());
  },

  syncActiveUserAccount: () => {
    const user = storage.getUser();
    if (!user || !user.email) return;
    const normalized = user.email.toLowerCase().trim();
    const accounts = storage.getRegisteredAccounts();
    if (accounts[normalized]) {
      accounts[normalized] = {
        ...accounts[normalized],
        user: user,
        subjects: storage.getSubjects(),
        sessions: storage.getSessions(),
        habits: storage.getHabits(),
        tasks: storage.getTasks(),
        goals: storage.getGoals(),
        notes: storage.getNotes(),
        achievements: storage.getAchievements(),
        decks: storage.getDecks(),
        flashcards: storage.getFlashcards(),
        exams: storage.getExams(),
        customYouTubeUrls: storage.getCustomYouTubeUrls(),
      };
      storage.saveRegisteredAccounts(accounts);
    }
  },

  // --- Active Workspace Accessors ---

  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(KEYS.USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setUser: (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
      storage.syncActiveUserAccount();
    } else {
      localStorage.removeItem(KEYS.USER);
    }
  },

  getSubjects: (): Subject[] => {
    const data = localStorage.getItem(KEYS.SUBJECTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setSubjects: (subjects: Subject[]) => {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
    storage.syncActiveUserAccount();
  },

  getSessions: (): StudySession[] => {
    const data = localStorage.getItem(KEYS.SESSIONS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setSessions: (sessions: StudySession[]) => {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    storage.syncActiveUserAccount();
  },

  getHabits: (): Habit[] => {
    const data = localStorage.getItem(KEYS.HABITS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setHabits: (habits: Habit[]) => {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    storage.syncActiveUserAccount();
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setTasks: (tasks: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    storage.syncActiveUserAccount();
  },

  getGoals: (): Goal[] => {
    const data = localStorage.getItem(KEYS.GOALS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setGoals: (goals: Goal[]) => {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
    storage.syncActiveUserAccount();
  },

  getNotes: (): Note[] => {
    const data = localStorage.getItem(KEYS.NOTES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setNotes: (notes: Note[]) => {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
    storage.syncActiveUserAccount();
  },

  getAchievements: (): Achievement[] => {
    const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setAchievements: (achievements: Achievement[]) => {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    storage.syncActiveUserAccount();
  },

  // --- Flashcards Accessors ---
  getDecks: (): FlashcardDeck[] => {
    const data = localStorage.getItem(KEYS.DECKS);
    if (!data) return INITIAL_DECKS;
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_DECKS;
    }
  },

  setDecks: (decks: FlashcardDeck[]) => {
    localStorage.setItem(KEYS.DECKS, JSON.stringify(decks));
    storage.syncActiveUserAccount();
  },

  getFlashcards: (): Flashcard[] => {
    const data = localStorage.getItem(KEYS.FLASHCARDS);
    if (!data) return INITIAL_FLASHCARDS;
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_FLASHCARDS;
    }
  },

  setFlashcards: (flashcards: Flashcard[]) => {
    localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(flashcards));
    storage.syncActiveUserAccount();
  },

  // --- Exams Accessors ---
  getExams: (): Exam[] => {
    const data = localStorage.getItem(KEYS.EXAMS);
    if (!data) return INITIAL_EXAMS;
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_EXAMS;
    }
  },

  setExams: (exams: Exam[]) => {
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(exams));
    storage.syncActiveUserAccount();
  },

  getCustomYouTubeUrls: (): string[] => {
    const data = localStorage.getItem(KEYS.YOUTUBE_URLS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCustomYouTubeUrl: (url: string) => {
    if (!url) return;
    const existing = storage.getCustomYouTubeUrls();
    const updated = [url, ...existing.filter(u => u !== url)].slice(0, 8);
    localStorage.setItem(KEYS.YOUTUBE_URLS, JSON.stringify(updated));
  },

  getOnboarded: (): boolean => {
    return localStorage.getItem(KEYS.ONBOARDED) === 'true';
  },

  isOnboarded: (): boolean => {
    return storage.getOnboarded();
  },

  authenticateUserAccount: async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const res = await storage.authenticateAccount(email, password);
    return { success: res.success, error: res.error, user: res.account?.user };
  },

  registerUserAccount: async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const res = await storage.registerAccount(email, password, name);
    return { success: res.success, error: res.error, user: res.account?.user };
  },

  setOnboarded: (val: boolean) => {
    localStorage.setItem(KEYS.ONBOARDED, String(val));
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem(KEYS.AUTH_TOKEN);
  },

  setAuthToken: (token: string | null) => {
    if (token) {
      localStorage.setItem(KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(KEYS.AUTH_TOKEN);
    }
  },

  loadDemoData: () => {
    storage.setUser(INITIAL_USER);
    storage.setSubjects(INITIAL_SUBJECTS);
    storage.setSessions(INITIAL_SESSIONS);
    storage.setHabits(INITIAL_HABITS);
    storage.setTasks(INITIAL_TASKS);
    storage.setGoals(INITIAL_GOALS);
    storage.setNotes(INITIAL_NOTES);
    storage.setAchievements(INITIAL_ACHIEVEMENTS);
    storage.setDecks(INITIAL_DECKS);
    storage.setFlashcards(INITIAL_FLASHCARDS);
    storage.setExams(INITIAL_EXAMS);
    storage.setOnboarded(true);
    storage.setAuthToken('token_demo_scholar');
  },

  initCleanUserData: (user: UserProfile, chosenSubjects: string[], chosenHabits: string[]) => {
    const cleanSubjects: Subject[] = chosenSubjects.map((name, i) => {
      const colors = ['#06b6d4', '#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];
      return {
        id: 'sub_' + Date.now() + '_' + i,
        name,
        code: name.substring(0, 3).toUpperCase() + ' ' + (100 + i * 10),
        icon: 'BookOpen',
        color: colors[i % colors.length],
        weeklyGoalHours: 6,
        completedMinutesThisWeek: 0,
        totalStudyMinutes: 0,
        createdAt: new Date().toISOString(),
      };
    });

    const cleanHabits: Habit[] = chosenHabits.map((name, i) => {
      const colors = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];
      return {
        id: 'hab_' + Date.now() + '_' + i,
        userId: user.id,
        name,
        icon: 'Flame',
        color: colors[i % colors.length],
        category: 'discipline',
        frequency: 'daily',
        targetDaysPerWeek: 7,
        currentStreak: 0,
        longestStreak: 0,
        completions: {},
        createdAt: new Date().toISOString(),
      };
    });

    // Create default starting deck
    const initialDeck: FlashcardDeck = {
      id: 'deck_' + Date.now(),
      userId: user.id,
      subjectName: cleanSubjects[0]?.name || 'General Studies',
      title: 'First Active Recall Deck',
      description: 'Key definitions, formulas, and theorems for fast daily review.',
      color: '#06b6d4',
      createdAt: new Date().toISOString()
    };

    const initialCard: Flashcard = {
      id: 'card_' + Date.now(),
      deckId: initialDeck.id,
      userId: user.id,
      front: 'What is the Feynman Technique for rapid concept mastery?',
      back: '1. Pick a concept.\n2. Teach it to a 10-year-old in simple words.\n3. Identify knowledge gaps.\n4. Review and simplify the explanation.',
      tags: ['Study Strategy', 'Memory'],
      interval: 1,
      repetition: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    storage.setUser(user);
    storage.setSubjects(cleanSubjects);
    storage.setSessions([]);
    storage.setHabits(cleanHabits);
    storage.setTasks([]);
    storage.setGoals([]);
    storage.setNotes([]);
    storage.setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlockedAt: undefined, progress: 0 })));
    storage.setDecks([initialDeck]);
    storage.setFlashcards([initialCard]);
    storage.setExams([]);
    storage.syncActiveUserAccount();
  },

  exportBackup: (): string => {
    const data = {
      user: storage.getUser(),
      subjects: storage.getSubjects(),
      sessions: storage.getSessions(),
      habits: storage.getHabits(),
      tasks: storage.getTasks(),
      goals: storage.getGoals(),
      notes: storage.getNotes(),
      achievements: storage.getAchievements(),
      decks: storage.getDecks(),
      flashcards: storage.getFlashcards(),
      exams: storage.getExams(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importBackup: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.user) storage.setUser(data.user);
      if (data.subjects) storage.setSubjects(data.subjects);
      if (data.sessions) storage.setSessions(data.sessions);
      if (data.habits) storage.setHabits(data.habits);
      if (data.tasks) storage.setTasks(data.tasks);
      if (data.goals) storage.setGoals(data.goals);
      if (data.notes) storage.setNotes(data.notes);
      if (data.achievements) storage.setAchievements(data.achievements);
      if (data.decks) storage.setDecks(data.decks);
      if (data.flashcards) storage.setFlashcards(data.flashcards);
      if (data.exams) storage.setExams(data.exams);
      storage.syncActiveUserAccount();
      return true;
    } catch {
      return false;
    }
  },

  clearAll: () => {
    const user = storage.getUser();
    if (user) {
      storage.initCleanUserData(user, ['Data Structures', 'Calculus', 'Physics'], ['Daily 25m Focus', 'Solve 1 Problem']);
    } else {
      localStorage.clear();
    }
  }
};
