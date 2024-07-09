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
			<button
				onClick={saveHighlight}
				className="px-2 py-1 bg-blue-500 text-white rounded shadow-md focus:outline-none hover:bg-blue-600 text-xs"
			>
				Save
			</button>
			<MiniChatWindow selectedText={props.selectedText} position={props.selectionRegion} />
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
										className="group-hover:bg-yellow-600 group-hover:bg-opacity-40 bg-opacity-40 cursor-pointer"
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
											className="group-hover:bg-[#ccccff] bg-[#8080FF] group-hover:bg-opacity-40 bg-opacity-40  cursor-pointer"
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
