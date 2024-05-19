import React from "react";

import { HighlightWithRelations } from "@src/lib/types";
import SidebarHighlight from "@/components/pdf/SidebarHighlight";

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
				<div className="p-4">
					<button onClick={resetHighlights}>Reset highlights</button>
				</div>
			) : null}
		</div>
	);
}
