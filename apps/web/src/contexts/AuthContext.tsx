'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  AuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked. Please allow popups for this site.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials. Please sign in using the original method.';
      case 'auth/cancelled-popup-request':
        return 'The sign-in process was cancelled. Please try again.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations. Please contact support.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled. Please contact support.';
      default:
        return authError.message || 'An unknown error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (user) {
      try {
        await updateProfile(user, { displayName, photoURL });
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Apple Sign-in Error:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    updateUserProfile,
    signInWithGoogle,
    signInWithApple,
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