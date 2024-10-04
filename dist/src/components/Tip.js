var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs } from "react/jsx-runtime";
import { Component } from "react";
import styles from "../style/Tip.module.css.js";
class Tip extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      compact: true,
      text: "",
      emoji: ""
    });
  }
  // for TipContainer
  componentDidUpdate(_, nextState) {
    const { onUpdate } = this.props;
    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }
  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text, emoji } = this.state;
    return /* @__PURE__ */ jsx("div", { children: compact ? /* @__PURE__ */ jsx(
      "div",
      {
        className: styles.compact,
        onClick: () => {
          onOpen();
          this.setState({ compact: false });
        },
        children: "Add highlight"
      }
    ) : /* @__PURE__ */ jsxs(
      "form",
      {
        className: styles.card,
        onSubmit: (event) => {
          event.preventDefault();
          onConfirm({ text, emoji });
        },
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                placeholder: "Your comment",
                autoFocus: true,
                value: text,
                onChange: (event) => this.setState({ text: event.target.value }),
                ref: (node) => {
                  if (node) {
                    node.focus();
                  }
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { children: ["💩", "😱", "😍", "🔥", "😳", "⚠️"].map((_emoji) => /* @__PURE__ */ jsxs("label", { children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  checked: emoji === _emoji,
                  type: "radio",
                  name: "emoji",
                  value: _emoji,
                  onChange: (event) => this.setState({ emoji: event.target.value })
                }
              ),
              _emoji
            ] }, _emoji)) })
          ] }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("input", { type: "submit", value: "Save" }) })
        ]
      }
    ) });
  }
}
export {
  Tip
};
