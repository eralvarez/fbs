"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthContext = exports.AuthContextProvider = exports.AuthContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("firebase/auth");
const firebase_1 = require("../config/firebase");
const UserProfileService_1 = __importDefault(require("../services/UserProfileService"));
const AuthContext = (0, react_1.createContext)(null);
exports.AuthContext = AuthContext;
function AuthContextProvider({ firebaseConfig, userProfileSchema, children, }) {
    const { current: app } = (0, react_1.useRef)((0, firebase_1.getApp)(firebaseConfig));
    const { current: auth } = (0, react_1.useRef)((0, firebase_1.getAuth)(app));
    const { current: userProfileService } = (0, react_1.useRef)(new UserProfileService_1.default(firebaseConfig, userProfileSchema));
    const [user, setUser] = (0, react_1.useState)(null);
    const [userProfile, setUserProfile] = (0, react_1.useState)(null);
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
    const handleSignInAnonymously = () => __awaiter(this, void 0, void 0, function* () { return yield (0, auth_1.signInAnonymously)(auth); });
    const handleSignOut = () => __awaiter(this, void 0, void 0, function* () { return yield (0, auth_1.signOut)(auth); });
    const handleSignInWithEmailAndPassword = (email, password) => __awaiter(this, void 0, void 0, function* () { return yield (0, auth_1.signInWithEmailAndPassword)(auth, email, password); });
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: {
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
exports.AuthContextProvider = AuthContextProvider;
const useAuthContext = () => (0, react_1.useContext)(AuthContext);
exports.useAuthContext = useAuthContext;
