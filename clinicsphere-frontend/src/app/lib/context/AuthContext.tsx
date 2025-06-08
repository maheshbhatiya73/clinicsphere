"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserProfile, login as apiLogin, register as apiRegister } from "@/app/lib/api/api";

type User = {
  profile_pic: string;
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  authChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to save token and user to state + localStorage
  const saveAuth = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
  };

  // Helper to clear auth data
  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // Fetch profile using current token
  const fetchProfile = async (token: string) => {
    try {
      const profile = await fetchUserProfile(token);
      const userData: User = {
        id: profile.id,
        _id: profile._id || profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role || "patient",
        profile_pic: profile.profile_pic || "",
      };
      setUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      clearAuth();
      setError("Failed to fetch user profile");
      throw err;
    }
  };

  // On mount, check token and fetch profile if token exists
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (!tokenFromStorage) {
      setLoading(false);
      setAuthChecked(true);
      return;
    }

    fetchProfile(tokenFromStorage)
      .then(() => setToken(tokenFromStorage))
      .catch(() => clearAuth())
      .finally(() => {
        setLoading(false);
        setAuthChecked(true);
      });
  }, []);

  // Login: call API, save token, then fetch profile
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin({ email, password });
      saveAuth(data.access_token, {
        id: "", // temporarily empty, will be replaced after fetchProfile
        _id: "",
        name: "",
        email: "",
        role: "",
        profile_pic: "",
      });
      // Fetch full profile
      const userData = await fetchProfile(data.access_token);
      saveAuth(data.access_token, userData); // update with full user data
    } catch (e: any) {
      const errorMessage = e.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register: call API, save token, then fetch profile
  const register = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRegister({ name, email, password, role });
      saveAuth(data.access_token, {
        id: "",
        _id: "",
        name: "",
        email: "",
        role: "",
        profile_pic: "",
      });
      const userData = await fetchProfile(data.access_token);
      saveAuth(data.access_token, userData);
    } catch (e: any) {
      const errorMessage = e.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    clearAuth();
    setError(null);
  };

  // Refresh profile manually
  const refreshUserProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await fetchProfile(token);
      setError(null);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        authChecked,
        login,
        register,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
