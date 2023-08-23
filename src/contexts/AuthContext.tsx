"use client";

import { createContext, useContext, ReactNode } from "react";
import { Auth, User, UserCredential } from "firebase/auth";
import { FirebaseApp, FirebaseOptions } from "firebase/app";

import { useAuth } from "../hooks/useAuth";

interface AuthContext {
  user: User | null;
  hasAuth: boolean;
  authLoading: boolean;
  isAnonymous: boolean;
  app: FirebaseApp;
  auth: Auth;
  handleSignInAnonymously: () => Promise<UserCredential>;
  handleSignOut: () => Promise<void>;
  handleSignInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

interface AuthProviderProps {
  firebaseConfig: FirebaseOptions;
  children: ReactNode;
}

const AuthProvider = ({ firebaseConfig, children }: AuthProviderProps) => {
  const {
    user,
    hasAuth,
    authLoading,
    isAnonymous,
    app,
    auth,
    handleSignInAnonymously,
    handleSignOut,
    handleSignInWithEmailAndPassword,
  } = useAuth({ firebaseConfig });

  return (
    <AuthContext.Provider
      value={{
        user,
        hasAuth,
        authLoading,
        isAnonymous,
        app,
        auth,
        handleSignInAnonymously,
        handleSignOut,
        handleSignInWithEmailAndPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a ThemeProvider");
  }

  return context;
};

export { AuthContext, AuthProvider, useAuthContext };
