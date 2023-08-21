"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth = exports.getApp = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const getApp = (config) => {
    const app = (0, app_1.getApps)().length === 0 ? (0, app_1.initializeApp)(config) : (0, app_1.getApp)();
    return app;
};
exports.getApp = getApp;
const getAuth = (app) => (0, auth_1.getAuth)(app);
exports.getAuth = getAuth;
