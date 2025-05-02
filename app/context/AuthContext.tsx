'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  setPreviousPath: (path: string) => void;
  previousPath: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousPath, setPreviousPath] = useState('/');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Set auth cookie when user is logged in
        Cookies.set('auth', 'true', { expires: 7 }); // Cookie expires in 7 days
      } else {
        setUser(null);
        // Remove auth cookie when user is logged out
        Cookies.remove('auth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      const usersRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(usersRef);

      if (!userDoc.exists()) {
        await setDoc(usersRef, {
          email: user.email,
          fullName: fullName,
          role: 'admin', // First user is admin
          createdAt: new Date().toISOString()
        });
      }

      setUser(user);
      Cookies.set('auth', 'true', { expires: 7 });
      return user;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user);
    Cookies.set('auth', 'true', { expires: 7 });
    return userCredential.user;
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Create or update user document in Firestore
      const usersRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(usersRef);

      if (!userDoc.exists()) {
        await setDoc(usersRef, {
          email: user.email,
          fullName: user.displayName || 'User',
          role: 'admin', // First user is admin
          createdAt: new Date().toISOString()
        });
      }

      setUser(user);
      Cookies.set('auth', 'true', { expires: 7 });
      return user;
    } catch (error) {
      console.error('Error in Google sign in:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    Cookies.remove('auth');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signInWithGoogle, 
      logout,
      previousPath,
      setPreviousPath 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 