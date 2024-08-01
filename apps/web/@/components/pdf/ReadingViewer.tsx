import React, { useRef, useState, useMemo, Suspense, useCallback } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { RenderHighlightContentProps, RenderHighlightsProps, RenderHighlightTargetProps } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import FloatingProfiles from "@/components/pdf/FloatingProfiles";

import { useAskHighlight } from "@src/context/ask-highlight-context";
import { AnnotatedPdfWithProfile, HighlightWithRelations, UserProfile } from "@src/lib/types";
import { clientApi } from "@src/trpc/react";
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import { PanelGroup } from 'react-resizable-panels';
import { Sidebar } from './Sidebar';
import { LastSelectedArea } from '@/components/pdf/types';
import { renderHighlightContent, renderHighlightTarget, renderHighlights } from './Highlights';
import { NewHighlightWithRelationsInput } from '@src/server/api/routers/highlight';


const highlightPlugin = require("./highlight.js").highlightPlugin;

type Props = {
	loadedSource: string;
	pdfBytes: number[];
	loggedInUserHighlights: HighlightWithRelations[];
	otherUserHighlights: HighlightWithRelations[];
	loggedInUserId: string;
	annotatedPdfId: string;
	annotatedPdfsWithProfile: AnnotatedPdfWithProfile[];
	userProfiles: UserProfile[];
};

