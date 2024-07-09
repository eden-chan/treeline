import React, { useRef, useState, useMemo, Suspense } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { RenderHighlightsProps, RenderHighlightTargetProps } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import FloatingProfiles from "@/components/pdf/FloatingProfiles";
import { renderHighlightTarget, renderHighlights } from "@/lib/highlight-plugins";
import { useAskHighlight } from "@src/context/ask-highlight-context";
import { AnnotatedPdfWithProfile, HighlightWithRelations, UserProfile } from "@src/lib/types";
import { clientApi } from "@src/trpc/react";
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import { PanelGroup } from 'react-resizable-panels';
import { Sidebar } from './Sidebar';
import { LastSelectedArea } from '@src/app/pdf/ui';


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


	const highlightPluginInstance = highlightPlugin({
		renderHighlightTarget: (props: RenderHighlightTargetProps) => {
			lastSelectedRef.current = { highlightAreas: props.highlightAreas, selectedText: props.selectedText };
			return renderHighlightTarget({
				...props,
				openForest,
				annotatedPdfId,
				createAskHighlight,
				setCurrentHighlight,
				inputRef, lastSelectedRef
			});
		},
		renderHighlights: (props: RenderHighlightsProps) => {
			console.log("selectedHighlights", selectedHighlights);
			return renderHighlights({ ...props, highlights, selectedHighlights, openForest, editHighlight, deleteHighlight, loggedInUserId: loggedInUserId, userProfiles, lastSelectedRef })
		},
	});

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