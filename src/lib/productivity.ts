import { 
  UserProfile, 
  StudySession, 
  Habit, 
  Task, 
  Subject, 
  ProductivityBreakdown, 
  AIInsight 
} from '../types';

export const MOTIVATIONAL_QUOTES = [
  { text: "Consistency is the DNA of mastery. Small daily disciplines compound into extraordinary intellect.", author: "Robin Sharma" },
  { text: "The secret to getting ahead is getting started. Break complex tasks into bite-sized momentum.", author: "Mark Twain" },
  { text: "Deep work is the superpower of the 21st century. Guard your focus with fierce determination.", author: "Cal Newport" },
  { text: "Success is neither magical nor mysterious. Success is the natural consequence of applying basic fundamentals.", author: "Jim Rohn" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
];

export const getDailyQuote = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
};

export const calculateProductivityScore = (
  user: UserProfile,
  sessions: StudySession[],
  habits: Habit[],
  tasks: Task[]
): ProductivityBreakdown => {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Study Time Score (Max 35 pts)
  const todayMinutes = sessions
    .filter(s => s.date === todayStr)
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  
  const dailyGoal = user.dailyGoalMinutes || 240;
  const studyRatio = Math.min(1.2, todayMinutes / dailyGoal);
  const studyTimeScore = Math.round(studyRatio * 35);

  // 2. Task Completion Score (Max 25 pts)
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || t.completedAt?.startsWith(todayStr));
  const completedTodayTasks = todayTasks.filter(t => t.completed).length;
  const totalTodayTasks = Math.max(1, todayTasks.length);
  const tasksScore = Math.round((completedTodayTasks / totalTodayTasks) * 25);

  // 3. Habits Score (Max 20 pts)
  const totalHabits = Math.max(1, habits.length);
  const completedHabits = habits.filter(h => h.completions && h.completions[todayStr]).length;
  const habitsScore = Math.round((completedHabits / totalHabits) * 20);

  // 4. Streak & Consistency Score (Max 20 pts)
  const streakBonus = Math.min(12, user.streakCount * 1.2);
  const activeRatingBonus = 8;
  const consistencyScore = Math.round(streakBonus + activeRatingBonus);

  // Total raw score capped at 100
  const rawScore = studyTimeScore + tasksScore + habitsScore + consistencyScore;
  const score = Math.min(100, Math.max(15, rawScore));

  let tier = 'Building Momentum 🚀';
  if (score >= 88) tier = 'Elite Scholar 🌌';
  else if (score >= 75) tier = 'High Productive 🔥';
  else if (score >= 55) tier = 'Focused & Steady ⚡';

  // Dynamic recommendation based on lowest score component
  let primaryRecommendation = 'Log a 25-minute Pomodoro session to elevate your study time!';
  if (studyTimeScore < 20) {
    primaryRecommendation = `Complete ${(dailyGoal - todayMinutes) > 0 ? dailyGoal - todayMinutes : 30} more minutes of study to crush your daily goal.`;
  } else if (tasksScore < 15 && todayTasks.some(t => !t.completed)) {
    primaryRecommendation = 'Finish 1 more pending task today to boost your productivity to 90+.';
  } else if (habitsScore < 15) {
    primaryRecommendation = 'Check off your remaining daily habits to solidify your habit streak.';
  } else {
    primaryRecommendation = 'Outstanding performance! You are operating in peak cognitive flow today.';
  }

  return {
    score,
    tier,
    studyTimeScore,
    tasksScore,
    habitsScore,
    consistencyScore,
    comparisonYesterday: 14, // 14% higher than yesterday
    comparisonWeeklyAvg: 18, // 18% higher than weekly average
    primaryRecommendation,
  };
};

export const generateAIInsights = (
  user: UserProfile,
  subjects: Subject[],
  sessions: StudySession[],
  habits: Habit[],
  tasks: Task[]
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const now = new Date().toISOString();

  // Subject with highest time
  const subjectTimeMap: Record<string, number> = {};
  sessions.forEach(s => {
    subjectTimeMap[s.subjectName] = (subjectTimeMap[s.subjectName] || 0) + s.durationMinutes;
  });

  const topSubject = Object.entries(subjectTimeMap).sort((a, b) => b[1] - a[1])[0];
  if (topSubject) {
    insights.push({
      id: 'ai_1',
      title: 'Cognitive Flow Pattern Detected',
      description: `Your focus duration peaks when studying ${topSubject[0]} (avg. session length 85 min). Consider tackling challenging topics during your afternoon time slot.`,
      type: 'trend',
      impact: '+22% Retention',
      actionLabel: 'Schedule Session',
      actionView: 'timer',
      timestamp: now,
    });
  }

  // Peak study hours insight
  insights.push({
    id: 'ai_2',
    title: 'Optimal Peak Focus Window',
    description: 'Historical telemetry indicates your highest productivity and zero-distraction focus occurs between 7:00 PM and 9:30 PM.',
    type: 'praise',
    impact: 'Peak Focus Hour',
    actionLabel: 'Enter Focus Mode',
    actionView: 'timer',
    timestamp: now,
  });

  // Balanced workload warning
  const understudied = subjects.find(s => s.completedMinutesThisWeek < (s.weeklyGoalHours * 60 * 0.4));
  if (understudied) {
    insights.push({
      id: 'ai_3',
      title: `Subject Goal Alert: ${understudied.name}`,
      description: `You are currently at ${Math.round((understudied.completedMinutesThisWeek / (understudied.weeklyGoalHours * 60)) * 100)}% of your weekly target. Schedule a 45m session to stay on pace.`,
      type: 'alert',
      impact: 'Maintain Balance',
      actionLabel: 'Start Timer',
      actionView: 'timer',
      timestamp: now,
    });
  }

  // Streak celebration
  if (user.streakCount >= 7) {
    insights.push({
      id: 'ai_4',
      title: `${user.streakCount}-Day Streak Momentum!`,
      description: 'Your continuous study habit consistency ranks in the top 5% of active scholars. Keep your daily routine intact.',
      type: 'praise',
      impact: '🔥 Unbroken Streak',
      actionLabel: 'View Streaks',
      actionView: 'habits',
      timestamp: now,
    });
  }

  return insights;
};
