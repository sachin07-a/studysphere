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
  Exam,
  CourseGrade,
  StudyPeer
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
  gpaCourses?: CourseGrade[];
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
  GPA_COURSES: 'studysphere_gpa_courses',
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
    id: 'exam_dsa_final',
    userId: 'usr_guest',
    subjectId: 'sub_dsa',
    subjectName: 'Data Structures & Algorithms',
    title: 'Comprehensive Midterm & Coding Practical',
    examDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:30',
    location: 'Turing Hall 301',
    targetGrade: 'A+',
    weightPercent: 35,
    syllabusUnits: [
      { id: 'u1', name: 'Asymptotic Analysis & Recurrences', completed: true, estimatedHours: 4 },
      { id: 'u2', name: 'Red-Black Trees & AVL Self-Balancing Trees', completed: true, estimatedHours: 6 },
      { id: 'u3', name: 'Graph Traversal (DFS/BFS, Dijkstra, Bellman-Ford)', completed: false, estimatedHours: 8 },
      { id: 'u4', name: 'Dynamic Programming (Memoization & 2D Tabulation)', completed: false, estimatedHours: 10 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam_os_final',
    userId: 'usr_guest',
    subjectId: 'sub_os',
    subjectName: 'Operating Systems & Architecture',
    title: 'Final Examination & Concurrency Lab',
    examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    location: 'Science Complex B',
    targetGrade: 'A',
    weightPercent: 40,
    syllabusUnits: [
      { id: 'u201', name: 'Process Synchronization & Mutex/Semaphores', completed: true, estimatedHours: 5 },
      { id: 'u202', name: 'Virtual Memory & Page Replacement Algorithms (LRU)', completed: false, estimatedHours: 7 },
      { id: 'u203', name: 'File Systems & Disk Scheduling (SCAN/C-SCAN)', completed: false, estimatedHours: 5 }
    ],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_GPA_COURSES: CourseGrade[] = [
  {
    id: 'course_1',
    userId: 'usr_guest',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS 301',
    credits: 4,
    targetGrade: 'A',
    assignments: [
      { id: 'a1', name: 'Midterm Exam', weight: 30, score: 92, maxScore: 100 },
      { id: 'a2', name: 'Programming Projects (3)', weight: 30, score: 96, maxScore: 100 },
      { id: 'a3', name: 'Quizzes & Homework', weight: 10, score: 95, maxScore: 100 },
      { id: 'a4', name: 'Final Examination', weight: 30, score: 0, maxScore: 100 }
    ]
  },
  {
    id: 'course_2',
    userId: 'usr_guest',
    courseName: 'Operating Systems & Concurrency',
    courseCode: 'CS 340',
    credits: 3,
    targetGrade: 'A-',
    assignments: [
      { id: 'a21', name: 'Lab Shell Project', weight: 25, score: 90, maxScore: 100 },
      { id: 'a22', name: 'Midterm Exam', weight: 25, score: 84, maxScore: 100 },
      { id: 'a23', name: 'Kernel Memory Lab', weight: 20, score: 88, maxScore: 100 },
      { id: 'a24', name: 'Final Exam', weight: 30, score: 0, maxScore: 100 }
    ]
  },
  {
    id: 'course_3',
    userId: 'usr_guest',
    courseName: 'Linear Algebra & Matrix Methods',
    courseCode: 'MATH 220',
    credits: 4,
    targetGrade: 'A',
    assignments: [
      { id: 'a31', name: 'Exam 1 (Vectors & Spaces)', weight: 25, score: 94, maxScore: 100 },
      { id: 'a32', name: 'Exam 2 (Eigenvalues & SVD)', weight: 25, score: 91, maxScore: 100 },
      { id: 'a33', name: 'Weekly Problem Sets', weight: 20, score: 98, maxScore: 100 },
      { id: 'a34', name: 'Cumulative Final', weight: 30, score: 0, maxScore: 100 }
    ]
  }
];

export const INITIAL_PEERS: StudyPeer[] = [
  {
    id: 'peer_1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    major: 'Neuroscience & Pre-Med',
    currentSubject: 'Organic Chemistry II',
    focusMinutesToday: 185,
    isStudying: true,
    streak: 14,
    statusMessage: 'Memorizing reaction mechanisms for Friday midterm 🧪'
  },
  {
    id: 'peer_2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    major: 'Computer Science',
    currentSubject: 'Distributed Systems',
    focusMinutesToday: 240,
    isStudying: true,
    streak: 21,
    statusMessage: 'Debugging Paxos consensus implementation 💻'
  },
  {
    id: 'peer_3',
    name: 'Aaliyah Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    major: 'Mechanical Engineering',
    currentSubject: 'Thermodynamics & Heat Transfer',
    focusMinutesToday: 120,
    isStudying: true,
    streak: 9,
    statusMessage: 'Solving Rankine power cycle enthalpy problems ⚙️'
  },
  {
    id: 'peer_4',
    name: 'Julian Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    major: 'Economics & Finance',
    currentSubject: 'Econometrics & Stata',
    focusMinutesToday: 95,
    isStudying: false,
    streak: 5,
    statusMessage: 'Taking 10m Pomodoro coffee break ☕'
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
  // --- Multi-User Accounts Registry ---

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

  registerUserAccount: async (
    name: string, 
    email: string, 
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = storage.getRegisteredAccounts();

    if (accounts[cleanEmail]) {
      return { 
        success: false, 
        error: 'An account with this email already exists. Please log in.' 
      };
    }

    const passwordHash = await hashPassword(password);
    const userId = 'usr_' + Date.now();

    const newUser: UserProfile = {
      id: userId,
      name: name.trim() || 'Scholar',
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      major: 'Computer Science',
      academicYear: 'Freshman',
      level: 1,
      xp: 0,
      dailyGoalMinutes: 240,
      streakCount: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    const newAccount: UserAccount = {
      id: userId,
      email: cleanEmail,
      passwordHash,
      name: newUser.name,
      user: newUser,
      subjects: [],
      sessions: [],
      habits: [],
      tasks: [],
      goals: [],
      notes: [],
      achievements: INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlockedAt: undefined, progress: 0 })),
      decks: [],
      flashcards: [],
      exams: [],
      gpaCourses: [],
      customYouTubeUrls: [],
      createdAt: new Date().toISOString(),
    };

    accounts[cleanEmail] = newAccount;
    storage.saveRegisteredAccounts(accounts);

    // Set active workspace
    storage.setActiveAccount(newAccount);
    storage.setOnboarded(false);

    return { success: true, user: newUser };
  },

  authenticateUserAccount: async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = storage.getRegisteredAccounts();
    const account = accounts[cleanEmail];

    if (!account) {
      return { 
        success: false, 
        error: 'Account not found. Please check your email or click Sign Up.' 
      };
    }

    const providedHash = await hashPassword(password);
    if (account.passwordHash !== providedHash) {
      return { 
        success: false, 
        error: 'Incorrect password. Please try again.' 
      };
    }

    // Successfully authenticated -> load this user's isolated workspace
    storage.setActiveAccount(account);
    return { success: true, user: account.user };
  },

  setActiveAccount: (account: UserAccount) => {
    storage.setUser(account.user);
    storage.setSubjects(account.subjects || []);
    storage.setSessions(account.sessions || []);
    storage.setHabits(account.habits || []);
    storage.setTasks(account.tasks || []);
    storage.setGoals(account.goals || []);
    storage.setNotes(account.notes || []);
    storage.setAchievements(account.achievements || INITIAL_ACHIEVEMENTS);
    storage.setDecks(account.decks || []);
    storage.setFlashcards(account.flashcards || []);
    storage.setExams(account.exams || []);
    storage.setGPACourses(account.gpaCourses || []);
    storage.setAuthToken('token_' + account.id + '_' + Date.now());
  },

  syncActiveUserAccount: () => {
    const user = storage.getUser();
    if (!user || !user.email) return;

    const cleanEmail = user.email.toLowerCase();
    const accounts = storage.getRegisteredAccounts();
    if (accounts[cleanEmail]) {
      accounts[cleanEmail] = {
        ...accounts[cleanEmail],
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
        gpaCourses: storage.getGPACourses(),
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
    if (!data) return INITIAL_ACHIEVEMENTS;
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  setAchievements: (achievements: Achievement[]) => {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    storage.syncActiveUserAccount();
  },

  // --- Flashcard Decks Accessors ---
  getDecks: (): FlashcardDeck[] => {
    const data = localStorage.getItem(KEYS.DECKS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setDecks: (decks: FlashcardDeck[]) => {
    localStorage.setItem(KEYS.DECKS, JSON.stringify(decks));
    storage.syncActiveUserAccount();
  },

  getFlashcards: (): Flashcard[] => {
    const data = localStorage.getItem(KEYS.FLASHCARDS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setFlashcards: (flashcards: Flashcard[]) => {
    localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(flashcards));
    storage.syncActiveUserAccount();
  },

  // --- Exams Accessors ---
  getExams: (): Exam[] => {
    const data = localStorage.getItem(KEYS.EXAMS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setExams: (exams: Exam[]) => {
    localStorage.setItem(KEYS.EXAMS, JSON.stringify(exams));
    storage.syncActiveUserAccount();
  },

  // --- GPA Courses Accessors ---
  getGPACourses: (): CourseGrade[] => {
    const data = localStorage.getItem(KEYS.GPA_COURSES);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  setGPACourses: (courses: CourseGrade[]) => {
    localStorage.setItem(KEYS.GPA_COURSES, JSON.stringify(courses));
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

  isOnboarded: (): boolean => {
    return localStorage.getItem(KEYS.ONBOARDED) === 'true';
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
    storage.setGPACourses(INITIAL_GPA_COURSES);
    storage.setOnboarded(true);
    storage.setAuthToken('token_guest_demo_2026');
  },

  initCleanUserData: (
    user: UserProfile,
    chosenSubjects: string[],
    chosenHabits: string[]
  ) => {
    const cleanSubjects: Subject[] = chosenSubjects.map((subName, i) => {
      const colors = ['#06b6d4', '#6366f1', '#a855f7', '#10b981', '#f59e0b', '#f43f5e'];
      const icons = ['BookOpen', 'Code2', 'Cpu', 'Brain', 'Layers', 'Globe'];
      const codes = ['CS 101', 'MATH 201', 'SCI 105', 'ENG 110', 'HIST 120', 'BUS 102'];
      return {
        id: 'sub_' + (i + 1),
        name: subName,
        code: codes[i % codes.length],
        icon: icons[i % icons.length],
        color: colors[i % colors.length],
        weeklyGoalHours: 10,
        completedMinutesThisWeek: 0,
        totalStudyMinutes: 0,
        createdAt: new Date().toISOString(),
      };
    });

    const cleanHabits: Habit[] = chosenHabits.map((habitName, i) => {
      const colors = ['#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899'];
      const icons = ['Sparkles', 'Code2', 'BookOpen', 'Check', 'Zap'];
      return {
        id: 'hab_' + (i + 1),
        userId: user.id,
        name: habitName,
        icon: icons[i % icons.length],
        color: colors[i % colors.length],
        category: 'study',
        frequency: 'daily',
        targetDaysPerWeek: 7,
        currentStreak: 0,
        longestStreak: 0,
        completions: {},
        createdAt: new Date().toISOString(),
      };
    });

    // Create default starting deck and sample exam for onboarding
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
    storage.setGPACourses([]);
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
      gpaCourses: storage.getGPACourses(),
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
      if (data.gpaCourses) storage.setGPACourses(data.gpaCourses);
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
