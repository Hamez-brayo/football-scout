import 'dotenv/config';
import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Vysion Analytics',
  slug: 'vysion-analytics',
  version: '2.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'vysion',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.vysion.analytics',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#1e40af',
    },
    package: 'com.vysion.analytics',
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#1e40af',
      },
    ],
  ],
  extra: {
    // Firebase — loaded from .env
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    // API
    apiUrl: process.env.API_URL,
    ...(process.env.VYSION_LOCAL_PILOT === '1'
      ? {
          localPilot: true,
          firebaseApiKey: 'demo-vysion-pilot-key',
          firebaseAuthDomain: 'demo-vysion-pilot.firebaseapp.com',
          firebaseProjectId: 'demo-vysion-pilot',
          firebaseAppId: 'demo-vysion-pilot-app',
          authEmulatorUrl: `http://${process.env.PILOT_HOST || '127.0.0.1'}:9099`,
        }
      : {}),
    // EAS
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'your-project-id',
    },
  },
});
