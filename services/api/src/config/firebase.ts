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

if (!hasFirebaseConfig) {
  logger.warn('⚠️  Firebase env vars missing — Firebase features are disabled for local dev mode');
}

// Firebase is optional for local development and is intentionally not bundled in the API package
// to avoid the vulnerable Firebase Admin transitive dependency chain. When configuration is absent,
// routes fall back to the app’s JWT-based local auth flow. This keeps the API functional without
// requiring external Firebase credentials.
export const auth = null as any;
export const storage = null as any;
export const firestore = null as any;

export default { apps: [], auth: () => null, storage: () => null, firestore: () => null };
