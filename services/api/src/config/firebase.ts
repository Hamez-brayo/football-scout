import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

const firebaseVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_STORAGE_BUCKET',
];

const hasFirebaseConfig = firebaseVars.every((key) => !!process.env[key]);

const initializeFirebase = () => {
  if (!hasFirebaseConfig) {
    logger.warn('⚠️  Firebase env vars missing — skipping Firebase initialization (local dev mode)');
    return null;
  }
  try {
    if (getApps().length) {
      return getApp();
    }
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    logger.info('✅ Firebase Admin initialized successfully');
    return app;
  } catch (error) {
    logger.error('❌ Firebase Admin initialization failed:', error);
    throw error;
  }
};

const app = initializeFirebase();

// Preserve the existing client types for consumers; unconfigured local mode
// still exports null at runtime and cannot serve Firebase-dependent endpoints.
export const auth = (app ? getAuth(app) : null) as Auth;
export const storage = (app ? getStorage(app) : null) as Storage;
export const firestore = (app ? getFirestore(app) : null) as Firestore;
