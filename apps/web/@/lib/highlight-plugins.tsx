import { MutableRefObject, useCallback, useMemo } from "react";
import {
	HighlightArea,
	RenderHighlightsProps,
	RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";

import { NewHighlightWithRelationsInput } from "@src/server/api/routers/highlight";

import { AnnotatedPdfWithProfile, HighlightWithRelations, UserProfile } from "@src/lib/types";
import { HighlightedArea } from "@/components/pdf/HighlightedArea";
import { PastNote } from "@/components/pdf/PastNote";
import { MiniChatWindow } from '@/components/pdf/MiniChatWindow';
import { LastSelectedArea } from '@src/app/pdf/ui';
import React from 'react';


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
	loggedInUserId: string;
	userProfiles: UserProfile[];
	openForest: (highlight: HighlightWithRelations) => void;
	lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
	selectedHighlights: AnnotatedPdfWithProfile[];
} & RenderHighlightsProps;

const calculateAreaStats = (filteredAreas: HighlightArea[]) => {
	const rightmostArea = filteredAreas.reduce((maxArea, area) =>
		area.left > (maxArea?.left ?? 0) ? area : maxArea, filteredAreas[0]);

	const topmostArea = filteredAreas.reduce((minArea, area) =>
		area.top < (minArea?.top ?? 0) ? area : minArea, filteredAreas[0]);

	const bottommostArea = filteredAreas.reduce((maxArea, area) =>
		area.top > (maxArea?.top ?? Number.MAX_VALUE) ? area : maxArea, filteredAreas[0]);

	const middleHeight = topmostArea && bottommostArea
		? (topmostArea.top + bottommostArea.top + bottommostArea.height) / 2
		: undefined;

	return { rightmostArea, middleHeight };
};


export const renderHighlights = (props: MyRenderHighlightsProps) => {
	const renderLastSelectedHighlight = useCallback(() => {
		if (!props.lastSelectedRef.current || props.lastSelectedRef.current.highlightAreas.length === 0) {
			return null;
		}
		return props.lastSelectedRef.current.highlightAreas.map((area) => (
			<HighlightedArea
				className="bg-yellow-400 bg-opacity-10 cursor-pointer"
				area={area}
				props={props}
			/>
		));
	}, [props.lastSelectedRef.current]);

	const renderSelectedHighlights = useCallback(() => {
		return props.selectedHighlights.flatMap(profile =>
			profile.highlights.map(highlight => {
				const filteredAreas = highlight.highlightAreas.filter(
					area => area.pageIndex === props.pageIndex && area.width > 0
				);
				const { rightmostArea, middleHeight } = calculateAreaStats(filteredAreas);

				return (
					<div key={highlight.id} className="group z-10">
						{filteredAreas.map((area) => (
							<HighlightedArea
								className="group-hover:bg-purple-600 group-hover:bg-opacity-40 bg-purple-400 bg-opacity-40 cursor-pointer"
								area={area}
								props={props}
							/>
						))}
						<PastNote
							userId={profile.userId}
							highlight={highlight}
							middleHeight={middleHeight}
							rightmostArea={rightmostArea}
							editHighlight={props.editHighlight}
							deleteHighlight={props.deleteHighlight}
							userProfiles={props.userProfiles}
						/>
					</div>
				);
			})
		);
	}, [props.selectedHighlights, props.pageIndex, props.editHighlight, props.deleteHighlight, props.userProfiles]);

	const renderUserHighlights = useCallback(() => {
		return props.highlights.map(highlight => {
			const filteredAreas = highlight.highlightAreas.filter(
				area => area.pageIndex === props.pageIndex && area.width > 0
			);
			const { rightmostArea, middleHeight } = calculateAreaStats(filteredAreas);

			return (
				<div key={highlight.id} className="group z-10">
					{filteredAreas.map((area, index) => (
						<HighlightedArea
							key={index}
							className="group-hover:bg-yellow-600 group-hover:bg-opacity-40 bg-yellow-400 bg-opacity-40 cursor-pointer"
							area={area}
							props={props}
						/>
					))}
					<PastNote
						userId={props.loggedInUserId}
						highlight={highlight}
						middleHeight={middleHeight}
						rightmostArea={rightmostArea}
						editHighlight={props.editHighlight}
						deleteHighlight={props.deleteHighlight}
						userProfiles={props.userProfiles}
					/>
				</div>
			);
		});
	}, [props.highlights, props.pageIndex, props.loggedInUserId, props.editHighlight, props.deleteHighlight, props.userProfiles]);

	try {
		return (
			<div>
				{renderLastSelectedHighlight()}
				{renderSelectedHighlights()}
				{renderUserHighlights()}
			</div>
		);
	} catch (error) {
		console.error("Error in renderHighlights:", error);
		return <div>An error occurred while rendering highlights.</div>;
	}
};

renderHighlights.displayName = 'RenderHighlights';