import { getApp as getOriginalApp, getApps, initializeApp, } from "firebase/app";
import { getAuth as getOriginalAuth } from "firebase/auth";
const getApp = (config) => {
    const app = getApps().length === 0 ? initializeApp(config) : getOriginalApp();
    return app;
};
const getAuth = (app) => getOriginalAuth(app);
export { getApp, getAuth };
