import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG
  ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      // Only needed for OAuth providers (Google, Apple)
      clientId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
    };

// Only initialize Firebase in the browser to avoid runtime errors during SSR/prerender
let auth: ReturnType<typeof getAuth> | null = null;
if (typeof window !== 'undefined') {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
}

export { auth };