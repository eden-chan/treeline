var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx } from "react/jsx-runtime";
import React, { Component } from "react";
class MouseMonitor extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "container", null);
    __publicField(this, "unsubscribe", () => {
    });
    __publicField(this, "onMouseMove", (event) => {
      if (!this.container) {
        return;
      }
      const { onMoveAway, paddingX, paddingY } = this.props;
      const { clientX, clientY } = event;
      const { left, top, width, height } = this.container.getBoundingClientRect();
      const inBoundsX = clientX > left - paddingX && clientX < left + width + paddingX;
      const inBoundsY = clientY > top - paddingY && clientY < top + height + paddingY;
      const isNear = inBoundsX && inBoundsY;
      if (!isNear) {
        onMoveAway();
      }
    });
    __publicField(this, "attachRef", (ref) => {
      this.container = ref;
      this.unsubscribe();
      if (ref) {
        const { ownerDocument: doc } = ref;
        doc.addEventListener("mousemove", this.onMouseMove);
        this.unsubscribe = () => {
          doc.removeEventListener("mousemove", this.onMouseMove);
        };
      }
    });
  }
  render() {
    const { onMoveAway, paddingX, paddingY, children, ...restProps } = this.props;
    return /* @__PURE__ */ jsx("div", { ref: this.attachRef, children: React.cloneElement(children, restProps) });
  }
}
export {
  MouseMonitor
};
