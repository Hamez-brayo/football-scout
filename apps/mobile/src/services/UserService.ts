import apiClient from '@/src/api/client';

/**
 * UserService — abstracts user-related API calls.
 *
 * Placeholder for now. Will grow as profile features are built.
 */

interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  dateOfBirth?: string;
  nationality?: string;
  phone?: string;
  languages?: string[];
  currentLocation?: string;
}

interface UserProfileResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    userType?: string;
    [key: string]: unknown;
  };
}

export const UserService = {
  async getProfile(): Promise<UserProfileResponse['data']> {
    const response = await apiClient.get<UserProfileResponse>('/users/profile');
    return response.data.data;
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<UserProfileResponse['data']> {
    const response = await apiClient.put<UserProfileResponse>('/users/profile', payload);
    return response.data.data;
  },
};
