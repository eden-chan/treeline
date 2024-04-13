import React from "react";

import {
  SignIn,
  SignInButton,
  SignOutButton,
  currentUser,
} from "@clerk/nextjs";

export default async function Page() {
  const clerkUser = await currentUser();

  if (clerkUser) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
