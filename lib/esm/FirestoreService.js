var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { collection, getDocs, getDoc, setDoc, addDoc, deleteDoc, doc, query, limit, where, Timestamp, } from "firebase/firestore";
import { has, get } from "lodash";
class FirestoreService {
    constructor({ modelName, collectionSchema, environment = "dev", firestore, }) {
        this.modelName = "";
        this.modelName = `${environment}-${modelName}`;
        this.collectionSchema = collectionSchema;
        this.environment = environment;
        this.firestore = firestore;
    }
    parseItem(doc) {
        const item = doc.data();
        const dateKeys = ["createdAt", "updatedAt", "deletedAt"];
        const dateMap = new Map();
        for (const dateKey of dateKeys) {
            if (has(item, dateKey) && get(item, dateKey) instanceof Timestamp) {
                dateMap.set(dateKey, get(item, dateKey).toDate());
            }
        }
        return Object.assign(Object.assign(Object.assign({}, item), { id: doc.id }), Object.fromEntries(dateMap));
    }
    getEnvironment() {
        return this.environment;
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const docRef = doc(this.firestore, this.modelName, id);
            const item = yield getDoc(docRef);
            return this.collectionSchema.cast(this.parseItem(item), {
                stripUnknown: true,
            });
        });
    }
    getAll(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { whereConditions = [], limitBy = 20 } = props;
            const items = [];
            const modelRef = collection(this.firestore, this.modelName);
            let queryRef = query(modelRef, limit(limitBy));
            whereConditions.forEach((whereCondition) => {
                queryRef = query(queryRef, where(whereCondition.at(0), whereCondition.at(1), whereCondition.at(2)));
            });
            // https://firebase.google.com/docs/firestore/query-data/queries#or_queries
            const querySnapshot = yield getDocs(queryRef);
            querySnapshot.forEach((doc) => {
                const item = this.parseItem(doc);
                items.push(this.collectionSchema.cast(item, { stripUnknown: true }));
            });
            return items;
        });
    }
    getSingle(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getAll(Object.assign(Object.assign({}, props), { limitBy: 1 }));
            const response = items.length ? items.at(0) : null;
            return response;
        });
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.collectionSchema.validate(item);
                const dbRef = collection(this.firestore, this.modelName);
                const cleanItem = this.collectionSchema.cast(item, {
                    stripUnknown: true,
                });
                const createdItemRef = yield addDoc(dbRef, Object.assign(Object.assign({}, cleanItem), { createdAt: Timestamp.fromDate(new Date()), updatedAt: null, deletedAt: null }));
                const createdItem = yield this.getById(createdItemRef.id);
                return createdItem;
            }
            catch (error) {
                // console.log(Array(40).join("-"));
                // console.log(error);
                // console.log(Array(40).join("*"));
                throw new Error("item is invalid");
            }
        });
    }
    update(itemId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const docRef = doc(this.firestore, this.modelName, itemId);
            if (this.collectionSchema.isValidSync(item)) {
                const cleanItem = this.collectionSchema.cast(item, {
                    stripUnknown: true,
                });
                const cleanItemMap = new Map(Object.entries(cleanItem));
                cleanItemMap.delete("id");
                cleanItemMap.delete("createdAt");
                cleanItemMap.delete("updatedAt");
                cleanItemMap.delete("deletedAt");
                yield setDoc(docRef, Object.assign(Object.assign({}, Object.fromEntries(cleanItemMap)), { updatedAt: Timestamp.fromDate(new Date()) }), { merge: true });
            }
            else {
                throw new Error("item is invalid");
            }
        });
    }
    delete(itemId, isSoftDelete = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const docRef = doc(this.firestore, this.modelName, itemId);
            if (isSoftDelete) {
                yield setDoc(docRef, {
                    deletedAt: Timestamp.fromDate(new Date()),
                }, { merge: true });
            }
            else {
                yield deleteDoc(docRef);
            }
        });
    }
}
export default FirestoreService;
