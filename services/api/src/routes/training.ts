import { Router } from 'express';
import { authenticate, requireUserType } from '@/middleware/auth';
import { validateBody } from '@/middleware/validate';
import { trainingController } from '@/controllers/trainingController';
import {
  DrillSubmissionSchema,
  DrillSchema,
  TrainingProgramSchema,
  UserRole,
} from '@vysion/shared';

const router = Router();

router.use(authenticate);

router.get('/programs', trainingController.listPrograms.bind(trainingController));
router.post(
  '/programs',
  requireUserType(UserRole.SCOUT),
  validateBody(TrainingProgramSchema),
  trainingController.createProgram.bind(trainingController)
);

router.get('/drills', trainingController.listDrills.bind(trainingController));
router.post(
  '/drills',
  requireUserType(UserRole.SCOUT),
  validateBody(DrillSchema),
  trainingController.createDrill.bind(trainingController)
);

router.post(
  '/submissions',
  requireUserType(UserRole.PLAYER),
  validateBody(DrillSubmissionSchema),
  trainingController.submitDrill.bind(trainingController)
);

export default router;
