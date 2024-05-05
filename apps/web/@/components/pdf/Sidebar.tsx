import React from "react";
import { Highlight } from "@prisma/client";
import { HighlightWithRelations } from "@src/lib/types";

type Props = {
	highlights: Array<HighlightWithRelations>;
	resetHighlights: () => void;
	onHighlightClick: (highlight: HighlightWithRelations) => void;
};

const updateHash = (highlight: Highlight) => {
	document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
	highlights,
	resetHighlights,
	onHighlightClick,
}: Props) {
	return (
		<div className="overflow-auto text-gray-500 bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="p-4">
				<p>
					<small>
						To create area highlight hold ⌥ Option key (Alt), then click and
						drag.
					</small>
				</p>
			</div>

			<ul className="list-none p-0">
				{highlights.map((highlight) => (
					<div
						key={highlight.id}
						className="p-4 cursor-pointer transition-background duration-140 ease-in border-b border-gray-500 hover:bg-gray-200"
						onClick={() => {
							updateHash(highlight);
							if (
								highlight.highlightAreas.length > 0 &&
								highlight.highlightAreas[0]
							) {
								onHighlightClick(highlight);
							}
						}}
					>
						<div>
							{highlight.node?.prompt && (
								<div key={`${highlight.id}-prompt-${highlight.node.prompt}`}>
									{highlight.node.prompt}
								</div>
							)}
							{highlight?.quote && <div>{highlight.quote}</div>}
							{highlight.content ? (
								<blockquote className="mt-2">
									{`${highlight.content.slice(0, 90).trim()}…`}
								</blockquote>
							) : null}
							{/* {highlight.content.image ? (
                <div
                  className="mt-2 overflow-auto max-w-xs border-dashed border"
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null} */}
						</div>
						<div className="mt-2 text-right text-xs">
							{/* Page {highlight.highlightAreas.} */}
						</div>
					</div>
				))}
			</ul>
			{highlights.length > 0 ? (
				<div className="p-4">
					<button onClick={resetHighlights}>Reset highlights</button>
				</div>
			) : null}
		</div>
	);
}
