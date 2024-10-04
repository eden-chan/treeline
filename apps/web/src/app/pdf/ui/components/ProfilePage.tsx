/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cBZUcsElysy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import Timeline from "./Timeline";
import { Source, SourceGroup, User } from "@prisma/client";
import FollowButton from "./FollowButton";

import { useMemo } from "react";
import LearningActivityCalendar from "@src/components/activity-calendar";

import { AnnotatedPdfWithRelations } from '@src/lib/types';


type Props = {
  users: User[];
  timeline: AnnotatedPdfWithRelations[];
  searchedUser: User;
  loggedInUser: User;
  searchedUserImageUrl: string;
  sources: Source[];
  sourceGroups: SourceGroup[];
}
export default async function Profile({
  users,
  timeline,
  searchedUser,
  loggedInUser,
  searchedUserImageUrl,
  sources,
  sourceGroups,
}: Props) {
  const userHighlights = useMemo(
    () =>
      users.map((user) => {
        const userHighlight = timeline.find(
          (highlight) => highlight.userId === user.email,
        );
        return { ...user, recentPaper: userHighlight };
      }),
    [users, timeline],
  );
  const friendsSection = {
    title: "Your friends",
    friends: userHighlights,
  };

  const RenderUserProfileSection = () => {
    return (
      <nav className="w-1/5 p-6 h-screen">
        <div className="mb-8">
          <div className="w-20 h-20 mb-4">
            <Avatar className="w-full h-full">
              <AvatarImage src={searchedUserImageUrl} alt="User profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <FollowButton loggedInUser={loggedInUser} searchedUser={searchedUser} />
        </div>
        <div className="mt-8">
          <LearningActivityCalendar />
        </div>
      </nav>
    );
  };
  return (
    <div className="min-h-screen">
      <div className="flex">
        {RenderUserProfileSection()}
        <main className="w-3/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent</h2>
          <Timeline sources={sources} sourceGroups={sourceGroups} />
        </main>
        <aside className="w-1/5 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {friendsSection.title}
            </h2>
            <ul className="space-y-2">
              {friendsSection.friends.map(({ clerk_id, handle, first_name }) => (
                <li key={clerk_id}>
                  <Link className="block" href={`/user/${handle}`}>
                    <span className="font-medium">{first_name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
