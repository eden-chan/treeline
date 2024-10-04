"use client";
import { useState, useEffect, useRef, useMemo } from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "./react-pdf-highlighter";
import type { Comment, IHighlight } from "./react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import "./style/App.css";
import "../../dist/style.css";

import { ClerkProvider } from "@clerk/clerk-react";

import { updateHighlight, resetHighlights, ANONYMOUS_USER_ID, MAIN_ROOM_ID, getDocumentsWithHighlights as getDocumentsWithHighlightsAndComments, addHighlightWithComment } from "./utils/dbUtils";
import type { Document, DocumentWithHighlightsAndComments } from "./utils/dbUtils";
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
  const scrollViewerTo = useRef((_: IHighlight) => {
    // noop
  });

  const userColor = useMemo(() => randomDarkColor, []);

  // Fetch Documents
  const { data: documentData, isLoading: isLoadingDocuments, error: errorDocuments } = getDocumentsWithHighlightsAndComments();

  // Fetch displayed Document
  const currentDocument: DocumentWithHighlightsAndComments | undefined = documentData?.documents.find(doc => doc.sourceUrl === url)

  // Fetch Highlights
  // const { data: highlightData, error: errorHighlights } = getHighlightsByDocument(url);
  const highlights = currentDocument?.highlights

  const { user } = useDbAuth();


  useEffect(() => {
    const scrollToHighlightFromHash = () => {
      const highlightId = parseIdFromHash();
      const highlight = highlights?.find(highlight => highlight.id === highlightId);
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
  }, [highlights]);

  if (isLoadingDocuments) {
    return <Spinner />
  }
  if (errorDocuments) {
    return <div>Error fetching data: {errorDocuments.message}</div>;
  }


  const getHighlightType = (highlightUserId: string): HighlightType => {
    if (highlightUserId === user?.id) {
      return HighlightType.CURRENT_USER;
    }
    if (highlightUserId === ANONYMOUS_USER_ID) {
      return HighlightType.ANONYMOUS_USER;
    }
    return HighlightType.OTHER_REGISTERED_USER;
  };



  const handleResetHighlights = () => {
    if (highlights) {
      resetHighlights(highlights);
    }
  };

  const toggleDocument = (newDocument: Document) => {
    setUrl(newDocument.sourceUrl);
  };

  // reduce the highlights to only the ones that are in the selectedHighlightTypes
  const renderedFilterHighlights = highlights?.filter(highlight =>
    selectedHighlightTypes.includes(getHighlightType(highlight.userId))
  ).map(highlight => ({ ...highlight, content: { text: highlight.content.text, image: highlight.content.image } as IHighlight['content'] })) ?? []


  return (
    <InstantCursors roomId={MAIN_ROOM_ID} userId={user?.email ?? ANONYMOUS_USER_ID} >
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          documents={documentData?.documents}
          resetHighlights={handleResetHighlights}
          toggleDocument={toggleDocument}
          selectedHighlightTypes={selectedHighlightTypes}
          setSelectedHighlightTypes={setSelectedHighlightTypes}
          currentUser={user ?? null}
          currentUserColor={userColor}
          currentDocument={currentDocument}
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
                highlights={renderedFilterHighlights}
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}

                scrollRef={(scrollTo) => {
                  scrollViewerTo.current = scrollTo;
                  const highlightId = parseIdFromHash();
                  const highlight = highlights?.find(highlight => highlight.id === highlightId);
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
                      console.trace('[App] user making highlight', user, 'with comment', comment)

                      if (!currentDocument) {
                        console.error('[Confirm Highlight] failed - no current document')
                        return
                      }
                      const userId = user?.id ?? ANONYMOUS_USER_ID;
                      const userName = user?.email ?? ANONYMOUS_USER_ID;



                      const commentDraft = comment.text || comment.emoji ? {
                        text: comment.text,
                        emoji: comment.emoji,
                        userId,
                        userName,
                      } : undefined


                      const highlightDraft = {
                        position,
                        content,
                        userId,
                        userName,
                      }

                      // addHighlight(newHighlightDraft)
                      addHighlightWithComment({ highlight: highlightDraft, documentId: currentDocument.id, comment: commentDraft })

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
                      comment={highlight?.comments?.[0] ?? { text: '', emoji: '' }}
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
                      popupContent={<HighlightPopup {...highlight} comment={highlight?.comments?.[0] ?? { text: '', emoji: '' }} />}
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

