import apiClient from './client';
import type { AuthUser, SessionResponse, UserRole } from '@vysion/shared';

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
    registrationData?: { firstName?: string; lastName?: string; role?: UserRole; userType?: UserRole },
  ): Promise<{ user: AuthUser; appToken: string }> {
    const response = await apiClient.post<SessionResponse>('/auth/session', {
      idToken,
      ...registrationData,
    });
    const payload = response.data.data;

    if (!payload?.user || !payload?.appToken) {
      throw new Error('Invalid session response payload');
    }

    return { user: payload.user, appToken: payload.appToken };
  },

  /**
   * Fetch the current authenticated user profile.
   * Requires a backend session JWT in the Authorization header.
   */
  async me(): Promise<AuthUser> {
    const response = await apiClient.get<SessionResponse>('/auth/me');
    const payload = response.data.data;
    if (!payload?.user) {
      throw new Error('Invalid current user response payload');
    }
    return payload.user;
  },
};
