import { MutableRefObject } from "react";
import {
	RenderHighlightsProps,
	RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";

import { NewHighlightWithRelationsInput } from "@src/server/api/routers/highlight";
import { Textarea } from "@/components/ui/textarea";
import { HighlightWithRelations, UserProfile } from "@src/lib/types";
import { HighlightedArea } from "@/components/pdf/HighlightedArea";
import { PastNote } from "@/components/pdf/PastNote";

type MyRenderHighlightTargetProps = {
	annotatedPdfId: string;
	createAskHighlight: (
		highlight: NewHighlightWithRelationsInput,
	) => Promise<HighlightWithRelations | undefined>;
	setCurrentHighlight: (
		highlight: HighlightWithRelations | null,
		forceRerender?: boolean | undefined,
	) => void;
	inputRef: MutableRefObject<HTMLTextAreaElement | null>;
	openForest: (highlight: HighlightWithRelations) => void;
} & RenderHighlightTargetProps;

export const renderHighlightTarget = (props: MyRenderHighlightTargetProps) => {
	const saveHighlight = () => {
		const highlightDraft: NewHighlightWithRelationsInput = {
			annotatedPdfId: props.annotatedPdfId,
			highlightAreas: props.highlightAreas,
			quote: props.selectedText,
		};
		props.createAskHighlight(highlightDraft);
		props.cancel();
	};

	const askQuestion = async (prompt: string) => {
		const highlightDraft: NewHighlightWithRelationsInput = {
			annotatedPdfId: props.annotatedPdfId,
			highlightAreas: props.highlightAreas,
			quote: props.selectedText,
			node: {
				prompt,
				response: null,
				timestamp: new Date(),
			},
		};
		return await props.createAskHighlight(highlightDraft);
	};

	const submitQuestion = async (
		e: React.KeyboardEvent<HTMLTextAreaElement>,
	) => {
		if (e.key === "Enter") {
			if (props.inputRef.current && props.inputRef.current.value !== "") {
				const highlight = await askQuestion(
					`${props.inputRef.current.value} Here is the context: ` +
					props.selectedText,
				);

				if (highlight) {
					props.setCurrentHighlight(highlight, true);
					props.openForest(highlight);
				}
			}
		}
	};

	// maybe this can be used for flashcards?
	const define = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		const highlight = await askQuestion(
			"Concisely define the following term and why it is important." +
			props.selectedText,
		);

		if (highlight) {
			props.setCurrentHighlight(highlight, true);
			props.openForest(highlight);
		}
	};

	// guides the direction of the tree
	// TODO: revise the prompt
	const explain = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.stopPropagation();
		const highlight = await askQuestion(
			"Concisely explain why this is important: " + props.selectedText,
		);

		if (highlight) {
			props.setCurrentHighlight(highlight, true);
			props.openForest(highlight);
		}
	};

	return (
		<div
			className="relative flex space-x-2"
			style={{
				position: "absolute",
				left: `${props.selectionRegion.left + props.selectionRegion.width}%`,
				top: `${props.selectionRegion.top}%`,
				transform: "translate(0, 8px)",
				zIndex: 1,
			}}
		>
			<button
				onClick={saveHighlight}
				className="px-2 py-1 bg-blue-500 text-white rounded shadow-md focus:outline-none hover:bg-blue-600"
			>
				Save
			</button>
			<div
				className="group"
				onMouseEnter={() => props.inputRef.current?.focus()}
				onMouseLeave={() => props.inputRef.current?.blur()}
			>
				<button className="px-2 py-1 bg-blue-500 text-white rounded shadow-md focus:outline-none hover:bg-blue-600">
					Ask
				</button>
				<div className="absolute w-48 bg-white rounded-md shadow-xl z-20 invisible group-hover:visible text-xs">
					<Textarea
						placeholder="Ask a question or @ someone"
						onClick={(e) => {
							e.stopPropagation();
						}}
						onKeyDown={submitQuestion}
						ref={props.inputRef}
					/>
					<button
						onClick={define}
						className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left group-hover:visible"
					>
						Define
					</button>
					<button
						onClick={explain}
						className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left group-hover:visible"
					>
						Summarize
					</button>
				</div>
			</div>
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
							{filteredAreas.map((area, idx) => {
								return (
									<HighlightedArea
										openForest={() => props.openForest(highlight)}
										className="group-hover:bg-yellow-600 group-hover:bg-opacity-40 cursor-pointer"
										area={area}
										props={props}
										key={idx}
										idx={idx}
									/>
								);
							})}
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
