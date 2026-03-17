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
 * AuthService controls interaction with Firebase identity and the backend
 * application session layer.
 *
 * Hybrid auth flow:
 * 1. Firebase Auth resolves identity (sign-in / registration).
 * 2. A fresh Firebase ID token is exchanged for a backend JWT via POST /auth/session.
 * 3. The backend JWT is stored and used as the Bearer token for all API requests.
 * 4. Firebase ID tokens are never forwarded to protected API routes directly.
 * 5. onIdTokenChanged in AuthContext drives the session-creation lifecycle.
 */
export const AuthService = {
  /**
   * Sign in via Firebase.
   * onIdTokenChanged in AuthContext will handle the session exchange automatically.
   */
  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  },

  /**
   * Register via Firebase and immediately create the backend user record.
   * Passes registration fields so the backend can populate the profile on first session.
   */
  async register(payload: RegisterInput): Promise<void> {
    // 1. Create the Firebase identity
    const credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);

    // 2. Exchange Firebase ID token for a backend session JWT, passing registration data
    //    so the user record is created with full profile fields on first call.
    const idToken = await credential.user.getIdToken();
    const { appToken } = await authApi.session(idToken, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      userType: payload.userType,
    });

    // 3. Store backend JWT so subsequent API calls are authenticated immediately
    setAuthToken(appToken);

    // onIdTokenChanged will also fire and call createSession again (idempotent).
  },

  /**
   * Sign out: clear the backend JWT first, then revoke the Firebase session.
   */
  async logout(): Promise<void> {
    setAuthToken(null);
    await signOut(auth);
  },

  /**
   * Exchange a (fresh) Firebase ID token for a backend application session.
   * Stores the returned backend JWT on the API client and returns the app user.
   * Called by AuthContext.onIdTokenChanged on every login and token refresh.
   */
  async createSession(firebaseUser: FirebaseUser): Promise<AuthUser | null> {
    try {
      const idToken = await firebaseUser.getIdToken();
      const { user, appToken } = await authApi.session(idToken);
      setAuthToken(appToken);
      return user;
    } catch (error) {
      console.warn('Failed to create backend session for Firebase UID:', firebaseUser.uid, error);
      return null;
    }
  },
};
