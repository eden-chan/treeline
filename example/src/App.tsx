"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "./react-pdf-highlighter";
import type { Comment, IHighlight, NewHighlight } from "./react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import "./style/App.css";
import "../../dist/style.css";

import { ClerkProvider } from "@clerk/clerk-react";

import { addHighlight, updateHighlight, resetHighlights, getHighlights, ANONYMOUS_USER_ID, MAIN_ROOM_ID, getDocuments } from "./utils/dbUtils";
import { useAuth as useDbAuth } from "./utils/dbUtils";
import { HighlightType } from "./utils/highlightTypes";
import InstantCursors from './Cursor';
import InstantAvatarStack from './AvatarStack';
import InstantTopics from './Emoji';
import { randomDarkColor } from './utils/utils';

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: Comment;
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
  const [selectedHighlightTypes, setSelectedHighlightTypes] = useState<HighlightType[]>(Object.values(HighlightType));
  const scrollViewerTo = useRef((highlight: IHighlight) => {
    console.log('[App] scrollViewerTo', highlight)
  });

  const userColor = useMemo(() => randomDarkColor, []);

  const { data, isLoading: isLoadingDocuments, error: errorDocuments } = getDocuments();
  const highlights = data?.documents[0].highlights

  const getHighlightById = useCallback((id: string) => {
    return []
    // return data?.highlights.find((highlight) => highlight.id === id);
  }, []);
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

  if (isLoadingDocuments) {
    return <Spinner />
  }
  if (errorDocuments) {
    return <div>Error fetching data: {errorDocuments.message}</div>;
  }
  // const { highlights } = documents;

  const getHighlightType = (highlightUserId: string): HighlightType => {
    if (highlightUserId === user?.id) {
      return HighlightType.CURRENT_USER;
    }
    if (highlightUserId === ANONYMOUS_USER_ID) {
      return HighlightType.ANONYMOUS_USER;
    }
    return HighlightType.OTHER_REGISTERED_USER;
  };

  const filteredHighlights = []
  // highlights.filter(highlight =>
  //   selectedHighlightTypes.includes(getHighlightType(highlight.userId))
  // );

  const handleResetHighlights = () => {
    resetHighlights(highlights);
  };

  const toggleDocument = () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
  };

  // const currentDocument = {
  //   id: "1",
  //   name: "Document 1",
  //   sourceUrl: url,
  //   highlights: highlights as IHighlight[],
  //   chatSection: highlights[0].comments,
  // }
  return (
    <InstantCursors roomId={MAIN_ROOM_ID} userId={user?.email ?? ANONYMOUS_USER_ID} >
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          documents={data?.documents}
          resetHighlights={handleResetHighlights}
          toggleDocument={toggleDocument}
          selectedHighlightTypes={selectedHighlightTypes}
          setSelectedHighlightTypes={setSelectedHighlightTypes}
          currentUser={user ?? null}
          currentUserColor={userColor}
          currentDocument={data?.documents[0]}
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
                      // const highlightUserId = user?.id ?? ANONYMOUS_USER_ID
                      // const highlightUserName = user?.email ?? ANONYMOUS_USER_ID
                      // const highlightDraft = {
                      //   content,
                      //   position,
                      // }

                      // const commentDraft = {
                      //   text: comment.text,
                      //   emoji: comment.emoji,
                      //   userId: highlightUserId,
                      //   userName: highlightUserName,
                      // }

                      // const documentHighlightDraft = {
                      //   highlight: highlightDraft,
                      //   comment: commentDraft,
                      // }

                      // addHighlight({

                      // } as NewHighlight, highlightUserId, highlightUserName);
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
                      comment={highlight.comments[0]}
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
                      popupContent={<HighlightPopup {...highlight} comment={highlight.comments[0]} />}
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
                highlights={filteredHighlights}
              />
            )}
          </PdfLoader>

          <InstantTopics roomId={MAIN_ROOM_ID} />
          <InstantAvatarStack roomId={MAIN_ROOM_ID} username={user?.email ?? ANONYMOUS_USER_ID} color={userColor} />

        </div>
      </div>
    </InstantCursors>
  );
}

