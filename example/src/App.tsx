"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from "react";

import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
} from "./react-pdf-highlighter";
import ReactPlayer from "react-player";
import type { IHighlight, Viewer } from "./react-pdf-highlighter";

import { Sidebar } from "./Sidebar";
import { Spinner } from "./Spinner";
import "./style/App.css";
import "../../dist/style.css";

import { ClerkProvider } from "@clerk/clerk-react";

import {
  updateHighlight,
  resetHighlights,
  ANONYMOUS_USER_ID,
  MAIN_ROOM_ID,
  getDocumentsWithHighlights,
  addHighlightWithComment,
  getTags,
  getBundles,
  getUsers,
} from "./utils/dbUtils";
import type {
  Document,
  DocumentWithHighlightsAndComments,
} from "./utils/dbUtils";
import { useAuth as useDbAuth } from "./utils/dbUtils";
import { HighlightType } from "./utils/highlightTypes";
import InstantCursors from "./Cursor";
import InstantAvatarStack from "./AvatarStack";
import InstantTopics from "./Emoji";
import { randomDarkColor } from "./utils/utils";
import styles from "./App.module.css";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useMediaQuery } from "react-responsive";
import type { ServiceIdentifier, ServiceType } from "./services/globals";
import { serviceContextContainer, ServicesContext } from "./services/globals";
import MobileNavigation from "./components/MobileNavigation";
import { BundleProvider } from "./context/BundleContext";
import { ToastProvider } from "./context/ToastContext";
// @ts-ignore
import debounce, { DEBOUNCE_TIME } from "./utils/debounce";
import { HighlightPopup } from "./components/HighlightPopup";
import { encodeUrl, decodeUrl } from "./utils/urlHash";

export function useService<T extends ServiceIdentifier>(
  serviceIdentifier: T,
): ServiceType<T> {
  const container = useContext(ServicesContext);
  if (!container || !container.container) {
    throw new Error("useService must be used within a ServicesContext");
  }
  return container.container.get<ServiceType<T>>(serviceIdentifier);
}

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const DEFAULT_URL =
  "https://treeline.s3.us-east-2.amazonaws.com/d1366281-Treeline.pdf";

export function AppWrapper() {
  return (
    <ServicesContext.Provider value={{ container: serviceContextContainer }}>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? ""}
        afterSignOutUrl="/"
      >
        <ToastProvider>
          <ViewManager />
        </ToastProvider>
      </ClerkProvider>
    </ServicesContext.Provider>
  );
}

