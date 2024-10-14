"use client";
import { useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import {
  signInWithIdToken,
  signOut as signOutFromDb,
  useAuth as useDbAuth,
} from "./utils/dbUtils";
import styles from "./ClerkSignedInComponent.module.css";

export function ClerkSignedInComponent() {
  const { getToken, signOut: signOutFromClerk } = useClerkAuth();

  const signInToInstantWithClerkToken = async () => {
    const idToken = await getToken();

    if (!idToken) {
      return;
    }

    signInWithIdToken(
      idToken,
      import.meta.env.VITE_CLERK_CLIENT_NAME ?? "Treeline",
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Load only once on mount
  useEffect(() => {
    signInToInstantWithClerkToken();
  }, []);

  const { isLoading, user, error } = useDbAuth();

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
      <button
        className={styles.button}
        type="button"
        onClick={() => {
          signOutFromDb().then(() => {
            signOutFromClerk();
          });
        }}
      >
        Sign out
      </button>
    );
  }
  return (
    <button
      className={styles.button}
      type="button"
      onClick={signInToInstantWithClerkToken}
    >
      Sign in
    </button>
  );
}
