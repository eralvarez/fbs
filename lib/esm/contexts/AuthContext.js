"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
const AuthContext = createContext(undefined);
const AuthProvider = ({ firebaseConfig, children }) => {
    const { user, hasAuth, authLoading, isAnonymous, isLoading, app, auth, handleSignInAnonymously, handleSignOut, handleSignInWithEmailAndPassword, } = useAuth({ firebaseConfig });
    return (_jsx(AuthContext.Provider, { value: {
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
        }, children: children }));
};
const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
};
export { AuthContext, AuthProvider, useAuthContext };
