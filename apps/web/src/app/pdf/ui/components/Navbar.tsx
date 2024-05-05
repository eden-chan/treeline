/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GteMFw0cNnu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import SearchWithAutocomplete from "./SearchWithAutocomplete";
import type { User } from "@prisma/client";
import { ImportButton } from "@src/components/import-button";
import { UserSearchResult } from "@src/lib/types";

export default function Navbar({
	users,
	loggedInUser,
}: {
	users: User[];
	loggedInUser: User | undefined; // Corrected type from 'users' to 'User'
}) {
	// note: the id field is mandatory
	const items: UserSearchResult[] = users.map((user) => ({
		id: user.id,
		name: user.first_name + " " + user.last_name,
		handle: user.handle,
	}));
	return (
		<header className="flex p-4 justify-between items-center sticky top-0 bg-white z-50">
			<h1 className="text-3xl font-bold self-center">My/Space</h1>
			<div className="flex space-x-4 items-center">
				{loggedInUser ? (
					<>
						<div className="w-[200px] self-center">
							<SearchWithAutocomplete items={items} />
						</div>
						<Link
							className="text-gray-600 hover:text-gray-900 self-center"
							href={`/user/${loggedInUser?.handle}`}
						>
							My bookshelf
						</Link>
						<UserButton />
						<ImportButton />
					</>
				) : (
					<SignUpButton />
				)}
			</div>
		</header>
	);
}
