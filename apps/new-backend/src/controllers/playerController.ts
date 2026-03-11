import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/middleware/auth';
import { playerService } from '@/services/playerService';

export class PlayerController {
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
