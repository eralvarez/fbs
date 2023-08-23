import { useState, useEffect, useRef } from "react";
import {
  onAuthStateChanged,
  User,
  signInAnonymously,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { isFunction } from "lodash";

import { getApp, getAuth } from "../config/firebase";
import { FirebaseOptions } from "firebase/app";

interface UseAuthProps {
  firebaseConfig: FirebaseOptions;
  onSignOut?: () => void;
}

const useAuth = ({ firebaseConfig, onSignOut }: UseAuthProps) => {
  const { current: app } = useRef(getApp(firebaseConfig));
  const { current: auth } = useRef(getAuth(app));

  const [user, setUser] = useState<User | null>(null);
  const [hasAuth, setHasAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAnonymous, setIsAnonymousUser] = useState(false);

  useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      (user) => {
        setAuthLoading(false);
        if (user) {
          setUser(user);
          setHasAuth(true);
          setIsAnonymousUser(user.isAnonymous);
        } else {
          // User is signed out
          setUser(null);
          setHasAuth(false);
          setIsAnonymousUser(false);

          if (isFunction(onSignOut)) {
            onSignOut();
          }
        }
      }
    );
    return () => unsubscribeFromAuthStatusChanged();
  }, []);

  const handleSignInAnonymously = async () => await signInAnonymously(auth);

  const handleSignInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => await signInWithEmailAndPassword(auth, email, password);

  const handleSignOut = async () => await signOut(auth);

  return {
    user,
    hasAuth,
    authLoading,
    isAnonymous,
    app,
    auth,
    handleSignInAnonymously,
    handleSignOut,
    handleSignInWithEmailAndPassword,
  };
};

export { useAuth };
