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
    // onIdTokenChanged is preferable over onAuthStateChanged because it fires on 
    // token refresh, sign in, sign out. Ensures we never submit a stale token.
    const unsubscribe = onIdTokenChanged(auth, async (fbUser) => {
      try {
        if (!fbUser) {
          // Logged out
          setFirebaseUser(null);
          setUser(null);
          setAuthToken(null);
          queryClient.clear(); // Clear application server state
          setIsLoading(false);
          return;
        }

        const token = await fbUser.getIdToken();
        setAuthToken(token); // keep client in sync
        setFirebaseUser(fbUser);

        // Fetch application user data from backend
        // We sync Identity (Firebase) with Data (Backend)
        const appUser = await AuthService.getBackendUser(fbUser);
        
        if (appUser) {
          setUser(appUser);
        } else {
          // A Firebase user exists but a backend record does not!
          // We force logout or they enter a "limbo" / wizard onboarding state
          // For now, logout immediately to prevent corrupted session forms
          console.warn('Backend user missing for identity:', fbUser.uid);
          await AuthService.logout();
        }
      } catch (error) {
        console.error('Session sync error:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
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
