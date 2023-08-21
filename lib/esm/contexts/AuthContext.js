"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useRef, } from "react";
import { onAuthStateChanged, signInAnonymously, signOut, signInWithEmailAndPassword, } from "firebase/auth";
import { getApp, getAuth } from "../config/firebase";
import UserProfileService from "../services/UserProfileService";
const AuthContext = createContext(null);
function AuthContextProvider({ firebaseConfig, userProfileSchema, children, }) {
    const { current: app } = useRef(getApp(firebaseConfig));
    const { current: auth } = useRef(getAuth(app));
    const { current: userProfileService } = useRef(new UserProfileService(firebaseConfig, userProfileSchema));
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [hasAuth, setHasAuth] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [isAnonymous, setIsAnonymousUser] = useState(false);
    useEffect(() => {
        const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
            setAuthLoading(false);
            if (user) {
                setUser(user);
                setHasAuth(true);
                setIsAnonymousUser(user.isAnonymous);
                loadUserProfile(user);
            }
            else {
                // User is signed out
                setUser(null);
                setHasAuth(false);
                setIsAnonymousUser(false);
                setUserProfile(null);
            }
        });
        return () => unsubscribeFromAuthStatusChanged();
    }, []);
    const loadUserProfile = (user) => __awaiter(this, void 0, void 0, function* () {
        try {
            const profile = yield userProfileService.getSingle({
                whereConditions: [["authId", "==", user.uid]],
            });
            setUserProfile(profile);
        }
        catch (error) { }
    });
    const handleSignInAnonymously = () => __awaiter(this, void 0, void 0, function* () { return yield signInAnonymously(auth); });
    const handleSignOut = () => __awaiter(this, void 0, void 0, function* () { return yield signOut(auth); });
    const handleSignInWithEmailAndPassword = (email, password) => __awaiter(this, void 0, void 0, function* () { return yield signInWithEmailAndPassword(auth, email, password); });
    return (_jsx(AuthContext.Provider, { value: {
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
        }, children: children }));
}
const useAuthContext = () => useContext(AuthContext);
export { AuthContext, AuthContextProvider, useAuthContext };
