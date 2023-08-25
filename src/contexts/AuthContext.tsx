"use client";

import { createContext, useContext, ReactNode } from "react";
import { FirebaseOptions } from "firebase/app";

import { useAuth } from "../hooks/useAuth";

interface AuthContext extends ReturnType<typeof useAuth> {}

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
    isLoading,
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
        isLoading,
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
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
};

export { AuthContext, AuthProvider, useAuthContext };
