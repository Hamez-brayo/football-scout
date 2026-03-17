import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

  /**
   * Register via Firebase.
   * Creates Firebase identity, then calls backend to construct the application record.
   */
  async register(payload: RegisterInput): Promise<void> {
    // 1. Create Firebase Identity
    const credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    
    // 2. Obtain fresh token to authenticate the backend request
    const token = await credential.user.getIdToken();
    setAuthToken(token);

    // 3. Register user in backend DB using the token 
    // Uses the API route for registration, assuming backend extracts uid from token
    await authApi.register(payload);
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
   * If metadata is missing, we could implement a forced fix.
   */
  async getBackendUser(firebaseUser: FirebaseUser): Promise<AuthUser | null> {
    try {
      const token = await firebaseUser.getIdToken();
      setAuthToken(token);
      return await authApi.me();
    } catch (error) {
      console.warn('Failed to fetch backend user for firebase UID: ', firebaseUser.uid, error);
      return null;
    }
  }
};
