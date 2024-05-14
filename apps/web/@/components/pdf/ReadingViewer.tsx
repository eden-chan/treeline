import { useState, Fragment } from "react";
import {
	highlightPlugin,
	HighlightArea,
	MessageIcon,
	RenderHighlightContentProps,
	RenderHighlightsProps,
	RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";
import {
	Button,
	Position,
	Tooltip,
	Viewer,
} from "@react-pdf-viewer/core";
import { useAskHighlight } from "@src/context/ask-highlight-context";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { NewHighlightWithRelationsInput } from "@src/server/api/routers/highlight";
import { Highlight } from "@prisma/client";
import {
	AnnotatedPdfWithProfile,
	HighlightWithRelations,
} from "@src/lib/types";
import { Sidebar } from "@/components/pdf/Sidebar";
import { clientApi } from "@src/trpc/react";
import { Forest } from "@/components/pdf/Forest";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import FloatingProfiles from "@/components/pdf/FloatingProfiles";
import { ReactFlowProvider } from "reactflow";
import QuestionPopup from "./QuestionPopup";
import { cn } from '@/lib/utils';

type DisplayNotesSidebarExampleProps = {
	annotatedPdfId: string;
	loadedSource: string;
	userId: string;
	userHighlights: Highlight[];
	annotatedPdfsWithProfile: AnnotatedPdfWithProfile[];
};

type Note = {
	id: number;
	content: string;
	highlightAreas: HighlightArea[];
	quote: string;
};

const ReadingViewer: React.FC<DisplayNotesSidebarExampleProps> = ({
	loadedSource,
	userHighlights,
	userId,
	annotatedPdfId,
	annotatedPdfsWithProfile,
}) => {
	const [message, setMessage] = useState("");
	const [notes, setNotes] = useState<Note[]>([]);
	const [friendHighlights, setFriendHighlights] = useState<Highlight[]>([]);

	const {
		currentHighlight,
		selectHighlight,
		createAskHighlight,
		clearSelectedHighlight,
	} = useAskHighlight();
	let noteId = notes.length;

	const utils = clientApi.useUtils();

	const annotatedPdfMutation =
		clientApi.annotatedPdf.resetHighlights.useMutation({
			onMutate: async () => {
				await utils.annotatedPdf.fetchAnnotatedPdf.cancel({
					userId: userId,
					source: loadedSource,
				});

				utils.annotatedPdf.fetchAnnotatedPdf.setData(
					{
						userId: userId,
						source: loadedSource,
					},
					(oldData) => {
						if (!oldData) return oldData;
						return {
							...oldData,
							highlights: [],
						};
					},
				);
			},
			onSuccess: (input) => {
				utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
					userId: userId,
					source: loadedSource,
				});
			},
		});

	const deleteHighlightMutation =
		clientApi.highlight.deleteHighlight.useMutation({
			onMutate: async (newData) => {
				await utils.annotatedPdf.fetchAnnotatedPdf.cancel({
					userId: userId,
					source: loadedSource,
				});

				utils.annotatedPdf.fetchAnnotatedPdf.setData(
					{
						userId: userId,
						source: loadedSource,
					},
					(oldData) => {
						if (!oldData) return oldData;
						return {
							...oldData,
							highlights: highlights.filter(
								(highlight) => highlight.id != newData.highlightId,
							),
						};
					},
				);
			},
			onSuccess: (input) => {
				utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
					userId: userId,
					source: loadedSource,
				});
			},
		});

	const highlights =
		clientApi.annotatedPdf.fetchAnnotatedPdf.useQuery({
			userId: userId,
			source: loadedSource,
		}).data?.highlights || userHighlights;

	const deleteHighlight = (highlightId: string) => {
		deleteHighlightMutation.mutate({ highlightId });
	};

	const resetHighlights = () => {
		annotatedPdfMutation.mutate({
			id: annotatedPdfId,
		});
	};

	const renderHighlightTarget = (props: RenderHighlightTargetProps) => {

		return (

			<div
				// onClick={() => { console.log('props:', props) }}
				style={{
					background: "#eee",
					display: "flex",
					position: "absolute",
					left: `${props.selectionRegion.left + props.selectionRegion.width}%`,
					top: `${props.selectionRegion.top}%`,
					// left: `${props.selectionRegion.left}%`,
					// top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
					transform: "translate(0, 8px)",
					zIndex: 1,
				}}
			>
				<Tooltip
					position={Position.RightCenter}
					target={
						<Button onClick={props.toggle}>
							<MessageIcon />
						</Button>
					}
					content={() => <div style={{ width: "100px" }}>Ask a question</div>}
					offset={{ left: 0, top: -8 }}
				/>
			</div>
		);
	}

	const renderHighlightContent = (props: RenderHighlightContentProps) => {
		const addNote = () => {
			if (message !== "") {
				const note: Note = {
					id: ++noteId,
					content: message,
					highlightAreas: props.highlightAreas,
					quote: props.selectedText,
				};
				setNotes(notes.concat([note]));

				const extendedNote: NewHighlightWithRelationsInput = {
					...note,
					annotatedPdfId, // Placeholder or dynamic value as needed
					id_: noteId, // Placeholder or dynamic value as needed
					type: "COMMENT",
					node: {
						prompt: message,
						response: null,
						timestamp: new Date(),
						comments: [],
					},
				};
				createAskHighlight(extendedNote);
				props.cancel();
			}
		};

		return (
			<QuestionPopup
				left={`${props.selectionRegion.left}%`}
				top={`${props.selectionRegion.top + props.selectionRegion.height}%`}
				onChange={(e) => setMessage(e.target.value)}
				onSubmit={addNote}
				onCancel={props.cancel}
			/>
		);
	};
	const HighlightArea = ({ area, props, idx, className }) => (
		<div
			key={idx}
			className={cn("highlight-area z-10 bg-yellow-400 bg-opacity-40", className)}
			style={Object.assign(
				{},
				props.getCssProperties(area, props.rotation),
			)}
		/>
	);

	const renderHighlights = (props: RenderHighlightsProps) => {
		return (
			<div>
				{highlights.map((note) => {
					const filteredAreas = note.highlightAreas.filter(
						(area) => area.pageIndex === props.pageIndex && area.width > 0
					);

					const rightmostArea = filteredAreas.reduce((maxArea, area) => {
						return area.left > maxArea.left ? area : maxArea;
					}, filteredAreas[0]);

					return (
						<div key={note.id} className="group z-10">
							{filteredAreas.map((area, idx) => {
								return (
									<HighlightArea
										className="group-hover:bg-yellow-600 group-hover:bg-opacity-40"
										area={area}
										props={props}
										key={idx}
										idx={idx}
									/>
								);
							})}
							{rightmostArea && (
								<span
									className="absolute text-blue-500 text-xl font-bold group-hover:hidden"
									style={{
										left: `${rightmostArea.left + rightmostArea.width}%`,
										top: `${rightmostArea.top}%`,
										transform: 'translate(8px, -50%)',
									}}
								>
									*
								</span>
							)}
							{rightmostArea && (
								<span
									className="z-20 hidden group-hover:block bg-white text-black p-2 rounded shadow-lg absolute text-sm"
									style={{
										left: `${rightmostArea.left + rightmostArea.width}%`,
										top: `${rightmostArea.top}%`,
										transform: 'translate(8px, -50%)',
										maxWidth: '200px',
										wordBreak: 'break-word',
									}}
								>
									{note.quote}
								</span>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	const highlightPluginInstance = highlightPlugin({
		renderHighlightTarget,
		renderHighlightContent,
		renderHighlights,
	});

	const { jumpToHighlightArea } = highlightPluginInstance;

	const onHighlightClick = (highlight: HighlightWithRelations) => {
		const area = highlight.highlightAreas[0];
		if (area) {
			jumpToHighlightArea(area);
		}
		selectHighlight(highlight);
	};

	return (
		<div>
			<FloatingProfiles
				setDisplayHighlights={setFriendHighlights}
				allHighlightsWithProfile={annotatedPdfsWithProfile}
			/>

			<ResizablePanelGroup className="w-full" direction="horizontal">
				<ResizablePanel
					className="relative"
					defaultSize={70}
					style={{ height: "100vh", overflow: "auto" }}
				>
					<Viewer fileUrl={loadedSource} plugins={[highlightPluginInstance]} />
					{/* removes the trailing bottom whitespace */}
					<div />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel style={{ height: "100vh", overflow: "auto" }}>
					{currentHighlight?.node ? (
						<ReactFlowProvider>
							<Forest
								node={currentHighlight.node}
								returnHome={() => {
									document.location.hash = "";
									clearSelectedHighlight();
								}}
							/>
						</ReactFlowProvider>
					) : (
						<div style={{ height: "100%", overflow: "auto" }}>
							<Sidebar
								highlights={highlights ?? []}
								deleteHighlight={deleteHighlight}
								resetHighlights={resetHighlights}
								onHighlightClick={onHighlightClick}
							/>
						</div>
					)}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

export default ReadingViewer;
