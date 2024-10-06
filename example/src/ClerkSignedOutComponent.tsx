import { SignInButton } from "@clerk/clerk-react";
import styles from './ClerkSignedOutComponent.module.css';

export function ClerkSignedOutComponent() {
    return (
        <SignInButton mode="modal">
            <button className={styles.button} type="button">
                Sign In
            </button>
        </SignInButton>
    );
}