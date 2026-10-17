import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3002', 10),
  HOST: process.env.HOST || (process.env.NODE_ENV === 'development' ? '0.0.0.0' : '127.0.0.1'),
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api',
  DATABASE_URL: process.env.DATABASE_URL!,
  // A development fallback is convenient locally but must never be used in production.
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? '' : 'devsecret'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL!,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY!,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET!,
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '500', 10),
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

const requiredEnvVars = [
  'DATABASE_URL',
  ...(isProduction ? ['JWT_SECRET', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_STORAGE_BUCKET'] : []),
];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}
if (isProduction && (process.env.JWT_SECRET?.length ?? 0) < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production');
}

export default config;
