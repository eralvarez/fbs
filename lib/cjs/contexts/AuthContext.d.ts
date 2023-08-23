import { ReactNode } from "react";
import { Auth, User, UserCredential } from "firebase/auth";
import { FirebaseApp, FirebaseOptions } from "firebase/app";
interface AuthContext {
    user: User | null;
    hasAuth: boolean;
    authLoading: boolean;
    isAnonymous: boolean;
    app: FirebaseApp;
    auth: Auth;
    handleSignInAnonymously: () => Promise<UserCredential>;
    handleSignOut: () => Promise<void>;
    handleSignInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
}
declare const AuthContext: import("react").Context<AuthContext | undefined>;
interface AuthProviderProps {
    firebaseConfig: FirebaseOptions;
    children: ReactNode;
}
declare const AuthProvider: ({ firebaseConfig, children }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
declare const useAuthContext: () => AuthContext;
export { AuthContext, AuthProvider, useAuthContext };
