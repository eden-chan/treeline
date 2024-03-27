/**
 * v0 by Vercel.
 * @see https://v0.dev/t/w8vDzKe7a8p
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IHighlight, PDFHighlightsWithProfile } from '../types'
import { SetStateAction } from 'react'


export default function FloatingProfiles({ setDisplayHighlights, allHighlightsWithProfile }: { setDisplayHighlights: SetStateAction<IHighlight[]>, allHighlightsWithProfile: PDFHighlightsWithProfile[] }) {

    return (
        <div className="fixed top-0 right-0 z-50 flex items-center space-x-2">
            {allHighlightsWithProfile?.map((profile, index) => (
                <div key={`profile-${index}`} className="relative" onClick={() => setDisplayHighlights(profile.highlights)}>
                    <Avatar>
                        <AvatarImage src={profile.userProfilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{profile.highlights.length}</span>
                </div>
            ))}
        </div>
    )
}



function ChevronLeftIcon(props) {
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
            <path d="m15 18-6-6 6-6" />
        </svg>
    )
}
