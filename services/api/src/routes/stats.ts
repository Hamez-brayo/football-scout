import { Router, type Response, type NextFunction } from 'express';
import { authenticate, requireUserType, type AuthRequest } from '@/middleware/auth';
import { validateBody, validateQuery } from '@/middleware/validate';
import { statsController } from '@/controllers/statsController';
import { PlayerStatCreateSchema, PlayerStatsSchema, UserRole } from '@vysion/shared';

const router = Router();

router.use(authenticate);

const requireStatsReadAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  const targetPlayerId = req.params.playerId;

  if (!req.user) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.user.role === UserRole.SCOUT) {
    next();
    return;
  }

  if (req.user.role === UserRole.PLAYER && req.user.userId === targetPlayerId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
    timestamp: new Date().toISOString(),
  });
};

const requireOwnPlayerPayload = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'User not authenticated' },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.body.playerId !== req.user.userId) {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Players can only write their own stats' },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};

router.get(
  '/:playerId',
  requireUserType(UserRole.PLAYER, UserRole.SCOUT),
  validateQuery(PlayerStatsSchema),
  requireStatsReadAccess,
  statsController.getPlayerStats.bind(statsController)
);

router.post(
  '/',
  requireUserType(UserRole.PLAYER),
  validateBody(PlayerStatCreateSchema),
  requireOwnPlayerPayload,
  statsController.createPlayerStat.bind(statsController)
);

export default router;
