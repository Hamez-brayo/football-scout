import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { playerService } from '@/services/playerService';

export class PlayerController {
  /**
   * Create player profile
   */
  async createPlayerProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const profile = await playerService.createPlayerProfile(userId, req.body);

      res.status(201).json({
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get player profile (current user)
   */
  async getPlayerProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const profile = await playerService.getPlayerProfile(userId);

      res.json({
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update player profile
   */
  async updatePlayerProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
          timestamp: new Date().toISOString(),
        });
      }

      const profile = await playerService.updatePlayerProfile(userId, req.body);

      res.json({
        success: true,
        data: profile,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search players
   */
  async searchPlayers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = req.query as any;
      const result = await playerService.searchPlayers(filters);

      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get player by ID
   */
  async getPlayerById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const player = await playerService.getPlayerById(id);

      res.json({
        success: true,
        data: player,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const stats = await playerService.getPlayerStats(id);

      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}

export const playerController = new PlayerController();
