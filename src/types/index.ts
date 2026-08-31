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

// --- Active Recall & Spaced Repetition Types ---
export interface FlashcardDeck {
  id: string;
  userId: string;
  subjectId?: string;
  subjectName: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  userId: string;
  subjectId?: string;
  front: string;
  back: string;
  tags: string[];
  interval: number; // in days
  repetition: number;
  easeFactor: number; // default 2.5
  dueDate: string; // YYYY-MM-DD
  lastReviewedAt?: string;
  createdAt: string;
}

// --- Exam Countdown & Syllabus Mastery Types ---
export interface SyllabusUnit {
  id: string;
  name: string;
  completed: boolean;
  estimatedHours?: number;
  notes?: string;
}

export interface Exam {
  id: string;
  userId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  examDate: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  location?: string;
  targetGrade?: string;
  weightPercent: number; // e.g. 35%
  syllabusUnits: SyllabusUnit[];
  createdAt: string;
}

// --- GPA & Grade Simulator Types ---
export interface CourseAssignment {
  id: string;
  name: string;
  weight: number; // percentage (e.g. 20)
  score: number; // achieved score (e.g. 88)
  maxScore: number; // e.g. 100
}

export interface CourseGrade {
  id: string;
  userId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  targetGrade: string; // A+, A, A-, B+, etc.
  assignments: CourseAssignment[];
}

// --- Virtual Peer Lobby Types ---
export interface StudyPeer {
  id: string;
  name: string;
  avatar: string;
  major: string;
  currentSubject: string;
  focusMinutesToday: number;
  isStudying: boolean;
  streak: number;
  statusMessage?: string;
}
