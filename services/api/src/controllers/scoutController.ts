import { NextFunction, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth';
import { scoutService } from '@/services/scoutService';
import type { ApiResponseEnvelope } from '@vysion/shared';

export class ScoutController {
  async searchPlayers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await scoutService.searchPlayers(req.query as any);
      const response: ApiResponseEnvelope<typeof result> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addToShortlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await scoutService.addShortlistEntry(req.user!.userId, req.body);
      const response: ApiResponseEnvelope<typeof result> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async removeFromShortlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const playerId = typeof req.body?.playerId === 'string' ? req.body.playerId : '';
      const result = await scoutService.removeShortlistEntry(req.user!.userId, playerId);
      const response: ApiResponseEnvelope<typeof result> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const scoutController = new ScoutController();
