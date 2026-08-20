export type TimerMode = 'pomodoro' | 'short_break' | 'long_break' | 'custom' | 'stopwatch';

export type Priority = 'high' | 'medium' | 'low';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  major: string;
  academicYear: string;
  level: number;
  xp: number;
  dailyGoalMinutes: number;
  streakCount: number;
  longestStreak: number;
  lastActiveDate: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: string;
  color: string;
  weeklyGoalHours: number;
  completedMinutesThisWeek: number;
  totalStudyMinutes: number;
  examDate?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  durationMinutes: number;
  mode: TimerMode;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO
  endTime: string; // ISO
  productivityRating: number; // 1-5
  notes?: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  category: 'study' | 'wellness' | 'coding' | 'reading' | 'discipline';
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek: number;
  currentStreak: number;
  longestStreak: number;
  completions: Record<string, boolean>; // 'YYYY-MM-DD' -> true
  createdAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  subtasks: SubTask[];
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  description: string;
  type: 'hours' | 'tasks' | 'streak' | 'custom';
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  subjectId?: string;
  title: string;
  content: string;
  category: 'Lecture' | 'Summary' | 'Cheatsheet' | 'Idea' | 'Exam Prep';
  pinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  xpReward: number;
  category: 'streak' | 'timer' | 'tasks' | 'habits' | 'scholar';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'recommendation' | 'alert' | 'praise';
  impact: string;
  actionLabel?: string;
  actionView?: string;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'session' | 'task' | 'exam' | 'goal' | 'habit';
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  color: string;
  subjectName?: string;
  details?: string;
  completed?: boolean;
}

export interface ProductivityBreakdown {
  score: number; // 0-100
  tier: string;
  studyTimeScore: number;
  tasksScore: number;
  habitsScore: number;
  consistencyScore: number;
  comparisonYesterday: number;
  comparisonWeeklyAvg: number;
  primaryRecommendation: string;
}
