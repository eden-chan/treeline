import { useState, Fragment } from 'react';
import {
    highlightPlugin,
    HighlightArea,
    MessageIcon,
    RenderHighlightContentProps,
    RenderHighlightsProps,
    RenderHighlightTargetProps,
} from '@react-pdf-viewer/highlight';
import { Button, Position, PrimaryButton, Tooltip, Viewer } from '@react-pdf-viewer/core';
import { useAskHighlight } from "@src/context/ask-highlight-context";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { NewHighlightWithRelationsInput } from '@src/server/api/routers/highlight';
import { Highlight } from "@prisma/client";
import { AnnotatedPdfWithProfile } from "@src/lib/types";
import { Sidebar } from '@/components/pdf/Sidebar';
import { trpc } from "@src/utils/api";
import { clientApi } from "@src/trpc/react";
import { v4 as uuidv4 } from "uuid";
import { Forest } from '@/components/pdf/Forest';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import FloatingProfiles from '@/components/pdf/FloatingProfiles';
import { ReactFlowProvider } from 'reactflow';

type DisplayNotesSidebarExampleProps = {
    annotatedPdfId: string;
    loadedSource: string;
    userId: string;
    userHighlights: Highlight[];
    annotatedPdfsWithProfile: AnnotatedPdfWithProfile[];
};

type Note = {
    id: number;
    content: string;
    highlightAreas: HighlightArea[];
    quote: string;
};

const ReadingViewer: React.FC<DisplayNotesSidebarExampleProps> = ({ loadedSource, userHighlights, userId, annotatedPdfId, annotatedPdfsWithProfile }) => {
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [friendHighlights, setFriendHighlights] = useState<Highlight[]>([]);

    const {
        currentHighlight,
        selectHighlight,
        createAskHighlight,
        clearSelectedHighlight,
    } = useAskHighlight();
    let noteId = notes.length;

    const utils = clientApi.useUtils();

    const annotatedPdfMutation =
        clientApi.annotatedPdf.resetHighlights.useMutation({
            onMutate: async () => {
                await utils.annotatedPdf.fetchAnnotatedPdf.cancel({
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
                        return {
                            ...oldData,
                            highlights: [],
                        };
                    },
                );
            },
            onSuccess: (input) => {
                utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
                    userId: userId,
                    source: loadedSource,
                });
            },
        });

    const highlightMutation = clientApi.highlight.createHighlight.useMutation({
        onMutate: async (newData) => {
            await utils.annotatedPdf.fetchAnnotatedPdf.cancel({
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
                    const highlightId = uuidv4();
                    const newNode = newData?.highlight?.node
                        ? {
                            ...newData.highlight.node,
                            id: uuidv4(),
                            parentId: null,
                            highlightId: highlightId,
                            children: [],
                            comments: []  // Ensure this property is included
                        }
                        : null;
                    const newHighlight = {
                        ...newData.highlight,
                        id: highlightId,
                        node: newNode,
                        annotatedPdfId: annotatedPdfId,
                    };

                    return {
                        ...oldData,
                        highlights: [...oldData.highlights, newHighlight],
                    };
                },
            );
        },
        onSuccess: (input) => {
            utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
                userId: userId,
                source: loadedSource,
            });
        },
    });

    const highlights =
        clientApi.annotatedPdf.fetchAnnotatedPdf.useQuery({
            userId: userId,
            source: loadedSource,
        }).data?.highlights || userHighlights;

    const getHighlightById = (id: string) => {
        return highlights.find((highlight) => highlight.id === id);
    };

    const resetHighlights = () => {
        annotatedPdfMutation.mutate({
            id: annotatedPdfId,
        });
    };

    const noteEles: Map<number, HTMLElement> = new Map();

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                zIndex: 1,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={props.toggle}>
                        <MessageIcon />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            if (message !== '') {
                const note: Note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                };
                setNotes(notes.concat([note]));

                const extendedNote: NewHighlightWithRelationsInput = {
                    ...note,
                    annotatedPdfId, // Placeholder or dynamic value as needed
                    id_: noteId, // Placeholder or dynamic value as needed
                    type: 'COMMENT',
                    node: {
                        prompt: message,
                        response: null,
                        timestamp: new Date(),
                        comments: [],
                    },
                };
                createAskHighlight(extendedNote);
                props.cancel();
            }
        };

        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };

    const jumpToNote = (note: Note) => {
        if (noteEles.has(note.id)) {
            // noteEles.get(note.id).scrollIntoView();
        }
        console.log('jumptoNote', note)
    };

    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
            {highlights.map((note) => (
                <Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'yellow',
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                            // onClick={() => jumpToNote(note)}
                            // ref={(ref): void => {
                            //     noteEles.set(note.id, ref as HTMLElement);
                            // }}
                            />
                        ))}
                </Fragment>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlightTarget,
        renderHighlightContent,
        renderHighlights,
    });

    const { jumpToHighlightArea } = highlightPluginInstance;

    return (<div>
        <FloatingProfiles
            setDisplayHighlights={setFriendHighlights}
            allHighlightsWithProfile={annotatedPdfsWithProfile}
        />

        <ResizablePanelGroup className="w-full" direction="horizontal">
            <ResizablePanel className="relative" defaultSize={70} style={{ height: '100vh', overflow: 'auto' }}>
                <Viewer fileUrl={loadedSource} plugins={[highlightPluginInstance]} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel style={{ height: '100vh', overflow: 'auto' }}>
                {currentHighlight?.node ? (
                    <ReactFlowProvider>
                        <Forest
                            node={currentHighlight.node}
                            returnHome={() => {
                                document.location.hash = "";
                                clearSelectedHighlight();
                            }}
                        />
                    </ReactFlowProvider>
                ) : (
                    <div style={{ height: '100%', overflow: 'auto' }}>
                        <Sidebar
                            highlights={highlights ?? []}
                            resetHighlights={resetHighlights}
                            jumpToHighlightArea={jumpToHighlightArea}
                        />
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>)
};

export default ReadingViewer;
