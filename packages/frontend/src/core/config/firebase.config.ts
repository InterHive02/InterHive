import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD2b1LM-CsM-IEqT--stGgzxJ6JrccgtfM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'interhive-0.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'interhive-0',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'interhive-0.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '83363730117',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:83363730117:web:54d26c9a6e73c4520c56ac',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-4V8D2EMZM5',
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google OAuth Popup via Firebase Auth
export const signInWithFirebaseGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
    };
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    throw error;
  }
};
