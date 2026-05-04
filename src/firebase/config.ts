import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const placeholderValues = new Set([
  "your_firebase_api_key",
  "your-project.firebaseapp.com",
  "your-project-id",
  "your-project.appspot.com",
  "1:123456789:web:abcdef123456",
]);

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => !!value && !placeholderValues.has(value)
);

const fallbackFirebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo.localhost",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:demo",
};

const appConfig = isFirebaseConfigured ? firebaseConfig : fallbackFirebaseConfig;

const firebase_app =
  getApps().length === 0 ? initializeApp(appConfig) : getApps()[0];

export const db = getFirestore(firebase_app);

export default firebase_app;

