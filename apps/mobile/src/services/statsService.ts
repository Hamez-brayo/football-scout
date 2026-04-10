import apiClient from '@/src/api/client';
import type {
  ApiResponseEnvelope,
  CreatePlayerStatRequest,
  PlayerStatEntry,
  PlayerStatsQuery,
} from '@vysion/shared';

export type StatsHistoryResponse = {
  playerId: string;
  entries: PlayerStatEntry[];
};

export const statsService = {
  async getHistory(playerId: string, query?: PlayerStatsQuery): Promise<StatsHistoryResponse> {
    const response = await apiClient.get<ApiResponseEnvelope<StatsHistoryResponse>>(`/stats/${playerId}`, {
      params: query,
    });

    if (!response.data.data) {
      throw new Error('Invalid stats history response payload');
    }

    return response.data.data;
  },

  async createEntry(payload: CreatePlayerStatRequest): Promise<PlayerStatEntry> {
    const response = await apiClient.post<ApiResponseEnvelope<PlayerStatEntry>>('/stats', payload);

    if (!response.data.data) {
      throw new Error('Invalid stat creation response payload');
    }

    return response.data.data;
  },
};
