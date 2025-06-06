"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, fetchUserProfile } from '@/app/lib/api';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUserId = localStorage.getItem('userId');

    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUserId(savedUserId);
    }
  }, []);
  
  useEffect(() => {
    if (token && userId) {
      refreshUserProfile();
    } else {
      setUser(null);
    }
  }, [token, userId]);
  
  const refreshUserProfile = async () => {
    if (!token || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchUserProfile(token, userId);
      setUser(profile);
    } catch (e: any) {
      setError(e.message || 'Failed to load user profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin({ email, password });
      setToken(data.token);
      setUserId(data.userId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRegister({ name, email, password, role });
      setToken(data.token);
      setUserId(data.userId);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useUserData() {
  const { user } = useAuth();
  return user;
}
