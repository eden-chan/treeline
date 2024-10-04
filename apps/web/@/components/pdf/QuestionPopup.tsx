import React from "react";
import { Button, PrimaryButton } from "@react-pdf-viewer/core";

interface QuestionPopupProps {
	left: React.CSSProperties["left"];
	top: React.CSSProperties["top"];
	onCancel: () => void;
	onSubmit: () => void;
	inputRef: React.RefObject<HTMLTextAreaElement>
}

const QuestionPopup: React.FC<QuestionPopupProps> = ({
	left,
	top,
	inputRef,
	onCancel,
	onSubmit,
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			onSubmit();
		}
	};

	return (
		<div
			style={{
				background: "#fff",
				border: "1px solid rgba(0, 0, 0, .3)",
				borderRadius: "2px",
				padding: "8px",
				position: "absolute",
				left: left,
				top: top,
				zIndex: 1,
			}}
		>
			<div>
				<textarea
					rows={3}
					style={{
						border: "1px solid rgba(0, 0, 0, .3)",
					}}
					onKeyDown={handleKeyDown}
					ref={inputRef}
				></textarea>
			</div>
			<div
				style={{
					display: "flex",
					marginTop: "8px",
				}}
			>
				<div style={{ marginRight: "8px" }}>
					<PrimaryButton onClick={onSubmit}>Add</PrimaryButton>
				</div>
				<Button onClick={onCancel}>Cancel</Button>
			</div>
		</div>
	);
};

export default QuestionPopup;
