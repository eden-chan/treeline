/**
 * v0 by Vercel.
 * @see https://v0.dev/t/w8vDzKe7a8p
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import {
	AnnotatedPdfWithProfile,
} from "@src/lib/types";
import { AnimatedTooltip } from "../../../src/app/pdf/ui/components/AnimatedTooltip";
import { Dispatch, SetStateAction } from "react";



export default function FloatingProfiles({
	setDisplayHighlights,
	allHighlightsWithProfile,
}: {
	setDisplayHighlights: Dispatch<SetStateAction<AnnotatedPdfWithProfile[]>>;
	allHighlightsWithProfile: AnnotatedPdfWithProfile[];
}) {
	const items = allHighlightsWithProfile.map((profile, index) => ({
		id: index,
		name: `${profile.firstName} ${profile.lastName}`,
		designation: `Highlights: ${profile.highlights.length}`,
		image: profile.userProfilePicture,
		setDisplayHighlights: () => {
			setDisplayHighlights([profile]);
		},
	}));

	return (
		<div className="fixed bottom-4 left-4 z-50 flex items-center -space-x-8">
			<AnimatedTooltip items={items} />
		</div>
	);
}
