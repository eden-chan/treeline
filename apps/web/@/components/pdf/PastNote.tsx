import { useEffect, useRef, useState } from "react";
import { CircleArrowUp, Pencil, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { HighlightWithRelations } from "@src/lib/types";

type Props = {
	highlight: HighlightWithRelations;
	rightmostArea:
	| {
		height: number;
		left: number;
		pageIndex: number;
		top: number;
		width: number;
	}
	| undefined;
	middleHeight: number | undefined;
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
};
export const PastNote = ({
	highlight,
	rightmostArea,
	middleHeight,
	editHighlight,
	deleteHighlight,
}: Props) => {
	if (!rightmostArea) return null;

	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = highlight.comments?.[0]?.text ?? "";
		}
	}, [highlight]);

	const handleSubmit = () => {
		if (inputRef.current) {
			editHighlight({
				id: highlight.comments?.[0]?.id,
				highlightId: highlight.id,
				text: inputRef.current.value,
			});
		}
	};

	const handleTrash = () => {
		deleteHighlight(highlight.id);
	};

	const handleReply = () => {
		// Dummy function for handling comment
	};

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && e.shiftKey) {
			e.preventDefault();
			if (inputRef.current) {
				const updateComment = await editHighlight({
					id: highlight.comments?.[0]?.id,
					highlightId: highlight.id,
					text: inputRef.current.value,
				});
				console.log('updateComment', updateComment)
			}
		}
	};
	return (
		<span
			className="z-50 absolute text-xl w-[20px] group"
			style={{
				left: `${rightmostArea.left + rightmostArea.width}%`,
				top: `${middleHeight ?? rightmostArea.top}%`,
				transform: "translate(8px, -50%)",
			}}
		>
			<div className="relative group-hover:w-[200px] bg-white">
				<span className="flex items-center">
					<span className="select-none font-bold text-blue-500 inline">¶</span>
					<div className="invisible group-hover:visible flex items-center">
						<button
							className="text-blue-500 hover:text-blue-700 p-0.5 rounded select-none ml-2"
							onClick={handleTrash}
						>
							<Trash2 className="cursor-pointer" size={16} />
						</button>
						{/* <img
							src="/path/to/profile-picture.jpg"
							alt="Profile"
							className="w-6 h-6 rounded-full ml-2"
						/> */}
						<span className="text-xs ml-1 select-none">Eden Chan</span>
					</div>
				</span>
				<div className="invisible group-hover:visible absolute w-full">
					<Textarea ref={inputRef} onKeyDown={handleKeyDown} />
					<div className="sticky bottom-0 left-0  z-10">
						<div className="flex justify-end">
							<button
								className="text-blue-500 hover:text-blue-700 font-semibold text-sm select-none"
								onClick={handleReply}
							>
								Reply
							</button>
							<button
								className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-0.5 rounded select-none"
								onClick={handleSubmit}
							>
								<CircleArrowUp className="cursor-pointer" size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</span>
	);
};
