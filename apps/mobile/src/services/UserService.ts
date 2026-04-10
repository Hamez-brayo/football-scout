import apiClient from '@/src/api/client';
import type { ApiResponseEnvelope, UserProfile } from '@vysion/shared';

/**
 * UserService — abstracts user-related API calls.
 *
 * Placeholder for now. Will grow as profile features are built.
 */

type ProfileUpdatePayload = Partial<
  Pick<
    UserProfile,
    'firstName' | 'lastName' | 'fullName' | 'dateOfBirth' | 'nationality' | 'phone' | 'currentLocation' | 'profilePhoto'
  >
>;

export const UserService = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponseEnvelope<UserProfile>>('/users/me');
    if (!response.data.data) {
      throw new Error('Invalid profile response payload');
    }
    return response.data.data;
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponseEnvelope<UserProfile>>('/users/profile', payload);
    if (!response.data.data) {
      throw new Error('Invalid profile update response payload');
    }
    return response.data.data;
  },
};
