import { User } from "firebase/auth";
import { FirebaseOptions } from "firebase/app";
interface UseAuthProps {
    firebaseConfig: FirebaseOptions;
    onSignOut?: () => void;
}
declare const useAuth: ({ firebaseConfig, onSignOut }: UseAuthProps) => {
    user: User | null;
    hasAuth: boolean;
    authLoading: boolean;
    isAnonymous: boolean;
    isLoading: boolean;
    app: import("@firebase/app").FirebaseApp;
    auth: import("@firebase/auth").Auth;
    handleSignInAnonymously: () => Promise<import("@firebase/auth").UserCredential>;
    handleSignOut: () => Promise<void>;
    handleSignInWithEmailAndPassword: (email: string, password: string) => Promise<import("@firebase/auth").UserCredential>;
};
export { useAuth };
