'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDlCC6BjEwQQG_LleGhd4SYh5NdhmR4_GQ",
  authDomain: "football-scout-6cbf1.firebaseapp.com",
  projectId: "football-scout-6cbf1",
  storageBucket: "football-scout-6cbf1.firebasestorage.app",
  messagingSenderId: "903801571433",
  appId: "1:903801571433:web:8ddadf7b5add91b3b13af8",
  measurementId: "G-PP3GSE9R9X"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth }; 