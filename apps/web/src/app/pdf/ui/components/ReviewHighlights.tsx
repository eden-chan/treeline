/**
 * v0 by Vercel.
 * @see https://v0.dev/t/cBZUcsElysy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const userData = {
    avatar: {
        alt: "@edenchan",
        src: "https://github.com/eden-chan.png",
        fallback: "CN"
    },
    name: "Eden Chan",
    username: "@edenchan"
};

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

const mainContent = [
    {
        title: "The Bitter Lesson",
        time: "1 hour ago 4 highlights",
        description: "Enormous initial efforts went into avoiding search by taking advantage of human knowledge, or of the special features of the game, but all those efforts proved irrelevant, or worse, once search was applied effectively at scale."
    },
    {
        title: "the tiny corp raised $5.1M | the singularity is nearer",
        time: "6 hours ago 1 highlight"
    },
    {
        title: "Cultivating Agency - by Charles Yang - Rough Drafts",
        time: "1 day ago 2 highlights"
    }
];

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

export default function ReviewHighlights() {
    return (
        <div className="bg-white min-h-screen">
            <header className="flex justify-between p-6 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage alt={userData.avatar.alt} src={userData.avatar.src} />
                        <AvatarFallback>{userData.avatar.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-semibold">{userData.name}</h1>
                        <p className="text-sm text-gray-500">{userData.username}</p>
                    </div>
                </div>
                <div className="flex space-x-6">
                    <Input className="w-80" placeholder="Search bookmarks on My/Space" type="search" />
                    <Button variant="outline">My bookshelf</Button>
                </div>
            </header>
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
                    <ul className="space-y-4">
                        {mainContent.map(content => (
                            <li key={content.title}>
                                <h3 className="text-md font-semibold">{content.title}</h3>
                                <p className="text-sm text-gray-500">{content.time}</p>
                                {content.description && <p className="text-sm">{content.description}</p>}
                            </li>
                        ))}
                    </ul>
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


