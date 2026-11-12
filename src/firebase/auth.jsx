import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from './config';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const GUEST_STORAGE_KEY = 'tusharraut_guest_session';

const DEFAULT_GUEST = {
  uid: 'tushar_demo_user',
  displayName: 'Tushar Raut',
  email: 'tusharraut2001@gmail.com',
  photoURL: null,
  isAnonymous: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedGuest = typeof window !== 'undefined' ? localStorage.getItem(GUEST_STORAGE_KEY) : null;
      return storedGuest ? JSON.parse(storedGuest) : DEFAULT_GUEST;
    } catch {
      return DEFAULT_GUEST;
    }
  });
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            setIsGuest(false);
            localStorage.removeItem(GUEST_STORAGE_KEY);
          } else {
            try {
              const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
              if (storedGuest) {
                setUser(JSON.parse(storedGuest));
              } else {
                setUser(DEFAULT_GUEST);
                localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(DEFAULT_GUEST));
              }
            } catch {
              setUser(DEFAULT_GUEST);
            }
            setIsGuest(true);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Firebase Auth state listener note:', error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firebase Auth initialization caught:', err);
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return result.user;
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return result.user;
    } catch (error) {
      console.error('Email sign-in failed:', error);
      throw error;
    }
  };

  const signupWithEmail = async (email, password, displayName = 'Tushar Raut') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      setIsGuest(false);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return result.user;
    } catch (error) {
      console.error('Sign-up failed:', error);
      throw error;
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      uid: 'tushar_demo_user',
      displayName: 'Tushar Raut',
      email: 'tusharraut2001@gmail.com',
      isAnonymous: true,
    };
    setUser(guestUser);
    setIsGuest(true);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
  };

  const logout = async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setUser(null);
      setIsGuest(false);
    } else {
      await signOut(auth);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isGuest,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    loginAsGuest,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
