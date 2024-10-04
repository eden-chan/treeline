import {
    HighlightArea,
    RenderHighlightContentProps,
    RenderHighlightTargetProps,
    RenderHighlightsProps
} from "@react-pdf-viewer/highlight";
import { MutableRefObject, useCallback } from "react";


import styles from './Highlights.module.css';
import sidebarStyles from './PDFAnnotator.module.css';

import { AnnotateIcon, HighlightIcon } from "@/components/pdf/CustomIcons";
import { Button, Position, PrimaryButton, Tooltip } from '@react-pdf-viewer/core';
import { LastSelectedArea } from '@/components/pdf/types';
import { HighlightWithRelations, UserProfile } from '@src/lib/types';
import { PastNote } from './PastNote';



type MyRenderHighlightTargetProps = {
    addHighlight: (props: RenderHighlightContentProps) => void;
    annotatedPdfId: string;
    popupInputRef: MutableRefObject<HTMLTextAreaElement | null>;
    lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
    addComment: (props: RenderHighlightContentProps, text: string) => void;
    focusPopupInput: () => void;

} & RenderHighlightTargetProps;


type MyRenderHighlightContentProps = {
    addHighlight: (props: RenderHighlightContentProps) => void;
    popupInputRef: MutableRefObject<HTMLTextAreaElement | null>;
    lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
    addComment: (props: RenderHighlightContentProps, text: string) => void;
    setActiveHighlight: (highlight: HighlightWithRelations | null) => void;
    setCollapsedHighlights: React.Dispatch<React.SetStateAction<Set<string>>>;
} & RenderHighlightContentProps;


type MyRenderHighlightsProps = {
    displayedHighlights: HighlightWithRelations[];
    openHighlight: (highlight: HighlightWithRelations) => void;
    deleteHighlight: (highlightId: string) => void;
    addComment: (props: RenderHighlightContentProps, text: string) => void;
    loggedInUserId: string;
    lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
    activeHighlight: HighlightWithRelations | null;
    isSelecting: boolean;
    editHighlight: (highlightId: string, text: string) => void;
    upsertCommentToExistingHighlight: (highlightId: string, text: string, commentId?: string) => void;
    userProfiles: UserProfile[];

} & RenderHighlightsProps;

export const renderHighlightContent = (props: MyRenderHighlightContentProps) => {

    const handleCommentSubmit = async () => {

        if (!props.popupInputRef.current?.value) {
            return;
        }


        await props.addComment(props, props.popupInputRef.current?.value ?? '')

        props.setCollapsedHighlights(prev => {
            const newSet = new Set(prev);
            // newSet.add(props.);
            return newSet;
        });

        if (props.popupInputRef.current) {
            props.popupInputRef.current.value = ''
        }


        props.cancel()

    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleCommentSubmit();
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
                zIndex: 1000,
            }}
        >
            <div>
                <textarea
                    rows={3}
                    ref={props.popupInputRef}
                    style={{
                        border: '1px solid rgba(0, 0, 0, .3)',
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={'Add a comment or @ someone...'}
                ></textarea>
            </div>
            <div
                style={{
                    display: 'flex',
                    marginTop: '8px',
                }}
            >
                <div style={{ marginRight: '8px' }}>
                    <PrimaryButton onClick={handleCommentSubmit}>Add</PrimaryButton>
                </div>
                <Button onClick={props.cancel}>Cancel</Button>
            </div>
        </div>
    );
};


