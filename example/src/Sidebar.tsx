import { useState } from 'react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import type { User } from '@instantdb/react';
import { ClerkSignedInComponent } from './ClerkSignedInComponent';
import { ClerkSignedOutComponent } from './ClerkSignedOutComponent';
import Chat from './TypingIndicator';
import { HighlightType } from "./utils/highlightTypes";
import { addDocument, ANONYMOUS_USER_ID, MAIN_ROOM_ID } from './utils/dbUtils';
import type { Document, DocumentWithHighlightsAndComments, HighlightResponseType, HighlightResponseTypeWithComments } from './utils/dbUtils';
import treeline from './treeline.png';
import styles from './Sidebar.module.css';

interface SidebarProps {
  documents: Document[];
  resetHighlights: () => void;
  toggleDocument: (newDocument: Document) => void;
  selectedHighlightTypes: HighlightType[];
  setSelectedHighlightTypes: React.Dispatch<React.SetStateAction<HighlightType[]>>;
  currentUser: User | null;
  currentUserColor: string;
  currentDocument?: DocumentWithHighlightsAndComments;
}

const updateHash = (highlight: HighlightResponseType) => {
  document.location.hash = `highlight-${highlight.id}`;
  const element = document.getElementById(`highlight-${highlight.id}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const CreateDocumentModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && sourceUrl) {
      addDocument({ name, sourceUrl });
      setName('');
      setSourceUrl('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Add New Source</h2>
        <form onSubmit={handleSubmit} className={styles.createDocumentForm}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Document Name"
            className={styles.inputField}
          />
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="PDF URL"
            className={styles.inputField}
          />
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.submitButton}>Add Document</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DocumentList = ({ documents, toggleDocument, onAddNew }: {
  documents: Document[],
  toggleDocument: (doc: Document) => void,
  onAddNew: () => void
}) => (
  <div>
    <div className={styles.documentListHeader}>
      <h3>Documents</h3>
      <button onClick={onAddNew} className={styles.addButton} type="button">+</button>
    </div>
    <ul className={styles.documentList}>
      {documents.map((doc: Document) => (
        <li key={doc.id} className={styles.documentItem}>
          <div
            onClick={() => toggleDocument(doc)}
            className={styles.documentButton}
          >
            {doc.name.length > 20 ? `${doc.name.slice(0, 20)}...` : doc.name}
          </div>
          <a
            href={doc.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.documentLink}
            aria-label={`Open ${doc.name} in new tab`}
          >
            <span className="sr-only"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg></span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const HighlightLegend = ({ selectedHighlightTypes, handleFilterChange }: {
  selectedHighlightTypes: HighlightType[],
  handleFilterChange: (type: HighlightType) => void
}) => (
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
          {type.replace(/([A-Z])/g, ' $1').trim()}
        </label>
      </div>
    ))}
  </div>
);

const HighlightsList = ({ highlights }: { highlights: HighlightResponseTypeWithComments[] | undefined }) => (
  <ul className={styles.highlightsList}>
    {highlights?.map((highlight) => (
      <li
        key={highlight.id}
        className={styles.highlightItem}
        onClick={() => updateHash(highlight)}
      >
        <div>
          {highlight.content.text && (
            <blockquote className={styles.highlightQuote}>
              {`${highlight.content.text.slice(0, 90).trim()}…`}
            </blockquote>
          )}
          {highlight.content.image && (
            <div className={styles.highlightImage}>
              <img src={highlight.content.image} alt={"Screenshot"} />
            </div>
          )}
          <div>
            {highlight.comments?.map((comment) => (
              <div key={comment.id}>{comment.text}</div>
            ))}
          </div>
        </div>
        <div className={styles.highlightInfo}>
          Author: {highlight.userName} | Page: {highlight.position.pageNumber}
        </div>
      </li>
    ))}
  </ul>
);

export function Sidebar({
  documents,
  toggleDocument,
  resetHighlights,
  selectedHighlightTypes,
  setSelectedHighlightTypes,
  currentUser,
  currentUserColor,
  currentDocument,
}: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const highlights = currentDocument?.highlights;

  const handleFilterChange = (type: HighlightType) => {
    setSelectedHighlightTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            Treeline
            <img src={treeline} alt="Treeline" className={styles.logo} />
          </div>
          <div style={{ fontSize: "0.7rem" }}>
            <a href="https://github.com/eden-chan/treeline">Open in GitHub</a>
          </div>
          <DocumentList
            documents={documents}
            toggleDocument={toggleDocument}
            onAddNew={() => setIsModalOpen(true)}
          />
          <CreateDocumentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <div>
            <small>
              To create area highlight hold ⌥ Option key (Alt), then click and
              drag. Try opening this in another tab, or ask a friend to join you!
            </small>
            <HighlightLegend
              selectedHighlightTypes={selectedHighlightTypes}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </div>
        <SignedOut>
          <ClerkSignedOutComponent />
        </SignedOut>
        <SignedIn>
          <ClerkSignedInComponent />
        </SignedIn>
        <HighlightsList highlights={highlights} />
        <div className={styles.buttonContainer}>
          {highlights && highlights.length > 0 && (
            <button type="button" onClick={resetHighlights}>
              Reset highlights
            </button>
          )}
        </div>
      </div>
      <div className={styles.chatContainer}>
        <Chat
          roomId={MAIN_ROOM_ID}
          username={currentUser?.email ?? ANONYMOUS_USER_ID}
          color={currentUserColor}
        />
      </div>
    </div>
  );
}