"use client";
import { useState, useEffect, useCallback, useRef } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "./react-pdf-highlighter";
import type { IHighlight, NewHighlight } from "./react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import "./style/App.css";
import "../../dist/style.css";

import { ClerkProvider } from "@clerk/clerk-react";

import { addHighlight, updateHighlight, resetHighlights, useHighlights, ANONYMOUS_USER_ID } from "./utils/dbUtils";
import { useAuth as useDbAuth } from "./utils/dbUtils";
import { HighlightType } from "./utils/highlightTypes";

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

export function ViewManager() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""}
      afterSignOutUrl="/"
    >
      <PDFAnnotator />
    </ClerkProvider>
  );
}

export function PDFAnnotator() {
  const [url, setUrl] = useState(initialUrl);
  const scrollViewerTo = useRef((highlight: IHighlight) => {
    console.log('[App] scrollViewerTo', highlight)
  });

  const { isLoading, error, data } = useHighlights();

  const getHighlightById = useCallback((id: string) => {
    return data?.highlights.find((highlight) => highlight.id === id);
  }, [data]);
  const { user } = useDbAuth();

  useEffect(() => {
    const scrollToHighlightFromHash = () => {
      const highlight = getHighlightById(parseIdFromHash());
      if (highlight) {
        scrollViewerTo.current(highlight);
      }
    };

    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false,
      );
    };
  }, [getHighlightById]);

  if (isLoading) {
    return <Spinner />
  }
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }
  const { highlights } = data;


  const handleResetHighlights = () => {
    resetHighlights(highlights);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
  };

  const getHighlightType = (highlightUserId: string): HighlightType => {
    console.log('[App] highlightUserId', highlightUserId, 'user?.id', user?.id, highlightUserId === user?.id)
    if (highlightUserId === user?.id) {
      return HighlightType.CURRENT_USER;
    }
    if (highlightUserId === ANONYMOUS_USER_ID) {
      return HighlightType.ANONYMOUS_USER;
    }
    return HighlightType.OTHER_USER;
  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        highlights={highlights}
        resetHighlights={handleResetHighlights}
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
                console.log(scrollTo)
                const highlight = getHighlightById(parseIdFromHash());
                console.log('[App] clicked highlight', highlight)
                if (highlight) {
                  scrollViewerTo.current(highlight);
                }

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
                    console.log('[App] user making highlight', user)
                    const highlightUserId = user?.id ?? ANONYMOUS_USER_ID
                    addHighlight({
                      content,
                      position,
                      comment,
                    } as NewHighlight, highlightUserId);
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

                const highlightType = getHighlightType(highlight.userId);

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                    highlightType={highlightType}
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
                    highlightType={highlightType}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, () => popupContent)
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

