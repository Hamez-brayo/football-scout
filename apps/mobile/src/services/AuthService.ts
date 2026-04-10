import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import apiClient, { setAuthToken } from '@/src/api/client';
import type {
  ApiResponseEnvelope,
  AuthUser,
  SignInRequest,
  SignUpRequest,
  UserRole,
} from '@vysion/shared';

type AuthTokenResponse = {
  user: AuthUser;
  token: string;
};

type AuthSessionResponse = {
  user: AuthUser;
  appToken: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
  role: UserRole | null;
};

export type RegisterInput = SignUpRequest;

const deriveRole = (user: AuthUser): UserRole | null => {
  return (user.role ?? user.userType ?? null) as UserRole | null;
};

const assertTokenPayload = (
  payload: AuthTokenResponse | AuthSessionResponse | undefined,
  tokenField: 'token' | 'appToken'
): AuthSession => {
  if (!payload?.user) {
    throw new Error('Invalid auth response payload');
  }

  const token =
    tokenField === 'token'
      ? (payload as Partial<AuthTokenResponse>).token
      : (payload as Partial<AuthSessionResponse>).appToken;

  if (!token) {
    throw new Error('Invalid auth response payload');
  }

  setAuthToken(token);

  return {
    user: payload.user,
    token,
    role: deriveRole(payload.user),
  };
};

export const authService = {
  async login(credentials: SignInRequest): Promise<AuthSession> {
    const response = await apiClient.post<ApiResponseEnvelope<AuthTokenResponse>>('/auth/login', credentials);
    return assertTokenPayload(response.data.data, 'token');
  },

  async register(payload: SignUpRequest): Promise<AuthSession> {
    const response = await apiClient.post<ApiResponseEnvelope<AuthTokenResponse>>('/auth/register', payload);
    return assertTokenPayload(response.data.data, 'token');
  },

  async exchangeFirebaseSession(
    firebaseUser: FirebaseUser,
    registrationData?: { firstName?: string; lastName?: string; role?: UserRole }
  ): Promise<AuthSession> {
    const idToken = await firebaseUser.getIdToken();
    const response = await apiClient.post<ApiResponseEnvelope<AuthSessionResponse>>('/auth/session', {
      idToken,
      ...registrationData,
    });

    return assertTokenPayload(response.data.data, 'appToken');
  },

  async loginWithFirebase(credentials: SignInRequest): Promise<AuthSession> {
    const credential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return this.exchangeFirebaseSession(credential.user);
  },

  async registerWithFirebase(payload: SignUpRequest): Promise<AuthSession> {
    const credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    return this.exchangeFirebaseSession(credential.user, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
    });
  },

  async logout(): Promise<void> {
    const activeUserId = auth.currentUser?.uid;

    setAuthToken(null);

    if (activeUserId) {
      await apiClient.post('/auth/signout', { userId: activeUserId });
    }

    await signOut(auth);
  },

  async createSession(firebaseUser: FirebaseUser): Promise<AuthUser | null> {
    try {
      const session = await this.exchangeFirebaseSession(firebaseUser);
      return session.user;
    } catch (error) {
      console.warn('Failed to create backend session for Firebase UID:', firebaseUser.uid, error);
      return null;
    }
  },
};

// Backward-compatible export while old imports are being migrated.
export const AuthService = authService;
