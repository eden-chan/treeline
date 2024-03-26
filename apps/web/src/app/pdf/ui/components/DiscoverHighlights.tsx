/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GteMFw0cNnu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { CreateOrganization, UserButton } from '@clerk/nextjs'
import { PDFHighlights } from '../types'
import Link from 'next/link'


const articles = [
    {
        "title": "The Bitter Lesson",
        "url": "incompleteideas.net",
        "excerpt": "We have to learn the bitter lesson that building in how we think we think does not work in the long run.",
        "author": "Taazik Sh, Hudzah",
        "timestamp": "6h"
    },
    {
        "title": "Whitepaper — The Collective Intelligence Project",
        "url": "cip.org",
        "excerpt": "Edward O. Wilson once described the problem of humanity as having 'Paleolithic emotions, medieval institutions, and god-like technology'.",
        "author": "Taazik Sh, Ananya Anupam, and 3 more",
        "timestamp": "19h"
    },
    {
        "title": "world_sim",
        "url": "worldsim.nousersearch.com",
        "excerpt": "...xdjozyc...oOKKKoo;'.kNWWKc..;xXMMMMMMMMWN0xc,.'ckXMMW0: 'lk0KKK0KX0Oxoc:ld' .kX00xc,..'dxdodddxOKXNl' :0K00Oxc..;o0KXNNWWMMMMMMMMMMMWX0xkXNWWMXc .dXMMMMMMWWKkxkXMMMMMMMMMMMMWNXNNWWNO: ...",
        "author": "Rishi Kothari, Anson Yu",
        "timestamp": "17h"
    },
    {
        "title": "Investing in founders defining the future",
        "url": "metaplanet.com",
        "excerpt": "We support novel and evidence based innovation that could produce an outsized return for the benefit of humankind. Metaplanet is an early-stage investment firm making long-term bets on contrarians and leveraging the knowledge and network across sectors. We back mission-drive...",
        "author": "Rishi Kothari",
        "timestamp": "7h"
    },
    {
        "title": "BlackRock",
        "url": "wikimc.org",
        "excerpt": "In exchange for a 50 percent stake in the bond business, initially Blackstone gave Fink and his team a $5 million credit line. Within months, the business had turned profitable, and by 1989 the group's assets had quadrupled to $2.7 billion. The percent of the stake owned by Blackstone...",
        "author": "Rishi Kothari",
        "timestamp": "13h"
    },
    {
        "title": "In Pursuit of Understanding and Connection",
        "url": "syllabusproject.org",
        "excerpt": "As a child, I believed being understood through words was a default. I thought people could...",
        "author": "Ananya Anupam",
        "timestamp": "4h"
    }
]

function UserHeader() {
    return (
        <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">My/Space</h1>
            <div className="flex space-x-4">
                <a className="text-gray-600 hover:text-gray-900" href="#">
                    Search people
                </a>
                <a className="text-gray-600 hover:text-gray-900" href="#">
                    My bookshelf
                </a>
                {/* <UserCircleIcon className="w-6 h-6 text-gray-600" /> */}
                <UserButton />
            </div>
        </header>)
}

function SearchTab() {
    return (<nav className="flex space-x-8 mb-10">
        <a className="text-gray-900 font-semibold" href="#">
            Today
        </a>
        <a className="text-gray-600 hover:text-gray-900" href="#">
            Explore
        </a>
    </nav>)
}

function Timeline({ articles }: { articles: PDFHighlights[] }) {
    return (
        <main>
            {articles.map((article, index) => (
                <article key={index} className="mb-6">
                    <Link href={`/pdf?url=${article.source}`}>

                        <h2 className="text-xl font-semibold mb-1">{article.userId}</h2>
                        <p className="text-gray-600 mb-2">{article.source}</p>
                        <p className="text-gray-500">{article.highlights[0]?.content?.text || 'image'}</p>
                        <p className="text-gray-400 text-sm mt-2">
                            — {article.source} / {article.userId}
                        </p>

                    </Link>
                </article>
            ))}
        </main>
    )
}
export default function DiscoverHighlights({ timeline }: { timeline: PDFHighlights[] }) {

    console.log(timeline)
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 text-black">
            <UserHeader />
            <SearchTab />
            <Timeline articles={timeline} />
        </div>
    )
}

function UserCircleIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </svg>
    )
}
