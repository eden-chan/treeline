import React from "react";
import { api } from "@src/trpc/server";
import { SearchTab } from "./pdf/ui/components/SearchTab";
import Timeline from "./pdf/ui/components/Timeline";
import { SignIn, currentUser } from "@clerk/nextjs";
import Navbar from "./pdf/ui/components/Navbar";

export default async function Page() {
    const clerkUser = await currentUser();


    return (
        <div>
            <SignIn />
        </div>
    );


}
