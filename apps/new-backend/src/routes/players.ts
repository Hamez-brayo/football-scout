import { Router } from 'express';
import { authenticate, optionalAuth } from '@/middleware/auth';
import { validateQuery, validateBody } from '@/middleware/validate';
import { playerController } from '@/controllers/playerController';
import { SearchFiltersSchema, PlayerProfileSchema } from '@vysion/shared';

const router = Router();

/**
 * POST /api/players/profile
 * Create player profile (requires auth)
 */
router.post(
  '/profile',
  authenticate,
  validateBody(PlayerProfileSchema),
  playerController.createPlayerProfile.bind(playerController)
);

/**
 * GET /api/players/profile
 * Get current user's player profile (requires auth)
 */
router.get(
  '/profile',
  authenticate,
  playerController.getPlayerProfile.bind(playerController)
);

/**
 * PUT /api/players/profile
 * Update player profile (requires auth)
 */
router.put(
  '/profile',
  authenticate,
  validateBody(PlayerProfileSchema.partial()),
  playerController.updatePlayerProfile.bind(playerController)
);

/**
 * GET /api/players/search
 * Search players (optional auth)
 */
router.get(
  '/search',
  optionalAuth,
  validateQuery(SearchFiltersSchema),
  playerController.searchPlayers.bind(playerController)
);

/**
 * GET /api/players/:id
 * Get player by ID (optional auth)
 */
router.get('/:id', optionalAuth, playerController.getPlayerById.bind(playerController));

/**
 * GET /api/players/:id/stats
 * Get player statistics (requires auth)
 */
router.get(
  '/:id/stats',
  authenticate,
  playerController.getPlayerStats.bind(playerController)
);

export default router;
