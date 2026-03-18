import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/src/api/auth';
import { useAuth } from '@/src/contexts/AuthContext';
import { queryKeys } from './queryKeys';

/**
 * useCurrentUserQuery
 *
 * Fetches the authenticated user from the backend via GET /api/auth/me.
 * The axios client already carries the Bearer token set by AuthContext
 * (via setAuthToken) after the Firebase→backend session exchange.
 *
 * Only runs when the user is authenticated to prevent unnecessary 401s.
 */
export const useCurrentUserQuery = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled: isAuthenticated,
    // 5 minutes — the backend user record doesn't change on every request
    staleTime: 5 * 60 * 1000,
    // Keep showing previous data while revalidating in background
    placeholderData: (prev) => prev,
  });
};
