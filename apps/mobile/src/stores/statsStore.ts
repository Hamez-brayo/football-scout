import { create } from 'zustand';
import type {
  CreatePlayerStatRequest,
  PlayerStatEntry,
  PlayerStatsQuery,
} from '@vysion/shared';
import { statsService } from '@/src/services/statsService';

type StatsStoreState = {
  playerId: string | null;
  entries: PlayerStatEntry[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: (playerId: string, query?: PlayerStatsQuery) => Promise<void>;
  addStatEntry: (payload: CreatePlayerStatRequest) => Promise<PlayerStatEntry | null>;
  clearStats: () => void;
};

export const useStatsStore = create<StatsStoreState>((set, get) => ({
  playerId: null,
  entries: [],
  isLoading: false,
  error: null,

  fetchHistory: async (playerId, query) => {
    set({ isLoading: true, error: null });

    try {
      const history = await statsService.getHistory(playerId, query);
      set({ playerId: history.playerId, entries: history.entries, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch stats history';
      set({ error: message, isLoading: false });
    }
  },

  addStatEntry: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const entry = await statsService.createEntry(payload);
      set({ entries: [entry, ...get().entries], isLoading: false });
      return entry;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create stat entry';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  clearStats: () => {
    set({ playerId: null, entries: [], isLoading: false, error: null });
  },
}));
