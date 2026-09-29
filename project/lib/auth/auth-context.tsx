'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, Language } from '@/types';
import { DEMO_CREDENTIALS } from '@/lib/constants';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  language: Language;
  textSize: 'default' | 'lg' | 'xl';
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  setTextSize: (size: 'default' | 'lg' | 'xl') => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'vandhan-auth';
const LANG_KEY = 'vandhan-lang';
const TEXT_SIZE_KEY = 'vandhan-text-size';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [textSize, setTextSizeState] = useState<'default' | 'lg' | 'xl'>('default');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
      const lang = localStorage.getItem(LANG_KEY) as Language | null;
      if (lang) setLanguageState(lang);
      const ts = localStorage.getItem(TEXT_SIZE_KEY) as 'default' | 'lg' | 'xl' | null;
      if (ts) setTextSizeState(ts);
    } catch {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (textSize === 'default') {
      document.documentElement.removeAttribute('data-text-size');
    } else {
      document.documentElement.setAttribute('data-text-size', textSize);
    }
  }, [textSize]);

  const login = useCallback((u: User) => {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  }, []);

  const setTextSize = useCallback((size: 'default' | 'lg' | 'xl') => {
    setTextSizeState(size);
    localStorage.setItem(TEXT_SIZE_KEY, size);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, language, textSize, login, logout, setLanguage, setTextSize }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function verifyOtp(mobile: string, otp: string): User | null {
  if (otp !== DEMO_CREDENTIALS.otp) return null;
  if (mobile === DEMO_CREDENTIALS.studentMobile) {
    return { id: 'u1', mobile, role: 'STUDENT', name: 'Asha Munda', state: 'Jharkhand', district: 'Khunti' };
  }
  if (mobile === DEMO_CREDENTIALS.officerMobile) {
    return { id: 'u2', mobile, role: 'STATE_OFFICER', name: 'Anil Kumar', state: 'Jharkhand', district: 'Ranchi' };
  }
  return null;
}
