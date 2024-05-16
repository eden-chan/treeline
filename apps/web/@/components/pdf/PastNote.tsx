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
	const replyInputRef = useRef<HTMLTextAreaElement>(null);

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

	const [showReplyTextarea, setShowReplyTextarea] = useState(false);

	const handleReplyKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (showReplyTextarea && e.key === "Enter" && (e.shiftKey || e.altKey)) {
			e.preventDefault();
			if (replyInputRef.current) {
				const updateComment = await editHighlight({
					id: highlight.comments?.[0]?.id,
					highlightId: highlight.id,
					text: replyInputRef.current.value,
				});
				console.log('updateComment', updateComment);
			}
		}
	};

	const handleReply = async () => {
		if (replyInputRef.current) {
			const updateComment = await editHighlight({
				id: highlight.comments?.[highlight.comments.length - 1]?.id,
				highlightId: highlight.id,
				text: replyInputRef.current.value,
			});
			console.log('updateComment', updateComment);
		}
	};

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && (e.shiftKey || e.altKey)) {
			e.preventDefault();
			if (inputRef.current) {
				const updateComment = await editHighlight({
					id: highlight.comments?.[0]?.id,
					highlightId: highlight.id,
					text: inputRef.current.value,
				});
				console.log('updateComment', updateComment);
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
						<span className="text-xs ml-1 select-none self-end">Eden Chan</span>
					</div>
				</span>
				<div className="invisible group-hover:visible absolute w-full bg-white">
					<Textarea ref={inputRef} placeholder={'Comment or share with @'} disabled={showReplyTextarea} onKeyDown={handleKeyDown} />
					<div className="sticky bottom-0 left-0 z-50 bg-white">
						{!showReplyTextarea &&
							<div className="flex justify-end bg-white">

								<button
									className="text-blue-500 hover:text-blue-700 font-semibold text-sm select-none"
									onClick={() => setShowReplyTextarea(true)}
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
						}
						{showReplyTextarea && (
							<Textarea
								ref={replyInputRef}
								placeholder="Reply"
								className='min-h-[24px]'
								onKeyDown={handleReplyKeyDown}
							/>
						)}
					</div>
				</div>
			</div>
		</span>
	);
};
