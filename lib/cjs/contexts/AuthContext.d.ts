import { Context, ReactNode } from "react";
import { Auth, User, UserCredential } from "firebase/auth";
import { ObjectSchema, AnyObject } from "yup";
import { FirebaseApp, FirebaseOptions } from "firebase/app";
interface AuthContext {
    user: User | null;
    hasAuth: boolean;
    authLoading: boolean;
    isAnonymous: boolean;
    userProfile: any;
    app: FirebaseApp;
    auth: Auth;
    handleSignInAnonymously: () => Promise<UserCredential>;
    handleSignOut: () => Promise<void>;
    handleSignInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
}
declare const AuthContext: Context<AuthContext | null>;
interface AuthContextProviderProps<UserProfile> {
    firebaseConfig: FirebaseOptions;
    userProfileSchema: ObjectSchema<UserProfile & AnyObject>;
    children: ReactNode;
}
declare function AuthContextProvider<UserProfile>({ firebaseConfig, userProfileSchema, children, }: AuthContextProviderProps<UserProfile>): import("react/jsx-runtime").JSX.Element;
declare const useAuthContext: () => AuthContext;
export { AuthContext, AuthContextProvider, useAuthContext };
