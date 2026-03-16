import { Request, Response, NextFunction } from 'express';
import { logger } from '@/config/logger';

const formatTimestamp = (date: Date): string => {
  const pad = (value: number) => value.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    const timestamp = formatTimestamp(new Date());

    logger.info(
      `${timestamp} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${Math.round(
        durationMs
      )}ms`
    );
  });

  next();
};