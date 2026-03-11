import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import { config } from '@/config';
import { logger } from '@/config/logger';
import { testDatabaseConnection } from '@/config/database';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';

// Create Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: `${config.MAX_FILE_SIZE_MB}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${config.MAX_FILE_SIZE_MB}mb` }));

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Vysion Analytics API',
    version: '2.0.0',
    description: 'Football Talent Scouting Platform API',
    documentation: '/api/health',
  });
});

// API routes
app.use(config.API_PREFIX, routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Start listening
    app.listen(config.PORT, () => {
      logger.info('================================================');
      logger.info(`🚀 Vysion Analytics API v2.0.0`);
      logger.info(`🌍 Environment: ${config.NODE_ENV}`);
      logger.info(`📡 Server running on port ${config.PORT}`);
      logger.info(`🔗 API URL: http://localhost:${config.PORT}${config.API_PREFIX}`);
      logger.info(`✅ Database connected`);
      logger.info('================================================');
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;
