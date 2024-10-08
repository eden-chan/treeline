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
import { addBundle, addTag, Bundle, Tag, type Document, type DocumentWithHighlightsAndComments } from './utils/dbUtils';
import treeline from './treeline.png';
import styles from './Sidebar.module.css';
import { ChatView } from './ChatView.tsx';
import { AddTag } from './components/AddTag';
import { TagList } from './components/TagList';
import { AddBundle } from './components/AddBundle';
import { BundleList } from './components/BundleList';

type Props = {
  documents: Document[];
  resetHighlights: () => void;
  toggleDocument: (newDocument: Document) => void;
  selectedHighlightTypes: HighlightType[];
  setSelectedHighlightTypes: React.Dispatch<React.SetStateAction<HighlightType[]>>;
  currentUser: User | null;
  currentUserColor: string;
  currentDocument?: DocumentWithHighlightsAndComments;
  isMobile: boolean;
  closeSidebar: () => void;
  tags?: Tag[];
  bundles?: Bundle[];
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
  isMobile,
  closeSidebar,
  tags,
  bundles,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const highlights = currentDocument?.highlights;

  const handleFilterChange = (type: HighlightType) => {
    setSelectedHighlightTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleTagAdded = () => {
    // Refresh tags (you might want to implement this function)
    // refreshTags();
  };

  const handleBundleAdded = () => {
    // Refresh bundles (you might want to implement this function)
    // refreshBundles();
  };

  return (
    <div className={`${styles.sidebar} ${isMobile ? styles.mobileSidebar : ''}`}>
      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerText}>
              Treeline
              <img src={treeline} alt="Treeline" className={styles.logo} />
            </div>
            {isMobile && (
              <button className={styles.closeButton} onClick={closeSidebar} type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-label="Close">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  <title>Close</title>
                </svg>
              </button>
            )}
            <div className={styles.authButtons}>
              <SignedOut>
                <ClerkSignedOutComponent />
              </SignedOut>
              <SignedIn>
                <ClerkSignedInComponent />
              </SignedIn>
            </div>
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

          <div className={styles.tagsAndBundles}>
            <h3>Tags</h3>
            <AddTag onTagAdded={handleTagAdded} documents={documents} />
            <TagList tagsWithDocuments={tags || []} />

            <h3>Bundles</h3>
            <AddBundle onBundleAdded={handleBundleAdded} documents={documents} />
            <BundleList bundlesWithDocuments={bundles || []} />
          </div>

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