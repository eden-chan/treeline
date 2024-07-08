import React from "react";
import { HighlightWithRelations } from "@src/lib/types";
import SidebarHighlight from "@/components/pdf/SidebarHighlight";
import { toast } from '../ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { Button } from "../ui/button";

type Props = {
	highlights: Array<HighlightWithRelations>;
	deleteHighlight: (highlightId: string) => void;
	resetHighlights: () => void;
	onHighlightClick: (highlight: HighlightWithRelations) => void;
};

export default function Sidebar({
	highlights,
	deleteHighlight,
	resetHighlights,
	onHighlightClick,
}: Props) {
	const exportHighlights = () => {
		const formattedHighlights = highlights
			.map(({ quote, comments, highlightAreas }) =>
				`> ${quote}\n\n${comments.map(c => `- ${c.text}`).join('\n')}\n\n*Page ${(highlightAreas[0]?.pageIndex ?? -1) + 1}*\n`
			)
			.join('\n---\n\n');

		navigator.clipboard.writeText(formattedHighlights)
			.then(() => toast({ title: "Copied highlights to clipboard" }))
			.catch(err => {
				console.error('Could not copy text:', err);
				toast({
					title: "Failed to copy highlights",
					description: "See console for details",
					action: <ToastAction altText="Try again">Try again</ToastAction>,
				});
			});
	};

	return (
		<div className="overflow-auto text-gray-500 bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="p-4">
				<small>Highlight text and ask a question to start learning</small>
			</div>

			<ul className="list-none p-0">
				{highlights.map((highlight, idx) => (
					<SidebarHighlight
						key={idx}
						highlight={highlight}
						deleteHighlight={deleteHighlight}
						onHighlightClick={onHighlightClick}
					/>
				))}
			</ul>

			{highlights.length > 0 && (
				<div className="p-4 space-y-2">
					<Button
						variant="outline"
						onClick={resetHighlights}
						className="w-full"
					>
						Reset highlights
					</Button>
					<Button
						variant="outline"
						onClick={exportHighlights}
						className="w-full"
					>
						Export highlights to clipboard
					</Button>
				</div>
			)}
		</div>
	);
}