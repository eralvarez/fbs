"use client";
import { string, InferType } from "yup";

import { AuthContextProvider, commonSchema } from "../../../../../lib/esm/";
import { firebaseConfig } from "../../config/firebase";

const userProfileSchema = commonSchema.shape({
  authId: string(),
  firstName: string(),
  lastName: string(),
  age: string(),
});

type UserProfile = InferType<typeof userProfileSchema>;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContextProvider<UserProfile>
      firebaseConfig={firebaseConfig}
      userProfileSchema={userProfileSchema}
    >
      {children}
    </AuthContextProvider>
  );
};

export default Layout;
