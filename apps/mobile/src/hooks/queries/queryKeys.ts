/**
 * Strongly typed factory for TanStack Query string keys.
 * 
 * Centralizing these prevents typo bugs causing cached misses,
 * making invalidation safe: queryClient.invalidateQueries({ queryKey: queryKeys.players.detail(id) })
 */

export const queryKeys = {
  // Auth & Current User
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', id] as const,
    profile: (userId: string) => ['users', userId, 'profile'] as const,
    physical: (userId: string) => ['users', userId, 'physical'] as const,
  },

  // Players
  players: {
    all: ['players'] as const,
    search: (filters: Record<string, unknown>) => ['players', 'search', filters] as const,
    detail: (id: string) => ['players', id] as const,
    stats: (id: string) => ['players', id, 'stats'] as const,
  },

  // Media
  media: {
    user: (userId: string) => ['media', 'user', userId] as const,
    detail: (id: string) => ['media', id] as const,
  },

  // Scouts (Evaluations, Watchlists)
  scouts: {
    evaluations: (scoutId: string) => ['scouts', scoutId, 'evaluations'] as const,
    watchlist: (scoutId: string) => ['scouts', scoutId, 'watchlist'] as const,
  },
};
