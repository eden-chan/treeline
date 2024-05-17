import { useEffect, useRef, useState } from "react";
import { CircleArrowUp, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { HighlightWithRelations } from "@src/lib/types";
import { HighlightCommentTextarea } from './HighlightCommentTextArea';
import { Comment } from '@prisma/client';

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
	userId: string;
};

export const PastNote = ({
	highlight,
	rightmostArea,
	middleHeight,
	editHighlight,
	deleteHighlight,
	userId

}: Props) => {
	if (!rightmostArea) return null;

	const inputRef = useRef<HTMLTextAreaElement>(null);
	const replyInputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = highlight.comments?.[0]?.text ?? "";
		}
	}, [highlight.comments]);

	const handleTrash = async () => {
		try {
			await deleteHighlight(highlight.id);
		} catch (error) {

			console.error("Failed to delete highlight:", error);
		}
	};

	const [showReplyTextarea, setShowReplyTextarea] = useState(false);

	const createNewComment = (text: string, commentId: string | undefined) => ({
		id: commentId, // id will be supplied in returned response
		highlightId: highlight.id,
		text,
		timestamp: new Date(),
		userId,
	});


	const handleUpdateFirstComment = async () => {
		if (inputRef.current) {
			const updatedComment = createNewComment(inputRef.current.value, highlight.comments?.[0]?.id);
			const result = await editHighlight(updatedComment)
			console.log('handleUpdateFirstComment res', result)
		}
	};

	const handleUpdateFirstCommentKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		console.log('hello update first comment keydown', showReplyTextarea)
		if (!showReplyTextarea && e.key === "Enter" && (e.shiftKey || e.altKey)) {
			console.log('hello update first comment keydown', showReplyTextarea)
			e.preventDefault();
			e.stopPropagation();
			handleUpdateFirstComment()
		}
	};
	const handleReply = async (text: string | undefined) => {
		if (text) {
			const newComment = createNewComment(text, undefined);
			const result = await editHighlight(newComment)
			console.log('handleReply res', result)
		}
	};


	const handleUpdateCommentReplyKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		console.log('hello update reply keydown', showReplyTextarea)
		if (showReplyTextarea && e.key === "Enter" && (e.shiftKey || e.altKey)) {
			e.preventDefault();
			await handleReply(replyInputRef.current?.value);
		}
	};

	const handleUpdateCommentSubmit = async () => {
		await handleReply(replyInputRef.current?.value);
	};

	const [isReplyDrafted, setIsReplyDrafted] = useState(false);

	return (
		<span
			className="absolute text-xl w-[20px] group z-20"
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
				<div className="invisible group-hover:visible group-hover:z-30 absolute w-full bg-white z-50">
					<Textarea
						ref={inputRef}
						placeholder={'Comment or share with @'}
						disabled={showReplyTextarea}
						onKeyDown={handleUpdateFirstCommentKeyDown}
					/>
					<div className="pl-5">
						{highlight.comments.slice(1).map((comment, index) => (
							<HighlightCommentTextarea
								key={index}
								value={comment.text}
								disabled
							/>
						))}
					</div>
					<div className="sticky bottom-0 left-0 bg-white">
						{!showReplyTextarea && (
							<div className="flex justify-end bg-white">
								{highlight.comments?.length > 0 &&
									<button
										className="text-blue-500 hover:text-blue-700 font-semibold text-sm select-none"
										onClick={() => setShowReplyTextarea(true)}
									>
										Reply
									</button>
								}
								<button
									className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-0.5 rounded select-none"
									onClick={handleUpdateFirstComment}
								>
									<CircleArrowUp className="cursor-pointer" size={16} />
								</button>
							</div>
						)}
						{showReplyTextarea && (
							<>
								<Textarea
									ref={replyInputRef}
									placeholder="Reply"
									onKeyDown={handleUpdateCommentReplyKeyDown}
									onChange={() => { setIsReplyDrafted(true) }}
								/>
								{isReplyDrafted && (
									<div className="flex justify-end mt-2">
										<button
											className="text-gray-500 hover:text-gray-700 font-semibold text-sm select-none mr-2"
											onClick={() => setShowReplyTextarea(false)}
										>
											Cancel
										</button>
										<button
											className="text-blue-500 hover:text-blue-700 font-semibold text-sm select-none"
											onClick={handleUpdateCommentSubmit}
										>
											Save
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</span>
	);
};