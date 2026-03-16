import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validateBody } from '@/middleware/validate';
import { userController } from '@/controllers/userController';
import {
  UserProfileSchema,
  PhysicalAttributesSchema,
  FootballProfileSchema,
} from '@vysion/shared';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', userController.getCurrentUser.bind(userController));

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put(
  '/profile',
  validateBody(UserProfileSchema.partial()),
  userController.updateProfile.bind(userController)
);

/**
 * PUT /api/users/physical-attributes
 * Update physical attributes
 */
router.put(
  '/physical-attributes',
  validateBody(PhysicalAttributesSchema),
  userController.updatePhysicalAttributes.bind(userController)
);

/**
 * PUT /api/users/football-profile
 * Update football profile
 */
router.put(
  '/football-profile',
  validateBody(FootballProfileSchema),
  userController.updateFootballProfile.bind(userController)
);

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', userController.getUserById.bind(userController));

/**
 * DELETE /api/users/account
 * Delete user account
 */
router.delete('/account', userController.deleteAccount.bind(userController));

export default router;
