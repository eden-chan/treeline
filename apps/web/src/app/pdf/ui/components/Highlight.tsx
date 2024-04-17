import React, { Component } from "react";
import { HighlightComment } from "@prisma/client";

import "../style/Highlight.css";

import type { LTWHP } from "../types.js";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  comments: Array<HighlightComment>;
  isScrolledTo: boolean;
}

export class Highlight extends Component<Props> {
  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      comments,
      isScrolledTo,
    } = this.props;

    const { rects, boundingRect } = position;

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className={`Highlight__part`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
