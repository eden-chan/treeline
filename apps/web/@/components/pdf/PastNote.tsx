import { useEffect, useMemo, useRef, useState } from "react";
import { CircleArrowUp, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { HighlightWithRelations, UserProfile } from "@src/lib/types";
import { HighlightCommentTextarea } from './HighlightCommentTextArea';
import { calculateTimeAgo } from '@src/lib/utils';


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
	userProfiles: UserProfile[];
};

export const PastNote = ({
	highlight,
	rightmostArea,
	middleHeight,
	editHighlight,
	deleteHighlight,
	userId, userProfiles

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
			await editHighlight(updatedComment)
		}
	};

	const handleUpdateFirstCommentKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

		if (!showReplyTextarea && e.key === "Enter" && (e.shiftKey || e.altKey)) {
			e.preventDefault();
			handleUpdateFirstComment()
		}
	};
	const handleReply = async (text: string | undefined) => {
		if (text) {
			const newComment = createNewComment(text, undefined);
			await editHighlight(newComment)
		}
	};


	const handleUpdateCommentReplyKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (showReplyTextarea && e.key === "Enter" && (e.shiftKey || e.altKey)) {
			e.preventDefault();
			await handleReply(replyInputRef.current?.value);
		}
	};

	const handleUpdateCommentSubmit = async () => {
		await handleReply(replyInputRef.current?.value);
	};


	const firstCommentTimestamp = highlight.comments?.[0]?.timestamp;
	const memoizedTimeAgo = useMemo(() => firstCommentTimestamp ? calculateTimeAgo(firstCommentTimestamp) : '', [firstCommentTimestamp]);
	const [isReplyDrafted, setIsReplyDrafted] = useState(false);
	const isFirstCommentEditable = highlight.comments.length === 0

	const userProfile = userProfiles.find(user => user.email === highlight?.comments?.[0]?.userId ?? '')



	const listboxRef = useRef<HTMLUListElement>(null);

	function getCaretPosition() {
		if (!inputRef.current) return { x: 0, y: 0 };



		const inputElement = inputRef.current;
		// Create a temporary span element
		const tempSpan = document.createElement('span');
		tempSpan.textContent = inputElement.value.substring(0, inputElement.selectionStart);

		// Insert the temporary span just before the caret
		inputElement.parentNode?.insertBefore(tempSpan, inputElement.nextSibling);

		// Calculate the position of the temporary span
		const tempRect = tempSpan.getBoundingClientRect();
		const inputRect = inputElement.getBoundingClientRect();

		// Remove the temporary span
		tempSpan.remove();

		// Return the calculated position
		return {
			x: inputRect.left + (tempRect.width / 2),
			y: inputRect.top + (tempRect.height / 2)
		};
	}


	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value;
		const selectionStart = event.target.selectionStart;
		const textarea = event.target;

		console.log({ event })

		const mostRecentAtIndex = value.lastIndexOf('@', selectionStart - 1);

		if (mostRecentAtIndex !== -1) {
			const caretPosition = getCaretPosition();

			if (listboxRef.current) {

				const parentElement = parentRef.current;
				const parentRect = parentElement?.getBoundingClientRect();
				const parentOffset = {
					left: parentRect?.left || 0,
					top: parentRect?.top || 0,
				};

				console.log(`Caret Position X: ${caretPosition.x}, Parent Offset Left: ${parentOffset.left}`);
				const leftPosition = `${(caretPosition.x - parentOffset.left) * 1.1}px`;
				const topPosition = `${textarea.scrollHeight}px`;

				const listboxWidth = listboxRef.current.clientWidth;
				console.log(`listboxRef current width: ${listboxWidth}px`);
				console.log(`textarea width: ${200}px`);
				const parsedLeftPosition = `${(parseFloat(leftPosition) % (152))}px`;

				listboxRef.current.style.left = parsedLeftPosition;
				listboxRef.current.style.top = topPosition;

				listboxRef.current.style.visibility = 'visible'
			}
		}
		// Perform any additional logic here, such as filtering suggestions based on the entered value
	};

	const handleOptionClick = (optionId: string) => {

		const selectedUserProfile = userProfiles.find(user => user.email === optionId);
		if (selectedUserProfile && inputRef.current && listboxRef.current) {
			const currentValue = inputRef.current.value;
			const atIndex = currentValue.lastIndexOf('@', inputRef.current.selectionStart - 1);
			const newValue = `${currentValue.substring(0, atIndex + 1)}${selectedUserProfile.firstName} ${selectedUserProfile.lastName} `;
			inputRef.current.value = newValue;
			console.log(atIndex)
			// listboxRef.current.style.visibility = 'hidden'
		}
		// Perform any additional logic here, such as updating the textarea value or triggering an action
	};
	const parentRef = useRef<HTMLDivElement>(null);
	return (
		<span
			className="absolute text-xs w-[20px] group z-20 "
			style={{
				left: `${90}%`,
				top: `${middleHeight ?? rightmostArea.top}%`,
				transform: "translate(8px, -50%)",
			}}
		>
			<div ref={parentRef} onMouseLeave={() => { if (listboxRef.current) listboxRef.current.style.visibility = 'hidden' }} className="relative group-hover:w-[200px] pt-10 pb-20 pl-5">
				<span className="flex items-center">
					<span className="select-none font-bold text-blue-500 inline hover:bg-blue-500 rounded-full hover:bg-opacity-20 transition duration-300 ease-in-out">⁂</span>
					<div className="invisible group-hover:visible flex items-center bg-white">
						<button
							className="text-blue-500 hover:text-blue-700 p-0.5 rounded select-none ml-2"
							onClick={handleTrash}
						>
							<Trash2 className="cursor-pointer" size={16} />
						</button>
						{highlight.comments.length > 0 && (
							<span className="text-xs ml-1 select-none self-end">{userProfile?.firstName} {userProfile?.lastName} {memoizedTimeAgo} </span>
						)}
					</div>
				</span>
				<div className="invisible group-hover:visible group-hover:z-30 absolute w-full bg-white z-50  ">
					<div>
						<Textarea
							ref={inputRef}
							placeholder="Comment or share with @"
							disabled={!isFirstCommentEditable}
							onKeyDown={handleUpdateFirstCommentKeyDown}
							onChange={handleInputChange}
							role="combobox"
							aria-controls="suggestions"
							aria-autocomplete="list"
							className="w-full"
						/>
						{(
							<ul
								id="suggestions"
								ref={listboxRef}
								role="listbox"
								aria-label="Suggestions"
								className="invisible absolute z-30 bg-white border border-gray-300 rounded-md w-[200px]"
							>
								{userProfiles.map((userProfile) => (
									<li
										key={userProfile.email}
										role="option"
										className={`px-2 py-1 h-[20px] text-xs cursor-pointer hover:bg-gray-200`}
										onClick={() => handleOptionClick(userProfile.email)}
									>
										{userProfile.firstName} {userProfile.lastName}
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="pl-5">
						{highlight.comments.slice(1).map((comment, index) => {
							const userProfile = userProfiles.find(user => user.email === comment.userId)
							const timeAgo = calculateTimeAgo(comment.timestamp)
							return (
								<HighlightCommentTextarea
									userProfile={userProfile}
									key={index}
									value={comment.text}
									timeAgo={timeAgo}
									disabled
								/>
							)
						})}
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