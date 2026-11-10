import { NextFunction, Response, Router } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { attemptInputSchema, trainingService } from './service';

const router = Router();
router.use(authenticate);
function handle(action: (req: AuthRequest, actor: string) => Promise<unknown>, status = 200) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'));
      return;
    }
    action(req, req.user.id)
      .then((data) => res.status(status).json({ success: true, data, timestamp: new Date().toISOString() }))
      .catch(next);
  };
}

router.get('/attempts', handle((_req, actor) => trainingService.list(actor)));
router.post('/attempts', handle((req, actor) =>
  trainingService.create(actor, attemptInputSchema.parse(req.body)), 201));
router.patch('/attempts/:id/visibility', handle((req, actor) =>
  trainingService.setVisibility(
    req.params.id, actor, z.object({ isPublic: z.boolean() }).strict().parse(req.body).isPublic,
  )));
router.get('/players/:userId/evidence', handle((req, actor) =>
  trainingService.evidence(req.params.userId, actor)));

export default router;
