import { NextFunction, Response } from 'express';
import type { AuthRequest } from '@/middleware/auth';
import type { ApiResponseEnvelope } from '@vysion/shared';

export class MediaController {
  async uploadMetadata(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const response: ApiResponseEnvelope<{
        accepted: boolean;
        message: string;
        ownerId: string;
      }> = {
        success: true,
        data: {
          accepted: false,
          message: 'Media upload adapter is not implemented in Phase 1 hardening.',
          ownerId: req.user!.userId,
        },
        timestamp: new Date().toISOString(),
      };

      res.status(202).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
