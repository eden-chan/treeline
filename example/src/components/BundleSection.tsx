import { useState, useRef, useCallback } from 'react';
import { addBundle, deleteBundle, unlinkDocumentFromBundle, updateBundle, type Document, type BundleWithDocuments, addToBundle, addDocument } from '../utils/dbUtils';
// @ts-ignore
import debounce from '../utils/debounce';
import styles from './BundleSection.module.css';

type Props = {
    documents: Document[];
    bundlesWithDocuments: BundleWithDocuments[];
    toggleDocument: (doc: Document) => void;
    selectedDocument?: Document;
};

const DEBOUNCE_TIME = 1000; // ms

export function BundleSection({ documents, bundlesWithDocuments, toggleDocument, selectedDocument }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
    const [newBundleName, setNewBundleName] = useState('');
    const [newBundleDescription, setNewBundleDescription] = useState('');
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentBundleId, setCurrentBundleId] = useState<string | null>(null);
    const [newDocumentName, setNewDocumentName] = useState('');
    const [newDocumentUrl, setNewDocumentUrl] = useState('');

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const nameRefs = useRef<{ [key: string]: HTMLInputElement }>({});
    const descriptionRefs = useRef<{ [key: string]: HTMLInputElement }>({});

    const debouncedUpdateBundle = useCallback(
        debounce((bundleId: string, name: string, description: string) => {
            updateBundle(bundleId, { name, description });
        }, DEBOUNCE_TIME),
        []
    );

    const handleBundleChange = (bundleId: string) => {
        const name = nameRefs.current[bundleId]?.value ?? '';
        const description = descriptionRefs.current[bundleId]?.value ?? '';
        debouncedUpdateBundle(bundleId, name, description);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newBundleName.trim()) {
            await addBundle({
                name: newBundleName.trim(),
                description: newBundleDescription.trim(),
                documentIds: selectedDocumentIds,
            });
            setNewBundleName('');
            setNewBundleDescription('');
            setSelectedDocumentIds([]);
            setIsModalOpen(false);
        }
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

    const handleCreateDocumentAndAddToBundle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newDocumentName && newDocumentUrl && currentBundleId) {
            await addDocument({ name: newDocumentName, sourceUrl: newDocumentUrl }, currentBundleId);
            setNewDocumentName('');
            setNewDocumentUrl('');
            setIsAddDocumentModalOpen(false);
        }
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
                    onClick={() => setIsModalOpen(true)}
                    className={styles.addNewButton}
                    type="button"
                    aria-label="Add new bundle"
                >
                    Add Bundle
                </button>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Add New Bundle</h2>
                        <form onSubmit={handleSubmit} className={styles.createBundleForm}>
                            <input
                                type="text"
                                value={newBundleName}
                                onChange={(e) => setNewBundleName(e.target.value)}
                                placeholder="Bundle Name"
                                className={styles.inputField}
                                required
                            />
                            <input
                                type="text"
                                value={newBundleDescription}
                                onChange={(e) => setNewBundleDescription(e.target.value)}
                                placeholder="Bundle Description"
                                className={styles.inputField}
                            />
                            <select
                                multiple
                                value={selectedDocumentIds}
                                onChange={(e) => setSelectedDocumentIds(Array.from(e.target.selectedOptions, option => option.value))}
                                className={styles.inputField}
                            >
                                {documents.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.name}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.modalButtons}>
                                <button type="submit" className={styles.submitButton}>Add Bundle</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAddDocumentModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Add Document to Bundle</h2>
                        <h3>Choose Existing Document</h3>
                        <ul className={styles.documentList}>
                            {documents.map((doc) => (
                                <li key={doc.id} className={styles.documentItem}>
                                    <button
                                        type="button"
                                        onClick={() => handleAddExistingDocument(doc.id)}
                                        className={styles.documentButton}
                                    >
                                        {doc.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <h3>Or Create New Document</h3>
                        <form onSubmit={handleCreateDocumentAndAddToBundle} className={styles.createDocumentForm}>
                            <input
                                type="text"
                                value={newDocumentName}
                                onChange={(e) => setNewDocumentName(e.target.value)}
                                placeholder="Document Name"
                                className={styles.inputField}
                                required
                            />
                            <input
                                type="url"
                                value={newDocumentUrl}
                                onChange={(e) => setNewDocumentUrl(e.target.value)}
                                placeholder="Document URL"
                                className={styles.inputField}
                                required
                            />
                            <div className={styles.modalButtons}>
                                <button type="submit" className={styles.submitButton}>Create and Add</button>
                                <button type="button" onClick={() => setIsAddDocumentModalOpen(false)} className={styles.cancelButton}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isExpanded && <ul className={styles.bundleList}>
                {bundlesWithDocuments.map((bundle) => (
                    <li key={bundle.id} className={styles.bundleItem}>
                        <div className={styles.bundleContent}>
                            <input
                                type="text"
                                defaultValue={bundle.name}
                                ref={(el) => {
                                    if (el) {
                                        nameRefs.current[bundle.id] = el;
                                    }
                                }}
                                onChange={() => handleBundleChange(bundle.id)}
                                placeholder="Bundle name"
                                className={`${styles.input} ${styles.bundleName}`}
                            />
                            <input
                                type="text"
                                defaultValue={bundle.description}
                                ref={(el) => {
                                    if (el) {
                                        descriptionRefs.current[bundle.id] = el;
                                    }
                                }}
                                onChange={() => handleBundleChange(bundle.id)}
                                placeholder="Bundle description"
                                className={`${styles.input} ${styles.bundleDescription}`}
                            />
                            <div className={styles.linkedDocumentsHeader}>
                                <span>Linked documents:</span>
                                <button
                                    onClick={() => handleAddDocumentToBundle(bundle.id)}
                                    className={styles.addDocumentToBundleButton}
                                    type="button"
                                    aria-label="Add new document to bundle"
                                >
                                    +
                                </button>
                            </div>
                            <ul className={styles.documentList}>
                                {bundle.documents && bundle.documents.length > 0 && (
                                    bundle.documents.map((doc) => (
                                        doc ? (
                                            <li key={doc.id} className={`${styles.documentButton} ${selectedDocument && selectedDocument.id === doc.id ? styles.selectedDocument : ''}`} onClick={() => toggleDocument(doc)}>
                                                {doc.name}
                                                <button
                                                    type="button"
                                                    onClick={() => unlinkDocumentFromBundle(bundle.id, doc.id)}
                                                    className={styles.unlinkButton}
                                                >
                                                    Unlink
                                                </button>
                                                <a
                                                    href={doc.sourceUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={styles.documentLink}
                                                    aria-label={`Open ${doc.name} in new tab`}
                                                >
                                                    <span className={styles.srOnly}>Open in new tab</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ) : null
                                    ))
                                )}
                            </ul>
                            <button
                                type="button"
                                onClick={() => deleteBundle(bundle.id)}
                                className={styles.deleteButton}
                            >
                                Delete Bundle
                            </button>
                        </div>
                    </li>
                ))}
            </ul>}
        </div>
    );
}