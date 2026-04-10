'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { exchangeSession } from '@/lib/session';
import { setToken, clearToken, getToken } from '@/lib/token';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean; // Firebase loading
  tokenLoading: boolean; // JWT loading
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Firebase loading
  const [token, setTokenState] = useState<string | null>(getToken());
  const [tokenLoading, setTokenLoading] = useState(false);
  const lastIdTokenRef = useRef<string | null>(null);

  useEffect(() => {
    // Listen for both auth state and ID token changes (token refresh)
    const handleAuthChange = async (user: User | null) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setTokenLoading(true);
        try {
          const idToken = await user.getIdToken();
          if (lastIdTokenRef.current === idToken && getToken()) {
            setTokenLoading(false);
            return; // Prevent duplicate session exchange
          }
          lastIdTokenRef.current = idToken;
          const backendJwt = await exchangeSession();
          setToken(backendJwt);
          setTokenState(backendJwt);
        } catch (err) {
          clearToken();
          setTokenState(null);
        } finally {
          setTokenLoading(false);
        }
      } else {
        clearToken();
        setTokenState(null);
        lastIdTokenRef.current = null;
      }
    };
    const unsub1 = onAuthStateChanged(auth, handleAuthChange);
    // @ts-ignore: onIdTokenChanged exists in Firebase v9+
    const unsub2 = auth.onIdTokenChanged?.(handleAuthChange);
    return () => {
      unsub1();
      if (unsub2) unsub2();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle session exchange and JWT storage
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle session exchange and JWT storage
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle session exchange and JWT storage
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      clearToken();
      setTokenState(null);
      lastIdTokenRef.current = null;
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value: AuthContextType & {
    token: string | null;
    tokenLoading: boolean;
    isAuthenticated: boolean;
  } = {
    user,
    token,
    loading,
    tokenLoading,
    isAuthenticated: !!user && !!token && !loading && !tokenLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 