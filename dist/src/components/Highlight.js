import { jsxs, jsx } from "react/jsx-runtime";
import styles from "../style/Highlight.module.css.js";
function Highlight({
  position,
  onClick,
  onMouseOver,
  onMouseOut,
  comment,
  isScrolledTo
}) {
  const { rects, boundingRect } = position;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `Highlight ${styles.highlight} ${isScrolledTo ? styles.scrolledTo : ""}`,
      children: [
        comment ? /* @__PURE__ */ jsx(
          "div",
          {
            className: `Highlight__emoji ${styles.emoji}`,
            style: {
              left: 20,
              top: boundingRect.top
            },
            children: comment.emoji
          }
        ) : null,
        /* @__PURE__ */ jsx("div", { className: `Highlight__parts ${styles.parts}`, children: rects.map((rect, index) => /* @__PURE__ */ jsx(
          "div",
          {
            onMouseOver,
            onMouseOut,
            onClick,
            style: rect,
            className: `Highlight__part ${styles.part}`
          },
          index
        )) })
      ]
    }
  );
}
export {
  Highlight
};
