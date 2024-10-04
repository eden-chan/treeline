import { jsx } from "react/jsx-runtime";
import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "../style/TipContainer.module.css.js";
function clamp(value, left, right) {
  return Math.min(Math.max(value, left), right);
}
function TipContainer({
  children,
  style,
  scrollTop,
  pageBoundingRect
}) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const nodeRef = useRef(null);
  const updatePosition = useCallback(() => {
    if (!nodeRef.current) {
      return;
    }
    const { offsetHeight, offsetWidth } = nodeRef.current;
    setHeight(offsetHeight);
    setWidth(offsetWidth);
  }, []);
  useEffect(() => {
    setTimeout(updatePosition, 0);
  }, [updatePosition]);
  const isStyleCalculationInProgress = width === 0 && height === 0;
  const shouldMove = style.top - height - 5 < scrollTop;
  const top = shouldMove ? style.bottom + 5 : style.top - height - 5;
  const left = clamp(style.left - width / 2, 0, pageBoundingRect.width - width);
  const handleUpdate = useCallback(() => {
    setWidth(0);
    setHeight(0);
    setTimeout(updatePosition, 0);
  }, [updatePosition]);
  const childrenWithProps = React.Children.map(
    children,
    (child) => child != null ? React.cloneElement(child, {
      onUpdate: handleUpdate,
      popup: {
        position: shouldMove ? "below" : "above"
      }
    }) : null
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      id: "PdfHighlighter__tip-container",
      className: styles.tipContainer,
      style: {
        visibility: isStyleCalculationInProgress ? "hidden" : "visible",
        top,
        left
      },
      ref: nodeRef,
      children: childrenWithProps
    }
  );
}
export {
  TipContainer
};
