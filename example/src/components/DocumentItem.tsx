import React from "react";
import styles from "./DocumentItem.module.css";
import { Document } from "../utils/dbUtils";

interface DocumentItemProps {
  doc: Document;
  selectedDocument: Document;
  toggleDocument: (doc: Document) => void;
  toggleSettings: (e: React.MouseEvent, doc: Document) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  doc,
  selectedDocument,
  toggleDocument,
  toggleSettings,
}) => {
  return (
    <li className={styles.documentItem}>
      <div
        className={`${styles.documentButton} ${selectedDocument && selectedDocument.id === doc.id ? styles.selectedDocument : ""}`}
      >
        <span
          onClick={() => toggleDocument(doc)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleDocument(doc);
            }
          }}
          tabIndex={0}
          role="button"
        >
          {doc?.name?.length > 20 ? `${doc.name.slice(0, 20)}...` : doc?.name}
        </span>
        <div className={styles.documentActions}>
          <button
            onClick={(e) => toggleSettings(e, doc)}
            className={styles.settingsButton}
            type="button"
            aria-label="Document settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>settings</title>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

export default DocumentItem;
