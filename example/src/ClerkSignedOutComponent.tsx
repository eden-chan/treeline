import { SignInButton } from "@clerk/clerk-react";
import styles from './ClerkSignedOutComponent.module.css';

export function ClerkSignedOutComponent() {
    return (
        <div className={styles.container}>
            <p className={styles.message}>You are not signed in.</p>
            <SignInButton mode="modal">
                <button className={styles.button} type="button">
                    Sign In
                </button>
            </SignInButton>
        </div>
    );
}