
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

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

import {
  SignInButton,
  SignedIn,
  SignedOut,
  useAuth as useClerkAuth,
} from "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  addHighlight,
  updateHighlight,
  resetHighlights,
  useHighlights,
  signInWithIdToken,
  signOut as signOutFromDb,
  useAuth as useDbAuth,
} from "./utils/dbUtils";

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
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <ClerkSignedInComponent />
      </SignedIn>
      <PDFAnnotator />
    </ClerkProvider>
  );
}

export function PDFAnnotator() {
  const [url, setUrl] = useState(initialUrl);
  const scrollViewerTo = useRef((highlight: IHighlight) => {
    // Implement scrolling logic here
    // console.log('[App] scrollViewerTo', highlight)
    // document.location.hash = `#highlight-${highlight.id}`

  });





  const { isLoading, error, data } = useHighlights();

  const getHighlightById = useCallback((id: string) => {
    return data?.highlights.find((highlight) => highlight.id === id);
  }, [data]);

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
    return <div>Fetching data...</div>;
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
                    addHighlight({
                      content,
                      position,
                      comment,
                    } as NewHighlight);
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

function ClerkSignedInComponent() {
  const { getToken, signOut: signOutFromClerk } = useClerkAuth();

  const signInToInstantWithClerkToken = async () => {
    const idToken = await getToken();

    if (!idToken) {
      return;
    }

    signInWithIdToken(
      idToken,
      import.meta.env.VITE_CLERK_CLIENT_NAME ?? "Treeline",
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Load only once on mount
  useEffect(() => {
    signInToInstantWithClerkToken();
  }, []);

  const { isLoading, user, error } = useDbAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error signing in! {error.message}</div>;
  }
  if (user) {
    return (
      <div>
        <p>Signed in</p>{" "}
        <button
          type="button"
          onClick={() => {
            signOutFromDb().then(() => {
              signOutFromClerk();
            });
          }}
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div>
      <button type="button" onClick={signInToInstantWithClerkToken}>Sign in</button>
    </div>
  );
}
