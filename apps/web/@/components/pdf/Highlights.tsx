import {
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
import { HighlightWithRelations } from '@src/lib/types';



type MyRenderHighlightTargetProps = {
    addHighlight: (props: RenderHighlightContentProps) => Promise<string>
    annotatedPdfId: string;
    popupInputRef: MutableRefObject<HTMLTextAreaElement | null>;
    lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
    addComment: (text: string, parentId: string) => Promise<string>;
    focusPopupInput: () => void;

} & RenderHighlightTargetProps;


type MyRenderHighlightContentProps = {
    addHighlight: (props: RenderHighlightContentProps) => Promise<string>
    popupInputRef: MutableRefObject<HTMLTextAreaElement | null>;
    lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
    addComment: (text: string, parentId: string) => Promise<string>;
    setActiveHighlight: (highlight: HighlightWithRelations | null) => void;
    setCollapsedHighlights: React.Dispatch<React.SetStateAction<Set<string>>>;

} & RenderHighlightContentProps;


type MyRenderHighlightsProps = {
    displayedHighlights: HighlightWithRelations[];
    openHighlight: (highlight: HighlightWithRelations) => void;
    deleteHighlight: (highlightId: string) => Promise<boolean>;
    addComment: (text: string, parentId: string) => Promise<string>;
    loggedInUserId: string;
    lastSelectedRef: MutableRefObject<LastSelectedArea | null>;
    activeHighlight: HighlightWithRelations | null;
    isSelecting: boolean;

} & RenderHighlightsProps;

export const renderHighlightContent = (props: MyRenderHighlightContentProps) => {



    const handleCommentSubmit = async () => {

        if (!props.popupInputRef.current?.value) {
            return;
        }

        // props.toggle()
        const highlightId = await props.addHighlight(props)
        const commentId = await props.addComment(props.popupInputRef.current?.value ?? '', highlightId)

        props.setCollapsedHighlights(prev => {
            const newSet = new Set(prev);
            newSet.add(highlightId);
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
                    }}
                    onMouseLeave={() => {
                        if (highlight.id === props.activeHighlight?.id) return;
                        const sidebar = document.getElementById(`sidebar-highlight-${highlight.id}`);
                        if (sidebar) sidebar.classList.remove(sidebarStyles.activeNoteItem);
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