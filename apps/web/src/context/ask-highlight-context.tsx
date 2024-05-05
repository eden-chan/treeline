"use client";
import React, {
	FC,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useChat, Message } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";

import { Highlight, ParsedPapers } from "@prisma/client";
import { clientApi } from "@src/trpc/react";
import { FOLLOW_UP_PROMPT, generateSystemPrompt } from "@src/utils/prompts";
import { NewHighlightWithRelationsInput } from "@src/server/api/routers/highlight";
import { getParsedPaperAction } from "@src/app/actions";
import {
	CurriculumNodeWithRelations,
	HighlightWithRelations,
} from "@src/lib/types";
import { getNodeById } from "@src/utils/curriculum";

export type ContextProps = {
	currentHighlight: HighlightWithRelations | null;
	setCurrentHighlight: (
		highlight: Highlight | null,
		forceRerender?: boolean,
	) => void;
	createAskHighlight: (
		highlight: NewHighlightWithRelationsInput,
	) => Promise<Highlight | undefined>;
	clearSelectedHighlight: () => void;
	selectHighlight: (h: HighlightWithRelations) => void;
	generateFollowUpResponse: (nodeId: string) => void;
} & ReturnType<typeof useChat>;

export const useAskHighlight = () => {
	return useContext(AskHighlightContext);
};

// @ts-ignore: too many default values for useChat to include
export const AskHighlightContext = React.createContext<ContextProps>({
	currentHighlight: null,
	setCurrentHighlight: () => null,
});

