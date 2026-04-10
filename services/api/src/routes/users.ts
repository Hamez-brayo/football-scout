import { Router } from 'express';
import { authenticate, requireUserType } from '@/middleware/auth';
import { validateBody } from '@/middleware/validate';
import { userController } from '@/controllers/userController';
import {
  UserProfileSchema,
  PhysicalAttributesSchema,
  FootballProfileSchema,
  UserRole,
} from '@vysion/shared';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', userController.getCurrentUser.bind(userController));

// Backward-compatible alias retained during contract freeze migration.
router.get('/profile', userController.getCurrentUser.bind(userController));

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put(
  '/profile',
  requireUserType(UserRole.PLAYER),
  validateBody(UserProfileSchema.partial()),
  userController.updateProfile.bind(userController)
);

router.patch(
  '/me',
  requireUserType(UserRole.PLAYER),
  validateBody(UserProfileSchema.partial()),
  userController.updateProfile.bind(userController)
);

/**
 * PUT /api/users/physical-attributes
 * Update physical attributes
 */
router.put(
  '/physical-attributes',
  requireUserType(UserRole.PLAYER),
  validateBody(PhysicalAttributesSchema),
  userController.updatePhysicalAttributes.bind(userController)
);

/**
 * PUT /api/users/football-profile
 * Update football profile
 */
router.put(
  '/football-profile',
  requireUserType(UserRole.PLAYER),
  validateBody(FootballProfileSchema),
  userController.updateFootballProfile.bind(userController)
);

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get(
  '/:id',
  requireUserType(UserRole.SCOUT),
  userController.getUserById.bind(userController)
);

/**
 * DELETE /api/users/account
 * Delete user account
 */
router.delete('/account', userController.deleteAccount.bind(userController));

export default router;
