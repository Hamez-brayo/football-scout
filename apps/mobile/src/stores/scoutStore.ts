import { create } from 'zustand';
import type {
  PaginatedResponse,
  PlayerProfile,
  SearchFilters,
  ShortlistEntry,
  ShortlistMutationRequest,
} from '@vysion/shared';
import { scoutService } from '@/src/services/scoutService';

type ScoutStoreState = {
  searchResults: PaginatedResponse<PlayerProfile> | null;
  shortlist: ShortlistEntry[];
  activeFilters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  searchPlayers: (filters: SearchFilters) => Promise<void>;
  addToShortlist: (payload: ShortlistMutationRequest) => Promise<ShortlistEntry | null>;
  removeFromShortlist: (playerId: string) => Promise<boolean>;
  clearScoutState: () => void;
};

export const useScoutStore = create<ScoutStoreState>((set, get) => ({
  searchResults: null,
  shortlist: [],
  activeFilters: {},
  isLoading: false,
  error: null,

  searchPlayers: async (filters) => {
    set({ isLoading: true, error: null, activeFilters: filters });

    try {
      const searchResults = await scoutService.search(filters);
      set({ searchResults, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search players';
      set({ error: message, isLoading: false });
    }
  },

  addToShortlist: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const entry = await scoutService.addToShortlist(payload);
      const filtered = get().shortlist.filter((item) => item.playerId !== entry.playerId);
      set({ shortlist: [entry, ...filtered], isLoading: false });
      return entry;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add shortlist entry';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  removeFromShortlist: async (playerId) => {
    set({ isLoading: true, error: null });

    try {
      const result = await scoutService.removeFromShortlist(playerId);
      if (result.deleted) {
        set({
          shortlist: get().shortlist.filter((item) => item.playerId !== playerId),
          isLoading: false,
        });
        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove shortlist entry';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearScoutState: () => {
    set({ searchResults: null, shortlist: [], activeFilters: {}, isLoading: false, error: null });
  },
}));
