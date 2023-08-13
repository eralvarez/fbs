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
} from "firebase/firestore";
import { has, get } from "lodash";
import { ObjectSchema } from "yup";

type FirestoreEnvironment = "dev" | "stage" | "prod";

type WhereConditions<T> = [keyof T, WhereFilterOp, any];

interface GetProps<T> {
  whereConditions?: WhereConditions<T>[];
}

interface GetAllProps<T> extends GetProps<T> {
  limitBy?: number;
}

interface GetSingleProps<T> extends GetProps<T> {}

interface FirestoreServiceProps {
  modelName: string;
  collectionSchema: ObjectSchema<any>;
  environment: FirestoreEnvironment;
  firestore: Firestore;
}

class FirestoreService<FirestoreCollection> {
  modelName = "";
  collectionSchema: ObjectSchema<any>;
  environment: FirestoreEnvironment;
  firestore: Firestore;

  constructor({
    modelName,
    collectionSchema,
    environment = "dev",
    firestore,
  }: FirestoreServiceProps) {
    this.modelName = `${environment}-${modelName}`;
    this.collectionSchema = collectionSchema;
    this.environment = environment;
    this.firestore = firestore;
  }

  parseItem(doc: DocumentSnapshot<DocumentData>) {
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

  getEnvironment() {
    return this.environment;
  }

  async getById(id: string): Promise<FirestoreCollection> {
    const docRef = doc(this.firestore, this.modelName, id);
    const item = await getDoc(docRef);

    return this.collectionSchema.cast(this.parseItem(item), {
      stripUnknown: true,
    });
  }

  async getAll(
    props: GetAllProps<FirestoreCollection>
  ): Promise<FirestoreCollection[]> {
    const { whereConditions = [], limitBy = 20 } = props;
    const items: FirestoreCollection[] = [];
    const modelRef = collection(this.firestore, this.modelName);
    let queryRef = query(modelRef, limit(limitBy));
    whereConditions.forEach((whereCondition) => {
      queryRef = query(
        queryRef,
        where(whereCondition.at(0), whereCondition.at(1), whereCondition.at(2))
      );
    });
    // https://firebase.google.com/docs/firestore/query-data/queries#or_queries
    const querySnapshot = await getDocs(queryRef);

    querySnapshot.forEach((doc) => {
      const item = this.parseItem(doc);
      items.push(this.collectionSchema.cast(item, { stripUnknown: true }));
    });

    return items;
  }

  async getSingle(
    props?: GetSingleProps<FirestoreCollection>
  ): Promise<FirestoreCollection | null> {
    const items = await this.getAll({ ...props, limitBy: 1 });
    const response = items.length ? items.at(0)! : null;

    return response;
  }

  async create(item: FirestoreCollection): Promise<FirestoreCollection> {
    try {
      await this.collectionSchema.validate(item);
      const dbRef = collection(this.firestore, this.modelName);

      const cleanItem = this.collectionSchema.cast(item, {
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
      // console.log(Array(40).join("-"));
      // console.log(error);
      // console.log(Array(40).join("*"));
      throw new Error("item is invalid");
    }
  }

  async update(itemId: string, item: FirestoreCollection) {
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

      await setDoc(
        docRef,
        {
          ...Object.fromEntries(cleanItemMap),
          updatedAt: Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );
    } else {
      throw new Error("item is invalid");
    }
  }

  async delete(itemId: string, isSoftDelete = true) {
    const docRef = doc(this.firestore, this.modelName, itemId);
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
  }
}

export default FirestoreService;
export type { FirestoreServiceProps };
