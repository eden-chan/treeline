import { jsx } from "react/jsx-runtime";
import { Rnd } from "react-rnd";
import { getPageFromElement } from "../lib/pdfjs-dom.js";
import styles from "../style/AreaHighlight.module.css.js";
function AreaHighlight({
  highlight,
  onChange,
  isScrolledTo,
  ...otherProps
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `${styles.areaHighlight} ${isScrolledTo ? styles.scrolledTo : ""}`,
      children: /* @__PURE__ */ jsx(
        Rnd,
        {
          className: styles.part,
          onDragStop: (_, data) => {
            const boundingRect = {
              ...highlight.position.boundingRect,
              top: data.y,
              left: data.x
            };
            onChange(boundingRect);
          },
          onResizeStop: (_mouseEvent, _direction, ref, _delta, position) => {
            var _a;
            const boundingRect = {
              top: position.y,
              left: position.x,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              pageNumber: ((_a = getPageFromElement(ref)) == null ? void 0 : _a.number) || -1
            };
            onChange(boundingRect);
          },
          position: {
            x: highlight.position.boundingRect.left,
            y: highlight.position.boundingRect.top
          },
          size: {
            width: highlight.position.boundingRect.width,
            height: highlight.position.boundingRect.height
          },
          onClick: (event) => {
            event.stopPropagation();
            event.preventDefault();
          },
          ...otherProps
        }
      )
    }
  );
}
export {
  AreaHighlight
};
