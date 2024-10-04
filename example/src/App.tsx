'use client'
import React, { useState, useEffect, useCallback, useRef } from "react";

import {
    AreaHighlight,
    Highlight,
    PdfHighlighter,
    PdfLoader,
    Popup,
    Tip,
} from "./react-pdf-highlighter";
import type {
    Content,
    IHighlight,
    NewHighlight,
    ScaledPosition,
} from "./react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import { testHighlights as _testHighlights } from "./test-highlights";

import "./style/App.css";
import "../../dist/style.css";

import { init, tx, id } from '@instantdb/react'

// Optional: Declare your schema for intellisense!
type Schema = {
    highlights: IHighlight
}

const db = init<Schema>({ appId: import.meta.env.VITE_INSTANTDB_APP_ID ?? '' })

const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

const resetHash = () => {
    document.location.hash = "";
};

const HighlightPopup = ({
    comment,
}: {
    comment: { text: string; emoji: string };
}) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480";

const searchParams = new URLSearchParams(document.location.search);
const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

export function App() {
    const [url, setUrl] = useState(initialUrl);
    const scrollViewerTo = useRef((highlight: IHighlight) => {
        // Implement scrolling logic here
    });
    const scrollToHighlightFromHash = useCallback(() => {
        const highlight = getHighlightById(parseIdFromHash());
        if (highlight) {
            scrollViewerTo.current(highlight);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("hashchange", scrollToHighlightFromHash, false);
        return () => {
            window.removeEventListener(
                "hashchange",
                scrollToHighlightFromHash,
                false,
            );
        };
    }, [scrollToHighlightFromHash]);
    const { isLoading, error, data } = db.useQuery({ highlights: {} })
    console.log('[App] data', data, typeof data, data?.highlights, typeof data?.highlights)
    if (isLoading) {
        return <div>Fetching data...</div>
    }
    if (error) {
        return <div>Error fetching data: {error.message}</div>
    }
    const { highlights } = data

    const resetHighlights = () => {
        db.transact(highlights.map(h => tx.highlights[h.id].delete()));
    };

    const toggleDocument = () => {
        const newUrl =
            url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
        setUrl(newUrl);
    };

    const getHighlightById = (id: string) => {
        return highlights.find((highlight) => highlight.id === id);
    };

    const addHighlight = (highlight: NewHighlight) => {
        console.log("Saving highlight", highlight);
        db.transact(
            tx.highlights[id()].update({
                ...highlight,
            })
        )
    };

    const updateHighlight = (
        highlightId: string,
        position: Partial<ScaledPosition>,
        content: Partial<Content>,
    ) => {
        console.log("Updating highlight", highlightId, position, content);
        db.transact(tx.highlights[highlightId].update({ position, content }))
    };

    return (
        <div className="App" style={{ display: "flex", height: "100vh" }}>
            <Sidebar
                highlights={highlights}
                resetHighlights={resetHighlights}
                toggleDocument={toggleDocument}
            />
            <div
                style={{
                    height: "100vh",
                    width: "75vw",
                    position: "relative",
                }}
            >
                <PdfLoader url={url} beforeLoad={<Spinner />}>
                    {(pdfDocument) => (
                        <PdfHighlighter
                            pdfDocument={pdfDocument}
                            enableAreaSelection={(event) => event.altKey}
                            onScrollChange={resetHash}
                            scrollRef={(scrollTo) => {
                                scrollViewerTo.current = scrollTo;
                                scrollToHighlightFromHash();
                            }}
                            onSelectionFinished={(
                                position,
                                content,
                                hideTipAndSelection,
                                transformSelection,
                            ) => (
                                <Tip
                                    onOpen={transformSelection}
                                    onConfirm={(comment) => {
                                        addHighlight({ content, position, comment });
                                        hideTipAndSelection();
                                    }}
                                />
                            )}
                            highlightTransform={(
                                highlight,
                                index,
                                setTip,
                                hideTip,
                                viewportToScaled,
                                screenshot,
                                isScrolledTo,
                            ) => {
                                const isTextHighlight = !highlight.content?.image;

                                const component = isTextHighlight ? (
                                    <Highlight
                                        isScrolledTo={isScrolledTo}
                                        position={highlight.position}
                                        comment={highlight.comment}
                                    />
                                ) : (
                                    <AreaHighlight
                                        isScrolledTo={isScrolledTo}
                                        highlight={highlight}
                                        onChange={(boundingRect) => {
                                            updateHighlight(
                                                highlight.id,
                                                { boundingRect: viewportToScaled(boundingRect) },
                                                { image: screenshot(boundingRect) },
                                            );
                                        }}
                                    />
                                );

                                return (
                                    <Popup
                                        popupContent={<HighlightPopup {...highlight} />}
                                        onMouseOver={(popupContent) =>
                                            setTip(highlight, (highlight) => popupContent)
                                        }
                                        onMouseOut={hideTip}
                                        key={index}
                                    >
                                        {component}
                                    </Popup>
                                );
                            }}
                            highlights={highlights}
                        />
                    )}
                </PdfLoader>
            </div>
        </div>
    );
}



