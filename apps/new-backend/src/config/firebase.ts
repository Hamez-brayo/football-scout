import * as admin from 'firebase-admin';
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
    return;
  }
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      logger.info('✅ Firebase Admin initialized successfully');
    } catch (error) {
      logger.error('❌ Firebase Admin initialization failed:', error);
      throw error;
    }
  }
};

initializeFirebase();

// When Firebase is unconfigured (local dev), exports are null at runtime but
// typed correctly so routes compile. Calling them without config will throw
// a descriptive error only for Firebase-dependent endpoints.
export const auth = (hasFirebaseConfig ? admin.auth() : null) as admin.auth.Auth;
export const storage = (hasFirebaseConfig ? admin.storage() : null) as admin.storage.Storage;
export const firestore = (hasFirebaseConfig ? admin.firestore() : null) as admin.firestore.Firestore;

export default admin;
