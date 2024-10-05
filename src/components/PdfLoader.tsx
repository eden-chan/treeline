import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import React, { Component } from "react";

interface Props {
  /** See `GlobalWorkerOptionsType`. */
  workerSrc: string;
  url: string;
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
  retryCount: number;
  currentUrl: string;
}

export class PdfLoader extends Component<Props, State> {
  state: State = {
    pdfDocument: null,
    error: null,
    retryCount: 0,
    currentUrl: this.props.url,
  };

  static defaultProps = {
    workerSrc: "https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs",
  };

  documentRef = React.createRef<HTMLElement>();

  componentDidMount() {
    this.load(this.props.url);
  }

  componentWillUnmount() {
    const { pdfDocument: discardedDocument } = this.state;
    if (discardedDocument) {
      discardedDocument.destroy();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.url !== prevProps.url) {
      this.setState({ retryCount: 0 }, () => this.load(this.props.url));
    }
  }

  componentDidCatch(error: Error) {
    const { onError } = this.props;
    if (onError) {
      onError(error);
    }
    this.setState({ pdfDocument: null, error });
  }

  load(url: string) {
    const { ownerDocument = document } = this.documentRef.current || {};
    const { cMapUrl, cMapPacked, workerSrc } = this.props;
    const { pdfDocument: discardedDocument, retryCount } = this.state;

    this.setState({ pdfDocument: null, error: null, currentUrl: url });

    if (typeof workerSrc === "string") {
      GlobalWorkerOptions.workerSrc = workerSrc;
    }

    Promise.resolve()
      .then(() => discardedDocument?.destroy())
      .then(() => {
        if (!url) {
          console.error('No URL to load');
          return;
        }
        const document = {
          url,
          ownerDocument,
          cMapUrl,
          cMapPacked,
        };
        return getDocument(document).promise.then((pdfDocument) => {
          this.setState({ pdfDocument, retryCount: 0 });
        });
      })
      .catch((e) => {
        if (retryCount === 0) {
          this.fetchHostedPdfUrl();
        } else {
          this.componentDidCatch(e);
        }
      });
  }

  fetchHostedPdfUrl() {
    fetch(`${import.meta.env.VITE_SERVER_URL}/get-hosted-pdf-url?url=${encodeURIComponent(this.props.url)}`)
      .then(response => response.json())
      .then(data => data.url)
      .then(url => this.load(url))
      .catch(error => {
        console.error('Error fetching hosted PDF URL:', error);
        this.componentDidCatch(error);
      });
  }

  render() {
    const { children, beforeLoad } = this.props;
    const { pdfDocument, error, currentUrl } = this.state;

    return (
      <>
        <span ref={this.documentRef} />
        {error
          ? this.renderError(currentUrl)
          : !pdfDocument || !children
            ? beforeLoad
            : children(pdfDocument)}
      </>
    );
  }

  renderError(url: string) {
    const errorStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      flexDirection: 'column',
    };

    const linkStyle: React.CSSProperties = {
      color: 'blue',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
    };

    return (
      <div style={errorStyle}>
        <p>Failed to load PDF</p>
        <a href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            <title>Access PDF</title>
          </svg>
          <span style={{ marginLeft: '5px' }}>Access PDF</span>
        </a>
      </div>
    );
  }
}