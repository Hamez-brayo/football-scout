import { onIdTokenChanged } from 'firebase/auth';
import { create } from 'zustand';
import type { AuthUser, SignInRequest, SignUpRequest, UserRole } from '@vysion/shared';
import { auth } from '@/src/config/firebase';
import { setAuthToken } from '@/src/api/client';
import { authService, type AuthSession } from '@/src/services/AuthService';

type AuthStoreState = {
  isHydrated: boolean;
  isSyncing: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: UserRole | null;
  token: string | null;
  bootstrap: () => void;
  login: (payload: SignInRequest) => Promise<void>;
  register: (payload: SignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
};

let unsubscribeAuthListener: (() => void) | null = null;

const emptySession = {
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
};

const applySession = (session: AuthSession) => ({
  user: session.user,
  role: session.role,
  token: session.token,
  isAuthenticated: true,
});

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  isHydrated: false,
  isSyncing: false,
  isAuthenticated: false,
  user: null,
  role: null,
  token: null,

  bootstrap: () => {
    if (unsubscribeAuthListener) {
      set({ isHydrated: true });
      return;
    }

    set({ isHydrated: false, isSyncing: true });

    unsubscribeAuthListener = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthToken(null);
        set({ ...emptySession, isHydrated: true, isSyncing: false });
        return;
      }

      try {
        const session = await authService.exchangeFirebaseSession(firebaseUser);
        set({ ...applySession(session), isHydrated: true, isSyncing: false });
      } catch (error) {
        console.warn('Failed to exchange Firebase token for backend session', error);
        setAuthToken(null);
        set({ ...emptySession, isHydrated: true, isSyncing: false });
      }
    });
  },

  login: async (payload) => {
    set({ isSyncing: true });
    const session = await authService.loginWithFirebase(payload);
    set({ ...applySession(session), isHydrated: true, isSyncing: false });
  },

  register: async (payload) => {
    set({ isSyncing: true });
    const session = await authService.registerWithFirebase(payload);
    set({ ...applySession(session), isHydrated: true, isSyncing: false });
  },

  logout: async () => {
    set({ isSyncing: true });
    await authService.logout();
    set({ ...emptySession, isHydrated: true, isSyncing: false });
  },

  clearSession: () => {
    if (unsubscribeAuthListener) {
      unsubscribeAuthListener();
      unsubscribeAuthListener = null;
    }

    setAuthToken(null);
    set({ ...emptySession, isHydrated: true, isSyncing: false });

    if (get().isAuthenticated) {
      set({ isAuthenticated: false });
    }
  },
}));
