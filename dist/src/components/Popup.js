import { jsx } from "react/jsx-runtime";
import { useState } from "react";
import { MouseMonitor } from "./MouseMonitor.js";
function Popup({
  onMouseOver,
  popupContent,
  onMouseOut,
  children
}) {
  const [mouseIn, setMouseIn] = useState(false);
  return /* @__PURE__ */ jsx(
    "div",
    {
      onMouseOver: () => {
        setMouseIn(true);
        onMouseOver(
          /* @__PURE__ */ jsx(
            MouseMonitor,
            {
              onMoveAway: () => {
                if (mouseIn) {
                  return;
                }
                onMouseOut();
              },
              paddingX: 60,
              paddingY: 30,
              children: popupContent
            }
          )
        );
      },
      onMouseOut: () => {
        setMouseIn(false);
      },
      children
    }
  );
}
export {
  Popup
};
