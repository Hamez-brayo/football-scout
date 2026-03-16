import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Log queries in development
prisma.$on('query', (e: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    const queryEvent = e as { query?: string; duration?: number };
    logger.debug(`Query: ${queryEvent.query ?? 'unknown'}`);
    logger.debug(`Duration: ${queryEvent.duration ?? 0}ms`);
  }
});

// Log errors
prisma.$on('error', (e: unknown) => {
  logger.error('Prisma Error:', e);
});

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    return false;
  }
};

export default prisma;
