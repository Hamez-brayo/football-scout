import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '@/config/logger';
import { config } from '@/config';
import { ERROR_CODES, HTTP_STATUS } from '@vysion/shared';

type SessionJwtPayload = {
  userId: string;
  email: string;
  role?: string | null;
};

const verifySessionToken = (token: string): SessionJwtPayload => {
  if (!config.JWT_SECRET) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.verify(token, config.JWT_SECRET) as SessionJwtPayload;
};

export interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role?: string;
  };
}

/**
 * Primary route authentication middleware.
 * Verifies the Bearer token as a backend application session JWT issued
 * by POST /auth/session. Firebase tokens are never accepted here directly.
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'No authorization header provided',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.slice(7);
    const payload = verifySessionToken(token);

    req.user = {
      id: payload.userId,
      userId: payload.userId,
      email: payload.email,
      role: payload.role ?? undefined,
    };

    next();
  } catch (error: any) {
    logger.error('Authentication error:', error);
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: error.error?.code ?? ERROR_CODES.INVALID_TOKEN,
        message: error.message ?? 'Invalid authentication token',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Alias for `authenticate`. Retained for compatibility with existing route imports.
 */
export const authenticateJwt = authenticate;

/**
 * Middleware to check if user has specific user type
 */
export const requireUserType = (...allowedTypes: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!req.user.role || !allowedTypes.includes(req.user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Insufficient permissions',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication — JWT-based, does not fail if no token present.
 */
export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.slice(7);
    const payload = verifySessionToken(token);

    req.user = {
      id: payload.userId,
      userId: payload.userId,
      email: payload.email,
      role: payload.role ?? undefined,
    };
  } catch {
    // Silently ignore invalid/expired tokens for optional auth
  }

  next();
};
