var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import React, { Component } from "react";
class PdfLoader extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      pdfDocument: null,
      error: null
    });
    __publicField(this, "documentRef", React.createRef());
  }
  componentDidMount() {
    this.load();
  }
  componentWillUnmount() {
    const { pdfDocument: discardedDocument } = this.state;
    if (discardedDocument) {
      discardedDocument.destroy();
    }
  }
  componentDidUpdate({ url }) {
    if (this.props.url !== url) {
      this.load();
    }
  }
  componentDidCatch(error) {
    const { onError } = this.props;
    if (onError) {
      onError(error);
    }
    this.setState({ pdfDocument: null, error });
  }
  load() {
    const { ownerDocument = document } = this.documentRef.current || {};
    const { url, cMapUrl, cMapPacked, workerSrc } = this.props;
    const { pdfDocument: discardedDocument } = this.state;
    this.setState({ pdfDocument: null, error: null });
    if (typeof workerSrc === "string") {
      GlobalWorkerOptions.workerSrc = workerSrc;
    }
    Promise.resolve().then(() => discardedDocument == null ? void 0 : discardedDocument.destroy()).then(() => {
      if (!url) {
        return;
      }
      const document2 = {
        ...this.props,
        ownerDocument,
        cMapUrl,
        cMapPacked
      };
      return getDocument(document2).promise.then((pdfDocument) => {
        this.setState({ pdfDocument });
      });
    }).catch((e) => this.componentDidCatch(e));
  }
  render() {
    const { children, beforeLoad } = this.props;
    const { pdfDocument, error } = this.state;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { ref: this.documentRef }),
      error ? this.renderError() : !pdfDocument || !children ? beforeLoad : children(pdfDocument)
    ] });
  }
  renderError() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return React.cloneElement(errorMessage, { error: this.state.error });
    }
    return null;
  }
}
__publicField(PdfLoader, "defaultProps", {
  workerSrc: "https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs"
});
export {
  PdfLoader
};
