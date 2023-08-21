import { AnyObject, ObjectSchema } from "yup";
import { FirebaseOptions } from "firebase/app";
import { FirestoreService } from "./FirestoreService";
declare class UserProfileService<UserProfile> extends FirestoreService<UserProfile> {
    constructor(config: FirebaseOptions, collectionSchema: ObjectSchema<UserProfile & AnyObject>);
}
export default UserProfileService;
