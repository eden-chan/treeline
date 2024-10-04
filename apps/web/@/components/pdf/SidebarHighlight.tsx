import { Button } from "@/components/ui/button";
import { HighlightWithRelations } from "@src/lib/types";
import { useMemo } from 'react';

const updateHash = (id: string) => {
	document.location.hash = `highlight-${id}`;
};

export default function Highlight({ highlight, deleteHighlight, onHighlightClick }: {
	highlight: HighlightWithRelations;
	deleteHighlight: (highlightId: string) => void;
	onHighlightClick: (highlight: HighlightWithRelations) => void;
}) {
	const pageNumber = useMemo(() =>
		(highlight.highlightAreas[0]?.pageIndex ?? -1) + 1,
		[highlight.highlightAreas]
	);

	return (
		<li
			id={`highlight-${highlight.id}`}
			className="relative p-4 cursor-pointer transition-colors duration-140 ease-in border-b border-gray-500 bg-gray-100 hover:bg-gray-200"
			onClick={() => {
				updateHash(highlight.id);
				if (highlight.highlightAreas.length > 0) {
					onHighlightClick(highlight);
				}
			}}
		>
			<Button
				size="icon"
				variant="ghost"
				className="absolute top-0 right-0 hover:bg-gray-300"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					deleteHighlight(highlight.id);
				}}
			>
				<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
						fill="currentColor"
						fillRule="evenodd"
						clipRule="evenodd"
					></path>
				</svg>
			</Button>
			<div>
				{highlight.node?.prompt && (
					<p className="italic underline line-clamp-2 pr-12">{highlight.node.prompt}</p>
				)}
				{highlight?.quote && <p className="mt-1 line-clamp-2 font-bold">{highlight.quote}</p>}
				{highlight.node?.response && (
					<blockquote className="mt-2">{`${highlight.node.response.slice(0, 90).trim()}…`}</blockquote>
				)}
				{highlight.comments?.length > 0 && (
					<div className="mt-2">
						{highlight.comments.map((comment) => <p key={comment.id}>{comment.text}</p>)}
					</div>
				)}
				<p className="mt-2">Page {pageNumber}</p>
			</div>
		</li>
	);
}