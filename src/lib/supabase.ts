import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default mock credentials or user-provided credentials
const SUPABASE_URL = localStorage.getItem('studysphere_supabase_url') || 'https://demo-placeholder.supabase.co';
const SUPABASE_ANON_KEY = localStorage.getItem('studysphere_supabase_key') || 'demo-anon-key-studysphere-2026';

let supabaseInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  const url = localStorage.getItem('studysphere_supabase_url');
  const key = localStorage.getItem('studysphere_supabase_key');
  return !!(url && key && !url.includes('demo-placeholder'));
};

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
};

export const updateSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('studysphere_supabase_url', url);
  localStorage.setItem('studysphere_supabase_key', key);
  supabaseInstance = createClient(url, key);
};

export const SUPABASE_SQL_SCHEMA = `
-- StudySphere Complete PostgreSQL Schema

-- Users profile extension
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  major TEXT,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  daily_goal_minutes INT DEFAULT 240,
  streak_count INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  icon TEXT,
  color TEXT,
  weekly_goal_hours NUMERIC DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study Sessions
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects ON DELETE SET NULL,
  topic TEXT,
  duration_minutes INT NOT NULL,
  mode TEXT NOT NULL,
  productivity_rating INT DEFAULT 5,
  notes TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Habits
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  frequency TEXT DEFAULT 'daily',
  category TEXT DEFAULT 'study',
  target_days_per_week INT DEFAULT 7,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit Completions
CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'hours',
  current_value NUMERIC DEFAULT 0,
  target_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  deadline DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Lecture',
  pinned BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, code)
);

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
`;
