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

// Helper to format relative date strings
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_USER: UserProfile = {
  id: 'usr_sachin_108',
  name: 'Sachin Sharma',
  email: 'sachin.scholar@studysphere.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  major: 'Computer Science & AI',
  academicYear: 'Senior Year',
  level: 4,
  xp: 3850,
  dailyGoalMinutes: 360, // 6 hours
  streakCount: 12,
  longestStreak: 18,
  lastActiveDate: getRelativeDate(0),
  createdAt: '2026-01-10T10:00:00Z',
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub_math',
    name: 'Mathematics & Linear Algebra',
    code: 'MATH-301',
    icon: 'Sigma',
    color: '#6366f1', // Indigo
    weeklyGoalHours: 15,
    completedMinutesThisWeek: 690, // 11.5 hours
    totalStudyMinutes: 2840,
    examDate: getRelativeDate(14),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'sub_dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS-204',
    icon: 'Code',
    color: '#06b6d4', // Cyan
    weeklyGoalHours: 20,
    completedMinutesThisWeek: 990, // 16.5 hours
    totalStudyMinutes: 4120,
    examDate: getRelativeDate(22),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'sub_ml',
    name: 'Machine Learning & Neural Nets',
    code: 'AI-401',
    icon: 'Brain',
    color: '#a855f7', // Purple
    weeklyGoalHours: 14,
    completedMinutesThisWeek: 570, // 9.5 hours
    totalStudyMinutes: 2310,
    examDate: getRelativeDate(30),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'sub_os',
    name: 'Operating Systems & Concurrency',
    code: 'CS-310',
    icon: 'Cpu',
    color: '#f59e0b', // Amber
    weeklyGoalHours: 10,
    completedMinutesThisWeek: 420, // 7 hours
    totalStudyMinutes: 1750,
    examDate: getRelativeDate(18),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'sub_web',
    name: 'Distributed Systems & Cloud',
    code: 'CS-440',
    icon: 'Globe',
    color: '#10b981', // Emerald
    weeklyGoalHours: 8,
    completedMinutesThisWeek: 360, // 6 hours
    totalStudyMinutes: 1480,
    examDate: getRelativeDate(45),
    createdAt: '2026-01-15T09:00:00Z',
  },
];

