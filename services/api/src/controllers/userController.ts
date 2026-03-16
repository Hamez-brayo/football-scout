import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { userService } from '@/services/userService';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '@vysion/shared';

export class UserController {
  /**
   * Get current user profile
   */
  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserByUserId(req.user!.userId);

      res.json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID (for scouts/clubs viewing players)
   */
  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);

      res.json({
        success: true,
        data: user,
        message: SUCCESS_MESSAGES.PROFILE_UPDATED,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update physical attributes
   */
  async updatePhysicalAttributes(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const attributes = await userService.updatePhysicalAttributes(
        req.user!.userId,
        req.body
      );

      res.json({
        success: true,
        data: attributes,
        message: 'Physical attributes updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update football profile
   */
  async updateFootballProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profile = await userService.updateFootballProfile(
        req.user!.userId,
        req.body
      );

      res.json({
        success: true,
        data: profile,
        message: 'Football profile updated successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await userService.deleteUser(req.user!.userId);

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
