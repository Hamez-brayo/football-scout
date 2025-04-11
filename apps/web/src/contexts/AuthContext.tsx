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
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ registrationStatus: string }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ registrationStatus: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  signInWithGoogle: () => Promise<{ registrationStatus: string }>;
  signInWithApple: () => Promise<{ registrationStatus: string }>;
  checkRegistrationStatus: (userId: string) => Promise<boolean>;
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // Get the session token and set it as a cookie
        const token = await user.getIdToken();
        Cookies.set('session', token, { 
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      } else {
        // Remove the session cookie when user signs out
        Cookies.remove('session');
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      // Call our backend API to handle sign-in
      const response = await fetch('http://localhost:3002/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign in');
      }

      const data = await response.json();
      
      // Set the session cookie
      Cookies.set('session', token, { 
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Set or remove registration cookie based on status
      if (data.user.registrationStatus === 'COMPLETE') {
        Cookies.set('registration_complete', 'true', {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      } else {
        Cookies.remove('registration_complete');
      }

      return { registrationStatus: data.user.registrationStatus };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      const token = await userCredential.user.getIdToken();
      
      const response = await fetch('http://localhost:3002/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, isSignUp: true }),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          text: text.substring(0, 200) // Log first 200 chars of response
        });
        throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign up');
      }
      
      const data = await response.json();
      setUser(data.user);
      
      // Set the session cookie
      Cookies.set('session', data.token, { 
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Remove registration cookie for new sign-ups
      Cookies.remove('registration_complete');
      
      return { registrationStatus: data.user.registrationStatus };
    } catch (error) {
      console.error('Sign up error:', error);
      // Provide more specific error message
      if (error instanceof Error) {
        if (error.message.includes('non-JSON response')) {
          throw new Error('Server is not responding correctly. Please check if the API server is running.');
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      
      // 1. Sign out from Firebase
      console.log('Signing out from Firebase...');
      await signOut(auth);
      
      // 2. Clear all cookies with domain and path options
      console.log('Clearing cookies...');
      const cookieOptions = {
        path: '/',
        domain: window.location.hostname,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const
      };
      
      // Clear all possible cookies
      ['session', 'registration_complete', 'next-auth.session-token', 'next-auth.callback-url', 'next-auth.csrf-token'].forEach(cookieName => {
        Cookies.remove(cookieName, cookieOptions);
      });
      
      // 3. Clear local storage
      console.log('Clearing local storage...');
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. Reset React state
      console.log('Resetting React state...');
      setUser(null);
      setLoading(false);
      
      // 5. Force a hard reload to clear all state
      console.log('Reloading page...');
      window.location.href = '/';
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, try to clear everything and redirect
      Cookies.remove('session', { path: '/' });
      Cookies.remove('registration_complete', { path: '/' });
      window.location.href = '/';
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
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      
      // Always force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // If user is already signed in, sign them out first
      if (auth.currentUser) {
        await signOut(auth);
      }

      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      
      // Call our backend API to handle sign-in
      const response = await fetch('http://localhost:3002/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign in with Google');
      }

      const data = await response.json();
      
      // Set the session cookie
      Cookies.set('session', token, { 
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Set or remove registration cookie based on status
      if (data.user.registrationStatus === 'COMPLETE') {
        Cookies.set('registration_complete', 'true', {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      } else {
        Cookies.remove('registration_complete');
      }

      return { registrationStatus: data.user.registrationStatus };
    } catch (error: any) {
      // Don't throw for cancelled popup requests
      if (error.code === 'auth/cancelled-popup-request' || 
          error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup was closed');
        return { registrationStatus: 'INCOMPLETE' };
      }
      console.error('Google Sign-in Error:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const signInWithApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      
      // Call our backend API to handle sign-in
      const response = await fetch('http://localhost:3002/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sign in with Apple');
      }

      const data = await response.json();
      
      // Set the session cookie
      Cookies.set('session', token, { 
        expires: 1,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Set or remove registration cookie based on status
      if (data.user.registrationStatus === 'COMPLETE') {
        Cookies.set('registration_complete', 'true', {
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      } else {
        Cookies.remove('registration_complete');
      }

      return { registrationStatus: data.user.registrationStatus };
    } catch (error) {
      console.error('Apple Sign-in Error:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  const checkRegistrationStatus = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3002/api/users/${userId}/registration-status`);
      if (!response.ok) {
        throw new Error('Failed to check registration status');
      }
      const data = await response.json();
      return data.isRegistrationComplete;
    } catch (error) {
      console.error('Error checking registration status:', error);
      return false;
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
    checkRegistrationStatus,
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