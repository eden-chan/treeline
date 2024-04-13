import React from "react";

import {
  SignIn,
  SignInButton,
  SignOutButton,
  currentUser,
} from "@clerk/nextjs";
import { Button } from '@/components/ui/button';

export default async function Page() {
  const clerkUser = await currentUser();

  if (clerkUser) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">


        <Button><SignOutButton /></Button>

      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
