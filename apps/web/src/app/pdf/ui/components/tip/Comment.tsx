import React, { useState } from "react";

import "../../style/Tip.css";

type CommentProps = {
	onConfirm: (arg: { text: string; emoji: string }) => void;
};

export const Comment = ({ onConfirm }: CommentProps) => {
	const [text, setText] = useState("");
	const [emoji, setEmoji] = useState("");
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onConfirm({ text, emoji });
		}
	};

	return (
		<form
			className="Tip__card"
			onSubmit={(event) => {
				event.preventDefault();
				onConfirm({ text, emoji });
			}}
		>
			<div>
				<textarea
					className="text-black"
					placeholder="Your comment"
					autoFocus
					value={text}
					onChange={(e) => setText(e.target.value)}
					ref={(node) => {
						if (node) {
							node.focus();
						}
					}}
					onKeyDown={handleKeyDown}
				/>
				<div>
					{["💩", "😱", "😍", "🔥", "😳", "⚠️"].map((_emoji) => (
						<label key={_emoji}>
							<input
								checked={emoji === _emoji}
								type="radio"
								name="emoji"
								value={_emoji}
								onChange={(e) => setEmoji(e.target.value)}
							/>
							{_emoji}
						</label>
					))}
				</div>
			</div>
			<div>
				<input type="submit" className="text-black" value="Save" />
			</div>
		</form>
	);
};
