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
  completeOnboarding: (data: { name: string; major: string; dailyGoalMinutes: number }) => void;
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local session
    const savedUser = storage.getUser();
    const onboarded = storage.isOnboarded();
    setUser(savedUser);
    setIsOnboarded(onboarded);
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Simulated auth with instant feedback
    const activeUser: UserProfile = {
      ...storage.getUser(),
      email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
    };
    setUser(activeUser);
    storage.setUser(activeUser);
    storage.setAuthToken('token_' + Date.now());
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
      streakCount: 1,
      longestStreak: 1,
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
    setUser(INITIAL_USER);
    storage.setUser(INITIAL_USER);
    storage.setOnboarded(true);
    setIsOnboarded(true);
    storage.setAuthToken('guest_token_demo');
  };

  const logout = () => {
    storage.setAuthToken(null);
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    storage.setUser(nextUser);
  };

  const completeOnboarding = (data: { name: string; major: string; dailyGoalMinutes: number }) => {
    if (!user) return;
    const nextUser = {
      ...user,
      name: data.name,
      major: data.major,
      dailyGoalMinutes: data.dailyGoalMinutes,
    };
    setUser(nextUser);
    storage.setUser(nextUser);
    storage.setOnboarded(true);
    setIsOnboarded(true);
  };

  const addXP = (amount: number): { leveledUp: boolean; newLevel: number } => {
    if (!user) return { leveledUp: false, newLevel: 1 };
    const newXP = user.xp + amount;
    // Level formula: Level N requires N * 1000 XP
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
        isAuthenticated: !!user,
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
