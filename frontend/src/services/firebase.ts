import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

function requiredEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing Firebase environment variable: ${name}`);
  }

  return value;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: requiredEnv(import.meta.env.VITE_FIREBASE_API_KEY, 'VITE_FIREBASE_API_KEY'),
  authDomain: requiredEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requiredEnv(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    'VITE_FIREBASE_STORAGE_BUCKET',
  ),
  messagingSenderId: requiredEnv(
    String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? ''),
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
  ),
  appId: requiredEnv(import.meta.env.VITE_FIREBASE_APP_ID, 'VITE_FIREBASE_APP_ID'),
};

console.log('Firebase API Key available:', Boolean(import.meta.env.VITE_FIREBASE_API_KEY));

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}
