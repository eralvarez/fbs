"use client";

import { signInAnonymously, signOut } from "firebase/auth";

import { useAuthContext } from "../../../../../lib/esm/";
// import { auth } from "../../config/firebase";

const AuthPage = () => {
  const { auth, hasAuth, isAnonymous, handleSignInAnonymously } =
    useAuthContext();

  return (
    <div>
      <p>AuthPage</p>
      {isAnonymous && <p>is anonymous</p>}
      {hasAuth && <p>has auth</p>}

      <button onClick={handleSignInAnonymously}>sign In Anonymously</button>
      <button onClick={() => signInAnonymously(auth)}>
        sign In Anonymously local
      </button>
      <button onClick={() => signOut(auth)}>sign out</button>
    </div>
  );
};

export default AuthPage;