export const renderHighlightTarget = (props: MyRenderHighlightTargetProps) => {


    // Keep the selected text highlighted? 
    const handleHighlight = async () => {
        const highlightId = await props.addHighlight(props)
        props.cancel();
        // Don't double highlight when saving highlight
        props.lastSelectedRef.current = null;

        return highlightId;
    };

    const handleCommentSubmit = () => {
        props.toggle()

        props.focusPopupInput();
    }

    const heightAdjustment = props.selectionRegion.height * 3;
    return (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top - heightAdjustment}%`,
                transform: 'translate(0, 8px)',
                zIndex: 1000,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <>
                        <Button onClick={handleHighlight}>
                            <HighlightIcon className={styles.annotateIcon} />
                        </Button>
                    </>
                }
                content={() => <div style={{ width: '100px', zIndex: 1000 }}>Highlight</div>}
                offset={{ left: 0, top: -8 }}
            />
            <Tooltip
                position={Position.TopCenter}
                target={
                    <>
                        <Button onClick={handleCommentSubmit}>
                            <AnnotateIcon className={styles.annotateIcon} />
                        </Button>
                    </>
                }
                content={() => <div style={{ width: '100px', zIndex: 1000 }}>Annotate</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>)
};


const calculateAreaStats = (filteredAreas: HighlightArea[]) => {
    const rightmostArea = filteredAreas.reduce((maxArea, area) =>
        area.left > (maxArea?.left ?? 0) ? area : maxArea, filteredAreas[0]);

    const topmostArea = filteredAreas.reduce((minArea, area) =>
        area.top < (minArea?.top ?? 0) ? area : minArea, filteredAreas[0]);

    const bottommostArea = filteredAreas.reduce((maxArea, area) =>
        area.top > (maxArea?.top ?? Number.MAX_VALUE) ? area : maxArea, filteredAreas[0]);

    const middleHeight = topmostArea && bottommostArea
        ? (topmostArea.top + bottommostArea.top + bottommostArea.height) / 2
        : undefined;

    return { rightmostArea, middleHeight };
};


export const renderHighlights = (props: MyRenderHighlightsProps) => {
    const renderLastSelectedHighlight = useCallback(() => {
        if (!props.lastSelectedRef.current || props.lastSelectedRef.current.highlightAreas.length === 0) {
            return null;
        }
        return props.lastSelectedRef.current.highlightAreas
            .filter(area => area.pageIndex === props.pageIndex) // Ensure it renders only the current page
            .map((area) => (
                <div
                    key={crypto.randomUUID()}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className={`${styles.highlightedArea} ${styles.lastSelectedHighlight}`}
                    style={Object.assign(
                        {},
                        props.getCssProperties(area, props.rotation),
                    )}
                />
            ));
    }, [props]);


    const renderUserHighlights = useCallback(() => {
        return props.displayedHighlights.map(highlight => {
            const filteredAreas = highlight.highlightAreas.filter(
                area => area.pageIndex === props.pageIndex && area.width > 0
            );

            const { rightmostArea, middleHeight } = calculateAreaStats(filteredAreas);

            return (
                <div
                    key={highlight.id}
                    id={`pdf-highlight-${highlight.id}`}
                    className={`${styles.groupContainer}`}
                    data-highlight-id={highlight.id}
                    onMouseEnter={() => {
                        if (highlight.id === props.activeHighlight?.id) return;
                        const sidebar = document.getElementById(`sidebar-highlight-${highlight.id}`);
                        if (sidebar) sidebar.classList.add(sidebarStyles.activeNoteItem);
                        const highlightNote = document.getElementById(`highlight-note-${highlight.id}`);
                        if (highlightNote) {
                            highlightNote.style.backgroundColor = 'rgba(255, 253, 208, 1)';
                            highlightNote.style.zIndex = '2000';
                        }

                    }}
                    onMouseLeave={() => {
                        if (highlight.id === props.activeHighlight?.id) return;
                        const sidebar = document.getElementById(`sidebar-highlight-${highlight.id}`);
                        if (sidebar) sidebar.classList.remove(sidebarStyles.activeNoteItem);

                        const highlightNote = document.getElementById(`highlight-note-${highlight.id}`);
                        if (highlightNote) {
                            highlightNote.style.backgroundColor = 'white';
                            highlightNote.style.zIndex = '1';
                        }
                    }}
                >
                    {filteredAreas.map((area, index) => (
                        <div
                            key={crypto.randomUUID()}
                            onClick={(e) => {
                                e.stopPropagation();
                                props.openHighlight(highlight);
                            }}
                            className={`${props.activeHighlight?.id === highlight.id ? styles.active : styles.userHighlight} ${props.isSelecting ? styles.userHighlightOnSelect : ''}`}
                            style={Object.assign(
                                {},
                                props.getCssProperties(area, props.rotation),
                            )}
                        />
                    ))}
                    <PastNote
                        userId={props.loggedInUserId}
                        highlight={highlight}
                        middleHeight={middleHeight}
                        rightmostArea={rightmostArea}
                        upsertCommentToExistingHighlight={props.upsertCommentToExistingHighlight}
                        editHighlight={props.editHighlight}
                        deleteHighlight={props.deleteHighlight}
                        userProfiles={props.userProfiles}
                    />
                </div>
            );
        });
    }, [props]);

    try {
        return (
            <div>
                {renderLastSelectedHighlight()}
                {renderUserHighlights()}
            </div>
        );
    } catch (error) {
        console.error("Error in renderHighlights:", error);
        return <div className={styles.errorContainer}>An error occurred while rendering highlights.</div>;
    }
};