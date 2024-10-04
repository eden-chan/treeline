import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import React, { Component } from "react";

interface Props {
  /** See `GlobalWorkerOptionsType`. */
  workerSrc: string;

  url: string;
  bytes?: Uint8Array;
  beforeLoad: JSX.Element;
  errorMessage?: JSX.Element;
  children: (pdfDocument: PDFDocumentProxy) => JSX.Element;
  onError?: (error: Error) => void;
  cMapUrl?: string;
  cMapPacked?: boolean;
}



interface State {
  pdfDocument: PDFDocumentProxy | null;
  error: Error | null;
  failedAttempts: number;
}

export class PdfLoader extends Component<Props, State> {
  state: State = {
    pdfDocument: null,
    error: null,
    failedAttempts: 0,
  };

  static defaultProps = {
    workerSrc: "https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs",
  };

  documentRef = React.createRef<HTMLElement>();

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    const { pdfDocument: discardedDocument } = this.state;
    if (discardedDocument) {
      discardedDocument.destroy();
    }
  }

  componentDidUpdate({ url }: Props) {
    if (this.props.url !== url) {
      this.setState({ failedAttempts: 0, error: null });
      this.load();
    }
  }

  componentDidCatch(error: Error) {
    const { onError } = this.props;

    console.error('PdfLoader componentDidCatch', error);

    if (onError) {
      onError(error);
    }

    this.setState(prevState => ({
      pdfDocument: null,
      error,
      failedAttempts: prevState.failedAttempts + 1,
    }));
  }

  load() {
    const { ownerDocument = document } = this.documentRef.current || {};
    const { url, cMapUrl, cMapPacked, workerSrc } = this.props;
    const { pdfDocument: discardedDocument, failedAttempts } = this.state;

    if (failedAttempts >= 2) {
      console.error('PdfLoader: Max retry attempts reached');
      return;
    }

    this.setState({ pdfDocument: null, error: null });

    if (typeof workerSrc === "string") {
      GlobalWorkerOptions.workerSrc = workerSrc;
    }

    console.log('PdfLoader load', url, discardedDocument, ownerDocument);

    Promise.resolve()
      .then(() => discardedDocument?.destroy())
      .then(() => {
        if (!url) {
          return;
        }

        const document = {
          ...this.props,
          ownerDocument,
          cMapUrl,
          cMapPacked,
        };


        //  if url failed, try agani with different passing in bytes
        //  if bytes failed, try by uploading to server and pulling that in
        // NOTE: If a URL is used to fetch the PDF data a standard Fetch API call (or XHR as fallback) 
        // is used, which means it must follow same origin rules, e.g. no cross-domain requests 
        // without CORS.
        return getDocument(document).promise.then((pdfDocument) => {
          this.setState({ pdfDocument, failedAttempts: 0 });
        });
      })
      .catch(async (e) => {
        this.componentDidCatch(e);
        if (this.state.failedAttempts < 2) {

          const firstTry = this.state.failedAttempts === 0
          const secondTry = this.state.failedAttempts === 1

          if (firstTry) {
            // Server-side implementation to fetch bytes
            const getBytes = async (url: string) => {
              try {
                const response = await fetch('/api/fetch-pdf', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ url }),
                });

                if (!response.ok) {
                  throw new Error('Server failed to fetch PDF');
                }

                const arrayBuffer = await response.arrayBuffer();
                return new Uint8Array(arrayBuffer);
              } catch (error) {
                console.error('Error fetching bytes from server:', error);
                throw error;
              }
            };

            let bytes: Uint8Array | null = null;
            try {
              bytes = await getBytes(url);
            } catch (error) {
              console.error('Error getting bytes on first retry, so next try will be to upload pdf to server and pull that in instead', error);
              // throw error;
            }

            // get the bytes of the pdf and pass that in instead
          } else if (secondTry) {
            // upload the pdf to server and pull that in instead
            const uploadUrl = 'https://api.uploadthing.com/v2/upload';
            console.log('second retry is to uploadUrl to server ', this.props.url, uploadUrl);
          }

          console.log(`Retrying PDF load. Attempt ${this.state.failedAttempts + 1}`);

          // get the bytes of the pdf and pass that in instead
          setTimeout(() => this.load(), 1000); // Retry after 1 second
        }
      });
  }

  render() {
    const { children, beforeLoad } = this.props;
    const { pdfDocument, error, failedAttempts } = this.state;

    if (failedAttempts < 2 && !pdfDocument) {
      return beforeLoad;
    }

    if (failedAttempts >= 2 || error) {
      return this.renderError();
    }

    return (
      <>
        <span ref={this.documentRef} />
        {pdfDocument && children ? children(pdfDocument) : null}
      </>
    );
  }

  renderError() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return React.cloneElement(errorMessage, { error: this.state.error });
    }

    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Failed to load PDF after multiple attempts. Please try again later.</div>;
  }
}
