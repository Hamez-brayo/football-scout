import { create } from 'zustand';
import { auth } from '@/services/firebase';
import { apiClient } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithCustomToken, signInWithEmailAndPassword } from 'firebase/auth';
import { STORAGE_KEYS } from '@vysion/shared';
import type { UserProfile } from '@vysion/shared';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Verify token and get user data from backend
      const response: any = await apiClient.auth.verifyToken(idToken);

      if (response.success && response.data.user) {
        // Store user data
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Failed to get user data');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      set({ error: error.message || 'Failed to login', isLoading: false });
      throw error;
    }
  },

  signup: async (data) => {
    try {
      set({ isLoading: true, error: null });

      // Create account via backend (which creates Firebase user)
      const response: any = await apiClient.auth.signup(data);

      if (response.success && response.data.user) {
        // Store user data
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
        
        // Sign in to Firebase with the token
        await signInWithCustomToken(auth, response.data.token);

        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      set({ error: error.message || 'Failed to signup', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const user = get().user;
      if (user) {
        await apiClient.auth.signout(user.userId);
      }
      
      await auth.signOut();
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER_DATA, STORAGE_KEYS.AUTH_TOKEN]);
      
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error: any) {
      console.error('Logout error:', error);
      set({ error: error.message || 'Failed to logout' });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      // Check if we have stored user data
      const storedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (storedUserData && auth.currentUser) {
        const user = JSON.parse(storedUserData);
        set({ user, isAuthenticated: true, isLoading: false });
        
        // Refresh user data in background
        get().refreshUser();
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refreshUser: async () => {
    try {
      if (!auth.currentUser) return;

      const response: any = await apiClient.users.getMe();
      
      if (response.success && response.data) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
        set({ user: response.data });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  },
}));
