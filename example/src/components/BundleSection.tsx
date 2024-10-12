import { useState, useCallback } from 'react';
import { addBundle, updateBundle, type Document, type BundleWithDocuments, addToBundle, addDocument } from '../utils/dbUtils';
// @ts-ignore
import debounce from '../utils/debounce';
import styles from './BundleSection.module.css';
import { CreateBundleModal } from './CreateBundleModal';
import { AddDocumentToBundleModal } from './AddDocumentToBundleModal';
import { Bundle } from './Bundle';
import { BundleProvider } from '../context/BundleContext';

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
                        <BundleProvider bundlesWithDocuments={bundlesWithDocuments}>
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
                        </BundleProvider>
                    </ul>
                </div>
            )}
        </div>
    );
}