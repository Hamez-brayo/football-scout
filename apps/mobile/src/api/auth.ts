import apiClient from './client';

export interface AuthUser {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
}

interface AuthApiResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

interface MeApiResponse {
  success: boolean;
  data: AuthUser;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthApiResponse['data']> {
    const response = await apiClient.post<AuthApiResponse>('/auth/login', { email, password });
    return response.data.data;
  },

  async register(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: string;
  }): Promise<AuthApiResponse['data']> {
    const response = await apiClient.post<AuthApiResponse>('/auth/register', payload);
    return response.data.data;
  },

  async me(): Promise<AuthUser> {
    const response = await apiClient.get<MeApiResponse>('/auth/me');
    return response.data.data;
  },
};
