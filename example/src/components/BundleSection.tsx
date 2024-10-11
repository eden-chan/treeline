import { useState, useCallback } from 'react';
import { addBundle, updateBundle, type Document, type BundleWithDocuments, addToBundle, addDocument } from '../utils/dbUtils';
// @ts-ignore
import debounce from '../utils/debounce';
import styles from './BundleSection.module.css';
import { CreateBundleModal } from './CreateBundleModal';
import { AddDocumentToBundleModal } from './AddDocumentToBundleModal';
import { Bundle } from './Bundle';

type Props = {
    documents: Document[];
    bundlesWithDocuments: BundleWithDocuments[];
    toggleDocument: (doc: Document) => void;
    selectedDocument?: Document;
};

const DEBOUNCE_TIME = 1000; // ms

export function BundleSection({ documents, bundlesWithDocuments, toggleDocument, selectedDocument }: Props) {
    const [isCreateBundleModalOpen, setIsCreateBundleModalOpen] = useState(false);
    const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentBundleId, setCurrentBundleId] = useState<string | null>(null);

    const debouncedUpdateBundle = useCallback(
        debounce((bundleId: string, name: string, description: string) => {
            updateBundle(bundleId, { name, description });
        }, DEBOUNCE_TIME),
        []
    );

    const handleBundleChange = (bundleId: string, name: string, description: string) => {
        debouncedUpdateBundle(bundleId, name, description);
    };

    const handleCreateBundle = async (name: string, description: string, documentIds: string[]) => {
        await addBundle({
            name,
            description,
            documentIds,
        });
        setIsCreateBundleModalOpen(false);
    };

    const handleAddDocumentToBundle = (bundleId: string) => {
        setCurrentBundleId(bundleId);
        setIsAddDocumentModalOpen(true);
    };

    const handleAddExistingDocument = async (documentId: string) => {
        if (currentBundleId) {
            await addToBundle(currentBundleId, documentId);
            setIsAddDocumentModalOpen(false);
        }
    };

    const handleCreateDocumentAndAddToBundle = async (name: string, url: string) => {
        if (currentBundleId) {
            await addDocument({ name, sourceUrl: url }, currentBundleId);
            setIsAddDocumentModalOpen(false);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.bundleSectionContainer}>
            <div className={styles.bundleSectionHeader}>
                <div className={styles.headerLeft}>
                    <button
                        onClick={toggleExpand}
                        className={styles.toggleButton}
                        type="button"
                        aria-label={isExpanded ? "Collapse bundle list" : "Expand bundle list"}
                    >
                        {isExpanded ? '▼' : '▶'}
                    </button>
                    <h3>Bundles</h3>
                </div>
                <button
                    onClick={() => setIsCreateBundleModalOpen(true)}
                    className={styles.addNewButton}
                    type="button"
                    aria-label="Add new bundle"
                >
                    Add Bundle
                </button>
            </div>

            <CreateBundleModal
                isOpen={isCreateBundleModalOpen}
                onClose={() => setIsCreateBundleModalOpen(false)}
                onSubmit={handleCreateBundle}
                documents={documents}
            />

            <AddDocumentToBundleModal
                isOpen={isAddDocumentModalOpen}
                onClose={() => setIsAddDocumentModalOpen(false)}
                onAddExistingDocument={handleAddExistingDocument}
                onCreateDocument={handleCreateDocumentAndAddToBundle}
                documents={documents}
            />

            {isExpanded && (
                <div className={styles.bundleListWrapper}>
                    <ul className={styles.bundleList}>
                        {bundlesWithDocuments.map((bundle) => (
                            <Bundle
                                key={bundle.id}
                                bundle={bundle}
                                selectedDocument={selectedDocument}
                                toggleDocument={toggleDocument}
                                handleBundleChange={handleBundleChange}
                                handleAddDocumentToBundle={handleAddDocumentToBundle}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export function Bundle({ bundle, selectedDocument, toggleDocument, handleBundleChange, handleAddDocumentToBundle }: Props) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsPosition, setSettingsPosition] = useState({ top: 0, left: 0 });
    const [settingsButtonRef, setSettingsButtonRef] = useState<HTMLButtonElement | null>(null);

    const toggleSettings = (e: React.MouseEvent) => {
        e.stopPropagation();
        const button = e.currentTarget as HTMLButtonElement;
        const rect = button.getBoundingClientRect();
        setSettingsPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        });
        setIsSettingsOpen(!isSettingsOpen);
        button.classList.toggle(styles.active);
    };

    return (
        <li className={styles.bundleItem}>
            <div className={styles.bundleHeader} onClick={toggleExpand}>
                <button
                    ref={settingsButtonRef}
                    onClick={toggleSettings}
                    className={`${styles.settingsButton} ${isSettingsOpen ? styles.active : ''}`}
                    type="button"
                    aria-label="Bundle settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <title>settings</title>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>
            </div>
            {/* ... (keep other existing code) ... */}
        </li>
    );
}

// ... (keep other existing code) ...