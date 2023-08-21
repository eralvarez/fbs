import {
  getApp as getOriginalApp,
  getApps,
  initializeApp,
  FirebaseOptions,
  FirebaseApp,
} from "firebase/app";
import { getAuth as getOriginalAuth } from "firebase/auth";

const getApp = (config: FirebaseOptions) => {
  const app = getApps().length === 0 ? initializeApp(config) : getOriginalApp();
  return app;
};

const getAuth = (app: FirebaseApp) => getOriginalAuth(app);

export { getApp, getAuth };
