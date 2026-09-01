import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { storage } from '../lib/storage';
import { INITIAL_USER } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logout: () => void;
  clearAuthError: () => void;
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
  const [authError, setAuthError] = useState<string | null>(null);

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

  const clearAuthError = () => {
    setAuthError(null);
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (!email || !pass) {
      const err = 'Please enter both email and password.';
      setAuthError(err);
      return { success: false, error: err };
    }

    const res = await storage.authenticateUserAccount(email, pass);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed.');
      return { success: false, error: res.error };
    }

    if (res.user) {
      setUser(res.user);
      const onboarded = storage.isOnboarded();
      setIsOnboarded(onboarded);
      window.location.reload();
      return { success: true };
    }

    return { success: false, error: 'Unknown authentication error' };
  };

  const signup = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (!name.trim()) {
      const err = 'Please provide your full name.';
      setAuthError(err);
      return { success: false, error: err };
    }
    if (!email.trim() || !email.includes('@')) {
      const err = 'Please enter a valid email address.';
      setAuthError(err);
      return { success: false, error: err };
    }
    if (pass.length < 4) {
      const err = 'Password must be at least 4 characters long.';
      setAuthError(err);
      return { success: false, error: err };
    }

    const res = await storage.registerUserAccount(name, email, pass);
    if (!res.success) {
      setAuthError(res.error || 'Account creation failed.');
      return { success: false, error: res.error };
    }

    if (res.user) {
      setUser(res.user);
      setIsOnboarded(false);
      window.location.reload();
      return { success: true };
    }

    return { success: false, error: 'Unknown signup error' };
  };

  const loginAsGuest = () => {
    storage.loadDemoData();
    setUser(INITIAL_USER);
    setIsOnboarded(true);
    window.location.reload();
  };

  const logout = () => {
    storage.syncActiveUserAccount();
    storage.setAuthToken(null);
    setUser(null);
    setIsOnboarded(false);
    window.location.reload();
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
        authError,
        login,
        signup,
        loginAsGuest,
        logout,
        clearAuthError,
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
