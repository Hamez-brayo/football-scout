import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  sessionError: string | null;
  retrySession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [sessionError, setSessionError] = useState<string | null>(null);
  const syncSession = useRef<() => Promise<void>>(async () => {});
  const retrySession = useCallback(() => syncSession.current(), []);

  // Grab the query client to clear the cache upon auth state change/logout
  const queryClient = useQueryClient();

  useEffect(() => {
    // A late lookup must never restore or sign out a superseded identity.
    let generation = 0;
    let activeUid: string | null = null;
    let hasBackendUser = false;
    const synchronize = async (fbUser: FirebaseUser | null) => {
      const current = ++generation;
      const isCurrent = () => current === generation && auth.currentUser === fbUser;
      const identityChanged = activeUid !== (fbUser?.uid ?? null);
      if (identityChanged || !fbUser) {
        hasBackendUser = false;
        setSessionError(null);
        setUser(null);
        setFirebaseUser(null);
        setAuthToken(null);
        queryClient.clear();
      }
      activeUid = fbUser?.uid ?? null;
      // Refreshing the same identity must preserve the mounted screen and its drafts.
      if (!hasBackendUser) setIsLoading(true);
      try {
        if (!fbUser) return;
        const appUser = await AuthService.getBackendUser(fbUser);
        if (!isCurrent()) return;
        if (appUser) {
          hasBackendUser = true;
          setSessionError(null);
          setFirebaseUser(fbUser);
          setUser(appUser);
        } else {
          hasBackendUser = false;
          setFirebaseUser(null);
          setUser(null);
          setAuthToken(null);
          queryClient.clear();
          await AuthService.logout();
        }
      } catch (error) {
        if (!isCurrent()) return;
        const status = (error as { statusCode?: number })?.statusCode;
        const code = (error as { code?: string })?.code;
        const invalidIdentity =
          [401, 403, 404].includes(status ?? 0) ||
          ['auth/user-disabled', 'auth/user-token-expired', 'auth/invalid-user-token'].includes(
            code ?? '',
          );
        if (invalidIdentity) {
          hasBackendUser = false;
          setFirebaseUser(null);
          setUser(null);
          setAuthToken(null);
          queryClient.clear();
          try {
            await AuthService.logout();
          } catch {
            if (isCurrent()) setSessionError('Unable to finish signing out. Please retry.');
          }
        } else {
          // Keep a previously confirmed account mounted so drafts survive an API outage.
          setSessionError(error instanceof Error ? error.message : 'Unable to sync your session.');
        }
      } finally {
        if (isCurrent()) setIsLoading(false);
      }
    };
    syncSession.current = () => synchronize(auth.currentUser);
    const unsubscribe = onIdTokenChanged(auth, synchronize);

    return () => {
      generation++;
      syncSession.current = async () => {};
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
      sessionError,
      retrySession,
      login,
      register,
      logout,
    }),
    [user, firebaseUser, isLoading, sessionError, retrySession, login, register, logout],
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
