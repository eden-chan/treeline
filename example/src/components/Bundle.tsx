import { useState, useRef } from 'react';
import { unlinkDocumentFromBundle, deleteBundle, type Document, type BundleWithDocuments } from '../utils/dbUtils';
import styles from './BundleSection.module.css';
import { BundleSettingsMenu } from './BundleSettingsMenu';
import { Editor } from '../editor/Editor';
import { $getRoot, type EditorState } from 'lexical';

type Props = {
    bundle: BundleWithDocuments;
    selectedDocument?: Document;
    toggleDocument: (doc: Document) => void;
    handleBundleChange: (bundleId: string, name: string, description: string) => void;
    handleAddDocumentToBundle: (bundleId: string) => void;
};

export function Bundle({ bundle, selectedDocument, toggleDocument, handleBundleChange, handleAddDocumentToBundle }: Props) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsPosition, setSettingsPosition] = useState({ top: 0, left: 0 });
    const settingsButtonRef = useRef<HTMLButtonElement>(null);

    const handleNameBlur = (editorState: EditorState) => {
        const name = editorState.read(() => $getRoot().getTextContent());
        handleBundleChange(bundle.id, name, bundle.description);
    };

    const handleDescriptionChange = (editorState: EditorState) => {
        console.log('handleDescriptionChange', editorState.read(() => $getRoot().getTextContent()));
    };

    const handleDescriptionBlur = (editorState: EditorState) => {
        const description = editorState.read(() => $getRoot().getTextContent());
        handleBundleChange(bundle.id, bundle.name, description);
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };


    const toggleSettings = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (settingsButtonRef.current) {
            const rect = settingsButtonRef.current.getBoundingClientRect();
            setSettingsPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
        setIsSettingsOpen(!isSettingsOpen);
    };

    const handleDeleteBundle = () => {
        if (window.confirm('Are you sure you want to delete this bundle?')) {
            deleteBundle(bundle.id);
        }
        setIsSettingsOpen(false);
    };



    const candidateTexts = bundle.documents.map((doc) => doc.name);
    console.log(candidateTexts);

    return (
        <li className={styles.bundleItem}>
            <div className={styles.bundleHeader} onClick={toggleExpand}>
                <button
                    className={styles.toggleButton}
                    type="button"
                    aria-label={isExpanded ? "Collapse bundle" : "Expand bundle"}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>

                <Editor value={bundle.name} onBlur={handleNameBlur} className={styles.bundleName} />
                <button
                    ref={settingsButtonRef}
                    onClick={toggleSettings}
                    className={styles.settingsButton}
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
            {isExpanded && (
                <div className={styles.bundleContent}>
                    <Editor value={bundle.description} onChange={handleDescriptionChange} onBlur={handleDescriptionBlur} className={styles.bundleDescription} />
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
                    {(!bundle.documents || bundle.documents.length === 0) ? (
                        <div className={styles.noDocumentsMessage}>
                            <p>No documents linked to this bundle.</p>
                            <button
                                onClick={() => handleAddDocumentToBundle(bundle.id)}
                                className={styles.addDocumentButton}
                                type="button"
                            >
                                Add a document
                            </button>
                        </div>
                    ) : (
                        <ul className={styles.documentList}>
                            {bundle.documents.map((doc) => (
                                doc ? (
                                    <li key={doc.id} className={`${styles.documentButton} ${selectedDocument && selectedDocument.id === doc.id ? styles.selectedDocument : ''}`} onClick={() => toggleDocument(doc)}>
                                        {doc.name}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                unlinkDocumentFromBundle(bundle.id, doc.id);
                                            }}
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
                                            onClick={(e) => e.stopPropagation()}
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
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <BundleSettingsMenu
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                position={settingsPosition}
                onAddDocument={() => handleAddDocumentToBundle(bundle.id)}
                onDeleteBundle={handleDeleteBundle}
            />
        </li>
    );
}