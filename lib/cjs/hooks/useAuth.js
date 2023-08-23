"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const lodash_1 = require("lodash");
const firebase_1 = require("../config/firebase");
const useAuth = ({ firebaseConfig, onSignOut }) => {
    const { current: app } = (0, react_1.useRef)((0, firebase_1.getApp)(firebaseConfig));
    const { current: auth } = (0, react_1.useRef)((0, firebase_1.getAuth)(app));
    const [user, setUser] = (0, react_1.useState)(null);
    const [hasAuth, setHasAuth] = (0, react_1.useState)(false);
    const [authLoading, setAuthLoading] = (0, react_1.useState)(true);
    const [isAnonymous, setIsAnonymousUser] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const unsubscribeFromAuthStatusChanged = (0, auth_1.onAuthStateChanged)(auth, (user) => {
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
                if ((0, lodash_1.isFunction)(onSignOut)) {
                    onSignOut();
                }
            }
        });
        return () => unsubscribeFromAuthStatusChanged();
    }, []);
    const handleSignInAnonymously = () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, auth_1.signInAnonymously)(auth); });
    const handleSignInWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, auth_1.signInWithEmailAndPassword)(auth, email, password); });
    const handleSignOut = () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, auth_1.signOut)(auth); });
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
exports.useAuth = useAuth;