export function ViewManager() {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlHash = searchParams.get("doc");

    if (urlHash) {
      // Here, you would look up the original URL using the hash
      // For now, we'll just use the hash as is
      const decodedUrl = decodeUrl(urlHash);
      setPdfUrl(decodedUrl);
    } else {
      setPdfUrl(DEFAULT_URL);
    }
  }, []);

  useEffect(() => {
    if (pdfUrl) {
      const encodedUrl = encodeUrl(pdfUrl);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("doc", encodedUrl);
      window.history.pushState({}, "", newUrl.toString());

      // Here, you would store the mapping of encodedUrl to pdfUrl in your database or cache
    }
  }, [pdfUrl]);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedHighlightTypes, setSelectedHighlightTypes] = useState<
    HighlightType[]
  >(Object.values(HighlightType));
  const scrollViewerTo = useRef((_: IHighlight) => {
    // noop
  });

  const userColor = useMemo(() => randomDarkColor, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isAreaSelectionEnabled, setIsAreaSelectionEnabled] = useState(false);
  const [touchStartPosition, setTouchStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [viewer, setViewer] = useState<Viewer>("pdf");

  // Fetch Documents
  const {
    data: documentData,
    isLoading: isLoadingDocuments,
    error: errorDocuments,
  } = getDocumentsWithHighlights();

  // Fetch displayed Document
  const currentDocument: DocumentWithHighlightsAndComments | undefined =
    documentData?.documents.find((doc) => doc.sourceUrl === pdfUrl);

  // Fetch Highlights
  // const {data: highlightData, error: errorHighlights } = getHighlightsByDocument(url);
  const highlights = currentDocument?.highlights;

  // Fetch Tags
  const { data: tagData } = getTags();

  // Fetch Bundles
  const { data: bundleData } = getBundles();

  // Fetch Tags
  const { user } = useDbAuth();
  const { data: usersData } = getUsers();

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      console.log("Touch start", e);
      if (isMobile && isAreaSelectionEnabled) {
        setTouchStartPosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
      }
    },
    [isMobile, isAreaSelectionEnabled],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isMobile && isAreaSelectionEnabled) {
        // Prevent scrolling when area selection is enabled
        e.preventDefault();

        if (touchStartPosition) {
          const currentX = e.touches[0].clientX;
          const currentY = e.touches[0].clientY;
          const deltaX = Math.abs(currentX - touchStartPosition.x);
          const deltaY = Math.abs(currentY - touchStartPosition.y);

          if (deltaX > 5 || deltaY > 5) {
            // The user has moved their finger enough to consider it a selection
            console.log("Area selection started");
          }
        }
      }
    },
    [isMobile, isAreaSelectionEnabled, touchStartPosition],
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStartPosition(null);
  }, []);

  useEffect(() => {
    const scrollToHighlightFromHash = () => {
      const highlightId = parseIdFromHash();
      const highlight = highlights?.find(
        (highlight) => highlight.id === highlightId,
      );
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
    return <Spinner />;
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
    setPdfUrl(newDocument.sourceUrl);
  };

  // reduce the highlights to only the ones that are in the selectedHighlightTypes
  const renderedFilterHighlights =
    highlights
      ?.filter((highlight) =>
        selectedHighlightTypes.includes(getHighlightType(highlight.userId)),
      )
      .map((highlight) => ({
        ...highlight,
        content: {
          text: highlight.content.text,
          image: highlight.content.image,
        } as IHighlight["content"],
      })) ?? [];

  return (
    <BundleProvider
      documents={documentData?.documents ?? []}
      highlights={highlights ?? []}
      users={usersData?.$users ?? []}
    >
      <InstantCursors
        roomId={MAIN_ROOM_ID}
        userId={user?.email ?? ANONYMOUS_USER_ID}
      >
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          {(!isMobile || isSidebarOpen) && (
            <Panel>
              <Sidebar
                resetHighlights={handleResetHighlights}
                toggleDocument={toggleDocument}
                selectedHighlightTypes={selectedHighlightTypes}
                setSelectedHighlightTypes={setSelectedHighlightTypes}
                currentUser={user ?? null}
                currentUserColor={userColor}
                currentDocument={currentDocument}
                isMobile={isMobile}
                closeSidebar={() => setIsSidebarOpen(false)}
                tags={tagData?.tags}
                bundles={bundleData?.bundles}
                youtubeUrl={youtubeUrl}
                setYoutubeUrl={setYoutubeUrl}
                setViewer={setViewer}
              />
            </Panel>
          )}
          {!isMobile && (
            <PanelResizeHandle className={styles.panelResizeHandle} />
          )}
          <Panel
            className={styles.viewerPanel}
            defaultSize={isMobile ? 100 : 70}
            minSize={isMobile ? 100 : 70}
          >
            {viewer === "pdf" ? (
              <div
                className={styles.mainContent}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <PdfLoader url={pdfUrl} beforeLoad={<Spinner />}>
                  {(pdfDocument) => (
                    <PdfHighlighter
                      highlights={renderedFilterHighlights}
                      pdfDocument={pdfDocument}
                      enableAreaSelection={(event) =>
                        event.altKey || (isMobile && isAreaSelectionEnabled)
                      }
                      onScrollChange={resetHash}
                      scrollRef={(scrollTo) => {
                        scrollViewerTo.current = scrollTo;
                        const highlightId = parseIdFromHash();
                        const highlight = highlights?.find(
                          (highlight) => highlight.id === highlightId,
                        );
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
                            if (!currentDocument) {
                              console.error(
                                "[Confirm Highlight] failed - no current document",
                              );
                              return;
                            }
                            const userId = user?.id ?? ANONYMOUS_USER_ID;
                            const userName = user?.email ?? ANONYMOUS_USER_ID;

                            const commentDraft =
                              comment.text || comment.emoji
                                ? {
                                    text: comment.text,
                                    emoji: comment.emoji,
                                    userId,
                                    userName,
                                  }
                                : undefined;

                            const highlightDraft = {
                              position,
                              content,
                              userId,
                              userName,
                            };

                            // addHighlight(newHighlightDraft)
                            addHighlightWithComment({
                              highlight: highlightDraft,
                              documentId: currentDocument.id,
                              comment: commentDraft,
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
                        const isTextHighlight = !highlight.content?.image;

                        const highlightType = getHighlightType(
                          highlight.userId,
                        );

                        const component = isTextHighlight ? (
                          <Highlight
                            isScrolledTo={isScrolledTo}
                            position={highlight.position}
                            comment={highlight?.comments?.[0] ?? {}}
                            highlightType={highlightType}
                          />
                        ) : (
                          <AreaHighlight
                            isScrolledTo={isScrolledTo}
                            highlight={highlight}
                            onChange={(boundingRect) => {
                              updateHighlight(
                                highlight.id,
                                {
                                  boundingRect: viewportToScaled(boundingRect),
                                },
                                { image: screenshot(boundingRect) },
                              );
                            }}
                            highlightType={highlightType}
                          />
                        );

                        return (
                          <Popup
                            popupContent={
                              <HighlightPopup
                                comment={highlight?.comments?.[0] ?? {}}
                                highlightId={highlight.id}
                                user={user}
                                onClose={hideTip}
                              />
                            }
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
                <InstantAvatarStack
                  roomId={MAIN_ROOM_ID}
                  username={user?.email ?? ANONYMOUS_USER_ID}
                  color={userColor}
                />
              </div>
            ) : (
              <ReactPlayer url={youtubeUrl} />
            )}
          </Panel>
        </PanelGroup>
        {isMobile && (
          <MobileNavigation
            isAreaSelectionEnabled={isAreaSelectionEnabled}
            setIsAreaSelectionEnabled={setIsAreaSelectionEnabled}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
      </InstantCursors>
    </BundleProvider>
  );
}
