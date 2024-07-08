import React from "react";
import { HighlightWithRelations } from "@src/lib/types";
import SidebarHighlight from "@/components/pdf/SidebarHighlight";
import { toast } from '../ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';

type Props = {
	highlights: Array<HighlightWithRelations>;
	deleteHighlight: (highlightId: string) => void;
	resetHighlights: () => void;
	onHighlightClick: (highlight: HighlightWithRelations) => void;
};

export function Sidebar({
	highlights,
	deleteHighlight,
	resetHighlights,
	onHighlightClick,
}: Props) {
	const exportHighlights = () => {





		const formattedHighlights = highlights.map((highlight) => {
			const pageIndex = highlight.highlightAreas[0]?.pageIndex;
			const pageNumber = pageIndex !== undefined ? pageIndex + 1 : 'Unknown';

			return `${highlight.quote}\nComment: ${highlight.comments.map((comment) => comment.text).join('\n')}\nPage:- ${pageNumber}\n`;
		}).join('\n');

		navigator.clipboard.writeText(formattedHighlights).then(() => {
			toast({
				title: "Copied highlights to clipboard",
				// description: "There was a problem with your request.",
				// action: <ToastAction altText="Try again">Try again</ToastAction>,
			})

		}, (err) => {
			console.error('Could not copy text: ', err);
			toast({
				title: "Uh oh! Something went wrong.",
				description: "Failed to copy highlights to clipboard. See console for details",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			})

		});
	};

	return (
		<div className="overflow-auto text-gray-500 bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="p-4">
				<p>
					<small>Highlight text and ask a question to start learning</small>
				</p>
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
			{highlights.length > 0 ? (
				<div className="p-4 space-y-2">
					<button
						onClick={resetHighlights}
						className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
					>
						Reset highlights
					</button>
					<button
						onClick={exportHighlights}
						className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
					>
						Export highlights to clipboard
					</button>

				</div>
			) : null}
		</div>
	);
}