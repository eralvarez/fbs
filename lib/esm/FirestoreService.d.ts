import { DocumentData, WhereFilterOp, Firestore, DocumentSnapshot } from "firebase/firestore";
import { ObjectSchema } from "yup";
type FirestoreEnvironment = "dev" | "stage" | "prod";
type WhereConditions<T> = [keyof T, WhereFilterOp, any];
interface GetProps<T> {
    whereConditions?: WhereConditions<T>[];
}
interface GetAllProps<T> extends GetProps<T> {
    limitBy?: number;
}
interface GetSingleProps<T> extends GetProps<T> {
}
interface FirestoreServiceProps {
    modelName: string;
    collectionSchema: ObjectSchema<any>;
    environment: FirestoreEnvironment;
    firestore: Firestore;
}
declare class FirestoreService<FirestoreCollection> {
    modelName: string;
    collectionSchema: ObjectSchema<any>;
    environment: FirestoreEnvironment;
    firestore: Firestore;
    constructor({ modelName, collectionSchema, environment, firestore, }: FirestoreServiceProps);
    parseItem(doc: DocumentSnapshot<DocumentData>): any;
    getEnvironment(): FirestoreEnvironment;
    getById(id: string): Promise<FirestoreCollection>;
    getAll(props: GetAllProps<FirestoreCollection>): Promise<FirestoreCollection[]>;
    getSingle(props?: GetSingleProps<FirestoreCollection>): Promise<FirestoreCollection | null>;
    create(item: FirestoreCollection): Promise<FirestoreCollection>;
    update(itemId: string, item: FirestoreCollection): Promise<void>;
    delete(itemId: string, isSoftDelete?: boolean): Promise<void>;
}
export default FirestoreService;
export type { FirestoreServiceProps };
