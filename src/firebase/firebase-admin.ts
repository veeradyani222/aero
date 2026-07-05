import * as admin from 'firebase-admin';

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

export const isFirebaseAdminConfigured = requiredEnvVars.every(
  (varName) => !!process.env[varName]
);

if (!admin.apps.length && isFirebaseAdminConfigured) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is empty or invalid');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
export const adminApp = admin.apps.length ? admin.app() : null;

export async function testFirestoreConnection(): Promise<boolean> {
  if (!firestore) {
    return false;
  }

  try {
    await firestore.collection('test').limit(1).get();
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
}

export default admin;

