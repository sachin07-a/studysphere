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
};

export const storage = {
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
      currentStreak: 0, // Clean 0 streak!
      longestStreak: 0,
      completions: {}, // Empty completions!
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
      version: '1.0.0',
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
      return true;
    } catch {
      return false;
    }
  },

  // Clear all data to fresh start
  clearAll: () => {
    localStorage.clear();
  },
};
