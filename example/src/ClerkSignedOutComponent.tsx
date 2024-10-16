// components/ClerkSignedOutComponent.tsx
"use client";

import { SignInButton } from "@clerk/clerk-react";
import styles from "./ClerkSignedOutComponent.module.css";
import { UserIcon } from "./components/Icons";

export function ClerkSignedOutComponent() {
  return (
    <div className={styles.container}>
      <SignInButton mode="modal">
        <div className={styles.button}>
          <UserIcon />
          <span className={styles.tooltip}>Sign In</span>
        </div>
      </SignInButton>
    </div>
  );
}
