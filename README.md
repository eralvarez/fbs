# FirestoreService Class

<!-- https://registry.npmjs.org/fire-utils -->

The FirestoreService class is a utility for interacting with a Firestore database using the Firebase JavaScript SDK. It provides a set of methods to perform common operations like fetching, creating, updating, and deleting documents in a Firestore collection. This class is designed to work with collections that adhere to a specific schema defined using the Yup validation library.

## TODOs for v0.1.0

- [x] Add demo project inside library repo (CRA/Nextjs/RN Expo)
- [x] Create custom errors?
- [x] onChange method
- [ ] At this moment we support `AND` conditions for querying, we should also support `OR`
- [ ] Unit tests (pref Jest)
- [ ] Support multiple schemas for get/create/update
- [ ] Support realtime db
- [ ] Support other schema validation libraries like zod?
- [ ] React hook that exports all functions?

## Notes

Not sure if this will ever hit a stable version. This library was created to share basic Firestore functions across multiple projects.

That being said, the API could change between minor versions.

All collaborations will be appreciated. Feel free to raise an issue or PR in github.

## Compatibility

It should work fine for ES using `import`.

## Usage

To use the `FirestoreService` class, you need to import it and create an instance by providing the required parameters: `modelName`, `collectionSchema`, `environment` and a `reference to the Firestore instance` from the Firebase SDK.

This library uses the yup schema to filter and validate data when we try to create/get/update a record.

Example:

```javascript
import * as Yup from "yup";

import FirestoreService from "../../../../lib/esm/FirestoreService";
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
```

## Class Functionalities

### Constructor

```javascript
constructor({
  modelName,
  collectionSchema,
  environment = "dev",
  firebaseConfig,
  logErrorCollection = "errors",
}: FirestoreServiceProps)
```

The constructor initializes the `FirestoreService` instance with the given parameters:

| key                  | description                                   | example                     | default  | required |
| -------------------- | --------------------------------------------- | --------------------------- | -------- | -------- |
| `modelName`          | firestore table/ collection name              | `users`                     | n/a      | `true`   |
| `collectionSchema`   | YUP validation schema                         | `Yup.object().shape({...})` | n/a      | `true`   |
| `environment`        | Project environment                           | `dev/stage/prod`            | `dev`    | `false`  |
| `firebaseConfig`     | Firebase config obj                           | `{...}`                     | n/a      | `true`   |
| `logErrorCollection` | Firestore table/collection name to log errors | `errors`                    | `errors` | `false`  |

### Methods

1. `getById(id: string): Promise<FirestoreCollection>`: Fetches a document from the collection by its ID and returns it after schema validation.

1. `getAll(props?: GetAllProps<FirestoreCollection>): Promise<FirestoreCollection[]>`: Retrieves a list of documents from the collection based on optional filtering conditions and a limit. Returns an array of validated items.

1. `getSingle(props?: GetSingleProps<FirestoreCollection>): Promise<FirestoreCollection | null>`: Retrieves a single document from the collection based on optional filtering conditions. Returns null if no document is found or a validated item if found.

1. `create(item: FirestoreCollection): Promise<FirestoreCollection>`: Creates a new document in the collection, validates it against the schema, and returns the newly created and validated item.

1. `update(itemId: string, item: FirestoreCollection)`: Updates a document in the collection by its ID with the provided data. Validates the item against the schema before updating.

1. `delete(itemId: string, isSoftDelete = true)`: Deletes a document from the collection by its ID. If isSoftDelete is true, the document is soft-deleted by setting the deletedAt field. If isSoftDelete is false, the document is permanently deleted.

## Example Usage

```javascript
// Creating an instance of FirestoreService
import UserService from './services/userService';

const userService = new UserService();

try {
  const newUser = {
    firstName: 'John'
    lastName: 'Wick'
  };

  // Creating a new item
  const createdUser = await userService.create(newUser);
  console.log("Created user:", createdUser);

  // Fetching an item by ID
  const fetchedUser = await userService.getById(createdUser.id);
  console.log("Fetched user by ID:", fetchedUser);

  // Updating an item
  const updatedUser = {
    firstName: "Baba",
    lastName: "Yaga",
  };
  await userService.update(updatedUser.id, updatedUser);
  console.log("Updated User:", updatedUser);

  // Fetching a single item with specific conditions
  const singleUser = await userService.getSingle({
    whereConditions: [["firstName", "==", "Baba"]],
  });
  console.log("Single User:", singleUser);

  // Deleting an item
  await userService.delete(singleUser.id);
  console.log("User deleted.");
} catch (error) {
  // ATM I don't have custom errors, I'll do them later
  console.error("Error:", error);
}
```
