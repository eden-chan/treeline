import { useState, useCallback } from 'react';
import { addBundle, updateBundle, type Document, type BundleWithDocuments, addToBundle, HighlightResponseTypeWithComments, User } from '../utils/dbUtils';
// @ts-ignore
import debounce from '../utils/debounce';
import styles from './BundleSection.module.css';
import { CreateBundleModal } from './CreateBundleModal';
import { AddDocumentToBundleModal } from './AddDocumentToBundleModal';
import { Bundle } from './Bundle';
import { BundleProvider } from '../context/BundleContext';

type Props = {
    bundlesWithDocuments: BundleWithDocuments[];
    toggleDocument: (doc: Document) => void;
    selectedDocument?: Document;
    documents: Document[];
    highlights: HighlightResponseTypeWithComments[];
    users: User[];
};

const DEBOUNCE_TIME = 1000; // ms

export function BundleSection({ bundlesWithDocuments, toggleDocument, selectedDocument, documents, highlights, users }: Props) {
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

    const handleBundleSaveOnChange = (bundleId: string, name: string, description: string) => {
        debouncedUpdateBundle(bundleId, name, description);
        // export the bundle markdown
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

    const handleAddExistingDocument = async (documentId: string | string[]) => {
        if (currentBundleId) {
            const result = await addToBundle(currentBundleId, documentId);
            console.log("handleAddExistingDocument result", result);
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
                documents={documents}
            />

            {isExpanded && (
                <div className={styles.bundleListWrapper}>
                    <ul className={styles.bundleList}>
                        <BundleProvider documents={documents} highlights={highlights} users={users}>
                            {bundlesWithDocuments.map((bundle) => (
                                <Bundle
                                    key={bundle.id}
                                    bundle={bundle}
                                    selectedDocument={selectedDocument}
                                    toggleDocument={toggleDocument}
                                    handleBundleChange={handleBundleSaveOnChange}
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