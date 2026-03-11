import { Router } from 'express';
import { authenticate, optionalAuth } from '@/middleware/auth';
import { validateQuery } from '@/middleware/validate';
import { playerController } from '@/controllers/playerController';
import { SearchFiltersSchema } from '@vysion/shared';

const router = Router();

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
