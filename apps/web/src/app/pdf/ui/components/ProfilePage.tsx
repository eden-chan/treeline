/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cBZUcsElysy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import Timeline from "./Timeline";
import { ParsedPapers, User } from "@prisma/client";
import FollowButton from "./FollowButton";

import { useMemo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import LearningActivityCalendar from "@src/components/activity-calendar";
import ChromaForm from './ChromaForm';
import { AnnotatedPdfWithRelations } from '@src/lib/types';
import { BentoGridThirdDemo } from '@src/components/paper-card';

export default async function Profile({
  users,
  timeline,
  searchedUser,
  loggedInUser,
  searchedUserImageUrl,
  parsedPapers,
}: {
  users: User[];
  timeline: AnnotatedPdfWithRelations[];
  searchedUser: User;
  loggedInUser: User;
  searchedUserImageUrl: string;
  parsedPapers: ParsedPapers[]
}) {
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
          <FollowButton user1={loggedInUser} user2={searchedUser} />
          <ChromaForm />
          <div className="mt-4">
            <Link
              href={`https://x.com/${searchedUser.handle}`}
              className="text-blue-500 hover:underline"
            >
              Twitter
            </Link>
            <Link
              href={"https://edenchan.ca"}
              className="text-blue-500 hover:underline"
            >
              Website
            </Link>
          </div>
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
          <Timeline articles={timeline} parsedPapers={parsedPapers} />
        </main>
        <aside className="w-1/5 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {friendsSection.title}
            </h2>
            <ul className="space-y-2">
              {friendsSection.friends.map(({ clerk_id, handle, first_name, recentPaper }) => (
                <li key={clerk_id}>
                  <Link className="block" href={`/${handle}`}>
                    <span className="font-medium">{first_name}</span>
                    {recentPaper?.highlights?.slice(-1)?.[0]?.comment?.timestamp && (
                      <span className="text-sm text-gray-500">
                        {` ${calculateTimeAgo(recentPaper.highlights.slice(-1)[0]?.comment?.timestamp ?? new Date())}`}
                      </span>
                    )}
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
