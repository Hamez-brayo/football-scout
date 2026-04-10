import { Router } from 'express';
import { authenticate, requireUserType } from '@/middleware/auth';
import { validateBody, validateQuery } from '@/middleware/validate';
import { scoutController } from '@/controllers/scoutController';
import {
  ScoutShortlistSchema,
  SearchFiltersSchema,
  UserRole,
} from '@vysion/shared';

const router = Router();

router.use(authenticate, requireUserType(UserRole.SCOUT));

router.get(
  '/search',
  validateQuery(SearchFiltersSchema),
  scoutController.searchPlayers.bind(scoutController)
);

router.post(
  '/shortlist',
  validateBody(ScoutShortlistSchema),
  scoutController.addToShortlist.bind(scoutController)
);

router.delete(
  '/shortlist',
  validateBody(ScoutShortlistSchema),
  scoutController.removeFromShortlist.bind(scoutController)
);

export default router;
