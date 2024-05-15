import * as React from "react";
import {
	highlightPlugin,
	HighlightArea,
	MessageIcon,
	RenderHighlightContentProps,
	RenderHighlightTargetProps,
	RenderHighlightsProps,
} from "@react-pdf-viewer/highlight";
import { Button, Position, Tooltip, Viewer } from "@react-pdf-viewer/core";
import QuestionPopup from "./QuestionPopup";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface RenderHighlightContentExampleProps {
	fileUrl: string;
}

interface Note {
	id: number;
	content: string;
	highlightAreas: HighlightArea[];
	quote: string;
}

const RenderHighlightContentExample: React.FC<
	RenderHighlightContentExampleProps
> = ({ fileUrl }) => {
	const [message, setMessage] = React.useState("");
	const [notes, setNotes] = React.useState<Note[]>([]);
	let noteId = notes.length;

	const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
		<div
			style={{
				background: "#eee",
				display: "flex",
				position: "absolute",
				left: `${props.selectionRegion.left}%`,
				top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
				transform: "translate(0, 8px)",
				zIndex: 1,
			}}
		>
			<Tooltip
				position={Position.TopCenter}
				target={
					<Button onClick={props.toggle}>
						Save
					</Button>
				}
				content={() => <div style={{ width: "100px" }}>Ask a question</div>}
				offset={{ left: 0, top: -8 }}
			/>
		</div>
	);

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

	const renderHighlights = (props: RenderHighlightsProps) => (
		<div>
			{notes.map((note) => (
				<React.Fragment key={note.id}>
					{note.highlightAreas
						.filter((area) => area.pageIndex === props.pageIndex)
						.map((area, idx) => (
							<div
								key={idx}
								style={Object.assign(
									{},
									{
										background: "yellow",
										opacity: 0.4,
									},
									props.getCssProperties(area, props.rotation),
								)}
							/>
						))}
				</React.Fragment>
			))}
		</div>
	);

	const highlightPluginInstance = highlightPlugin({
		renderHighlightTarget,
		renderHighlightContent,
		renderHighlights,
	});

	return (
		<div
			style={{
				border: "1px solid rgba(0, 0, 0, 0.3)",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<Viewer fileUrl={fileUrl} plugins={[highlightPluginInstance]} />
		</div>
	);
};

export default RenderHighlightContentExample;
