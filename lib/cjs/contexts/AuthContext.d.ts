import { ReactNode } from "react";
import { FirebaseOptions } from "firebase/app";
import { useAuth } from "../hooks/useAuth";
interface AuthContext extends ReturnType<typeof useAuth> {
}
declare const AuthContext: import("react").Context<AuthContext | undefined>;
interface AuthProviderProps {
    firebaseConfig: FirebaseOptions;
    children: ReactNode;
}
declare const AuthProvider: ({ firebaseConfig, children }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
declare const useAuthContext: () => AuthContext;
export { AuthContext, AuthProvider, useAuthContext };
