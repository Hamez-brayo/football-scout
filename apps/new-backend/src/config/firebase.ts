import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

const initializeFirebase = () => {
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

export const auth = admin.auth();
export const storage = admin.storage();
export const firestore = admin.firestore();

export default admin;
