"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Context,
  ReactNode,
  useRef,
} from "react";
import {
  Auth,
  onAuthStateChanged,
  User,
  UserCredential,
  signInAnonymously,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ObjectSchema, AnyObject } from "yup";

import { getApp, getAuth } from "../config/firebase";
import UserProfileService from "../services/UserProfileService";
import { FirebaseApp, FirebaseOptions } from "firebase/app";

// yup.InferType<typeof userProfileSchema>;

interface AuthContext {
  user: User | null;
  hasAuth: boolean;
  authLoading: boolean;
  isAnonymous: boolean;
  userProfile: any;
  // userProfileService: UserProfileService<ObjectSchema<AnyObject>>;
  app: FirebaseApp;
  auth: Auth;
  handleSignInAnonymously: () => Promise<UserCredential>;
  handleSignOut: () => Promise<void>;
  handleSignInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthContextProviderProps<UserProfile> {
  firebaseConfig: FirebaseOptions;
  userProfileSchema: ObjectSchema<UserProfile & AnyObject>;
  children: ReactNode;
}

function AuthContextProvider<UserProfile>({
  firebaseConfig,
  userProfileSchema,
  children,
}: AuthContextProviderProps<UserProfile>) {
  const { current: app } = useRef(getApp(firebaseConfig));
  const { current: auth } = useRef(getAuth(app));

  const { current: userProfileService } = useRef(
    new UserProfileService<UserProfile>(firebaseConfig, userProfileSchema)
  );
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
          loadUserProfile(user);
        } else {
          // User is signed out
          setUser(null);
          setHasAuth(false);
          setIsAnonymousUser(false);
          setUserProfile(null);
        }
      }
    );
    return () => unsubscribeFromAuthStatusChanged();
  }, []);

  const loadUserProfile = async (user: User) => {
    try {
      const profile = await userProfileService.getSingle({
        whereConditions: [["authId" as keyof UserProfile, "==", user.uid]],
      });
      setUserProfile(profile);
    } catch (error) {}
  };

  const handleSignInAnonymously = async () => await signInAnonymously(auth);

  const handleSignOut = async () => await signOut(auth);

  const handleSignInWithEmailAndPassword = async (
    email: string,
    password: string
  ) => await signInWithEmailAndPassword(auth, email, password);

  return (
    <AuthContext.Provider
      value={{
        user,
        hasAuth,
        authLoading,
        isAnonymous,
        userProfile,
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
}

const useAuthContext = () =>
  useContext<AuthContext>(AuthContext as Context<AuthContext>);

export { AuthContext, AuthContextProvider, useAuthContext };
