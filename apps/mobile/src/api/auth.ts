import apiClient from './client';

export interface AuthUser {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
}

interface MeApiResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

export const authApi = {
  async verifySession(idToken: string): Promise<AuthUser> {
    const response = await apiClient.post<MeApiResponse>('/auth/verify-token', { idToken });
    return response.data.data.user;
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<MeApiResponse>('/auth/me');
    return response.data.data.user;
  },
};