// Generate past 14 days of realistic sessions
export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'sess_1',
    userId: 'usr_sachin_108',
    subjectId: 'sub_dsa',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Dynamic Programming on Trees & Bitmasking',
    durationMinutes: 90,
    mode: 'pomodoro',
    date: getRelativeDate(0),
    startTime: new Date(Date.now() - 4 * 3600000).toISOString(),
    endTime: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    productivityRating: 5,
    notes: 'Solved 3 hard problems. Tree DP state transitions feel intuitive now.',
  },
  {
    id: 'sess_2',
    userId: 'usr_sachin_108',
    subjectId: 'sub_math',
    subjectName: 'Mathematics & Linear Algebra',
    topic: 'Singular Value Decomposition (SVD) and PCA',
    durationMinutes: 75,
    mode: 'pomodoro',
    date: getRelativeDate(0),
    startTime: new Date(Date.now() - 7 * 3600000).toISOString(),
    endTime: new Date(Date.now() - 5.75 * 3600000).toISOString(),
    productivityRating: 5,
    notes: 'Understood low-rank approximation matrices and orthogonal bases.',
  },
  {
    id: 'sess_3',
    userId: 'usr_sachin_108',
    subjectId: 'sub_ml',
    subjectName: 'Machine Learning & Neural Nets',
    topic: 'Transformer Multi-Head Self-Attention derivations',
    durationMinutes: 60,
    mode: 'custom',
    date: getRelativeDate(0),
    startTime: new Date(Date.now() - 9 * 3600000).toISOString(),
    endTime: new Date(Date.now() - 8 * 3600000).toISOString(),
    productivityRating: 4,
    notes: 'Computed query, key, value matrix shapes and scaled dot-product attention.',
  },
  {
    id: 'sess_4',
    userId: 'usr_sachin_108',
    subjectId: 'sub_dsa',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Graph Shortest Paths & Dijkstra with MinHeap',
    durationMinutes: 120,
    mode: 'stopwatch',
    date: getRelativeDate(-1),
    startTime: '2026-08-19T14:00:00Z',
    endTime: '2026-08-19T16:00:00Z',
    productivityRating: 5,
  },
  {
    id: 'sess_5',
    userId: 'usr_sachin_108',
    subjectId: 'sub_os',
    subjectName: 'Operating Systems & Concurrency',
    topic: 'Virtual Memory Paging & TLB Hit Rate simulations',
    durationMinutes: 80,
    mode: 'pomodoro',
    date: getRelativeDate(-1),
    startTime: '2026-08-19T18:00:00Z',
    endTime: '2026-08-19T19:20:00Z',
    productivityRating: 4,
  },
  {
    id: 'sess_6',
    userId: 'usr_sachin_108',
    subjectId: 'sub_math',
    subjectName: 'Mathematics & Linear Algebra',
    topic: 'Eigenvalue calculations & Matrix Diagonalization',
    durationMinutes: 100,
    mode: 'pomodoro',
    date: getRelativeDate(-2),
    startTime: '2026-08-18T10:00:00Z',
    endTime: '2026-08-18T11:40:00Z',
    productivityRating: 5,
  },
  {
    id: 'sess_7',
    userId: 'usr_sachin_108',
    subjectId: 'sub_web',
    subjectName: 'Distributed Systems & Cloud',
    topic: 'Raft Consensus Protocol & Leader Election',
    durationMinutes: 90,
    mode: 'custom',
    date: getRelativeDate(-2),
    startTime: '2026-08-18T15:00:00Z',
    endTime: '2026-08-18T16:30:00Z',
    productivityRating: 5,
  },
  {
    id: 'sess_8',
    userId: 'usr_sachin_108',
    subjectId: 'sub_ml',
    subjectName: 'Machine Learning & Neural Nets',
    topic: 'Backpropagation Gradient Descent in PyTorch',
    durationMinutes: 110,
    mode: 'pomodoro',
    date: getRelativeDate(-3),
    startTime: '2026-08-17T11:00:00Z',
    endTime: '2026-08-17T12:50:00Z',
    productivityRating: 4,
  },
  {
    id: 'sess_9',
    userId: 'usr_sachin_108',
    subjectId: 'sub_dsa',
    subjectName: 'Data Structures & Algorithms',
    topic: 'Segment Trees with Lazy Propagation',
    durationMinutes: 130,
    mode: 'stopwatch',
    date: getRelativeDate(-4),
    startTime: '2026-08-16T14:00:00Z',
    endTime: '2026-08-16T16:10:00Z',
    productivityRating: 5,
  },
  {
    id: 'sess_10',
    userId: 'usr_sachin_108',
    subjectId: 'sub_os',
    subjectName: 'Operating Systems & Concurrency',
    topic: 'Mutex Semaphores & Dining Philosophers Solution',
    durationMinutes: 70,
    mode: 'pomodoro',
    date: getRelativeDate(-5),
    startTime: '2026-08-15T16:00:00Z',
    endTime: '2026-08-15T17:10:00Z',
    productivityRating: 4,
  },
  {
    id: 'sess_11',
    userId: 'usr_sachin_108',
    subjectId: 'sub_math',
    subjectName: 'Mathematics & Linear Algebra',
    topic: 'Fourier Transforms & Spectral Analysis',
    durationMinutes: 85,
    mode: 'pomodoro',
    date: getRelativeDate(-6),
    startTime: '2026-08-14T09:30:00Z',
    endTime: '2026-08-14T10:55:00Z',
    productivityRating: 5,
  },
];

