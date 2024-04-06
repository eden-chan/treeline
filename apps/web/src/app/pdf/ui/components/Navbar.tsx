/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GteMFw0cNnu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import SearchWithAutocomplete from "./SearchWithAutocomplete";
import type { User } from "@prisma/client";

export default function Navbar({
  users,
  loggedInUser,
}: {
  users: User[];
  loggedInUser: User | undefined;
}) {
  // note: the id field is mandatory
  // const items = users.map((user) => ());
  return (
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-3xl font-bold">My/Space</h1>
      <div className="flex space-x-4">
        <div className="w-[200px]">
          <SearchWithAutocomplete items={users} />
        </div>
        <Link
          className="text-gray-600 hover:text-gray-900"
          href={`/${loggedInUser?.handle}`}
        >
          My bookshelf
        </Link>
        <UserButton />
      </div>
    </header>
  );
}

