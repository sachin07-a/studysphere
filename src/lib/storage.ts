import { 
  UserProfile, 
  Subject, 
  StudySession, 
  Habit, 
  Task, 
  Goal, 
  Note, 
  Achievement 
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
  ONBOARDED: 'studysphere_onboarded',
  AUTH_TOKEN: 'studysphere_auth_token',
  REGISTERED_ACCOUNTS: 'studysphere_registered_accounts',
  YOUTUBE_URLS: 'studysphere_custom_youtube_urls',
};

// Simple fast SHA-256 hash using Web Crypto API or fallback
export const hashPassword = async (password: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_studysphere_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash
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
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = storage.getRegisteredAccounts();

    if (accounts[cleanEmail]) {
      return { 
        success: false, 
        error: 'An account with this email address already exists. Please Sign In.' 
      };
    }

    if (password.length < 4) {
      return {
        success: false,
        error: 'Password must be at least 4 characters long.'
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
  ): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = storage.getRegisteredAccounts();
    const account = accounts[cleanEmail];

    if (!account) {
      return { 
        success: false, 
        error: 'No account found with this email. Please check your spelling or Sign Up.' 
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
    if (!data) return INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlockedAt: undefined, progress: 0 }));
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

  isOnboarded: (): boolean => {
    return localStorage.getItem(KEYS.ONBOARDED) === 'true';
  },

  setOnboarded: (val: boolean) => {
    localStorage.setItem(KEYS.ONBOARDED, val ? 'true' : 'false');
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

  // Custom YouTube URLs history
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
    const list = storage.getCustomYouTubeUrls();
    const updated = [url, ...list.filter(u => u !== url)].slice(0, 10);
    localStorage.setItem(KEYS.YOUTUBE_URLS, JSON.stringify(updated));
  },

  // Load sample demo data for 1-click test drive
  loadDemoData: () => {
    storage.setUser(INITIAL_USER);
    storage.setSubjects(INITIAL_SUBJECTS);
    storage.setSessions(INITIAL_SESSIONS);
    storage.setHabits(INITIAL_HABITS);
    storage.setTasks(INITIAL_TASKS);
    storage.setGoals(INITIAL_GOALS);
    storage.setNotes(INITIAL_NOTES);
    storage.setAchievements(INITIAL_ACHIEVEMENTS);
    storage.setOnboarded(true);
    storage.setAuthToken('guest_token_demo');
  },

  // Initialize clean data for new users with 0 streaks
  initCleanUserData: (user: UserProfile, subjectNames: string[], habitNames: string[]) => {
    const colorList = ['#6366f1', '#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#f43f5e'];
    
    const cleanSubjects: Subject[] = subjectNames.map((name, i) => ({
      id: 'sub_' + Date.now() + '_' + i,
      name,
      code: name.split(' ').map(w => w[0]).join('').toUpperCase() + '-101',
      icon: i === 0 ? 'BookOpen' : i === 1 ? 'Code' : 'Brain',
      color: colorList[i % colorList.length],
      weeklyGoalHours: 10,
      completedMinutesThisWeek: 0,
      totalStudyMinutes: 0,
      createdAt: new Date().toISOString(),
    }));

    const cleanHabits: Habit[] = habitNames.map((name, i) => ({
      id: 'hab_' + Date.now() + '_' + i,
      userId: user.id,
      name,
      icon: i === 0 ? 'BookOpen' : i === 1 ? 'Code2' : i === 2 ? 'FileText' : 'Sparkles',
      color: colorList[i % colorList.length],
      category: i === 0 ? 'study' : i === 1 ? 'coding' : 'discipline',
      frequency: 'daily',
      targetDaysPerWeek: 7,
      currentStreak: 0,
      longestStreak: 0,
      completions: {},
      createdAt: new Date().toISOString(),
    }));

    storage.setUser(user);
    storage.setSubjects(cleanSubjects);
    storage.setHabits(cleanHabits);
    storage.setSessions([]);
    storage.setTasks([]);
    storage.setGoals([
      {
        id: 'goal_init',
        userId: user.id,
        title: 'Log 50 Hours of Deep Study',
        description: 'Consistent daily focus',
        type: 'hours',
        currentValue: 0,
        targetValue: 50,
        unit: 'Hours',
        deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString(),
      }
    ]);
    storage.setNotes([]);
    storage.setAchievements(INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlockedAt: undefined, progress: 0 })));
    storage.setOnboarded(true);
    storage.syncActiveUserAccount();
  },

  // Export all application state as a JSON string
  exportBackup: (): string => {
    const backup = {
      user: storage.getUser(),
      subjects: storage.getSubjects(),
      sessions: storage.getSessions(),
      habits: storage.getHabits(),
      tasks: storage.getTasks(),
      goals: storage.getGoals(),
      notes: storage.getNotes(),
      achievements: storage.getAchievements(),
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import application state from JSON
  importBackup: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.user) storage.setUser(data.user);
      if (data.subjects) storage.setSubjects(data.subjects);
      if (data.sessions) storage.setSessions(data.sessions);
      if (data.habits) storage.setHabits(data.habits);
      if (data.tasks) storage.setTasks(data.tasks);
      if (data.goals) storage.setGoals(data.goals);
      if (data.notes) storage.setNotes(data.notes);
      if (data.achievements) storage.setAchievements(data.achievements);
      storage.syncActiveUserAccount();
      return true;
    } catch {
      return false;
    }
  },

  // Clear all data to fresh start
  clearAll: () => {
    const accounts = storage.getRegisteredAccounts();
    const user = storage.getUser();
    if (user && user.email && accounts[user.email.toLowerCase()]) {
      delete accounts[user.email.toLowerCase()];
      storage.saveRegisteredAccounts(accounts);
    }
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.SUBJECTS);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.HABITS);
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.GOALS);
    localStorage.removeItem(KEYS.NOTES);
    localStorage.removeItem(KEYS.ACHIEVEMENTS);
    localStorage.removeItem(KEYS.ONBOARDED);
    localStorage.removeItem(KEYS.AUTH_TOKEN);
  },
};
