import React from "react";

import { SignIn, SignOutButton, currentUser } from "@clerk/nextjs";

export default async function Page() {
    const clerkUser = await currentUser();

    if (clerkUser) {
        return <SignOutButton />;
    }

    return (
        <div>
            <SignIn />
        </div>
    );
}

