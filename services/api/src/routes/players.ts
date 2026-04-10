import { Router } from 'express';
import { authenticate, requireUserType } from '@/middleware/auth';
import { validateQuery, validateBody } from '@/middleware/validate';
import { playerController } from '@/controllers/playerController';
import {
  CreateProfileSchema,
  SearchFiltersSchema,
  UpdateProfileSchema,
  UserRole,
} from '@vysion/shared';

const router = Router();

/**
 * POST /api/players/profile
 * Create player profile (requires auth)
 */
router.post(
  '/profile',
  authenticate,
  requireUserType(UserRole.PLAYER),
  validateBody(CreateProfileSchema),
  playerController.createPlayerProfile.bind(playerController)
);

/**
 * GET /api/players/profile
 * Get current user's player profile (requires auth)
 */
router.get(
  '/profile',
  authenticate,
  requireUserType(UserRole.PLAYER),
  playerController.getPlayerProfile.bind(playerController)
);

/**
 * PUT /api/players/profile
 * Update player profile (requires auth)
 */
router.put(
  '/profile',
  authenticate,
  requireUserType(UserRole.PLAYER),
  validateBody(UpdateProfileSchema),
  playerController.updatePlayerProfile.bind(playerController)
);

/**
 * GET /api/players/search
 * Search players (optional auth)
 */
router.get(
  '/search',
  authenticate,
  requireUserType(UserRole.SCOUT),
  validateQuery(SearchFiltersSchema),
  playerController.searchPlayers.bind(playerController)
);

/**
 * GET /api/players/:id
 * Get player by ID (optional auth)
 */
router.get(
  '/:id',
  authenticate,
  requireUserType(UserRole.SCOUT),
  playerController.getPlayerById.bind(playerController)
);

/**
 * GET /api/players/:id/stats
 * Get player statistics (requires auth)
 */
router.get(
  '/:id/stats',
  authenticate,
  requireUserType(UserRole.SCOUT),
  playerController.getPlayerStats.bind(playerController)
);

export default router;
