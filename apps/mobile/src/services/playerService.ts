import apiClient from '@/src/api/client';
import type { ApiResponseEnvelope, UserProfile } from '@vysion/shared';

export type UserProfileUpdateInput = Partial<
  Pick<
    UserProfile,
    'firstName' | 'lastName' | 'fullName' | 'dateOfBirth' | 'nationality' | 'phone' | 'currentLocation' | 'profilePhoto'
  >
>;

export const playerService = {
  async getMe(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponseEnvelope<UserProfile>>('/users/me');

    if (!response.data.data) {
      throw new Error('Invalid user profile response payload');
    }

    return response.data.data;
  },

  async updateMe(payload: UserProfileUpdateInput): Promise<UserProfile> {
    const response = await apiClient.patch<ApiResponseEnvelope<UserProfile>>('/users/me', payload);

    if (!response.data.data) {
      throw new Error('Invalid user profile update response payload');
    }

    return response.data.data;
  },
};
