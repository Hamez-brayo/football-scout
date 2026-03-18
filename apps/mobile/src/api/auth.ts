import apiClient from './client';
import type { AuthUser, SessionResponse } from '../../../../shared/src/types/auth';

// Re-export for consumers that import AuthUser from '@/src/api/auth'
export type { AuthUser, SessionResponse };


export const authApi = {
  /**
   * Exchange a Firebase ID token for a backend application session JWT.
   * Called once after every Firebase sign-in or token refresh.
   * Optional registration fields are used to populate the user record on first call.
   */
  async session(
    idToken: string,
    registrationData?: { firstName?: string; lastName?: string; userType?: string },
  ): Promise<{ user: AuthUser; appToken: string }> {
    const response = await apiClient.post<SessionResponse>('/auth/session', {
      idToken,
      ...registrationData,
    });
    return { user: response.data.data.user, appToken: response.data.data.appToken! };
  },

  /**
   * Fetch the current authenticated user profile.
   * Requires a backend session JWT in the Authorization header.
   */
  async me(): Promise<AuthUser> {
    const response = await apiClient.get<SessionResponse>('/auth/me');
    return response.data.data.user;
  },
};
