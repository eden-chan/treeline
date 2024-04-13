import React from "react";

import {
  SignIn,
  SignOutButton,
  currentUser,
} from "@clerk/nextjs";


export default async function Page() {
  const clerkUser = await currentUser();

  if (clerkUser) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="bg-black p-2.5 rounded text-white">
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
