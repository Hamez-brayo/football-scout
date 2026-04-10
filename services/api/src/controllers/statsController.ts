import { NextFunction, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth';
import { statsService } from '@/services/statsService';
import type { ApiResponseEnvelope } from '@vysion/shared';

export class StatsController {
  async getPlayerStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await statsService.getPlayerStatsHistory(req.params.playerId, {
        metricKey: typeof req.query.metricKey === 'string' ? req.query.metricKey : undefined,
        from: typeof req.query.from === 'string' ? req.query.from : undefined,
        to: typeof req.query.to === 'string' ? req.query.to : undefined,
      });

      const response: ApiResponseEnvelope<typeof data> = {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createPlayerStat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stat = await statsService.createStatEntry(req.body);
      const response: ApiResponseEnvelope<typeof stat> = {
        success: true,
        data: stat,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const statsController = new StatsController();
