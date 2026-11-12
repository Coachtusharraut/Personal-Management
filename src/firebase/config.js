import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "personal-mgmt-app",
  appId: "1:890008209229:web:7ff614f76e6936c2e5d904",
  storageBucket: "personal-mgmt-app.firebasestorage.app",
  apiKey: "AIzaSyBttO4U4MwgrTAHDsoDt-5whE7jVjiRpc0",
  authDomain: "personal-mgmt-app.firebaseapp.com",
  messagingSenderId: "890008209229",
  projectNumber: "890008209229"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = getFirestore(app);

// Enable offline persistence if in browser environment
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not supported in this browser');
    }
  });
}

export default app;
