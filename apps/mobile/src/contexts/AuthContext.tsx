import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authApi, AuthUser } from '@/src/api/auth';
import { setAuthToken } from '@/src/api/client';

const AUTH_TOKEN_KEY = 'vysion_auth_token';

type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

      if (!storedToken) {
        setAuthToken(null);
        setToken(null);
        setUser(null);
        return;
      }

      setAuthToken(storedToken);
      const me = await authApi.me();
      setToken(storedToken);
      setUser(me);
    } catch {
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
    setAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterInput) => {
    const response = await authApi.register(payload);
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, response.token);
    setAuthToken(response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      initializeAuth,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, initializeAuth, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
