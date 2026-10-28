import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { authApi } from '@/src/api/auth';
import { setAuthToken } from '@/src/api/client';
import type { AuthUser } from '@/src/api/auth';

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
};

/**
 * AuthService controls interaction with Firebase identity 
 * and backend application data.
 * 
 * Flow:
 * 1. Firebase resolves identity
 * 2. Token intercepts and gets sent to backend
 * 3. Backend verifies token, resolves/returns user record
 */
export const AuthService = {
  /**
   * Log in via Firebase.
   * State management is handled implicitly by Firebase's onAuthStateChanged
   */
  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  },

  /** Register both records through the backend, then exchange its Firebase custom token. */
  async register(payload: RegisterInput): Promise<void> {
    const { token } = await authApi.register(payload);
    await signInWithCustomToken(auth, token);
  },

  /**
   * Log out via Firebase, clear local traces
   */
  async logout(): Promise<void> {
    await signOut(auth);
    setAuthToken(null);
  },

  /**
   * Resolve backend application data for a given Firebase User
   * Ignore results from an identity that changed while the request was pending.
   */
  async getBackendUser(firebaseUser: FirebaseUser): Promise<AuthUser | null> {
    try {
      const token = await firebaseUser.getIdToken();
      if (auth.currentUser !== firebaseUser) return null;
      setAuthToken(token);
      const user = await authApi.me();
      return auth.currentUser === firebaseUser ? user : null;
    } catch (error) {
      console.warn('Failed to fetch backend user for firebase UID: ', firebaseUser.uid, error);
      return null;
    }
  },
};
