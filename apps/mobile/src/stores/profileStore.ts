import { create } from 'zustand';
import type { UserProfile } from '@vysion/shared';
import { playerService, type UserProfileUpdateInput } from '@/src/services/playerService';

type ProfileStoreState = {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<UserProfile | null>;
  updateProfile: (payload: UserProfileUpdateInput) => Promise<UserProfile | null>;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      const profile = await playerService.getMe();
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const profile = await playerService.updateMe(payload);
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  clearProfile: () => {
    set({ profile: null, isLoading: false, error: null });
  },
}));
