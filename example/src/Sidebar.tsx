import { ClerkSignedInComponent } from './ClerkSignedInComponent';
import { ClerkSignedOutComponent } from './ClerkSignedOutComponent';
import type { IHighlight } from "./react-pdf-highlighter";
import treeline from './treeline.png';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import styles from './Sidebar.module.css';

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
}: Props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.headerText}>
          Treeline
          <img src={treeline} alt="Treeline" className={styles.logo} />
        </h2>
        <p style={{ fontSize: "0.7rem" }}>
          <a href="https://github.com/eden-chan/treeline">
            Open in GitHub
          </a>
        </p>

        <p>
          <small>
            To create area highlight hold ⌥ Option key (Alt), then click and
            drag.
          </small>

          <div className={styles.legend}>
            <h3>Highlight Legend</h3>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.currentUser}`} />
              <span className={styles.legendText}>Current User</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.anonymousUser}`} />
              <span className={styles.legendText}>Anonymous User</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.otherUser}`} />
              <span className={styles.legendText}>Other User</span>
            </div>
          </div>
        </p>
      </div>
      <SignedOut>
        <ClerkSignedOutComponent />
      </SignedOut>
      <SignedIn>
        <ClerkSignedInComponent />
      </SignedIn>

      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={highlight.id}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
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
          </li>
        ))}
      </ul>
      <div style={{ padding: "1rem" }}>
        <button type="button" onClick={toggleDocument}>
          Toggle PDF document
        </button>
      </div>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button type="button" onClick={resetHighlights}>
            Reset highlights
          </button>
        </div>
      ) : null}
    </div>
  );
}
