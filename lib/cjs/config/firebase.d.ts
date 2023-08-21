import { FirebaseOptions, FirebaseApp } from "firebase/app";
declare const getApp: (config: FirebaseOptions) => FirebaseApp;
declare const getAuth: (app: FirebaseApp) => import("@firebase/auth").Auth;
export { getApp, getAuth };
