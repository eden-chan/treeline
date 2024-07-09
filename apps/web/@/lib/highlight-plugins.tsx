import { MutableRefObject } from "react";
import {
	RenderHighlightsProps,
	RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";

import { NewHighlightWithRelationsInput } from "@src/server/api/routers/highlight";

import { HighlightWithRelations, UserProfile } from "@src/lib/types";
import { HighlightedArea } from "@/components/pdf/HighlightedArea";
import { PastNote } from "@/components/pdf/PastNote";
import { MiniChatWindow } from '@/components/pdf/MiniChatWindow';
import { LastSelectedArea } from '@src/app/pdf/ui';


type MyRenderHighlightTargetProps = {
	annotatedPdfId: string;
	createAskHighlight: (highlight: NewHighlightWithRelationsInput) => Promise<HighlightWithRelations | undefined>;
	setCurrentHighlight: (highlight: HighlightWithRelations | null, forceRerender?: boolean | undefined) => void;
	inputRef: MutableRefObject<HTMLTextAreaElement | null>;
	openForest: (highlight: HighlightWithRelations) => void;
	lastSelectedRef: MutableRefObject<LastSelectedArea | null>;

} & RenderHighlightTargetProps;


export const renderHighlightTarget = (props: MyRenderHighlightTargetProps) => {

	// Keep the selected text highlighted? 
	const saveHighlight = () => {
		const highlightDraft: NewHighlightWithRelationsInput = {
			annotatedPdfId: props.annotatedPdfId,
			highlightAreas: props.highlightAreas,
			quote: props.selectedText,
		};
		props.createAskHighlight(highlightDraft);
		props.cancel();
		// Don't double highlight when saving highlight
		props.lastSelectedRef.current = null;

	};

	const cursorPosition = {
		x: window.getSelection()?.getRangeAt(0).getBoundingClientRect().right ?? 0,
		y: window.getSelection()?.getRangeAt(0).getBoundingClientRect().top ?? 0
	};

	return (
		<div
			className="absolute flex flex-col space-y-2"
			style={{
				left: '90%',
				top: `${props.selectionRegion.top}%`,
				transform: 'translateX(-100%)',
				zIndex: 1,
			}}
		>
			<MiniChatWindow saveHighlight={saveHighlight} selectedText={props.selectedText} cursorPosition={cursorPosition} />
		</div>
	);
};

type MyRenderHighlightsProps = {
	highlights: HighlightWithRelations[];
	editHighlight: ({
		id,
		highlightId,
		text,
	}: {
		id?: string;
		highlightId: string;
		text: string;
	}) => void;
	deleteHighlight: (highlightId: string) => void;
	userId: string;
	userProfiles: UserProfile[];
	openForest: (highlight: HighlightWithRelations) => void;
	lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
} & RenderHighlightsProps;

export const renderHighlights = (props: MyRenderHighlightsProps) => {
	try {
		return (
			<div>
				{props.highlights.map((highlight) => {
					const filteredAreas = highlight.highlightAreas.filter(
						(area) => area.pageIndex === props.pageIndex && area.width > 0,
					);
					const rightmostArea = filteredAreas.reduce((maxArea, area) => {
						return area.left > (maxArea?.left ?? 0) ? area : maxArea;
					}, filteredAreas[0]);
					const topmostArea = filteredAreas.reduce((minArea, area) => {
						return area.top < (minArea?.top ?? 0) ? area : minArea;
					}, filteredAreas[0]);
					const bottommostArea = filteredAreas.reduce((maxArea, area) => {
						return area.top > (maxArea?.top ?? Number.MAX_VALUE)
							? area
							: maxArea;
					}, filteredAreas[0]);
					const middleHeight =
						topmostArea && bottommostArea
							? (topmostArea.top + bottommostArea.top + bottommostArea.height) /
							2
							: undefined;

					return (
						<div key={highlight.id} className="group z-10">
							{filteredAreas.map((area) => {
								return (
									<HighlightedArea
										openForest={() => props.openForest(highlight)}
										className="group-hover:bg-yellow-600 group-hover:bg-opacity-40 bg-yellow-400 bg-opacity-40 cursor-pointer"
										area={area}
										props={props}
									/>
								);
							})}
							{props.lastSelectedRef.current && (props.lastSelectedRef.current.highlightAreas.length > 0) && (
								props.lastSelectedRef.current.highlightAreas.map((area) => {
									return (

										<HighlightedArea
											openForest={() => props.openForest(highlight)}
											className="bg-yellow-400 bg-opacity-10 cursor-pointer"
											area={area}
											props={props}
										/>
									)
								})
							)}
							<PastNote
								userId={props.userId}
								highlight={highlight}
								middleHeight={middleHeight}
								rightmostArea={rightmostArea}
								editHighlight={props.editHighlight}
								deleteHighlight={props.deleteHighlight}
								userProfiles={props.userProfiles}
							/>
						</div>
					);
				})}
			</div>
		);
	} catch (error) {
		console.error("Error in renderHighlights:", error);
		// Render an error message or fallback UI
		return <div>An error occurred while rendering highlights.</div>;
	}
};
