import { useQuery } from '@tanstack/react-query';
import apiClient from '@/src/api/client';
import { useAuth } from '@/src/contexts/AuthContext';
import { queryKeys } from './queryKeys';
import type { ApiResponseEnvelope, UserProfile } from '@vysion/shared';

const fetchCurrentUserProfile = async () => {
  const response = await apiClient.get<ApiResponseEnvelope<UserProfile>>('/users/me');
  return response.data.data;
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
