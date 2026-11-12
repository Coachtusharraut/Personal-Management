import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  reauthenticateWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from './config';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calendarAccessToken, setCalendarAccessToken] = useState(null);
  const [calendarTokenExpiresAt, setCalendarTokenExpiresAt] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
      if (!firebaseUser) {
        setCalendarAccessToken(null);
        setCalendarTokenExpiresAt(null);
      }
    }, (error) => {
      console.error('Authentication state could not be verified:', error);
      setUser(null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    return result.user;
  };

  const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    return result.user;
  };

  const requestCalendarAccess = async () => {
    if (!auth.currentUser) throw new Error('Sign in before connecting Google Calendar.');
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    provider.setCustomParameters({ prompt: 'consent select_account' });
    const result = await reauthenticateWithPopup(auth.currentUser, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google did not return a Calendar access token. Check that Google sign-in is enabled for this Firebase project.');
    }
    const expiresAt = Date.now() + 55 * 60 * 1000;
    setCalendarAccessToken(credential.accessToken);
    setCalendarTokenExpiresAt(expiresAt);
    return { accessToken: credential.accessToken, expiresAt };
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setCalendarAccessToken(null);
    setCalendarTokenExpiresAt(null);
  };

  const value = {
    user,
    loading,
    isGuest: false,
    loginWithGoogle,
    loginWithEmail,
    requestCalendarAccess,
    calendarAccessToken,
    calendarTokenExpiresAt,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
