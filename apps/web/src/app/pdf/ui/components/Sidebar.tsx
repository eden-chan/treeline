import React from "react";
import { Highlight } from "@prisma/client";
import { HighlightWithRelations } from "@src/server/api/routers/highlight";

interface Props {
  highlights: Array<HighlightWithRelations>;
  resetHighlights: () => void;
}

const updateHash = (highlight: Highlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({ highlights, resetHighlights }: Props) {
  return (
    <div className="sidebar" style={{ width: "50vw" }}>
      <div className="description" style={{ padding: "1rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>react-pdf-highlighter</h2>

        <p style={{ fontSize: "0.7rem" }}>
          <a href="https://github.com/agentcooper/react-pdf-highlighter">
            Open in GitHub
          </a>
        </p>

        <p>
          <small>
            To create area highlight hold ⌥ Option key (Alt), then click and
            drag.
          </small>
        </p>
      </div>

      <ul className="sidebar__highlights">
        {highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              {highlight.node?.prompt && (
                <div key={`${highlight.id}-prompt-${highlight.node.prompt}`}>
                  {highlight.node.prompt}
                </div>
              )}
              {highlight?.comment && <div>{highlight.comment.text}</div>}
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </div>
        ))}
      </ul>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    </div>
  );
}
