/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GteMFw0cNnu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import { CreateOrganization, UserButton } from '@clerk/nextjs'
import { PDFHighlights } from '../types'
import Link from 'next/link'
import Timeline from './Timeline'


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

export default function DiscoverHighlights({ timeline }: { timeline: PDFHighlights[] }) {

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
