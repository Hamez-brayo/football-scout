import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { AuthService, type RegisterInput } from '@/src/services/AuthService';
import { auth } from '@/src/config/firebase';
import { setAuthToken } from '@/src/api/client';
import type { AuthUser } from '@/src/api/auth';

type AuthContextValue = {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Grab the query client to clear the cache upon auth state change/logout
  const queryClient = useQueryClient();

  useEffect(() => {
    // A late lookup must never restore or sign out a superseded identity.
    let generation = 0;
    let activeUid: string | null = null;
    const unsubscribe = onIdTokenChanged(auth, async (fbUser) => {
      const current = ++generation;
      const isCurrent = () => current === generation && auth.currentUser === fbUser;
      if (activeUid !== (fbUser?.uid ?? null) || !fbUser) {
        setUser(null);
        setFirebaseUser(null);
        setAuthToken(null);
        queryClient.clear();
      }
      activeUid = fbUser?.uid ?? null;
      setIsLoading(true);
      try {
        if (!fbUser) return;
        const appUser = await AuthService.getBackendUser(fbUser);
        if (!isCurrent()) return;
        if (appUser) {
          setFirebaseUser(fbUser);
          setUser(appUser);
        } else {
          setFirebaseUser(null);
          setUser(null);
          setAuthToken(null);
          queryClient.clear();
          await AuthService.logout();
        }
      } catch (error) {
        if (!isCurrent()) return;
        setFirebaseUser(null);
        setUser(null);
        setAuthToken(null);
        queryClient.clear();
        console.error('Session sync error:', error);
      } finally {
        if (isCurrent()) setIsLoading(false);
      }
    });

    return () => {
      generation++;
      unsubscribe();
    };
  }, [queryClient]);

  const login = useCallback(async (email: string, password: string) => {
    // We let onIdTokenChanged handle the state propagation! 
    // Calling login just issues the command to Firebase.
    await AuthService.login(email, password);
  }, []);

  const register = useCallback(async (payload: RegisterInput) => {
    await AuthService.register(payload);
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      firebaseUser,
      isAuthenticated: !!user && !!firebaseUser,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, firebaseUser, isLoading, login, register, logout]
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
