import { Request, Response, NextFunction } from 'express';
import { auth } from '@/config/firebase';
import { prisma } from '@/config/database';
import { logger } from '@/config/logger';
import { ERROR_CODES, HTTP_STATUS } from '@vysion/shared';
import { authService } from '@/services/authService';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    userType?: string;
  };
}

/**
 * Middleware to authenticate requests using Firebase Auth
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
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

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'No token provided',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { userId: decodedToken.uid },
      select: {
        id: true,
        userId: true,
        email: true,
        userType: true,
      },
    });

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'User not found in database',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      userId: user.userId,
      email: user.email,
      userType: user.userType || undefined,
    };

    next();
  } catch (error: any) {
    logger.error('Authentication error:', error);

    if (error.code === 'auth/id-token-expired') {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.TOKEN_EXPIRED,
          message: 'Token has expired',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_TOKEN,
        message: 'Invalid authentication token',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Legacy JWT-based middleware for local auth routes only.
 * Mobile clients should use Firebase ID tokens with `authenticate`.
 */
export const authenticateJwt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: 'No token provided' },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.slice(7);
    const payload = authService.verifyToken(token);

    req.user = {
      id: payload.userId,   // fallback — full DB id only needed for DB queries
      userId: payload.userId,
      email: payload.email,
      userType: payload.userType ?? undefined,
    };

    next();
  } catch (error: any) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: error.error?.code ?? ERROR_CODES.INVALID_TOKEN,
        message: error.message ?? 'Invalid token',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

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

    if (!req.user.userType || !allowedTypes.includes(req.user.userType)) {
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
 * Optional authentication - doesn't fail if no token is provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      next();
      return;
    }

    const decodedToken = await auth.verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { userId: decodedToken.uid },
      select: {
        id: true,
        userId: true,
        email: true,
        userType: true,
      },
    });

    if (user) {
      req.user = {
        id: user.id,
        userId: user.userId,
        email: user.email,
        userType: user.userType || undefined,
      };
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};
