import * as Yup from "yup";

import { FirestoreService } from "../../../../lib/esm/";
import { firebaseConfig } from "../config/firebase";

// Define the schema for your collection items
const userSchema = Yup.object().shape({
  id: Yup.string(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  age: Yup.number(),
});

// Infer user type
type User = Yup.InferType<typeof userSchema>;

class UserService extends FirestoreService<User> {
  constructor() {
    super({
      modelName: "users",
      collectionSchema: userSchema,
      firebaseConfig,
    });
  }
}

export default UserService;
export type { User };