// Helper to generate completion mapping for streaks
const generatePastCompletions = (daysActive: number, skipDays: number[] = []) => {
  const result: Record<string, boolean> = {};
  for (let i = 0; i <= daysActive; i++) {
    if (!skipDays.includes(i)) {
      result[getRelativeDate(-i)] = true;
    }
  }
  return result;
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'hab_1',
    userId: 'usr_sachin_108',
    name: 'Deep Study 4+ Hours',
    icon: 'BookOpen',
    color: '#6366f1',
    category: 'study',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 12,
    longestStreak: 18,
    completions: generatePastCompletions(14),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'hab_2',
    userId: 'usr_sachin_108',
    name: 'LeetCode Problem of the Day',
    icon: 'Code2',
    color: '#06b6d4',
    category: 'coding',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 12,
    longestStreak: 15,
    completions: generatePastCompletions(12),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'hab_3',
    userId: 'usr_sachin_108',
    name: 'Read Research Paper / Book (30m)',
    icon: 'FileText',
    color: '#a855f7',
    category: 'reading',
    frequency: 'daily',
    targetDaysPerWeek: 6,
    currentStreak: 8,
    longestStreak: 12,
    completions: generatePastCompletions(10, [1, 5]),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'hab_4',
    userId: 'usr_sachin_108',
    name: 'Anki Flashcard Active Recall (20m)',
    icon: 'Sparkles',
    color: '#f59e0b',
    category: 'discipline',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 12,
    longestStreak: 16,
    completions: generatePastCompletions(13),
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'hab_5',
    userId: 'usr_sachin_108',
    name: 'Posture Stretch & 2.5L Hydration',
    icon: 'HeartPulse',
    color: '#10b981',
    category: 'wellness',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    currentStreak: 14,
    longestStreak: 21,
    completions: generatePastCompletions(14),
    createdAt: '2026-01-15T09:00:00Z',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    userId: 'usr_sachin_108',
    subjectId: 'sub_dsa',
    title: 'Implement Dijkstra & Bellman-Ford Shortest Path Benchmarks in C++',
    description: 'Compare runtime performance with dense vs sparse adjacency lists.',
    priority: 'high',
    dueDate: getRelativeDate(0),
    completed: false,
    subtasks: [
      { id: 'st_1', title: 'Write adjacency list graph class', completed: true },
      { id: 'st_2', title: 'Implement Priority Queue Dijkstra', completed: true },
      { id: 'st_3', title: 'Add negative cycle detection for Bellman-Ford', completed: false },
    ],
    createdAt: '2026-08-18T10:00:00Z',
  },
  {
    id: 'task_2',
    userId: 'usr_sachin_108',
    subjectId: 'sub_math',
    title: 'Review Singular Value Decomposition (SVD) Proofs & Exercises',
    description: 'Work through Chapter 6 problems on orthogonal rank reduction.',
    priority: 'high',
    dueDate: getRelativeDate(0),
    completed: false,
    subtasks: [
      { id: 'st_4', title: 'Derive covariance matrix diagonalization', completed: true },
      { id: 'st_5', title: 'Solve exercises 6.1 through 6.8', completed: false },
    ],
    createdAt: '2026-08-19T08:00:00Z',
  },
  {
    id: 'task_3',
    userId: 'usr_sachin_108',
    subjectId: 'sub_ml',
    title: 'Finish PyTorch Multi-Head Self-Attention implementation',
    description: 'Build query/key/value projection heads and forward pass.',
    priority: 'medium',
    dueDate: getRelativeDate(1),
    completed: false,
    subtasks: [
      { id: 'st_6', title: 'Draft Attention module class', completed: true },
      { id: 'st_7', title: 'Write unit tests on tensor dimensions', completed: false },
    ],
    createdAt: '2026-08-19T14:00:00Z',
  },
  {
    id: 'task_4',
    userId: 'usr_sachin_108',
    subjectId: 'sub_os',
    title: 'Prepare Operating Systems Midterm Cheat Sheet',
    description: 'Paging formulas, TLB access times, Deadlock conditions.',
    priority: 'high',
    dueDate: getRelativeDate(3),
    completed: false,
    subtasks: [
      { id: 'st_8', title: 'Summarize Coffman conditions', completed: false },
      { id: 'st_9', title: 'Calculate 2-level page table memory offsets', completed: false },
    ],
    createdAt: '2026-08-17T11:00:00Z',
  },
  {
    id: 'task_5',
    userId: 'usr_sachin_108',
    subjectId: 'sub_web',
    title: 'Distributed Consensus Raft Architecture Diagram',
    description: 'Draw cluster state transitions for leader heartbeat election.',
    priority: 'low',
    dueDate: getRelativeDate(5),
    completed: false,
    subtasks: [],
    createdAt: '2026-08-18T16:00:00Z',
  },
  {
    id: 'task_6',
    userId: 'usr_sachin_108',
    subjectId: 'sub_math',
    title: 'Submit Linear Algebra Problem Set #5',
    description: 'All 8 vector space transformations typed in LaTeX.',
    priority: 'high',
    dueDate: getRelativeDate(0),
    completed: true,
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    subtasks: [
      { id: 'st_10', title: 'LaTeX compilation', completed: true },
      { id: 'st_11', title: 'PDF upload to portal', completed: true },
    ],
    createdAt: '2026-08-16T09:00:00Z',
  },
  {
    id: 'task_7',
    userId: 'usr_sachin_108',
    subjectId: 'sub_dsa',
    title: 'Solve Daily Hard DP problem on LeetCode',
    priority: 'medium',
    dueDate: getRelativeDate(0),
    completed: true,
    completedAt: new Date(Date.now() - 10800000).toISOString(),
    subtasks: [],
    createdAt: '2026-08-20T06:00:00Z',
  },
  {
    id: 'task_8',
    userId: 'usr_sachin_108',
    subjectId: 'sub_ml',
    title: 'Read "Attention Is All You Need" paper',
    priority: 'medium',
    dueDate: getRelativeDate(-1),
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    subtasks: [],
    createdAt: '2026-08-18T10:00:00Z',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_1',
    userId: 'usr_sachin_108',
    title: 'Log 100 Hours of Deep Study This Month',
    description: 'Focus heavily on Core CS algorithms and Applied Machine Learning.',
    type: 'hours',
    currentValue: 74,
    targetValue: 100,
    unit: 'Hours',
    deadline: getRelativeDate(11),
    completed: false,
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'goal_2',
    userId: 'usr_sachin_108',
    subjectId: 'sub_dsa',
    title: 'Solve 50 Advanced LeetCode Problems',
    description: 'Focus on Dynamic Programming, Graphs, and Advanced Segment Trees.',
    type: 'tasks',
    currentValue: 38,
    targetValue: 50,
    unit: 'Problems',
    deadline: getRelativeDate(18),
    completed: false,
    createdAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'goal_3',
    userId: 'usr_sachin_108',
    title: 'Achieve a 21-Day Unbroken Study Streak',
    description: 'Study at least 3 hours and check in all core habits daily.',
    type: 'streak',
    currentValue: 12,
    targetValue: 21,
    unit: 'Days',
    deadline: getRelativeDate(9),
    completed: false,
    createdAt: '2026-08-08T00:00:00Z',
  },
  {
    id: 'goal_4',
    userId: 'usr_sachin_108',
    subjectId: 'sub_math',
    title: 'Score 95%+ in Linear Algebra Midterm Exam',
    description: 'Complete all 6 practice mock exams and master matrix eigenvalues.',
    type: 'custom',
    currentValue: 85,
    targetValue: 100,
    unit: '% Ready',
    deadline: getRelativeDate(14),
    completed: false,
    createdAt: '2026-08-01T00:00:00Z',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    userId: 'usr_sachin_108',
    subjectId: 'sub_dsa',
    title: 'Graph Traversal & Shortest Path Cheat Sheet',
    content: `# Graph Shortest Path Algorithms

### 1. Dijkstra Algorithm
- **Time Complexity:** $O((V + E) \\log V)$ using Min-Heap / \`std::priority_queue\`
- **Constraint:** Non-negative edge weights only!
- **Greedy approach:** Always expands the globally closest unvisited vertex.

\`\`\`cpp
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
dist[src] = 0;
pq.push({0, src});
while(!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if(d > dist[u]) continue;
    for(auto& [v, w] : adj[u]) {
        if(dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.push({dist[v], v});
        }
    }
}
\`\`\`

### 2. Bellman-Ford
- Works with **negative weights**
- Detects negative weight cycles in $O(V \\cdot E)$ time.`,
    category: 'Cheatsheet',
    pinned: true,
    tags: ['C++', 'Graphs', 'Algorithms', 'InterviewPrep'],
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-08-19T17:30:00Z',
  },
  {
    id: 'note_2',
    userId: 'usr_sachin_108',
    subjectId: 'sub_math',
    title: 'Singular Value Decomposition (SVD) Intuition & Formulas',
    content: `# SVD (Singular Value Decomposition)

Every real matrix $A \\in \\mathbb{R}^{m \\times n}$ can be factored into:

$$A = U \\Sigma V^T$$

Where:
- $U \\in \\mathbb{R}^{m \\times m}$: Orthogonal matrix of Left Singular Vectors (Eigenvectors of $AA^T$)
- $\\Sigma \\in \\mathbb{R}^{m \\times n}$: Diagonal matrix of singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge 0$
- $V \\in \\mathbb{R}^{n \\times n}$: Orthogonal matrix of Right Singular Vectors (Eigenvectors of $A^TA$)

### Applications:
1. **Principal Component Analysis (PCA)**
2. **Image Compression & Low-rank Matrix Approximation**
3. **Pseudoinverse ($A^+$) computation**`,
    category: 'Summary',
    pinned: true,
    tags: ['Math', 'LinearAlgebra', 'PCA', 'DataScience'],
    createdAt: '2026-08-17T14:20:00Z',
    updatedAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 'note_3',
    userId: 'usr_sachin_108',
    subjectId: 'sub_ml',
    title: 'Transformer Multi-Head Attention Architecture Notes',
    content: `# Multi-Head Self-Attention Formula

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

### Key Insights:
- Scaling factor $\\frac{1}{\\sqrt{d_k}}$ prevents vanishing gradients in softmax when dimensions grow large.
- Multi-head attention allows the model to jointly attend to information at different positions from different representation subspaces.`,
    category: 'Lecture',
    pinned: false,
    tags: ['AI', 'Transformers', 'DeepLearning', 'PyTorch'],
    createdAt: '2026-08-18T19:00:00Z',
    updatedAt: '2026-08-18T19:00:00Z',
  },
  {
    id: 'note_4',
    userId: 'usr_sachin_108',
    subjectId: 'sub_os',
    title: 'OS Paging & Virtual Memory Calculations',
    content: `# Virtual Memory & Page Tables

- **Page Size:** $4\\text{ KB} = 2^{12}\\text{ bytes} \\implies 12\\text{-bit offset}$.
- **Virtual Address:** 32-bit $\\implies$ 20 bits for Page Number, 12 bits for Offset.
- **Effective Access Time (EAT):**
$$\\text{EAT} = \\text{Hit Rate} \\times (\\text{TLB} + \\text{RAM}) + (1 - \\text{Hit Rate}) \\times (\\text{TLB} + 2\\times\\text{RAM})$$`,
    category: 'Exam Prep',
    pinned: false,
    tags: ['OS', 'VirtualMemory', 'Hardware', 'ExamPrep'],
    createdAt: '2026-08-19T09:30:00Z',
    updatedAt: '2026-08-19T09:30:00Z',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_1',
    code: 'first_step',
    title: 'First Step',
    description: 'Complete your first ever focused study session.',
    icon: 'Footprints',
    tier: 'bronze',
    xpReward: 100,
    category: 'timer',
    unlockedAt: '2026-01-15T10:00:00Z',
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'ach_2',
    code: 'pomodoro_pioneer',
    title: 'Pomodoro Pioneer',
    description: 'Complete 10 focused Pomodoro cycles.',
    icon: 'Timer',
    tier: 'bronze',
    xpReward: 250,
    category: 'timer',
    unlockedAt: '2026-01-20T15:00:00Z',
    progress: 10,
    maxProgress: 10,
  },
  {
    id: 'ach_3',
    code: 'streak_titan_7',
    title: '7-Day Streak Titan',
    description: 'Maintain an unbroken daily study streak for 7 days.',
    icon: 'Flame',
    tier: 'silver',
    xpReward: 500,
    category: 'streak',
    unlockedAt: '2026-08-15T22:00:00Z',
    progress: 7,
    maxProgress: 7,
  },
  {
    id: 'ach_4',
    code: 'streak_immortal_30',
    title: 'Streak Immortal',
    description: 'Build a legendary 30-day unbroken study streak.',
    icon: 'Zap',
    tier: 'gold',
    xpReward: 1500,
    category: 'streak',
    progress: 12,
    maxProgress: 30,
  },
  {
    id: 'ach_5',
    code: 'task_crusher_25',
    title: 'Task Crusher',
    description: 'Complete 25 academic tasks and assignments.',
    icon: 'CheckCheck',
    tier: 'silver',
    xpReward: 400,
    category: 'tasks',
    unlockedAt: '2026-08-16T18:00:00Z',
    progress: 25,
    maxProgress: 25,
  },
  {
    id: 'ach_6',
    code: 'focus_master_50h',
    title: 'Focus Master (50 Hours)',
    description: 'Accumulate 50 total hours of deep focused study time.',
    icon: 'Hourglass',
    tier: 'silver',
    xpReward: 600,
    category: 'scholar',
    unlockedAt: '2026-08-18T12:00:00Z',
    progress: 50,
    maxProgress: 50,
  },
  {
    id: 'ach_7',
    code: 'century_club_100h',
    title: 'Century Club (100 Hours)',
    description: 'Conquer 100 total hours of verified study time.',
    icon: 'Crown',
    tier: 'gold',
    xpReward: 1200,
    category: 'scholar',
    progress: 74,
    maxProgress: 100,
  },
  {
    id: 'ach_8',
    code: 'night_owl',
    title: 'Night Owl Scholar',
    description: 'Complete a productive study session between 10 PM and 2 AM.',
    icon: 'Moon',
    tier: 'bronze',
    xpReward: 200,
    category: 'timer',
    unlockedAt: '2026-08-19T23:30:00Z',
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'ach_9',
    code: 'deep_work_monk',
    title: 'Deep Work Monk',
    description: 'Complete a single continuous study session of 90+ minutes.',
    icon: 'Shield',
    tier: 'gold',
    xpReward: 750,
    category: 'timer',
    unlockedAt: '2026-08-19T16:00:00Z',
    progress: 1,
    maxProgress: 1,
  },
  {
    id: 'ach_10',
    code: 'polymath_5',
    title: 'The Polymath',
    description: 'Study 5 distinct subjects within a single 7-day span.',
    icon: 'Compass',
    tier: 'silver',
    xpReward: 500,
    category: 'scholar',
    unlockedAt: '2026-08-18T20:00:00Z',
    progress: 5,
    maxProgress: 5,
  },
  {
    id: 'ach_11',
    code: 'goal_getter_5',
    title: 'Goal Getter',
    description: 'Successfully complete 5 academic or habit goals.',
    icon: 'Target',
    tier: 'silver',
    xpReward: 600,
    category: 'scholar',
    progress: 3,
    maxProgress: 5,
  },
  {
    id: 'ach_12',
    code: 'habit_architect',
    title: 'Habit Architect',
    description: 'Check off all daily habits with 100% perfection for a full week.',
    icon: 'Sparkles',
    tier: 'gold',
    xpReward: 1000,
    category: 'habits',
    unlockedAt: '2026-08-17T21:00:00Z',
    progress: 7,
    maxProgress: 7,
  },
  {
    id: 'ach_13',
    code: 'code_warrior',
    title: 'Code Warrior',
    description: 'Log 20 coding & algorithmic problem solving sessions.',
    icon: 'Terminal',
    tier: 'silver',
    xpReward: 450,
    category: 'scholar',
    unlockedAt: '2026-08-19T16:00:00Z',
    progress: 20,
    maxProgress: 20,
  },
  {
    id: 'ach_14',
    code: 'scholar_supreme_lvl5',
    title: 'Scholar Supreme',
    description: 'Ascend to Student Level 5 by earning 5,000 XP.',
    icon: 'Award',
    tier: 'gold',
    xpReward: 1000,
    category: 'scholar',
    progress: 3850,
    maxProgress: 5000,
  },
  {
    id: 'ach_15',
    code: 'early_bird',
    title: 'Early Bird Mastery',
    description: 'Complete a focused study session before 7:00 AM.',
    icon: 'Sun',
    tier: 'bronze',
    xpReward: 250,
    category: 'timer',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'ach_16',
    code: 'diamond_transcendence',
    title: 'Diamond Transcendence',
    description: 'Reach 10,000 total XP and achieve Grandmaster Scholar rank.',
    icon: 'Gem',
    tier: 'diamond',
    xpReward: 3000,
    category: 'scholar',
    progress: 3850,
    maxProgress: 10000,
  },
];
