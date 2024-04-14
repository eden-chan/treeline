/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cBZUcsElysy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import Timeline from "./Timeline";
import { AnnotatedPdf, User } from "@prisma/client";
import FollowButton from "./FollowButton";

const navLinks = [
  { name: "Pages", href: "#" },
  { name: "Notes", href: "#" },
  { name: "Favorites", href: "#" },
  { name: "To Read", href: "#" },
  { name: "Your Org", href: "#" },
];

const readingSection = {
  title: "Reading Interesting Things",
  links: [{ name: "Trails", href: "#" }],
};

import { useMemo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import LearningActivityCalendar from "@src/components/activity-calendar";
import BasicRadarChart from "@src/components/radar-graph";
import { Button } from '@/components/ui/button';
import ChromaForm from './ChromaForm';

const curiousPeopleSection = {
  title: "Some curious people",
  people: [
    { name: "Rishi Kothari", mutuals: " 5 mutuals" },
    { name: "Steven Zhang", mutuals: " 3 mutuals" },
    { name: "Tazik Shahjahan", mutuals: " 2 mutuals" },
  ],
};



export default async function Profile({
  users,
  timeline,
  searchedUser,
  loggedInUser,
  searchedUserImageUrl,
}: {
  users: User[];
  timeline: AnnotatedPdf[];
  searchedUser: User;
  loggedInUser: User;
  searchedUserImageUrl: string;
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
            <Link href={`https://x.com/${searchedUser.handle}`} className="text-blue-500 hover:underline">Twitter</Link>
            <Link href={'https://edenchan.ca'} className="text-blue-500 hover:underline">Website</Link>
          </div>
        </div>
        <div className="mt-8">
          <LearningActivityCalendar />
        </div>
      </nav>
    )
  }
  return (
    <div className="min-h-screen">
      <div className="flex">

        {RenderUserProfileSection()}
        <main className="w-3/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent</h2>
          <Timeline articles={timeline} />
        </main>
        <aside className="w-1/5 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {friendsSection.title}
            </h2>
            <ul className="space-y-2">
              {friendsSection.friends.map((friend) => (
                <li key={friend.clerk_id}>
                  <Link className="block" href={`/${friend.handle}`}>
                    <span className="font-medium">{friend.first_name}</span>
                    <span className="text-sm text-gray-500">
                      {" "}
                      {calculateTimeAgo(
                        friend.recentPaper?.highlights?.slice(-1)[0]
                          ?.timestamp ?? new Date(),
                      )}{" "}
                    </span>
                    <p className="text-sm text-gray-500">
                      {friend.recentPaper?.source}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {curiousPeopleSection.title}
            </h2>
            <ul className="space-y-2">
              {curiousPeopleSection.people.map((person) => (
                <li key={person.name + "-" + person.mutuals}>
                  <Link className="block" href="#">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-sm text-gray-500">
                      {person.mutuals}
                    </span>
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
