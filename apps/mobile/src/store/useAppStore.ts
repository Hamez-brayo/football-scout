import { create } from 'zustand';

/**
 * App-level UI state managed by Zustand.
 *
 * This store is for CLIENT-SIDE UI state only:
 * - Theme preferences
 * - Onboarding status
 * - Modal visibility
 *
 * Auth state → AuthContext
 * Server data → TanStack Query (future)
 */

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Theme defaults
  themeMode: 'system',
  setThemeMode: (mode) => set({ themeMode: mode }),

  // Onboarding defaults
  hasCompletedOnboarding: false,
  setOnboardingComplete: (complete) => set({ hasCompletedOnboarding: complete }),
}));
