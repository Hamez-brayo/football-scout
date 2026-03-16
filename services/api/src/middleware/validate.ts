import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HTTP_STATUS, ERROR_CODES } from '@vysion/shared';

/**
 * Middleware to validate request data against a Zod schema
 */
export const validate = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Validation failed',
            fields: error.flatten().fieldErrors,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate request body only
 */
export const validateBody = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Invalid request body',
            fields: error.flatten().fieldErrors,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate query parameters
 */
export const validateQuery = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.query = await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Invalid query parameters',
            fields: error.flatten().fieldErrors,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next(error);
    }
  };
};
