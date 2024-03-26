"use client";
import React, { useState, useEffect } from "react";

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

import type { IHighlight, NewHighlight } from "../app/pdf/ui/types";

import { testHighlights as _testHighlights } from "../app/pdf/data/test-highlights";

import "../app/pdf/ui/style/main.css";
import { clientApi } from "@src/trpc/react";
import { ObjectId } from 'mongodb';
import { SignIn, SignInButton, UserButton } from '@clerk/nextjs';


const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

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

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

export default function PDFViewer({ loadedHighlights, loadedSource, loadedUserHighlightsId, user }: { loadedHighlights: IHighlight[], loadedSource: string, loadedUserHighlightsId: string, user: string }): JSX.Element {

  const mutation = clientApi.post.addHighlight.useMutation();

  const [userHighlightsId, setUserHighlightsId] = useState(loadedUserHighlightsId)
  const [url, setUrl] = useState(loadedSource);
  const [highlights, setHighlights] = useState<Array<IHighlight>>(loadedHighlights);

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = async () => {
    const newUrl =
      url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    setUrl(newUrl);

    console.log('FETCHING TRPC ', { loadedSource, user })
    const data = { "0": { "json": { "source": loadedSource, "user": user } } }
    const res = await fetch('http://localhost:3000/api/trpc/post.fetchUserHighlights?batch=1&input=' + encodeURIComponent(JSON.stringify(data)), { method: 'GET' });
    const body = await res.json();

    console.log({ body })



    // const newHighlights = clientApi.post.fetchUserHighlights.useQuery({ source: newUrl, user: user });
    // console.log({ 'data': newHighlights.data })
    // setHighlights(newHighlights.data?.highlights || []);
  };

  let scrollViewerTo = (highlight: any) => { };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
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
  }, [highlights]);

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  const addHighlight = async (highlight: NewHighlight) => {
    console.log("Saving highlight", highlight);


    const id = getNextId()
    // If the highlights object doesn't exist, create it
    const returnId: any = mutation.mutate({
      user: "admin",
      highlights: [{ ...highlight, id }, ...highlights],
      source: url,
      id: userHighlightsId
    });

    console.log({ returnId })

    console.log('added highlight: ', returnId, 'loaded id', userHighlightsId);
    setHighlights([{ ...highlight, id }, ...highlights]);


  };

  const updateHighlight = (
    highlightId: string,
    position: Object,
    content: Object,
  ) => {

    console.log("Updating highlight", highlightId, position, content);
    const updatedHighlights = highlights.map((h) => {
      const {
        id,
        position: originalPosition,
        content: originalContent,
        ...rest
      } = h;
      return id === highlightId
        ? {
          id,
          position: { ...originalPosition, ...position },
          content: { ...originalContent, ...content },
          ...rest,
        }
        : h;
    });

    setHighlights(updatedHighlights);

    const returnId: any = mutation.mutate({
      user: "admin",
      highlights: updatedHighlights,
      source: url,
      id: userHighlightsId
    });
    console.log('added highlight: ', returnId, 'loaded id', userHighlightsId);

  };

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      <SignInButton><button className='text-black'>Sign IN</button></SignInButton>
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
                    console.log({ content })
                    addHighlight({
                      content: {
                        // Only include the key if it exists
                        text: content?.text || '',
                        image: content?.image || ''
                      },
                      position,
                      comment
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

                // content will have non-empty image if it's text, and non-empty text if it's an image
                const isTextHighlight = highlight.content && highlight.content.image === ''
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
                    children={component}
                  />
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
      <Forest
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
      />
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
      />
    </div>
  );
}
