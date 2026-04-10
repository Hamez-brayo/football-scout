import apiClient from '@/src/api/client';
import type {
  ApiResponseEnvelope,
  PaginatedResponse,
  PlayerProfile,
  SearchFilters,
  ShortlistEntry,
  ShortlistMutationRequest,
} from '@vysion/shared';

export const scoutService = {
  async search(filters: SearchFilters): Promise<PaginatedResponse<PlayerProfile>> {
    const response = await apiClient.get<ApiResponseEnvelope<PaginatedResponse<PlayerProfile>>>('/scout/search', {
      params: filters,
    });

    if (!response.data.data) {
      throw new Error('Invalid scout search response payload');
    }

    return response.data.data;
  },

  async addToShortlist(payload: ShortlistMutationRequest): Promise<ShortlistEntry> {
    const response = await apiClient.post<ApiResponseEnvelope<ShortlistEntry>>('/scout/shortlist', payload);

    if (!response.data.data) {
      throw new Error('Invalid shortlist add response payload');
    }

    return response.data.data;
  },

  async removeFromShortlist(playerId: string): Promise<{ deleted: boolean }> {
    const response = await apiClient.delete<ApiResponseEnvelope<{ deleted: boolean }>>('/scout/shortlist', {
      data: { playerId },
    });

    if (!response.data.data) {
      throw new Error('Invalid shortlist remove response payload');
    }

    return response.data.data;
  },
};
