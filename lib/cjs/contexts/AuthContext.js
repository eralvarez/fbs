"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthContext = exports.AuthProvider = exports.AuthContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useAuth_1 = require("../hooks/useAuth");
const AuthContext = (0, react_1.createContext)(undefined);
exports.AuthContext = AuthContext;
const AuthProvider = ({ firebaseConfig, children }) => {
    const { user, hasAuth, authLoading, isAnonymous, isLoading, app, auth, handleSignInAnonymously, handleSignOut, handleSignInWithEmailAndPassword, } = (0, useAuth_1.useAuth)({ firebaseConfig });
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: {
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
exports.AuthProvider = AuthProvider;
const useAuthContext = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
};
exports.useAuthContext = useAuthContext;
