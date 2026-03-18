import { useQuery } from '@tanstack/react-query';
import apiClient from '@/src/api/client';
import { useAuth } from '@/src/contexts/AuthContext';
import { queryKeys } from './queryKeys';
import type { AuthUser } from '../../../../../shared/src/types/auth';

interface UserProfileApiResponse {
  success: boolean;
  data: {
    user: AuthUser & {
      firstName?: string;
      lastName?: string;
      nickname?: string;
      profilePhoto?: string;
      currentLocation?: string;
      position?: string;
      currentClub?: string;
      [key: string]: unknown;
    };
  };
  timestamp: string;
}

const fetchCurrentUserProfile = async () => {
  const response = await apiClient.get<UserProfileApiResponse>('/users/me');
  return response.data.data.user;
};

/**
 * useProfileQuery
 *
 * Fetches the full user profile from GET /api/users/me.
 * This endpoint returns richer data than /auth/me (physical attributes,
 * football profile, etc.) and requires a backend JWT Bearer token.
 *
 * Enabled only when the user is authenticated and their userId is known.
 */
export const useProfileQuery = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.users.profile(user?.userId ?? ''),
    queryFn: fetchCurrentUserProfile,
    enabled: isAuthenticated && !!user?.userId,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};
