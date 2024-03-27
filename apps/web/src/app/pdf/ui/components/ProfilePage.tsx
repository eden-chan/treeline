/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cBZUcsElysy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Account, PDFHighlights } from '../types';
import Timeline from './Timeline';
import { highlights, users } from '@prisma/client';



const navLinks = [
    { name: "Pages", href: "#" },
    { name: "Notes", href: "#" },
    { name: "Favorites", href: "#" },
    { name: "To Read", href: "#" },
    { name: "Your Org", href: "#" }
];

const readingSection = {
    title: "Reading Interesting Things",
    links: [
        { name: "Trails", href: "#" }
    ]
};


const friendsSection = {
    title: "Your friends",
    friends: [
        { name: "Eden Chan", context: " in Zorbing - Wikipedia", time: "1 hour ago" },
        { name: "Charles Liu", context: " in The Art of Coding", time: "2 hours ago" },
        { name: "Kenson Hui", context: " in Machine Learning Basics", time: "3 hours ago" }
    ]
};

const curiousPeopleSection = {
    title: "Some curious people",
    people: [
        { name: "Rishi Kothari", mutuals: " 5 mutuals" },
        { name: "Steven Zhang", mutuals: " 3 mutuals" },
        { name: "Tazik Shahjahan", mutuals: " 2 mutuals" }
    ]
};

export default function Profile({ timeline, userProfile }: { timeline: highlights[], userProfile: users }) {
    return (
        <div className="bg-white min-h-screen">

            <div className="flex">
                <nav className="w-1/5 p-6">
                    <ul className="space-y-1">
                        {navLinks.map(link => (
                            <li key={link.name}>
                                <Link className="block" href={link.href}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold">{readingSection.title}</h2>
                        <ul className="mt-2 space-y-1">
                            {readingSection.links.map(link => (
                                <li key={link.name}>
                                    <Link className="block" href={link.href}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
                <main className="w-3/5 p-6">
                    <h2 className="text-lg font-semibold mb-4">Pages</h2>
                    <Timeline articles={timeline} />
                </main>
                <aside className="w-1/5 p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">{friendsSection.title}</h2>
                        <ul className="space-y-2">
                            {friendsSection.friends.map(friend => (
                                <li key={friend.name}>
                                    <Link className="block" href="#">
                                        <span className="font-medium">{friend.name}</span>
                                        <span className="text-sm text-gray-500">{friend.context}</span>
                                    </Link>
                                    <p className="text-sm text-gray-500">{friend.time}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">{curiousPeopleSection.title}</h2>
                        <ul className="space-y-2">
                            {curiousPeopleSection.people.map(person => (
                                <li key={person.name}>
                                    <Link className="block" href="#">
                                        <span className="font-medium">{person.name}</span>
                                        <span className="text-sm text-gray-500">{person.mutuals}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    )
}


