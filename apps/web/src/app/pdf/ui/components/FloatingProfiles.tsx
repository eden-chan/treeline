/**
 * v0 by Vercel.
 * @see https://v0.dev/t/w8vDzKe7a8p
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PDFHighlightsWithProfile } from "../types";

export default function FloatingProfiles({
  setDisplayHighlights,
  allHighlightsWithProfile,
}: {
  setDisplayHighlights: any;
  allHighlightsWithProfile: PDFHighlightsWithProfile[];
}) {
  return (
    <div className="fixed top-0 right-0 z-50 flex items-center space-x-2">
      {allHighlightsWithProfile?.map((profile, index) => (
        <div
          key={`profile-${index}`}
          className="relative cursor-pointer"
          onClick={() => {
            setDisplayHighlights(profile.highlights);
          }}
        >
          <Avatar>
            <AvatarImage src={profile.userProfilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {profile.highlights.length}
          </span>
        </div>
      ))}
    </div>
  );
}
