// Sidebar.tsx
import { useState } from 'react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import type { User } from '@instantdb/react';
import { ClerkSignedInComponent } from './ClerkSignedInComponent';
import { ClerkSignedOutComponent } from './ClerkSignedOutComponent';
import { DocumentList } from './DocumentList';
import { CreateDocumentModal } from './CreateDocumentModal.tsx';
import { HighlightsList } from './HighlightsList.tsx';
import type { HighlightType } from "./utils/highlightTypes";
import type { Document, DocumentWithHighlightsAndComments } from './utils/dbUtils';
import treeline from './treeline.png';
import styles from './Sidebar.module.css';
import { ChatView } from './ChatView.tsx';

type Props = {
  documents: Document[];
  resetHighlights: () => void;
  toggleDocument: (newDocument: Document) => void;
  selectedHighlightTypes: HighlightType[];
  setSelectedHighlightTypes: React.Dispatch<React.SetStateAction<HighlightType[]>>;
  currentUser: User | null;
  currentUserColor: string;
  currentDocument?: DocumentWithHighlightsAndComments;
}

export function Sidebar({
  documents,
  toggleDocument,
  resetHighlights,
  selectedHighlightTypes,
  setSelectedHighlightTypes,
  currentUser,
  currentUserColor,
  currentDocument,
}: Props) {
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
          <div className={styles.headerTop}>
            <div className={styles.headerText}>
              Treeline
              <img src={treeline} alt="Treeline" className={styles.logo} />
            </div>
            <div className={styles.authButtons}>
              <SignedOut>
                <ClerkSignedOutComponent />
              </SignedOut>
              <SignedIn>
                <ClerkSignedInComponent />
              </SignedIn>
            </div>
          </div>
          <div className={styles.githubLink}>
            <a href="https://github.com/eden-chan/treeline">Open in GitHub</a>
          </div>
          <DocumentList
            documents={documents}
            toggleDocument={toggleDocument}
            onAddNew={() => setIsModalOpen(true)}
            selectedDocument={currentDocument}
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

          </div>
        </div>
        <HighlightsList highlights={highlights} selectedHighlightTypes={selectedHighlightTypes} handleFilterChange={handleFilterChange} />
        <div className={styles.buttonContainer}>
          {highlights && highlights.length > 0 && (
            <button type="button" onClick={resetHighlights}>
              Reset highlights
            </button>
          )}
        </div>
        <ChatView
          roomId={currentDocument?.id ?? ''}
          username={currentUser?.email ?? ''}
          color={currentUserColor}
          currentDocument={currentDocument}
        />
      </div>
    </div>
  );
}