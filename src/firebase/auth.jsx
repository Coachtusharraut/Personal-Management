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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user was previously in guest mode
    const storedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsGuest(false);
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } else if (storedGuest) {
        try {
          const guestUser = JSON.parse(storedGuest);
          setUser(guestUser);
          setIsGuest(true);
        } catch {
          setUser(null);
          setIsGuest(false);
        }
      } else {
        // Default to a friendly local guest profile for instant out-of-the-box readiness
        const defaultGuest = {
          uid: 'tushar_demo_user',
          displayName: 'Tushar Raut',
          email: 'tusharraut2001@gmail.com',
          photoURL: null,
          isAnonymous: true,
        };
        setUser(defaultGuest);
        setIsGuest(true);
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(defaultGuest));
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      {!loading && children}
    </AuthContext.Provider>
  );
}
