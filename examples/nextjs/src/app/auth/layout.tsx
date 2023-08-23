"use client";

import { AuthProvider } from "../../../../../lib/esm/";
import { firebaseConfig } from "../../config/firebase";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider firebaseConfig={firebaseConfig}>{children}</AuthProvider>
  );
};

export default Layout;
