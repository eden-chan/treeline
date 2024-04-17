//@ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { clientApi } from "@src/trpc/react";
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight as PDFHighlight,
  Forest,
  Popup,
  AreaHighlight,
  Spinner,
  Sidebar,
  PDFHighlightsWithProfile,
} from "../app/pdf/ui";
import { Highlight, HighlightComment } from "@prisma/client";

import FloatingProfiles from "@src/app/pdf/ui/components/FloatingProfiles";
import { useAskHighlight } from "@src/context/ask-highlight-context";

import "../app/pdf/ui/style/main.css";
import { NewHighlightWithRelationsInput } from "@src/server/api/routers/highlight";

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({ comment }: { comment: HighlightComment | null }) => {
  return comment?.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;
};

export default function PDFViewer({
  annotatedPdfId,
  loadedSource,
  userId,
  userHighlights,
  allHighlights,
}: {
  annotatedPdfId: string;
  loadedSource: string;
  userId: string;
  userHighlights: Highlight[];
  allHighlights: PDFHighlightsWithProfile[];
}): JSX.Element {
  const utils = clientApi.useUtils();
  const annotatedPdfMutation =
    clientApi.annotatedPdf.resetHighlights.useMutation({
      onMutate: async () => {
        // Cancel the pending request
        await utils.annotatedPdf.fetchAnnotatedPdf.cancel({
          userId: userId,
          source: loadedSource,
        });

        // Optimistically update the cache
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
              highlightId,
              children: [],
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

  const [friendHighlights, setFriendHighlights] = useState<Highlight[]>([]);
  const {
    currentHighlight,
    selectHighlight,
    createAskHighlight,
    clearSelectedHighlight,
  } = useAskHighlight();

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const resetHighlights = () => {
    console.log("annotatedPdfId", annotatedPdfId);
    annotatedPdfMutation.mutate({
      id: annotatedPdfId,
    });
  };

  let scrollToHighlightId = (highlight: Highlight) => { };

  const setHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      selectHighlight(highlight);
      scrollToHighlightId(highlight);
    }
  };


  // Todo: This useEffect reruns on every state update since scrollToHighlight changes reference on every render.
  // However, we need to keep an updated version of scrollToHighlightId after it gets assigned in PDFHighlighter.
  // Find a more elegant solution.
  useEffect(() => {
    window.addEventListener("hashchange", setHighlightFromHash, false);

    return () => {
      window.removeEventListener("hashchange", setHighlightFromHash, false);
    };
  }, [highlights, scrollToHighlightId]);

  const createCommentHighlight = async (
    highlight: NewHighlightWithRelationsInput,
  ) => {
    highlightMutation.mutate({
      highlight,
    });
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <FloatingProfiles
        setDisplayHighlights={setFriendHighlights}
        allHighlightsWithProfile={allHighlights}
      />
      <div
        style={{
          height: "100vh",
          width: "50vw",
          position: "relative",
        }}
      >
        <PdfLoader url={loadedSource} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              highlight={currentHighlight ?? undefined}
              scrollRef={(scrollTo) => {
                scrollToHighlightId = scrollTo;
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection,
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onCommentConfirm={(comment) => {
                    createCommentHighlight({
                      content: {
                        text: content?.text ?? "",
                        image: content?.image ?? "",
                      },
                      comment: {
                        ...comment,
                        timestamp: new Date(),
                        userId,
                      },
                      type: "COMMENT",
                      annotatedPdfId,
                      position,
                    });
                    hideTipAndSelection();
                  }}
                  onPromptConfirm={(prompt: string) => {
                    createAskHighlight({
                      content: {
                        text: content?.text ?? "",
                        image: content?.image ?? "",
                      },
                      comment: null,
                      annotatedPdfId,
                      type: "ASK",
                      node: {
                        prompt,
                        response: null,
                        timestamp: new Date(),
                        comments: [],
                      },
                      position,
                    });
                  }}
                  content={content}
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
                  <PDFHighlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comments={highlight.comments}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      // updateHighlight(
                      //   highlight.id,
                      //   { boundingRect: viewportToScaled(boundingRect) },
                      //   { image: screenshot(boundingRect) },
                      // );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={
                      <HighlightPopup comment={highlight.comment} />
                    }
                    onMouseOver={(popupContent) =>
                      setTip(highlight, (highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
              highlights={highlights ?? []}
              displayHighlights={friendHighlights}
            />
          )}
        </PdfLoader>
      </div>
      {currentHighlight ? (
        <Forest
          highlight={currentHighlight}
          returnHome={() => {
            document.location.hash = "";
            clearSelectedHighlight();
          }}
        />
      ) : (
        <Sidebar
          highlights={highlights ?? []}
          resetHighlights={resetHighlights}
        />
      )}
    </div>
  );
}
