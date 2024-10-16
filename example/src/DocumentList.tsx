// DocumentList.tsx
import { useState } from "react";
import { editDocument, removeDocument, type Document } from "./utils/dbUtils";
import styles from "./DocumentList.module.css";
import { EditDocumentModal } from "./EditDocumentModal";
import { DocumentSettingsMenu } from "./components/DocumentSettingsMenu";
import type { Viewer } from "./react-pdf-highlighter";

type Props = {
  documents: Document[];
  toggleDocument: (doc: Document) => void;
  onAddNew: () => void;
  selectedDocument?: Document;
  setViewer: (viewer: Viewer) => void;
};

export const DocumentList: React.FC<Props> = ({
  documents,
  toggleDocument,
  onAddNew,
  selectedDocument,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [settingsDocument, setSettingsDocument] = useState<Document | null>(
    null,
  );
  const [settingsPosition, setSettingsPosition] = useState({ top: 0, left: 0 });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const openEditModal = (doc: Document) => {
    setSettingsDocument(null);
    setEditingDocument(doc);
  };
  const closeEditModal = () => setEditingDocument(null);

  const toggleSettings = (e: React.MouseEvent, doc: Document) => {
    e.stopPropagation();
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    setSettingsPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setSettingsDocument(settingsDocument?.id === doc.id ? null : doc);
  };

  const closeSettingsMenu = () => setSettingsDocument(null);

  return (
    <div className={styles.documentListContainer}>
      <div className={styles.documentListHeader}>
        <button
          onClick={toggleExpand}
          className={styles.toggleButton}
          type="button"
          aria-label={
            isExpanded ? "Collapse document list" : "Expand document list"
          }
        >
          {isExpanded ? "▼" : "▶"}
        </button>
        <h3>
          Documents
          {selectedDocument && (
            <span className={styles.selectedDocumentName}>
              :{" "}
              {selectedDocument.name.length > 20
                ? `${selectedDocument.name.slice(0, 20)}...`
                : selectedDocument.name}
            </span>
          )}
        </h3>
      </div>
      {isExpanded && (
        <ul className={styles.documentList}>
          {documents.map((doc: Document) => (
            <li key={doc.id} className={styles.documentItem}>
              <div
                onClick={() => toggleDocument(doc)}
                className={`${styles.documentButton} ${
                  selectedDocument && selectedDocument.id === doc.id
                    ? styles.selectedDocument
                    : ""
                }`}
              >
                <span
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      // toggleDocument(doc);
                      console.log("toggleDocument", doc);
                    }
                  }}
                >
                  {doc?.name?.length > 20
                    ? `${doc.name.slice(0, 20)}...`
                    : doc?.name}
                </span>
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
            </li>
          ))}
          <li className={styles.documentItem}>
            <button
              onClick={onAddNew}
              className={styles.addNewButton}
              type="button"
            >
              Add new document
            </button>
          </li>
        </ul>
      )}
      {editingDocument && (
        <EditDocumentModal
          isOpen={true}
          document={editingDocument}
          onClose={closeEditModal}
          onSave={(updatedDoc) => {
            editDocument(editingDocument.id, updatedDoc);
            closeEditModal();
          }}
        />
      )}
      {settingsDocument && (
        <DocumentSettingsMenu
          position={settingsPosition}
          onClose={closeSettingsMenu}
          onEdit={() => openEditModal(settingsDocument)}
          onRemove={() => {
            removeDocument(settingsDocument.id);
            closeSettingsMenu();
          }}
        />
      )}
    </div>
  );
};
