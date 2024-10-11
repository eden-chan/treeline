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
import type { Document, DocumentWithHighlightsAndComments, BundleWithDocuments, TagWithDocuments } from './utils/dbUtils';
import treeline from './treeline.png';
import styles from './Sidebar.module.css';
import { ChatView } from './ChatView.tsx';
import { BundleSection } from './components/BundleSection';
import { useService } from './App.tsx';
import { IYoutubeService } from './services/youtube/youtubeService.ts';
import { MobileComponent } from './components/MobileComponent';

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
  tags?: TagWithDocuments[];
  bundles?: BundleWithDocuments[];
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
  bundles,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const highlights = currentDocument?.highlights;

  const youtubeService = useService(IYoutubeService);
  const handleFilterChange = (type: HighlightType) => {
    setSelectedHighlightTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleFetchTranscript = async () => {
    if (!youtubeUrl) {
      console.error('Please enter a YouTube URL');
      return;
    }
    try {
      const transcript = await youtubeService.getTranscript(youtubeUrl);
      console.log('Transcript:', transcript);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
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
          {isMobile && <MobileComponent />}
          <div className={styles.tagsAndBundles}>
            <BundleSection documents={documents} bundlesWithDocuments={bundles ?? []} toggleDocument={toggleDocument} selectedDocument={currentDocument} />
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