"use client";
import React, { useState, useEffect } from "react";

import { clientApi } from "@src/trpc/react";
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Forest,
  Popup,
  AreaHighlight,
  Spinner,
  Sidebar,
} from "../app/pdf/ui";
import type { HighlightComment, HighlightContent, IHighlight, NewHighlight, PDFHighlights, PDFHighlightsWithProfile, Position } from "../app/pdf/ui/types";

import "../app/pdf/ui/style/main.css";
import FloatingProfiles from '@src/app/pdf/ui/components/FloatingProfiles';

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comments,
}: {
  comments: HighlightComment[];
}) =>
  comments.map((comment) =>
    comment.text ? (
      <div className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null
  );

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

export default function PDFViewer({
  loadedHighlights,
  loadedSource,
  loadedUserHighlightsId,
  userId, allHighlights
}: {
  loadedHighlights: IHighlight[];
  loadedSource: string;
  loadedUserHighlightsId: string;
  userId: string;
  allHighlights: PDFHighlightsWithProfile[];
}): JSX.Element {
  const mutation = clientApi.post.addHighlight.useMutation();
  const [url, setUrl] = useState(loadedSource);
  const [highlight, setHighlight] = useState<IHighlight | undefined>(undefined);
  const [highlights, setHighlights] = useState(loadedHighlights);
  const [displayHighlights, setDisplayHighlights] = useState<IHighlight[]>(loadedHighlights)


  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    setUrl(newUrl);
    setHighlights([]);
  };

  let scrollViewerTo = (highlight: any) => { };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      console.log('selected highlight', highlight?.content)
      setHighlight(highlight);
      scrollViewerTo(highlight);
    }
  };

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);

    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false,
      );
    };
  }, []);

  const addHighlight = async (highlight: NewHighlight) => {
    console.log("Saving highlight", highlight);

    const id = getNextId();
    // If the highlights object doesn't exist, create it
    mutation.mutate({
      userId: userId,
      highlights: [{ ...highlight, id }, ...highlights],
      source: url,
      id: loadedUserHighlightsId,
    });

    setHighlights([{ ...highlight, id }, ...highlights]);
  };

  const updateHighlight = (
    highlightId: string,
    position: Position,
    content: HighlightContent,
  ) => {

    const updatedHighlights = highlights.map((h) => {
      const {
        id,
        position: originalPosition,
        content: originalContent,
        comments: originalComments,
        timestamp: originalTimestamp
      } = h;
      return id === highlightId
        ? {
          id,
          position: { ...originalPosition, ...position },
          content: { ...originalContent, ...content },
          comments: { ...originalComments },
          timestamp: new Date(),
        }
        : h;
    });

    setHighlights(updatedHighlights);

    mutation.mutate({
      userId: userId,
      highlights: updatedHighlights,
      source: url,
      id: loadedUserHighlightsId,
    });
  };


  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <FloatingProfiles setDisplayHighlights={setDisplayHighlights} allHighlightsWithProfile={allHighlights} />
      <div
        style={{
          height: "100vh",
          width: "50vw",
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
                scrollViewerTo = scrollTo;

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
                    addHighlight({
                      content: {
                        text: content?.text ?? '',
                        image: content?.image ?? '',
                      },
                      position,
                      comments: [{ ...comment, timestamp: new Date(), userId: userId }],
                      timestamp: new Date(),
                    });
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
                const isTextHighlight = !(
                  highlight.content && highlight.content.image
                );

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comments={highlight.comments}
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
                    children={component}
                  />
                );
              }}
              highlights={displayHighlights}
            />
          )}
        </PdfLoader>
      </div>
      {highlight ? (
        <Forest
          highlight={highlight}
          returnHome={() => setHighlight(undefined)}
        />
      ) : (
        <Sidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
        />
      )}
    </div>
  );
}
