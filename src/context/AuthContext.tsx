import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storage } from '../lib/storage';
import { INITIAL_USER } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  completeOnboarding: (
    data: { name: string; major: string; dailyGoalMinutes: number },
    selectedSubjects: string[],
    selectedHabits: string[]
  ) => void;
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = storage.getUser();
    const onboarded = storage.isOnboarded();
    const token = storage.getAuthToken();

    if (savedUser && token) {
      setUser(savedUser);
      setIsOnboarded(onboarded);
    } else {
      setUser(null);
      setIsOnboarded(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    const existing = storage.getUser();
    const activeUser: UserProfile = existing || {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
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

    setUser(activeUser);
    storage.setUser(activeUser);
    storage.setAuthToken('token_' + Date.now());
    const onboarded = storage.isOnboarded();
    setIsOnboarded(onboarded);
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      major: 'Computer Science',
      academicYear: 'Freshman',
      level: 1,
      xp: 0,
      dailyGoalMinutes: 240,
      streakCount: 0, // Clean 0 streak for new users!
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    storage.setUser(newUser);
    storage.setAuthToken('token_' + Date.now());
    storage.setOnboarded(false);
    setIsOnboarded(false);
    return true;
  };

  const loginAsGuest = () => {
    storage.loadDemoData();
    setUser(INITIAL_USER);
    setIsOnboarded(true);
  };

  const logout = () => {
    storage.setAuthToken(null);
    setUser(null);
    setIsOnboarded(false);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    storage.setUser(nextUser);
  };

  const completeOnboarding = (
    data: { name: string; major: string; dailyGoalMinutes: number },
    selectedSubjects: string[],
    selectedHabits: string[]
  ) => {
    if (!user) return;
    const nextUser: UserProfile = {
      ...user,
      name: data.name,
      major: data.major,
      dailyGoalMinutes: data.dailyGoalMinutes,
      streakCount: 0,
      longestStreak: 0,
    };

    storage.initCleanUserData(nextUser, selectedSubjects, selectedHabits);
    setUser(nextUser);
    setIsOnboarded(true);
    // Reload window state to re-populate StudyContext
    window.location.reload();
  };

  const addXP = (amount: number): { leveledUp: boolean; newLevel: number } => {
    if (!user) return { leveledUp: false, newLevel: 1 };
    const newXP = user.xp + amount;
    const newLevel = Math.max(1, Math.floor(newXP / 1000) + 1);
    const leveledUp = newLevel > user.level;

    const nextUser = {
      ...user,
      xp: newXP,
      level: newLevel,
    };

    setUser(nextUser);
    storage.setUser(nextUser);

    return { leveledUp, newLevel };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!storage.getAuthToken(),
        isOnboarded,
        isLoading,
        login,
        signup,
        loginAsGuest,
        logout,
        updateProfile,
        completeOnboarding,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
