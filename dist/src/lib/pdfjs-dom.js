const getDocument = (element) => element.ownerDocument || document;
const getWindow = (element) => getDocument(element).defaultView || window;
const isHTMLElement = (element) => element != null && (element instanceof HTMLElement || element instanceof getWindow(element).HTMLElement);
const isHTMLCanvasElement = (element) => element instanceof HTMLCanvasElement || element instanceof getWindow(element).HTMLCanvasElement;
const getPageFromElement = (target) => {
  const node = target.closest(".page");
  if (!isHTMLElement(node)) {
    return null;
  }
  const number = Number(node.dataset.pageNumber);
  return { node, number };
};
const getPagesFromRange = (range) => {
  const startParentElement = range.startContainer.parentElement;
  const endParentElement = range.endContainer.parentElement;
  if (!isHTMLElement(startParentElement) || !isHTMLElement(endParentElement)) {
    return [];
  }
  const startPage = getPageFromElement(startParentElement);
  const endPage = getPageFromElement(endParentElement);
  if (!(startPage == null ? void 0 : startPage.number) || !(endPage == null ? void 0 : endPage.number)) {
    return [];
  }
  if (startPage.number === endPage.number) {
    return [startPage];
  }
  if (startPage.number === endPage.number - 1) {
    return [startPage, endPage];
  }
  const pages = [];
  let currentPageNumber = startPage.number;
  const document2 = startPage.node.ownerDocument;
  while (currentPageNumber <= endPage.number) {
    const currentPage = getPageFromElement(
      document2.querySelector(
        `[data-page-number='${currentPageNumber}'`
      )
    );
    if (currentPage) {
      pages.push(currentPage);
    }
    currentPageNumber++;
  }
  return pages;
};
const findOrCreateContainerLayer = (container, className, selector) => {
  const doc = getDocument(container);
  let layer = container.querySelector(selector);
  if (!layer) {
    layer = doc.createElement("div");
    layer.className = className;
    container.appendChild(layer);
  }
  return layer;
};
export {
  findOrCreateContainerLayer,
  getDocument,
  getPageFromElement,
  getPagesFromRange,
  getWindow,
  isHTMLCanvasElement,
  isHTMLElement
};
