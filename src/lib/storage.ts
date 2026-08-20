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
  getUser: (): UserProfile => {
    const data = localStorage.getItem(KEYS.USER);
    if (!data) {
      storage.setUser(INITIAL_USER);
      return INITIAL_USER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_USER;
    }
  },

  setUser: (user: UserProfile) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  getSubjects: (): Subject[] => {
    const data = localStorage.getItem(KEYS.SUBJECTS);
    if (!data) {
      storage.setSubjects(INITIAL_SUBJECTS);
      return INITIAL_SUBJECTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SUBJECTS;
    }
  },

  setSubjects: (subjects: Subject[]) => {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getSessions: (): StudySession[] => {
    const data = localStorage.getItem(KEYS.SESSIONS);
    if (!data) {
      storage.setSessions(INITIAL_SESSIONS);
      return INITIAL_SESSIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SESSIONS;
    }
  },

  setSessions: (sessions: StudySession[]) => {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  },

  getHabits: (): Habit[] => {
    const data = localStorage.getItem(KEYS.HABITS);
    if (!data) {
      storage.setHabits(INITIAL_HABITS);
      return INITIAL_HABITS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_HABITS;
    }
  },

  setHabits: (habits: Habit[]) => {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    if (!data) {
      storage.setTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  },

  setTasks: (tasks: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getGoals: (): Goal[] => {
    const data = localStorage.getItem(KEYS.GOALS);
    if (!data) {
      storage.setGoals(INITIAL_GOALS);
      return INITIAL_GOALS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_GOALS;
    }
  },

  setGoals: (goals: Goal[]) => {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
  },

  getNotes: (): Note[] => {
    const data = localStorage.getItem(KEYS.NOTES);
    if (!data) {
      storage.setNotes(INITIAL_NOTES);
      return INITIAL_NOTES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTES;
    }
  },

  setNotes: (notes: Note[]) => {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  },

  getAchievements: (): Achievement[] => {
    const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
    if (!data) {
      storage.setAchievements(INITIAL_ACHIEVEMENTS);
      return INITIAL_ACHIEVEMENTS;
    }
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

  // Reset to initial mock state
  resetAll: () => {
    storage.setUser(INITIAL_USER);
    storage.setSubjects(INITIAL_SUBJECTS);
    storage.setSessions(INITIAL_SESSIONS);
    storage.setHabits(INITIAL_HABITS);
    storage.setTasks(INITIAL_TASKS);
    storage.setGoals(INITIAL_GOALS);
    storage.setNotes(INITIAL_NOTES);
    storage.setAchievements(INITIAL_ACHIEVEMENTS);
    storage.setOnboarded(true);
  },
};
