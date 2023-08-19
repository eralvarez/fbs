import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  query,
  limit,
  where,
  Timestamp,
  DocumentData,
  WhereFilterOp,
  Firestore,
  DocumentSnapshot,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { has, get } from "lodash";
import { ObjectSchema, ValidationError, date as yupDate } from "yup";

type FirestoreEnvironment = "dev" | "stage" | "prod";

type WhereConditions<T> = [keyof T, WhereFilterOp, any];

interface GetProps<T> {
  whereConditions?: WhereConditions<T>[];
}

interface GetAllProps<T> extends GetProps<T> {
  limitBy?: number;
  showDeleted?: boolean;
}

interface GetSingleProps<T> extends GetProps<T> {}

interface LogErrorProps {
  type: string;
  payload: any;
}

interface FirestoreServiceProps {
  modelName: string;
  collectionSchema: ObjectSchema<any>;
  firebaseConfig: any;
  environment?: FirestoreEnvironment;
  logErrorCollection?: string;
}

class FirestoreService<FirestoreCollection> {
  #modelName = "";
  #logErrorModelName = "";
  #collectionSchema: ObjectSchema<any>;
  #environment: FirestoreEnvironment;
  #firestore: Firestore;

  constructor({
    modelName,
    collectionSchema,
    environment = "dev",
    firebaseConfig,
    logErrorCollection = "errors",
  }: FirestoreServiceProps) {
    this.#modelName = `${environment}-${modelName}`;
    this.#logErrorModelName = `${environment}-${logErrorCollection}`;
    this.#collectionSchema = collectionSchema.shape({
      createdAt: yupDate().nullable(),
      updatedAt: yupDate().nullable(),
      deletedAt: yupDate().nullable(),
    });
    this.#environment = environment;
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    this.#firestore = getFirestore(app);
  }

  #parseItem(doc: DocumentSnapshot<DocumentData>): FirestoreCollection {
    const item = doc.data();
    const dateKeys = ["createdAt", "updatedAt", "deletedAt"];
    const dateMap = new Map();

    for (const dateKey of dateKeys) {
      if (has(item, dateKey) && get(item, dateKey) instanceof Timestamp) {
        dateMap.set(dateKey, get(item, dateKey).toDate());
      }
    }

    return {
      ...item,
      id: doc.id,
      ...Object.fromEntries(dateMap),
    };
  }

  async #logError(payload: LogErrorProps): Promise<void> {
    const dbRef = collection(this.#firestore, this.#logErrorModelName);

    await addDoc(dbRef, {
      ...payload,
      createdAt: Timestamp.fromDate(new Date()),
    });
  }

  getEnvironment() {
    return this.#environment;
  }

  onChange(id: string, callback: (doc?: FirestoreCollection) => void) {
    const docRef = doc(this.#firestore, this.#modelName, id);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const item = this.#parseItem(doc);
      callback(item);
    });

    return unsubscribe;
  }

  async getById(id: string): Promise<FirestoreCollection> {
    try {
      const docRef = doc(this.#firestore, this.#modelName, id);
      const item = await getDoc(docRef);

      return this.#collectionSchema.cast(this.#parseItem(item), {
        stripUnknown: true,
      });
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }

  async getAll(
    props?: GetAllProps<FirestoreCollection>
  ): Promise<FirestoreCollection[]> {
    try {
      const whereConditions = props?.whereConditions || [];
      const limitBy = props?.limitBy || 20;
      const showDeleted = props?.showDeleted || false;

      const items: FirestoreCollection[] = [];
      const modelRef = collection(this.#firestore, this.#modelName);
      let queryRef = query(modelRef, limit(limitBy));

      if (!showDeleted) {
        queryRef = query(queryRef, where("deletedAt", "==", null));
      }

      whereConditions.forEach((whereCondition) => {
        queryRef = query(
          queryRef,
          where(
            whereCondition[0] as string,
            whereCondition[1],
            whereCondition[2]
          )
        );
      });
      // https://firebase.google.com/docs/firestore/query-data/queries#or_queries
      const querySnapshot = await getDocs(queryRef);

      querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
        const item = this.#parseItem(doc);
        items.push(this.#collectionSchema.cast(item, { stripUnknown: true }));
      });

      return items;
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }

  async getSingle(
    props?: GetSingleProps<FirestoreCollection>
  ): Promise<FirestoreCollection | null> {
    try {
      const items = await this.getAll({ ...props, limitBy: 1 });
      const response = items.length ? items[0]! : null;

      return response;
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }

  async create(item: FirestoreCollection): Promise<FirestoreCollection> {
    try {
      await this.#collectionSchema.validate(item);
      const dbRef = collection(this.#firestore, this.#modelName);

      const cleanItem = this.#collectionSchema.cast(item, {
        stripUnknown: true,
      });

      const createdItemRef = await addDoc(dbRef, {
        ...cleanItem,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: null,
        deletedAt: null,
      });

      const createdItem = await this.getById(createdItemRef.id);
      return createdItem;
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (error instanceof ValidationError) {
        await this.#logError({
          type: "ValidationError",
          payload: errorPayload,
        });
      } else {
        // firebase error
        await this.#logError({ type: "FirebaseError", payload: errorPayload });
      }

      throw error;
    }
  }

  async update(id: string, item: FirestoreCollection) {
    try {
      const docRef = doc(this.#firestore, this.#modelName, id);

      await this.#collectionSchema.validate(item);

      const cleanItem = this.#collectionSchema.cast(item, {
        stripUnknown: true,
      });
      const cleanItemMap = new Map(Object.entries(cleanItem));
      cleanItemMap.delete("id");
      cleanItemMap.delete("createdAt");
      cleanItemMap.delete("updatedAt");
      cleanItemMap.delete("deletedAt");

      await setDoc(
        docRef,
        {
          ...Object.fromEntries(cleanItemMap),
          updatedAt: Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      if (error instanceof ValidationError) {
        await this.#logError({
          type: "ValidationError",
          payload: errorPayload,
        });
      } else {
        // firebase error
        await this.#logError({ type: "FirebaseError", payload: errorPayload });
      }

      throw error;
    }
  }

  async delete(id: string, isSoftDelete = true) {
    try {
      const docRef = doc(this.#firestore, this.#modelName, id);
      if (isSoftDelete) {
        await setDoc(
          docRef,
          {
            deletedAt: Timestamp.fromDate(new Date()),
          },
          { merge: true }
        );
      } else {
        await deleteDoc(docRef);
      }
    } catch (error) {
      const errorPayload = JSON.parse(
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      // firebase error
      await this.#logError({ type: "FirebaseError", payload: errorPayload });

      throw error;
    }
  }
}

export default FirestoreService;
export type { FirestoreServiceProps };
