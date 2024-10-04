import { useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { HighlightWithRelations, UserProfile } from "@src/lib/types";
import { calculateTimeAgo } from '@src/lib/utils';

type Props = {
	highlight: HighlightWithRelations;
	rightmostArea: {
		height: number;
		left: number;
		pageIndex: number;
		top: number;
		width: number;
	} | undefined;
	middleHeight: number | undefined;
	upsertCommentToExistingHighlight: (highlightId: string, text: string, commentId?: string) => void;
	editHighlight: (highlightId: string, text: string) => void;
	deleteHighlight: (highlightId: string) => void;
	userId: string;
	userProfiles: UserProfile[];
};

export const PastNote = ({
	highlight,
	rightmostArea,
	middleHeight,
	upsertCommentToExistingHighlight,
	editHighlight,
	deleteHighlight,
	userId,
	userProfiles
}: Props) => {
	if (!rightmostArea) return null;

	const [showReplyForm, setShowReplyForm] = useState(false);
	const replyInputRef = useRef<HTMLTextAreaElement>(null);
	const userProfile = userProfiles.find(user => user.email === userId);

	const handleTrash = async () => {
		try {
			await deleteHighlight(highlight.id);
		} catch (error) {
			console.error("Failed to delete highlight:", error);
		}
	};

	const handleHighlightEdit = (newText: string) => {
		editHighlight(highlight.id, newText);
	};

	const handleCommentEdit = (commentId: string, newText: string) => {
		upsertCommentToExistingHighlight(highlight.id, newText, commentId);
	};

	const handleReplySubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const replyText = replyInputRef.current?.value;
		if (replyText) {
			upsertCommentToExistingHighlight(highlight.id, replyText);
			if (replyInputRef.current) {
				replyInputRef.current.value = '';
			}
			setShowReplyForm(false);
		}
	};

	const firstCommentTimestamp = highlight.comments?.[0]?.timestamp;
	const memoizedTimeAgo = useMemo(() => firstCommentTimestamp ? calculateTimeAgo(firstCommentTimestamp) : '', [firstCommentTimestamp]);

	return (
		<div
			id={`highlight-note-${highlight.id}`}
			className="absolute text-xs w-[300px] group z-20 bg-white shadow-lg rounded-lg p-4"
			style={{
				left: `${90}%`,
				top: `${middleHeight ?? rightmostArea.top}%`,
				transform: "translate(8px, -50%)",
			}}
		>
			<div className="relative">
				<div className="flex items-center justify-between mb-2">
					<span className="font-bold text-blue-500">⁂</span>
					<div className="flex items-center">
						<button
							className="text-blue-500 hover:text-blue-700 p-0.5 rounded select-none mr-2"
							onClick={handleTrash}
						>
							<Trash2 className="cursor-pointer" size={16} />
						</button>
						<span className="text-xs select-none text-black">{userProfile?.firstName ?? 'Anonymous'} {userProfile?.lastName ?? ''} {memoizedTimeAgo}</span>
					</div>
				</div>
				<div
					contentEditable
					suppressContentEditableWarning
					className="w-full p-2 border rounded mb-2 min-h-[50px]"
					onBlur={(e) => handleHighlightEdit(e.currentTarget.textContent || '')}
					dangerouslySetInnerHTML={{ __html: highlight.quote }}
				/>
				{highlight.comments.map((comment) => {
					const commentUserProfile = userProfiles.find(user => user.email === comment.userId);
					const timeAgo = calculateTimeAgo(comment.timestamp);
					return (
						<div key={comment.id} className="mb-2">
							<div className="text-xs text-gray-500 mb-1">
								{commentUserProfile?.firstName ?? 'Anonymous'} {commentUserProfile?.lastName ?? ''} {timeAgo}
							</div>
							<div
								contentEditable
								suppressContentEditableWarning
								className="w-full p-2 border rounded"
								onBlur={(e) => handleCommentEdit(comment.id, e.currentTarget.textContent || '')}
								dangerouslySetInnerHTML={{ __html: comment.text }}
							/>
						</div>
					);
				})}
				<div className="mt-2">
					{!showReplyForm ? (
						<button
							className="text-blue-500 hover:text-blue-700 font-semibold text-sm select-none"
							onClick={() => setShowReplyForm(true)}
						>
							Reply
						</button>
					) : (
						<form onSubmit={handleReplySubmit}>
							<textarea
								ref={replyInputRef}
								className="w-full p-2 border rounded"
								placeholder="Add a reply..."
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										e.currentTarget.form?.requestSubmit();
									}
								}}
							/>
							<div className="flex justify-end mt-2">
								<button
									type="button"
									className="text-gray-500 hover:text-gray-700 font-semibold text-sm select-none mr-2"
									onClick={() => setShowReplyForm(false)}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="text-blue-500 hover:text-blue-700 font-semibold text-sm select-none"
								>
									Save
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};