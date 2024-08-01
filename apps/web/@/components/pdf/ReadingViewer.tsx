import React, { useRef, useState, useMemo, Suspense, useCallback, useEffect } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { RenderHighlightContentProps, RenderHighlightsProps, RenderHighlightTargetProps } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import FloatingProfiles from "@/components/pdf/FloatingProfiles";

import { useAskHighlight } from "@src/context/ask-highlight-context";
import { AnnotatedPdfWithProfile, HighlightWithRelations, UserProfile } from "@src/lib/types";
import { clientApi } from "@src/trpc/react";
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import { PanelGroup } from 'react-resizable-panels';
import { LastSelectedArea } from '@/components/pdf/types';
import { renderHighlightContent, renderHighlightTarget, renderHighlights } from './Highlights';
import { NewHighlightWithRelationsInput } from '@src/server/api/routers/highlight';
import styles from './PDFAnnotator.module.css';
import highlightsStyle from './Highlights.module.css';
import { EditIcon, ReplyIcon, ShareIcon, TrashIcon } from '@/components/pdf/CustomIcons';
import { toast } from '../ui/use-toast';
import { ToastAction } from '../ui/toast';
const highlightPlugin = require("./highlight.js").highlightPlugin;
const selectionDelay = 200;

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
	const lastSelectedRef = useRef<LastSelectedArea | null>(null);
	const [isSelecting, setIsSelecting] = useState(false);
	const [annotationsWithHiddenComments, setCollapsedHighlights] = useState<Set<string>>(new Set());

	const [activeHighlight, setActiveHighlight] = useState<HighlightWithRelations | null>(null);



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



	const editHighlightMutation = clientApi.highlight.updateHighlight.useMutation({
		onMutate: async (newData) => {
			await utils.annotatedPdf.fetchAnnotatedPdf.cancel({ userId: loggedInUserId, source: loadedSource });
			utils.annotatedPdf.fetchAnnotatedPdf.setData({ userId: loggedInUserId, source: loadedSource }, oldData => oldData);
		},
		onSuccess: () => utils.annotatedPdf.fetchAnnotatedPdf.invalidate({ userId: loggedInUserId, source: loadedSource }),
	});


	const editHighlightCommentMutation = clientApi.comment.upsertComment.useMutation({
		onMutate: async (res) => {
			await utils.annotatedPdf.fetchAnnotatedPdf.cancel({ userId: loggedInUserId, source: loadedSource });
			utils.annotatedPdf.fetchAnnotatedPdf.setData({ userId: loggedInUserId, source: loadedSource }, oldData => oldData);
		},
		onSuccess: () => {
			utils.annotatedPdf.fetchAnnotatedPdf.invalidate({ userId: loggedInUserId, source: loadedSource })
		},
	});


	const deleteHighlightCommentMutation = clientApi.comment.deleteComment.useMutation({
		onMutate: async (res) => {
			await utils.annotatedPdf.fetchAnnotatedPdf.cancel({ userId: loggedInUserId, source: loadedSource });
			utils.annotatedPdf.fetchAnnotatedPdf.setData({ userId: loggedInUserId, source: loadedSource }, oldData => oldData);
		},
		onSuccess: () => {
			utils.annotatedPdf.fetchAnnotatedPdf.invalidate({ userId: loggedInUserId, source: loadedSource })
		},
	});




	const highlights = clientApi.annotatedPdf.fetchAnnotatedPdf.useQuery({ userId: loggedInUserId, source: loadedSource }).data?.highlights || loggedInUserHighlights;

	const deleteHighlight = (highlightId: string) => deleteHighlightMutation.mutate({ highlightId });
	const upsertCommentToExistingHighlight = async ({ id, highlightId, text }: { id?: string; highlightId: string; text: string }) =>
		editHighlightCommentMutation.mutate({ id, highlightId, text, userId: loggedInUserId });
	const resetHighlights = () => annotatedPdfResetHighlightsMutation.mutate({ id: annotatedPdfId });


	const addHighlight = (props: RenderHighlightContentProps) => {
		// Keep the selected text highlighted? 

		const highlightDraft: NewHighlightWithRelationsInput = {
			annotatedPdfId,
			highlightAreas: props.highlightAreas,
			quote: props.selectedText,
		};
		createAskHighlight(highlightDraft);

		props.cancel();
		// Don't double highlight when saving highlight

		lastSelectedRef.current = null;

	}

	const commentInputRef = useRef<HTMLTextAreaElement>(null);
	const popupInputRef = useRef<HTMLTextAreaElement | null>(null);


	const _focusCommentInput = useCallback(() => {
		if (commentInputRef.current) {
			commentInputRef.current.focus();
		} else {
			setTimeout(focusCommentInput, 100);
		}
	}, []);
	const focusCommentInput = useCallback(() => {
		setTimeout(_focusCommentInput, 100);
	}, [_focusCommentInput]);

	// do the same focus but for input ref
	const _focusPopupInput = useCallback(() => {
		if (popupInputRef.current) {
			popupInputRef.current.focus();
		} else {
			setTimeout(focusCommentInput, 100);
		}
	}, []);
	const focusPopupInput = useCallback(() => {
		setTimeout(_focusPopupInput, 100);
	}, [_focusPopupInput]);


	const scrollAndFlashHighlight = (elementId: string) => {
		setTimeout(() => {
			const element = document.getElementById(elementId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				element.classList.add(styles.flash);
				focusCommentInput()
				setTimeout(() => {
					element.classList.remove(styles.flash);
				}, 2000); // Remove the flash class after 1 second
			}
		}, 100);
	};

	const openHighlight = useCallback((highlight: HighlightWithRelations) => {
		setActiveHighlight(highlight);
		scrollAndFlashHighlight(`sidebar-highlight-${highlight.id}`);
	}, []);



	const toggleCollapseHighlight = useCallback((highlight: HighlightWithRelations) => {
		setCollapsedHighlights(prev => {
			const newSet = new Set(prev);
			if (newSet.has(highlight.id)) {
				newSet.delete(highlight.id);
			} else {
				newSet.add(highlight.id);
			}
			return newSet;
		});

		openHighlight(highlight)
	}, []);

	const addComment = async (props: RenderHighlightContentProps, text: string) => {

		// Keep the selected text highlighted? 
		const highlightDraft: NewHighlightWithRelationsInput = {
			annotatedPdfId,
			highlightAreas: props.highlightAreas,
			quote: props.selectedText,
			comments: [{
				userId: loggedInUserId,
				timestamp: new Date(),
				text
			}]
		};
		await createAskHighlight(highlightDraft);
		props.cancel();
		lastSelectedRef.current = null;

	}

	const highlightPluginInstance = highlightPlugin({
		renderHighlightTarget: (props: RenderHighlightTargetProps) => {
			lastSelectedRef.current = { highlightAreas: props.highlightAreas, selectedText: props.selectedText };
			return renderHighlightTarget({
				...props,
				annotatedPdfId: '',
				popupInputRef,
				lastSelectedRef,
				addHighlight,
				addComment,
				focusPopupInput
			});
		},
		renderHighlightContent: (props: RenderHighlightContentProps) => {
			return renderHighlightContent({ ...props, addHighlight, popupInputRef, lastSelectedRef, addComment, setActiveHighlight, setCollapsedHighlights })
		},
		renderHighlights: (props: RenderHighlightsProps) => {
			return renderHighlights({
				...props, displayedHighlights: highlights, lastSelectedRef, openHighlight, deleteHighlight, loggedInUserId, addComment, activeHighlight, isSelecting, editHighlight: (highlightId: string, text: string) => {
					editHighlightMutation.mutate({ highlightId, text });
				}, upsertCommentToExistingHighlight: (highlightId: string, text: string, commentId?: string) => {
					upsertCommentToExistingHighlight({ highlightId, text, id: commentId });
				}, userProfiles
			})
		},

	});
	const { jumpToHighlightArea } = highlightPluginInstance;

	const pdfBytesMemoized = useMemo(() => new Uint8Array(pdfBytes), [pdfBytes]);


	const exportHighlights = () => {
		const formattedHighlights = highlights
			.map(({ quote, comments, highlightAreas }) =>
				`> ${quote}\n\n${comments.map(c => `- ${c.text}`).join('\n')}\n\n*Page ${(highlightAreas[0]?.pageIndex ?? -1) + 1}*\n`
			)
			.join('\n---\n\n');

		navigator.clipboard.writeText(formattedHighlights)
			.then(() => toast({ title: "Copied highlights to clipboard" }))
			.catch(err => {
				console.error('Could not copy text:', err);
				toast({
					title: "Failed to copy highlights",
					description: "See console for details",
					action: <ToastAction altText="Try again">Try again</ToastAction>,
				});
			});
	};


	const handleReplyHighlight = useCallback((highlight: HighlightWithRelations) => {
		console.log('handleReplyHighlight', highlight);
		setCollapsedHighlights(prev => {
			const newSet = new Set(prev);
			newSet.add(highlight.id);
			return newSet;
		});
		openHighlight(highlight)
	}, []);
	const handleShareHighlight = useCallback((highlightId: string) => {

		window.location.hash = `highlight-${highlightId}`;
		// copy to clipboard 

		const currentUrl = window.location.href;
		navigator.clipboard.writeText(currentUrl).then(() => {
			alert('Link copied to clipboard: ' + currentUrl);
		}).catch(err => {
			console.error('Failed to copy link to clipboard:', err);
		});


		console.log('handleShareHighlight', highlightId);
	}, []);



	const handleReplyComment = useCallback((highlight: HighlightWithRelations) => {
		console.log('handleReplyComment', highlight);
		// TODO: handle nested comments
		setCollapsedHighlights(prev => {
			const newSet = new Set(prev);
			newSet.add(highlight.id);
			return newSet;
		});
		openHighlight(highlight)
	}, []);
	const handleShareComment = useCallback((highlightId: string) => {
		window.location.hash = `highlight-${highlightId}`;
		const currentUrl = window.location.href;
		navigator.clipboard.writeText(currentUrl).then(() => {
			alert('Link copied to clipboard: ' + currentUrl);
		}).catch(err => {
			console.error('Failed to copy link to clipboard:', err);
		});
	}, []);




	const renderHighlightComments = useCallback((note: HighlightWithRelations) => {
		const showComments = annotationsWithHiddenComments.has(note.id);


		return (
			<div className={styles.commentSection}>
				{showComments && note.comments && note.comments.map((comment) => (
					<div key={comment.id} className={styles.comment}>
						<div className={styles.commentHeader}>
							<span>{comment.userId || 'Anonymous'}</span>
							<span>{new Date(comment.timestamp).toLocaleString()}</span>
						</div>
						<div
							className={styles.commentText}
							contentEditable
							suppressContentEditableWarning
							onBlur={(e) => upsertCommentToExistingHighlight({ highlightId: note.id, text: e.currentTarget.textContent || '', id: comment.id })}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									e.currentTarget.blur();
								}
							}}
						>
							{comment.text}
						</div>
						<div className={styles.commentFooter}>
							<button
								className={`${styles.commentButton} ${styles.deleteButton}`}
								onClick={() => {
									deleteHighlightCommentMutation.mutate({ commentId: comment.id });
								}}
							>
								<TrashIcon className={styles.icon} />
							</button>
							<button
								className={`${styles.commentButton} ${styles.replyButton}`}
								onClick={() => {
									handleReplyComment(note);
								}}
							>
								<ReplyIcon className={styles.icon} />
							</button>
							<button
								className={`${styles.commentButton} ${styles.shareButton}`}
								onClick={() => {
									handleShareComment(note.id);
								}}
							>
								<ShareIcon className={styles.icon} />
							</button>
						</div>
					</div>
				))}
			</div>
		);
	}, [annotationsWithHiddenComments, upsertCommentToExistingHighlight, handleReplyComment, handleShareComment]);
	const renderHighlightSidebar = useCallback(() => {
		return (
			<div className={styles.sidebar}>
				{highlights.length === 0 && <div className={styles.emptyMessage}>There is no note</div>}
				{highlights.map((note) => (
					<div
						id={`sidebar-highlight-${note.id}`}
						key={note.id}
						className={`${note.id === activeHighlight?.id ? styles.activeNoteItem : styles.noteItem}`}
						onMouseEnter={(e) => {
							e.preventDefault();

							if (note.id === activeHighlight?.id) return;
							const pdfHighlight = document.getElementById(`pdf-highlight-${note.id}`);
							if (pdfHighlight) {
								const userHighlights = pdfHighlight.getElementsByClassName(highlightsStyle.userHighlight);
								for (let i = 0; i < userHighlights.length; i++) {
									(userHighlights[i] as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.4)';
								}
							}

							const highlightNote = document.getElementById(`highlight-note-${note.id}`);
							if (highlightNote) {
								highlightNote.style.backgroundColor = 'rgba(255, 253, 208, 1)';
								highlightNote.style.zIndex = '2000';
							}
						}}
						onMouseLeave={(e) => {
							e.preventDefault();
							if (note.id === activeHighlight?.id) return;
							const pdfHighlight = document.getElementById(`pdf-highlight-${note.id}`);
							if (pdfHighlight) {
								const userHighlights = pdfHighlight.getElementsByClassName(highlightsStyle.userHighlight);
								for (let i = 0; i < userHighlights.length; i++) {
									(userHighlights[i] as HTMLElement).style.backgroundColor = 'rgba(250, 204, 21, 0.4)';
								}
							}
							const highlightNote = document.getElementById(`highlight-note-${note.id}`);
							if (highlightNote) {
								highlightNote.style.backgroundColor = 'white';
								highlightNote.style.zIndex = '1';
							}


						}}
					>
						<div
							className={styles.noteContent}
							contentEditable
							suppressContentEditableWarning
							onBlur={(e) => editHighlightMutation.mutate({ highlightId: note.id, text: e.currentTarget.textContent || '' })}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									e.currentTarget.blur();
								}
							}}
							onClick={(e) => {
								// Open the highlight on single click
								note.highlightAreas[0] && jumpToHighlightArea(note.highlightAreas[0]);
							}}
							onDoubleClick={(e) => {
								// Prevent opening the highlight when starting to edit
								e.stopPropagation();
								e.currentTarget.focus();
							}}
						>
							{note.quote}
						</div>

						<div className={styles.highlightFooter}>
							<button
								className={`${styles.commentButton} ${styles.deleteButton}`}
								onClick={(e) => {
									e.stopPropagation();
									deleteHighlight(note.id);
								}}
							>
								<TrashIcon className={styles.icon} />
							</button>
							<button
								className={`${styles.commentButton} ${styles.replyButton}`}
								onClick={(e) => {
									e.stopPropagation();
									handleReplyHighlight(note);
								}}
							>
								<ReplyIcon className={styles.icon} />
							</button>
							<button
								className={`${styles.commentButton} ${styles.shareButton}`}
								onClick={(e) => {
									e.stopPropagation();
									handleShareHighlight(note.id);
								}}
							>
								<ShareIcon className={styles.icon} />
							</button>
						</div>
						<button
							className={styles.collapseButton}
							onClick={() => toggleCollapseHighlight(note)}
						>
							{note.comments.length === 0 ? null : (annotationsWithHiddenComments.has(note.id) ? `Hide ${note.comments.length} Replies` : `See ${note.comments.length} Replies`)}
						</button>
						{renderHighlightComments(note)}
						{activeHighlight && activeHighlight.id === note.id && (

							<div>
								<form onSubmit={(e) => {
									e.preventDefault();
									upsertCommentToExistingHighlight({ highlightId: note.id, text: commentInputRef.current?.value ?? '' })
									if (commentInputRef.current) {
										commentInputRef.current.value = '';
									}
								}}>
									<textarea
										ref={commentInputRef}
										className={styles.commentInput}
										placeholder="Add a comment..."
										onKeyDown={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												e.currentTarget.form?.requestSubmit();
											}
										}}
									/>
									<div className={styles.commentActions}>
										<button
											type="submit"
											className={`${styles.actionButton} ${styles.saveButton}`}
										>
											Save
										</button>
									</div>
								</form>
							</div>
						)}

					</div>
				))}
				{highlights.length > 0 && (
					<div className="p-4 space-y-2">
						<button

							onClick={resetHighlights}
							className="w-full"
						>
							Reset highlights
						</button>
						<button

							onClick={exportHighlights}
							className="w-full"
						>
							Export highlights to clipboard
						</button>
					</div>
				)}
			</div>
		)
	}, [highlights, renderHighlightComments, activeHighlight]);


	const selectionTimeout = useRef<NodeJS.Timeout | null>(null);

	const handleSelectionStart = () => {
		selectionTimeout.current = setTimeout(() => {
			setIsSelecting(true);
		}, selectionDelay); // Adjust the delay as needed to discern click from text selection
	};

	const handleSelectionEnd = () => {
		if (selectionTimeout.current) {
			clearTimeout(selectionTimeout.current);
		}

		if (isSelecting) {
			setIsSelecting(false);
		}
	};



	const [scrolledToHashOnLoad, setScrolledToHashOnLoad] = useState(false);
	useEffect(() => {
		const handleHashChange = () => {
			console.log('calling this thing')
			if (scrolledToHashOnLoad) return;
			console.log('calling this thing again')
			if (window.location.hash.startsWith('#highlight-')) {
				const highlightId = window.location.hash.substring(11); // Remove '#highlight-'
				setTimeout(() => {
					const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`);
					console.log('highlightElement', highlightElement, 'highlightId', highlightId);
					if (highlightElement) {
						const highlight = highlights.find(h => h.id === highlightId);
						if (highlight) {
							jumpToHighlightArea(highlight.highlightAreas[0]);
							openHighlight(highlight);
							setScrolledToHashOnLoad(true);
						}
					}
				}, 1000); // Wait for 1 second before searching for the element
			}

		};

		// Call once on mount to handle initial URL
		handleHashChange();

		// Add event listener for hash changes
		window.addEventListener('hashchange', handleHashChange);

		// Cleanup
		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	}, [highlights, openHighlight, scrolledToHashOnLoad]);




	return (
		<div>
			<FloatingProfiles setDisplayHighlights={setSelectedHighlights} allHighlightsWithProfile={annotatedPdfsWithProfile} />
			<PanelGroup className="w-full" direction="horizontal">
				<Suspense fallback={<div>Loading PDF...</div>}>
					<ResizablePanel style={{ height: "100vh", overflow: "auto" }} collapsible>
						{renderHighlightSidebar()}
					</ResizablePanel>
					<ResizableHandle withHandle handleClassName="bg-[#B2B2B2]" />
					<ResizablePanel className="relative" defaultSize={80} style={{ height: "100vh", overflow: "auto" }} collapsible>
						<div className={styles.viewerContainer} onMouseDown={handleSelectionStart}
							onMouseUp={handleSelectionEnd}
							onMouseLeave={handleSelectionEnd}>

							<Viewer fileUrl={pdfBytesMemoized.length > 0 ? pdfBytesMemoized : loadedSource} plugins={[highlightPluginInstance]} />
						</div>
					</ResizablePanel>
				</Suspense>
			</PanelGroup>
		</div>
	);
};

export default ReadingViewer;