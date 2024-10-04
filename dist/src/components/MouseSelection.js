import { jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { isHTMLElement } from "../lib/pdfjs-dom.js";
import styles from "../style/MouseSelection.module.css.js";
const getBoundingRect = (start, end) => ({
  left: Math.min(end.x, start.x),
  top: Math.min(end.y, start.y),
  width: Math.abs(end.x - start.x),
  height: Math.abs(end.y - start.y)
});
const shouldRender = (boundingRect) => boundingRect.width >= 1 && boundingRect.height >= 1;
function MouseSelection({
  onSelection,
  onDragStart,
  onDragEnd,
  shouldStart,
  onChange
}) {
  const [locked, setLocked] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const rootRef = useRef(null);
  const startRef = useRef(start);
  const lockedRef = useRef(locked);
  useEffect(() => {
    startRef.current = start;
  }, [start]);
  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);
  const reset = useCallback(() => {
    onDragEnd();
    setStart(null);
    setEnd(null);
    setLocked(false);
  }, [onDragEnd]);
  useEffect(() => {
    const isVisible = Boolean(start && end);
    onChange(isVisible);
  }, [start, end, onChange]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const container = root.parentElement;
    if (!container || !isHTMLElement(container)) {
      return;
    }
    const containerCoords = (pageX, pageY) => {
      const containerBoundingRect = container.getBoundingClientRect();
      return {
        x: pageX - containerBoundingRect.left + container.scrollLeft,
        y: pageY - containerBoundingRect.top + container.scrollTop - window.scrollY
      };
    };
    const mouseMoveHandler = (event) => {
      if (!startRef.current || lockedRef.current) {
        return;
      }
      setEnd(containerCoords(event.pageX, event.pageY));
    };
    const mouseDownHandler = (event) => {
      if (!shouldStart(event)) {
        reset();
        return;
      }
      const startTarget = event.target;
      if (!(startTarget instanceof Element) || !isHTMLElement(startTarget)) {
        return;
      }
      onDragStart();
      setStart(containerCoords(event.pageX, event.pageY));
      setEnd(null);
      setLocked(false);
      const mouseUpHandler = (event2) => {
        var _a;
        (_a = event2.currentTarget) == null ? void 0 : _a.removeEventListener("mouseup", mouseUpHandler);
        const currentStart = startRef.current;
        if (!currentStart) {
          return;
        }
        if (!(event2 instanceof MouseEvent)) {
          return;
        }
        const endCoords = containerCoords(event2.pageX, event2.pageY);
        const boundingRect = getBoundingRect(currentStart, endCoords);
        if (!(event2.target instanceof Element) || !isHTMLElement(event2.target) || !container.contains(event2.target) || !shouldRender(boundingRect)) {
          reset();
          return;
        }
        setEnd(endCoords);
        setLocked(true);
        onSelection(startTarget, boundingRect, reset);
        onDragEnd();
      };
      const doc = container.ownerDocument;
      if (doc == null ? void 0 : doc.body) {
        doc.body.addEventListener("mouseup", mouseUpHandler);
      }
    };
    container.addEventListener("mousemove", mouseMoveHandler);
    container.addEventListener("mousedown", mouseDownHandler);
    return () => {
      container.removeEventListener("mousemove", mouseMoveHandler);
      container.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [shouldStart, onDragStart, onDragEnd, onSelection, reset]);
  return /* @__PURE__ */ jsx("div", { ref: rootRef, children: start && end && /* @__PURE__ */ jsx(
    "div",
    {
      className: styles.mouseSelection,
      style: getBoundingRect(start, end)
    }
  ) });
}
export {
  MouseSelection
};
