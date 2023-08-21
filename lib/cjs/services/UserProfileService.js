"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirestoreService_1 = require("./FirestoreService");
// const userProfileSchema = yup.object().shape({
//   id: yup.string(),
//   authId: yup.string(),
//   firstName: yup.string(),
//   lastName: yup.string(),
//   age: yup.string(),
//   zipCode: yup.string(),
// });
// type UserProfile = yup.InferType<typeof userProfileSchema>;
class UserProfileService extends FirestoreService_1.FirestoreService {
    constructor(config, collectionSchema) {
        super({
            modelName: "users",
            collectionSchema,
            firebaseConfig: config,
        });
    }
}
exports.default = UserProfileService;
// export { userProfileSchema };
// export type { UserProfile };
