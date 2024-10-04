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
  bytes?: Uint8Array;
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
    const { url, cMapUrl, cMapPacked, workerSrc, bytes } = this.props;
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
      .then(async () => {
        if (!url && !bytes) {
          return;
        }

        const document = {
          ...this.props,
          ownerDocument,
          cMapUrl,
          cMapPacked,
        };

        try {
          let pdfDocument: PDFDocumentProxy;
          if (bytes) {
            pdfDocument = await getDocument({ data: bytes }).promise;
          } else {
            pdfDocument = await getDocument(document).promise;
          }
          this.setState({ pdfDocument, failedAttempts: 0 });
        } catch (e) {
          if (this.state.failedAttempts < 2) {
            const firstTry = this.state.failedAttempts === 0;
            const secondTry = this.state.failedAttempts === 1;

            if (firstTry) {
              try {
                const response = await fetch(`/api/pdf?url=${encodeURIComponent(url)}`);
                if (!response.ok) {
                  throw new Error('Server failed to fetch PDF');
                }
                const data = await response.json();
                const pdfBytes = new Uint8Array(data.data);
                this.setState({ bytes: pdfBytes });

                // Attempt to load the PDF with the new bytes
                const pdfDocument = await getDocument({ data: pdfBytes }).promise;
                this.setState({ pdfDocument, failedAttempts: 0 });
                return; // Exit the function if successful
              } catch (error) {
                console.error('Error fetching bytes from server:', error);
              }
            } else if (secondTry) {
              // Implement second retry logic here if needed
              console.log('second retry logic not implemented');
            }

            console.log(`Retrying PDF load. Attempt ${this.state.failedAttempts + 1}`);
            this.setState(prevState => ({ failedAttempts: prevState.failedAttempts + 1 }));
            setTimeout(() => this.load(), 1000); // Retry after 1 second
          } else {
            this.componentDidCatch(e as Error);
          }
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