const ReadingViewer: React.FC<Props> = ({
	loadedSource,
	pdfBytes,
	loggedInUserHighlights,
	otherUserHighlights,
	loggedInUserId,
	annotatedPdfId,
	annotatedPdfsWithProfile,
	userProfiles
}) => {
	const { currentHighlight, selectHighlight, createAskHighlight, setCurrentHighlight } = useAskHighlight();
	const [selectedHighlights, setSelectedHighlights] = useState<AnnotatedPdfWithProfile[]>(annotatedPdfsWithProfile);
	const utils = clientApi.useUtils();
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const lastSelectedRef = useRef<LastSelectedArea | null>(null);


	const annotatedPdfResetHighlightsMutation = clientApi.annotatedPdf.resetHighlights.useMutation({
		onMutate: async () => {
			await utils.annotatedPdf.fetchAnnotatedPdf.cancel({ userId: loggedInUserId, source: loadedSource });
			utils.annotatedPdf.fetchAnnotatedPdf.setData({ userId: loggedInUserId, source: loadedSource },
				oldData => oldData ? { ...oldData, highlights: [] } : oldData);
		},
		onSuccess: () => utils.annotatedPdf.fetchAnnotatedPdf.invalidate({ userId: loggedInUserId, source: loadedSource }),
	});

	const deleteHighlightMutation = clientApi.highlight.deleteHighlight.useMutation({
		onMutate: async (newData) => {
			await utils.annotatedPdf.fetchAnnotatedPdf.cancel({ userId: loggedInUserId, source: loadedSource });
			utils.annotatedPdf.fetchAnnotatedPdf.setData({ userId: loggedInUserId, source: loadedSource },
				oldData => oldData ? { ...oldData, highlights: highlights.filter(h => h.id !== newData.highlightId) } : oldData);
		},
		onSuccess: () => utils.annotatedPdf.fetchAnnotatedPdf.invalidate({ userId: loggedInUserId, source: loadedSource }),
	});

	const editHighlightMutation = clientApi.comment.upsertComment.useMutation({
		onMutate: async () => {
			await utils.annotatedPdf.fetchAnnotatedPdf.cancel({ userId: loggedInUserId, source: loadedSource });
			utils.annotatedPdf.fetchAnnotatedPdf.setData({ userId: loggedInUserId, source: loadedSource }, oldData => oldData);
		},
		onSuccess: () => utils.annotatedPdf.fetchAnnotatedPdf.invalidate({ userId: loggedInUserId, source: loadedSource }),
	});



	const highlights = clientApi.annotatedPdf.fetchAnnotatedPdf.useQuery({ userId: loggedInUserId, source: loadedSource }).data?.highlights || loggedInUserHighlights;

	const deleteHighlight = (highlightId: string) => deleteHighlightMutation.mutate({ highlightId });
	const editHighlight = async ({ id, highlightId, text }: { id?: string; highlightId: string; text: string }) =>
		editHighlightMutation.mutate({ id, highlightId, text, userId: loggedInUserId });
	const resetHighlights = () => annotatedPdfResetHighlightsMutation.mutate({ id: annotatedPdfId });

	const openForest = (highlight: HighlightWithRelations) => setCurrentHighlight(highlight);

	const addHighlight = (props: RenderHighlightContentProps) => {
		// Keep the selected text highlighted? 

		const highlightDraft: NewHighlightWithRelationsInput = {
			annotatedPdfId,
			highlightAreas: props.highlightAreas,
			quote: props.selectedText,
		};
		createAskHighlight(highlightDraft);
		props.cancel();
		// Don't double highlight when saving highlight
		lastSelectedRef.current = null;

		return Promise.resolve('');
	}



	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const popupInputRef = useRef<HTMLTextAreaElement | null>(null);


	const _focusCommentInput = useCallback(() => {
		if (commentInputRef.current) {
			commentInputRef.current.focus();
		} else {
			setTimeout(focusCommentInput, 100);
		}
	}, []);
	const focusCommentInput = useCallback(() => {
		setTimeout(_focusCommentInput, 100);
	}, [_focusCommentInput]);

	// do the same focus but for input ref
	const _focusPopupInput = useCallback(() => {
		if (popupInputRef.current) {
			popupInputRef.current.focus();
		} else {
			setTimeout(focusCommentInput, 100);
		}
	}, []);
	const focusPopupInput = useCallback(() => {
		setTimeout(_focusPopupInput, 100);
	}, [_focusPopupInput]);



	const highlightPluginInstance = highlightPlugin({
		renderHighlightTarget: (props: RenderHighlightTargetProps) => {
			lastSelectedRef.current = { highlightAreas: props.highlightAreas, selectedText: props.selectedText };
			return renderHighlightTarget({
				...props,
				annotatedPdfId: '',
				popupInputRef,
				lastSelectedRef,
				addHighlight,
				addComment: (props) => { return Promise.resolve('') },
				focusPopupInput
			});
		},
		renderHighlightContent: (props: RenderHighlightContentProps) => {
			return renderHighlightContent({ ...props, addHighlight, popupInputRef, lastSelectedRef, addComment: (props) => { return Promise.resolve('') }, setActiveHighlight: (props) => { return Promise.resolve('') }, setCollapsedHighlights: (props) => { return Promise.resolve('') } })
		},
		renderHighlights: (props: RenderHighlightsProps) => {
			return renderHighlights({ ...props, displayedHighlights: highlights, lastSelectedRef, openHighlight: (props) => { return Promise.resolve(false) }, deleteHighlight: (props) => { return Promise.resolve(true) }, loggedInUserId: '', addComment: (props) => { return Promise.resolve('') }, activeHighlight: null, isSelecting: false })
		},

	});
	const { jumpToHighlightArea } = highlightPluginInstance;

	const onHighlightClick = (highlight: HighlightWithRelations) => {
		const area = highlight.highlightAreas[0];
		if (area) highlightPluginInstance.jumpToHighlightArea(area);
		selectHighlight(highlight);
	};

	const pdfBytesMemoized = useMemo(() => new Uint8Array(pdfBytes), [pdfBytes]);

	return (
		<div>
			<FloatingProfiles setDisplayHighlights={setSelectedHighlights} allHighlightsWithProfile={annotatedPdfsWithProfile} />
			<PanelGroup className="w-full" direction="horizontal">

				<ResizablePanel className="relative" defaultSize={80} style={{ height: "100vh", overflow: "auto" }} collapsible>
					<Suspense fallback={<div>Loading PDF...</div>}>
						<Viewer fileUrl={pdfBytesMemoized.length > 0 ? pdfBytesMemoized : loadedSource} plugins={[highlightPluginInstance]} />
					</Suspense>

				</ResizablePanel>
				<ResizableHandle withHandle handleClassName="bg-[#B2B2B2]" />
				<ResizablePanel style={{ height: "100vh", overflow: "auto" }} collapsible>
					<div className="h-full overflow-auto">
						<Sidebar highlights={highlights ?? []} deleteHighlight={deleteHighlight} resetHighlights={resetHighlights} onHighlightClick={onHighlightClick} />
					</div>
				</ResizablePanel>
			</PanelGroup>
		</div>
	);
};

export default ReadingViewer;