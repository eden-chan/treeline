"use client";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import {
  signInWithIdToken,
  signOut as signOutFromDb,
  useAuth as useDbAuth,
} from "./utils/dbUtils";
import styles from "./ClerkSignedInComponent.module.css";
import { UserIcon } from "./components/Icons";
import { useEffect } from "react";

export const ClerkSignedInComponent = () => {
  const {
    signOut: signOutFromClerk,
    getToken,
    isLoaded,
    isSignedIn,
  } = useClerkAuth();

  const { isLoading, user, error } = useDbAuth();

  const handleSignOut = () => {
    console.log("Signing out");
    signOutFromDb().then(() => {
      signOutFromClerk();
    });
  };

  useEffect(() => {
    // on first click sign in with clerk modal
    // on redirect sign in with instantdb id token
    if (isLoaded && isSignedIn) {
      signInToInstantWithClerkToken();
    }
  }, [isLoaded, isSignedIn]);

  const signInToInstantWithClerkToken = async () => {
    const idToken = await getToken();
    if (!idToken) return;
    signInWithIdToken(
      idToken,
      import.meta.env.VITE_CLERK_CLIENT_NAME ?? "Treeline",
    );
  };

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }
  if (error) {
    return (
      <div className={styles.container}>Error signing in! {error.message}</div>
    );
  }
  if (user) {
    return (
      <div className={styles.container}>
        <button className={styles.button} type="button" onClick={handleSignOut}>
          <UserIcon />
          <span className={styles.tooltip}>Sign Out</span>
        </button>
      </div>
    );
  }
  return (
    <button
      className={styles.button}
      type="button"
      onClick={signInToInstantWithClerkToken}
    >
      <UserIcon />
      <span className={styles.tooltip}>Sign In!!</span>
    </button>
  );
};
