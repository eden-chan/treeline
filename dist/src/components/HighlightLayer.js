import { jsx } from "react/jsx-runtime";
import { viewportToScaled } from "../lib/coordinates.js";
function HighlightLayer({
  highlightsByPage,
  scaledPositionToViewport,
  pageNumber,
  scrolledToHighlightId,
  highlightTransform,
  tip,
  hideTipAndSelection,
  viewer,
  screenshot,
  showTip,
  setTip
}) {
  const currentHighlights = highlightsByPage[String(pageNumber)] || [];
  return /* @__PURE__ */ jsx("div", { children: currentHighlights.map((highlight, index) => {
    const viewportHighlight = {
      ...highlight,
      position: scaledPositionToViewport(highlight.position)
    };
    if (tip && tip.highlight.id === String(highlight.id)) {
      showTip(tip.highlight, tip.callback(viewportHighlight));
    }
    const isScrolledTo = Boolean(scrolledToHighlightId === highlight.id);
    return highlightTransform(
      viewportHighlight,
      index,
      (highlight2, callback) => {
        setTip({ highlight: highlight2, callback });
        showTip(highlight2, callback(highlight2));
      },
      hideTipAndSelection,
      (rect) => {
        const viewport = viewer.getPageView(
          (rect.pageNumber || Number.parseInt(pageNumber)) - 1
        ).viewport;
        return viewportToScaled(rect, viewport);
      },
      (boundingRect) => screenshot(boundingRect, Number.parseInt(pageNumber)),
      isScrolledTo
    );
  }) });
}
export {
  HighlightLayer
};
