var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signInAnonymously, signOut, signInWithEmailAndPassword, } from "firebase/auth";
import { isFunction } from "lodash";
import { getApp, getAuth } from "../config/firebase";
const useAuth = ({ firebaseConfig, onSignOut }) => {
    const { current: app } = useRef(getApp(firebaseConfig));
    const { current: auth } = useRef(getAuth(app));
    const [user, setUser] = useState(null);
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
            }
            else {
                // User is signed out
                setUser(null);
                setHasAuth(false);
                setIsAnonymousUser(false);
                if (isFunction(onSignOut)) {
                    onSignOut();
                }
            }
        });
        return () => unsubscribeFromAuthStatusChanged();
    }, []);
    const handleSignInAnonymously = () => __awaiter(void 0, void 0, void 0, function* () { return yield signInAnonymously(auth); });
    const handleSignInWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () { return yield signInWithEmailAndPassword(auth, email, password); });
    const handleSignOut = () => __awaiter(void 0, void 0, void 0, function* () { return yield signOut(auth); });
    return {
        user,
        hasAuth,
        authLoading,
        isAnonymous,
        app,
        auth,
        handleSignInAnonymously,
        handleSignOut,
        handleSignInWithEmailAndPassword,
    };
};
export { useAuth };
