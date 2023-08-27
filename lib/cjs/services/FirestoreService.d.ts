import { Unsubscribe } from "firebase/auth";
import { WhereFilterOp } from "firebase/firestore";
import { ObjectSchema } from "yup";
type FirestoreEnvironment = "dev" | "stage" | "prod";
type WhereConditions<T> = [keyof T, WhereFilterOp, any];
interface GetProps<T> {
    whereConditions?: WhereConditions<T>[];
}
declare enum PaginationOptions {
    NEXT = "next",
    PREVIOUS = "previous"
}
interface GetAllProps<T> extends GetProps<T> {
    limitBy?: number;
    page?: number;
    pagination?: PaginationOptions;
    showDeleted?: boolean;
}
interface GetSingleProps<T> extends GetProps<T> {
}
interface FirestoreServiceProps {
    modelName: string;
    collectionSchema: ObjectSchema<any>;
    firebaseConfig: any;
    environment?: FirestoreEnvironment;
    logErrorCollection?: string;
}
declare class FirestoreService<FirestoreCollection> {
    #private;
    constructor({ modelName, collectionSchema, environment, firebaseConfig, logErrorCollection, }: FirestoreServiceProps);
    getEnvironment(): FirestoreEnvironment;
    onChange(idOrWhereCondition: string | WhereConditions<FirestoreCollection>, callback: (doc?: FirestoreCollection | undefined) => void): Unsubscribe;
    onMultipleChanges(idOrWhereCondition: WhereConditions<FirestoreCollection>, callback: (docs?: FirestoreCollection[] | undefined) => void): import("@firebase/firestore").Unsubscribe;
    getById(id: string): Promise<FirestoreCollection>;
    getAll(props?: GetAllProps<FirestoreCollection>): Promise<FirestoreCollection[]>;
    getSingle(props?: GetSingleProps<FirestoreCollection>): Promise<FirestoreCollection | null>;
    create(item: FirestoreCollection): Promise<FirestoreCollection>;
    update(id: string, item: FirestoreCollection): Promise<void>;
    delete(id: string, isSoftDelete?: boolean): Promise<void>;
}
export { FirestoreService, PaginationOptions };
export type { FirestoreServiceProps };
