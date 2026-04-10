import { NextFunction, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth';
import { trainingService } from '@/services/trainingService';
import type { ApiResponseEnvelope } from '@vysion/shared';

export class TrainingController {
  async listPrograms(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const programs = await trainingService.listPrograms();
      const response: ApiResponseEnvelope<typeof programs> = {
        success: true,
        data: programs,
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createProgram(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const created = await trainingService.createProgram(req.user!.userId, req.body);
      const response: ApiResponseEnvelope<typeof created> = {
        success: true,
        data: created,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listDrills(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trainingProgramId = typeof req.query.trainingProgramId === 'string'
        ? req.query.trainingProgramId
        : undefined;
      const drills = await trainingService.listDrills(trainingProgramId);
      const response: ApiResponseEnvelope<typeof drills> = {
        success: true,
        data: drills,
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createDrill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const created = await trainingService.createDrill(req.body);
      const response: ApiResponseEnvelope<typeof created> = {
        success: true,
        data: created,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async submitDrill(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const submission = await trainingService.submitDrill(req.user!.userId, req.body);
      const response: ApiResponseEnvelope<typeof submission> = {
        success: true,
        data: submission,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const trainingController = new TrainingController();