export const AskHighlightProvider: FC<{
	annotatedPdfId: string;
	userId: string;
	loadedSource: string;
	children: ReactNode;
	parsedPaper: ParsedPapers | null;
}> = ({ annotatedPdfId, userId, loadedSource, children, parsedPaper }) => {
	const [_, setForceRerender] = useState<Boolean>(false);
	// Refs are required so that their values are not cached in callback functions
	const currentHighlightRef = useRef<HighlightWithRelations | null>(null);
	const currentNodeRef = useRef<CurriculumNodeWithRelations | null>(null);
	const setCurrentHighlight = (
		highlight: HighlightWithRelations | null,
		forceRerender = true,
	) => {
		if (forceRerender) {
			// Necessary for useMemo/useCallback to execute
			currentHighlightRef.current = cloneDeep(highlight);
			if (currentNodeRef.current) {
				currentNodeRef.current =
					getNodeById(
						currentNodeRef.current.id,
						currentHighlightRef.current?.node,
					) ?? null;
			}
			setForceRerender((prev) => !prev);
		} else {
			currentHighlightRef.current = highlight;
		}
	};
	const setChildrenInNode = (
		children: CurriculumNodeWithRelations[],
		forceRerender = true,
	) => {
		if (!currentNodeRef.current) return;
		currentNodeRef.current.children = children;
		if (forceRerender) {
			currentHighlightRef.current = cloneDeep(currentHighlightRef.current);
			if (currentNodeRef.current) {
				currentNodeRef.current =
					getNodeById(
						currentNodeRef.current.id,
						currentHighlightRef.current?.node,
					) ?? null;
			}
			setForceRerender((prev) => !prev);
		}
	};

	const isGeneratingFollowUpsRef = useRef<Boolean>(false);

	const onFinishChatResponse = (message: Message) => {
		// Update DB once entire response is received
		if (!currentHighlightRef.current) {
			console.debug("No current highlight reference found.");
			return;
		}

		if (!currentHighlightRef.current.node) {
			console.debug("No current highlight node found.");
			return;
		}

		/**
		 * Case 1: Finished generating the response to the question being asked
		 * Case 2: Finished generating the response to a follow up node
		 * Case 2: Finished generating followup questions for the previous response
		 */
		if (!isGeneratingFollowUpsRef.current && !currentNodeRef.current) {
			const newHighlight = {
				...currentHighlightRef.current,
				node: {
					...currentHighlightRef.current.node,
					response: message.content,
				},
			};

			setCurrentHighlight(newHighlight, false);

			updateCurriculumNodeMutation.mutate({
				curriculumNode: newHighlight.node,
			});

			currentNodeRef.current = newHighlight.node;

			// Timeout is required since useChat may cause a socket connection error if opening a new connection with append as the old connection is closing
			setTimeout(() => {
				append({
					role: "user",
					content: FOLLOW_UP_PROMPT,
					createdAt: new Date(),
				});
				isGeneratingFollowUpsRef.current = true;
			}, 500);
		} else if (!isGeneratingFollowUpsRef.current && currentNodeRef.current) {
			currentNodeRef.current.response = message.content;

			updateCurriculumNodeMutation.mutate({
				curriculumNode: currentNodeRef.current,
			});

			// Timeout is required since useChat may cause a socket connection error if opening a new connection with append as the old connection is closing
			setTimeout(() => {
				append({
					role: "user",
					content: FOLLOW_UP_PROMPT,
					createdAt: new Date(),
				});
				isGeneratingFollowUpsRef.current = true;
			}, 500);
		} else if (isGeneratingFollowUpsRef.current && currentNodeRef.current) {
			const newPrompts = [...message.content.split("\n")];
			const newChildren = newPrompts.map((prompt) => {
				return {
					id: uuidv4(),
					parentId: currentNodeRef.current?.id ?? null,
					highlightId: null,
					comments: [],
					prompt,
					response: "",
					children: [],
					timestamp: new Date(),
				};
			});
			const newNode = {
				...currentNodeRef.current,
				children: newChildren,
			};

			updateCurriculumNodeMutation.mutate({
				curriculumNode: newNode,
			});

			setChildrenInNode(newChildren);
			isGeneratingFollowUpsRef.current = false;
		}
	};

	// #TODO: fetch paper text and field from db
	// fetch paper text and field from db
	const concatenatedText = useMemo(
		() => parsedPaper?.sections.map((section) => section.text).join(" "),
		[parsedPaper?.sections],
	);
	const systemPrompt = useMemo(
		() =>
			generateSystemPrompt(
				concatenatedText ?? "",
				parsedPaper?.primary_category ?? "",
			),
		[concatenatedText, parsedPaper?.primary_category],
	);
	const systemPromptId = useMemo(() => uuidv4(), []);
	const initialMessages: Message[] = [
		{
			id: systemPromptId,
			role: "system",
			content: systemPrompt,
		},
	];
	const { messages, setMessages, append, ...chat } = useChat({
		initialMessages,
		onFinish: onFinishChatResponse,
		onError: (error) => console.error("Error occured in useChat:", error),
	});

	const utils = clientApi.useUtils();
	// const updateHighlightMutation = clientApi.highlight.updateHighlight.useMutation();
	const createHighlightMutation =
		clientApi.highlight.createHighlight.useMutation({
			onMutate: async (newData) => {
				await utils.annotatedPdf.fetchAnnotatedPdf.cancel({
					userId: userId,
					source: loadedSource,
				});

				const previousData = utils.annotatedPdf.fetchAnnotatedPdf.getData({
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

						const highlightId = uuidv4(); // TODO: get the object ID
						const newNode = newData.highlight.node
							? {
								...newData.highlight.node,
								id: uuidv4(),
								parentId: null,
								highlightId,
								children: [],
								comments: [], // Add this line
							}
							: null;
						const newHighlight = {
							...newData.highlight,
							id: highlightId,
							node: newNode,
							annotatedPdfId,
						};

						return {
							...oldData,
							highlights: [newHighlight, ...oldData.highlights],
						};
					},
				);

				return { previousData };
			},
			onSuccess: (input) => {
				utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
					userId: userId,
					source: loadedSource,
				});

				// Todo: address potential race condition where onFinish callback for useChat executes before
				// setting the new id values
				if (!input?.node || !currentHighlightRef.current?.node) return;
				currentHighlightRef.current.id = input.id;
				currentHighlightRef.current.node.id = input.node.id;
				currentHighlightRef.current.node.highlightId = input.node.highlightId;
			},
		});
	const updateCurriculumNodeMutation =
		clientApi.curriculum.updateNode.useMutation({
			onSuccess: (input) => {
				// Invalidate annotatedPdf so highlights is updated
				utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
					userId: userId,
					source: loadedSource,
				});

				// Todo: address potential race condition where onFinish callback for useChat executes before
				// setting the new id values
				if (!input?.children || !currentNodeRef.current?.children) return;
				for (let child of input.children) {
					let pseudoChild = currentNodeRef.current.children.find(
						(c) => c.prompt === child.prompt,
					);
					if (!pseudoChild) return;

					pseudoChild.id = child.id;
				}
				// Used to cause a force rerender of the nodes in useMemo
				setCurrentHighlight(currentHighlightRef.current, true);
			},
		});

	const createAskHighlight = async (
		highlight: NewHighlightWithRelationsInput,
	): Promise<Highlight | undefined> => {
		if (!highlight.node?.prompt) return;

		const promptWithContext = `<question>${highlight.node.prompt}</question>
${highlight.content
				? `<context>
${highlight.content}
</context>`
				: ""
			}`;
		// Query AI for response
		append({
			role: "user",
			content: promptWithContext,
			createdAt: new Date(),
		});

		// Add node to DB
		createHighlightMutation.mutate({
			highlight,
		});

		const highlightId = uuidv4();
		const tempHighlight = {
			...highlight,
			id: highlightId,
			node: {
				...highlight.node,
				id: uuidv4(),
				highlightId,
				parentId: null,
				children: [],
			},
		};

		setCurrentHighlight(tempHighlight, false);

		return tempHighlight;
	};

	const generateFollowUpResponse = (nodeId: string) => {
		console.log("nodeId:", nodeId);
		const root = currentHighlightRef.current?.node;
		if (!root) return;

		const node = getNodeById(nodeId, root);
		if (!node || !node.prompt) return;

		currentNodeRef.current = node;

		append({
			role: "user",
			content: node.prompt,
			createdAt: new Date(),
		});
	};

	// Update the highlight as the AI response streams in
	// TODO: Update API so we don't rely on useEffect anymore. Just work off of callbacks once the response is done streaming
	useEffect(() => {
		if (isGeneratingFollowUpsRef.current) return;
		if (messages.length < 2 || !currentHighlightRef.current?.node?.prompt)
			return;
		if (messages[messages.length - 1]?.role === "user") return;

		const question = messages[messages.length - 2]?.content;
		const response = messages[messages.length - 1]?.content;

		if (!question || !response) return;

		// Case 1: Stream response for original highlighted question being asked
		// Case 2: Stream response for follow up node question being selected
		if (!currentNodeRef.current) {
			const newHighlight = {
				...currentHighlightRef.current,
				node: {
					...currentHighlightRef.current.node,
					response,
				},
			};

			setCurrentHighlight(newHighlight, false);
		} else {
			currentNodeRef.current.response = response;
			setCurrentHighlight(currentHighlightRef.current, true);
		}
	}, [messages, isGeneratingFollowUpsRef]);

	const selectHighlight = (highlight: HighlightWithRelations) => {
		setCurrentHighlight(highlight);
		if (highlight.node) {
			currentNodeRef.current = highlight.node;
		}
		// Todo: Construct message history
	};

	const clearSelectedHighlight = () => {
		setCurrentHighlight(null);
		currentNodeRef.current = null;
		isGeneratingFollowUpsRef.current = false;
	};

	const value = {
		currentHighlight: currentHighlightRef.current,
		setCurrentHighlight,
		messages,
		setMessages,
		createAskHighlight,
		selectHighlight,
		clearSelectedHighlight,
		generateFollowUpResponse,
		append,
		...chat,
	};

	return (
		<AskHighlightContext.Provider value={value}>
			{children}
		</AskHighlightContext.Provider>
	);
};
