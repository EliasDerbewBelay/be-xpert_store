"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User, LoginRequest, RegisterRequest } from "@/types";
import { login as apiLogin, getProfile, refreshToken as apiRefreshToken } from "@/lib/api/auth";
import { registerUser } from "@/lib/api/users";
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
  clearStoredTokens,
} from "./tokens";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserProfile = useCallback(async (accessToken: string) => {
    try {
      const profile = await getProfile(accessToken);
      setUser(profile);
      setToken(accessToken);
    } catch {
      // Access token may be expired, attempt refresh
      const storedRefresh = getStoredRefreshToken();
      if (storedRefresh) {
        try {
          const refreshed = await apiRefreshToken(storedRefresh);
          setStoredTokens(refreshed.access_token, refreshed.refresh_token);
          const newProfile = await getProfile(refreshed.access_token);
          setUser(newProfile);
          setToken(refreshed.access_token);
          return;
        } catch {
          // Refresh failed
        }
      }
      clearStoredTokens();
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const storedToken = getStoredAccessToken();
    if (storedToken) {
      fetchUserProfile(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  const login = async (credentials: LoginRequest) => {
    const res = await apiLogin(credentials);
    setStoredTokens(res.access_token, res.refresh_token);
    setToken(res.access_token);
    const profile = await getProfile(res.access_token);
    setUser(profile);
  };

  const register = async (data: RegisterRequest) => {
    const newUser = await registerUser(data);
    return newUser;
  };

  const logout = () => {
    clearStoredTokens();
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    const currentToken = token || getStoredAccessToken();
    if (currentToken) {
      await fetchUserProfile(currentToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
