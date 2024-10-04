import { ClerkSignedInComponent } from './ClerkSignedInComponent';
import { ClerkSignedOutComponent } from './ClerkSignedOutComponent';
import type { IHighlight } from "./react-pdf-highlighter";
import treeline from './treeline.png';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import styles from './Sidebar.module.css';
import { HighlightType } from "./utils/highlightTypes";
import { ANONYMOUS_USER_ID, MAIN_ROOM_ID } from './utils/dbUtils';
import InstantTypingIndicator from './TypingIndicator';
import type { User } from '@instantdb/react';

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  selectedHighlightTypes: HighlightType[];
  setSelectedHighlightTypes: React.Dispatch<React.SetStateAction<HighlightType[]>>;
  currentUser: User | null;
  currentUserColor: string;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  selectedHighlightTypes,
  setSelectedHighlightTypes,
  currentUser,
  currentUserColor
}: Props) {

  const handleFilterChange = (type: HighlightType) => {
    setSelectedHighlightTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className='sidebar' style={{ width: '25vw' }}>
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
            {Object.values(HighlightType).map(type => (
              <div key={type} className={styles.legendItem}>
                <input
                  type="checkbox"
                  id={`filter-${type}`}
                  checked={selectedHighlightTypes.includes(type)}
                  onChange={() => handleFilterChange(type)}
                />
                <div className={`${styles.legendColor} ${styles[type]}`} />
                <label htmlFor={`filter-${type}`} className={styles.legendText}>
                  {type.replace(/([A-Z])/g, ' $1').trim()} {/* Convert camelCase to spaces */}
                </label>
              </div>
            ))}
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
        {highlights.map((highlight) => (
          <li
            key={highlight.id}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text} </strong>
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
              Author: {highlight.userName} | Page: {highlight.position.pageNumber}
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

      <InstantTypingIndicator roomId={MAIN_ROOM_ID} username={currentUser?.email ?? ANONYMOUS_USER_ID} color={currentUserColor} />

    </div>
  );
}
