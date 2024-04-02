"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

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
  PDFHighlightsWithProfile,
  Position,
  HighlightContent,
} from "../app/pdf/ui";
import {
  AnnotatedPdf,
  AnnotatedPdfHighlights,
  AnnotatedPdfHighlightsComments,
} from "@prisma/client";

import FloatingProfiles from "@src/app/pdf/ui/components/FloatingProfiles";
import { useAskHighlight } from "@src/context/ask-highlight-context";

import "../app/pdf/ui/style/main.css";

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comments,
}: {
  comments: AnnotatedPdfHighlightsComments[];
}) =>
  comments.map((comment, index) =>
    comment.text ? (
      <div key={`highlight-comment-${index}`} className="Highlight__popup">
        {comment.emoji} {comment.text}
      </div>
    ) : null,
  );

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
  userHighlights: AnnotatedPdfHighlights[];
  allHighlights: PDFHighlightsWithProfile[];
}): JSX.Element {
  const utils = clientApi.useUtils();
  const mutation = clientApi.annotatedPdf.upsertAnnotatedPdf.useMutation({
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
        newData,
        (oldData) => newData as AnnotatedPdf,
      );

      return { previousData };
    },
    onSuccess: (input) => {
      utils.annotatedPdf.fetchAnnotatedPdf.invalidate({
        userId: input?.userId,
        source: input?.source,
      });
    },
  });
  const highlights =
    clientApi.annotatedPdf.fetchAnnotatedPdf.useQuery({
      userId: userId,
      source: loadedSource,
    }).data?.highlights || userHighlights;
  const [highlight, setHighlight] = useState<
    AnnotatedPdfHighlights | undefined
  >(undefined);
  const [friendHighlights, setFriendHighlights] = useState<
    AnnotatedPdfHighlights[]
  >([]);
  const { messages, isLoading } = useAskHighlight();

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const resetHighlights = () => {
    mutation.mutate({
      userId: userId,
      highlights: [],
      source: loadedSource,
      id: annotatedPdfId,
    });
  };

  let scrollToHighlightId = (highlight: AnnotatedPdfHighlights) => {};

  const setHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      setHighlight(highlight);
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

  const addHighlight = async (
    highlight: Omit<AnnotatedPdfHighlights, "id">,
  ) => {
    const id = uuidv4();
    // If the highlights object doesn't exist, create it
    mutation.mutate({
      userId: userId,
      highlights: [{ ...highlight, id }, ...(highlights ?? [])],
      source: loadedSource,
      id: annotatedPdfId,
    });

    // Set react flow to display the new highlight if it's a question
    if (highlight.prompt) {
      setHighlight({ ...highlight, id });
    }
  };

  useEffect(() => {
    if (messages.length < 2 || !highlight?.prompt) return;

    const question = messages[messages.length - 2]?.content;
    const response = messages[messages.length - 1]?.content;

    if (!question || !response) return;

    if (question == highlight.prompt) {
      const newHighlight = {
        ...highlight,
        response: response,
      };

      mutation.mutate({
        userId: userId,
        highlights: [
          newHighlight,
          ...highlights.filter((h) => h.id !== highlight.id),
        ],
        source: loadedSource,
        id: annotatedPdfId,
      });

      setHighlight(newHighlight);
    }
  }, [messages, isLoading]);

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
              highlight={highlight}
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
                    addHighlight({
                      content: {
                        text: content?.text ?? "",
                        image: content?.image ?? "",
                      },
                      position,
                      comments: [
                        { ...comment, timestamp: new Date(), userId: userId },
                      ],
                      timestamp: new Date(),
                    });
                    hideTipAndSelection();
                  }}
                  onPromptConfirm={(prompt: string) => {
                    addHighlight({
                      content: {
                        text: content?.text ?? "",
                        image: content?.image ?? "",
                      },
                      prompt,
                      position,
                      comments: [],
                      timestamp: new Date(),
                    });
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
              highlights={highlights ?? []}
              displayHighlights={friendHighlights}
            />
          )}
        </PdfLoader>
      </div>
      {highlight ? (
        <Forest
          highlight={highlight}
          returnHome={() => {
            document.location.hash = "";
            setHighlight(undefined);
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
