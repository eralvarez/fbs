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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FirestoreService_instances, _FirestoreService_modelName, _FirestoreService_logErrorModelName, _FirestoreService_collectionSchema, _FirestoreService_environment, _FirestoreService_firestore, _FirestoreService_latestGetAllResponseMap, _FirestoreService_parseItem, _FirestoreService_logError;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationOptions = exports.FirestoreService = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const lodash_1 = require("lodash");
const yup_1 = require("yup");
var PaginationOptions;
(function (PaginationOptions) {
    PaginationOptions["NEXT"] = "next";
    PaginationOptions["PREVIOUS"] = "previous";
})(PaginationOptions || (exports.PaginationOptions = PaginationOptions = {}));
class FirestoreService {
    constructor({ modelName, collectionSchema, environment = "dev", firebaseConfig, logErrorCollection = "errors", }) {
        _FirestoreService_instances.add(this);
        _FirestoreService_modelName.set(this, "");
        _FirestoreService_logErrorModelName.set(this, "");
        _FirestoreService_collectionSchema.set(this, void 0);
        _FirestoreService_environment.set(this, void 0);
        _FirestoreService_firestore.set(this, void 0);
        _FirestoreService_latestGetAllResponseMap.set(this, new Map());
        __classPrivateFieldSet(this, _FirestoreService_modelName, `${environment}-${modelName}`, "f");
        __classPrivateFieldSet(this, _FirestoreService_logErrorModelName, `${environment}-${logErrorCollection}`, "f");
        __classPrivateFieldSet(this, _FirestoreService_collectionSchema, collectionSchema.shape({
            createdAt: (0, yup_1.date)().nullable(),
            updatedAt: (0, yup_1.date)().nullable(),
            deletedAt: (0, yup_1.date)().nullable(),
        }), "f");
        __classPrivateFieldSet(this, _FirestoreService_environment, environment, "f");
        const app = (0, app_1.getApps)().length === 0 ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApp)();
        __classPrivateFieldSet(this, _FirestoreService_firestore, (0, firestore_1.getFirestore)(app), "f");
    }
    getEnvironment() {
        return __classPrivateFieldGet(this, _FirestoreService_environment, "f");
    }
    onChange(idOrWhereCondition, callback) {
        let docRef;
        let unsubscribe;
        if (typeof idOrWhereCondition === "string") {
            docRef = (0, firestore_1.doc)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"), idOrWhereCondition);
            unsubscribe = (0, firestore_1.onSnapshot)(docRef, (doc) => {
                if (doc && doc.exists()) {
                    const item = __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_parseItem).call(this, doc);
                    callback(item);
                }
                else {
                    callback();
                }
            });
        }
        else {
            const modelRef = (0, firestore_1.collection)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"));
            docRef = (0, firestore_1.query)(modelRef, (0, firestore_1.where)(idOrWhereCondition[0], idOrWhereCondition[1], idOrWhereCondition[2]));
            unsubscribe = (0, firestore_1.onSnapshot)(docRef, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    const items = [];
                    querySnapshot.forEach((doc) => {
                        const item = __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_parseItem).call(this, doc);
                        items.push(__classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").cast(item, { stripUnknown: true }));
                    });
                    callback(items[0]);
                }
                else {
                    callback();
                }
            });
        }
        return unsubscribe;
    }
    onMultipleChanges(idOrWhereCondition, callback) {
        const modelRef = (0, firestore_1.collection)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"));
        const docRef = (0, firestore_1.query)(modelRef, (0, firestore_1.where)(idOrWhereCondition[0], idOrWhereCondition[1], idOrWhereCondition[2]));
        const unsubscribe = (0, firestore_1.onSnapshot)(docRef, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const items = [];
                querySnapshot.forEach((doc) => {
                    const item = __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_parseItem).call(this, doc);
                    items.push(__classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").cast(item, { stripUnknown: true }));
                });
                callback(items);
            }
            else {
                callback();
            }
        });
        return unsubscribe;
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"), id);
                const item = yield (0, firestore_1.getDoc)(docRef);
                return __classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").cast(__classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_parseItem).call(this, item), {
                    stripUnknown: true,
                });
            }
            catch (error) {
                const errorPayload = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                // firebase error
                yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, { type: "FirebaseError", payload: errorPayload });
                throw error;
            }
        });
    }
    getAll(props) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whereConditions = (props === null || props === void 0 ? void 0 : props.whereConditions) || [];
                const limitBy = (props === null || props === void 0 ? void 0 : props.limitBy) || 10;
                const pagination = props === null || props === void 0 ? void 0 : props.pagination;
                const showDeleted = (props === null || props === void 0 ? void 0 : props.showDeleted) || false;
                const items = [];
                const modelRef = (0, firestore_1.collection)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"));
                let queryRef = (0, firestore_1.query)(modelRef, (0, firestore_1.limit)(limitBy), (0, firestore_1.orderBy)("createdAt", "desc"));
                if (pagination !== undefined &&
                    __classPrivateFieldGet(this, _FirestoreService_latestGetAllResponseMap, "f").has(limitBy)) {
                    const latestGetAllResponse = __classPrivateFieldGet(this, _FirestoreService_latestGetAllResponseMap, "f").get(limitBy);
                    if (pagination === PaginationOptions.NEXT) {
                        queryRef = (0, firestore_1.query)(queryRef, (0, firestore_1.startAfter)(latestGetAllResponse === null || latestGetAllResponse === void 0 ? void 0 : latestGetAllResponse.querySnapshot.docs.at(-1)), (0, firestore_1.limit)(limitBy));
                    }
                    else if (pagination === PaginationOptions.PREVIOUS) {
                        queryRef = (0, firestore_1.query)(queryRef, (0, firestore_1.endBefore)(latestGetAllResponse === null || latestGetAllResponse === void 0 ? void 0 : latestGetAllResponse.querySnapshot.docs.at(0)), (0, firestore_1.limitToLast)(limitBy));
                    }
                }
                if (!showDeleted) {
                    queryRef = (0, firestore_1.query)(queryRef, (0, firestore_1.where)("deletedAt", "==", null));
                }
                whereConditions.forEach((whereCondition) => {
                    queryRef = (0, firestore_1.query)(queryRef, (0, firestore_1.where)(whereCondition[0], whereCondition[1], whereCondition[2]));
                });
                // https://firebase.google.com/docs/firestore/query-data/queries#or_queries
                let querySnapshot = yield (0, firestore_1.getDocs)(queryRef);
                if (querySnapshot.docs.length > 0) {
                    __classPrivateFieldGet(this, _FirestoreService_latestGetAllResponseMap, "f").set(limitBy, {
                        querySnapshot,
                    });
                }
                else {
                    const lastQuerySnapshot = (_a = __classPrivateFieldGet(this, _FirestoreService_latestGetAllResponseMap, "f").get(limitBy)) === null || _a === void 0 ? void 0 : _a.querySnapshot;
                    querySnapshot = lastQuerySnapshot;
                    __classPrivateFieldGet(this, _FirestoreService_latestGetAllResponseMap, "f").set(limitBy, {
                        querySnapshot,
                    });
                }
                querySnapshot.forEach((doc) => {
                    const item = __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_parseItem).call(this, doc);
                    items.push(__classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").cast(item, { stripUnknown: true }));
                });
                return items;
            }
            catch (error) {
                const errorPayload = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                // firebase error
                yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, { type: "FirebaseError", payload: errorPayload });
                throw error;
            }
        });
    }
    getSingle(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.getAll(Object.assign(Object.assign({}, props), { limitBy: 1 }));
                const response = items.length ? items[0] : null;
                return response;
            }
            catch (error) {
                const errorPayload = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                // firebase error
                yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, { type: "FirebaseError", payload: errorPayload });
                throw error;
            }
        });
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").validate(item);
                const dbRef = (0, firestore_1.collection)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"));
                const cleanItem = __classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").cast(item, {
                    stripUnknown: true,
                });
                const createdItemRef = yield (0, firestore_1.addDoc)(dbRef, Object.assign(Object.assign({}, cleanItem), { createdAt: firestore_1.Timestamp.fromDate(new Date()), updatedAt: null, deletedAt: null }));
                const createdItem = yield this.getById(createdItemRef.id);
                return createdItem;
            }
            catch (error) {
                const errorPayload = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                if (error instanceof yup_1.ValidationError) {
                    yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, {
                        type: "ValidationError",
                        payload: errorPayload,
                    });
                }
                else {
                    // firebase error
                    yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, { type: "FirebaseError", payload: errorPayload });
                }
                throw error;
            }
        });
    }
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"), id);
                yield __classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").validate(item);
                const cleanItem = __classPrivateFieldGet(this, _FirestoreService_collectionSchema, "f").cast(item, {
                    stripUnknown: true,
                });
                const cleanItemMap = new Map(Object.entries(cleanItem));
                cleanItemMap.delete("id");
                cleanItemMap.delete("createdAt");
                cleanItemMap.delete("updatedAt");
                cleanItemMap.delete("deletedAt");
                yield (0, firestore_1.setDoc)(docRef, Object.assign(Object.assign({}, Object.fromEntries(cleanItemMap)), { updatedAt: firestore_1.Timestamp.fromDate(new Date()) }), { merge: true });
            }
            catch (error) {
                const errorPayload = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                if (error instanceof yup_1.ValidationError) {
                    yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, {
                        type: "ValidationError",
                        payload: errorPayload,
                    });
                }
                else {
                    // firebase error
                    yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, { type: "FirebaseError", payload: errorPayload });
                }
                throw error;
            }
        });
    }
    delete(id, isSoftDelete = true) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const docRef = (0, firestore_1.doc)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_modelName, "f"), id);
                if (isSoftDelete) {
                    yield (0, firestore_1.setDoc)(docRef, {
                        deletedAt: firestore_1.Timestamp.fromDate(new Date()),
                    }, { merge: true });
                }
                else {
                    yield (0, firestore_1.deleteDoc)(docRef);
                }
            }
            catch (error) {
                const errorPayload = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                // firebase error
                yield __classPrivateFieldGet(this, _FirestoreService_instances, "m", _FirestoreService_logError).call(this, { type: "FirebaseError", payload: errorPayload });
                throw error;
            }
        });
    }
}
exports.FirestoreService = FirestoreService;
_FirestoreService_modelName = new WeakMap(), _FirestoreService_logErrorModelName = new WeakMap(), _FirestoreService_collectionSchema = new WeakMap(), _FirestoreService_environment = new WeakMap(), _FirestoreService_firestore = new WeakMap(), _FirestoreService_latestGetAllResponseMap = new WeakMap(), _FirestoreService_instances = new WeakSet(), _FirestoreService_parseItem = function _FirestoreService_parseItem(doc) {
    const item = doc.data();
    const dateKeys = ["createdAt", "updatedAt", "deletedAt"];
    const dateMap = new Map();
    for (const dateKey of dateKeys) {
        if ((0, lodash_1.has)(item, dateKey) && (0, lodash_1.get)(item, dateKey) instanceof firestore_1.Timestamp) {
            dateMap.set(dateKey, (0, lodash_1.get)(item, dateKey).toDate());
        }
    }
    return Object.assign(Object.assign(Object.assign({}, item), { id: doc.id }), Object.fromEntries(dateMap));
}, _FirestoreService_logError = function _FirestoreService_logError(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbRef = (0, firestore_1.collection)(__classPrivateFieldGet(this, _FirestoreService_firestore, "f"), __classPrivateFieldGet(this, _FirestoreService_logErrorModelName, "f"));
        yield (0, firestore_1.addDoc)(dbRef, Object.assign(Object.assign({}, payload), { createdAt: firestore_1.Timestamp.fromDate(new Date()) }));
    });
};
