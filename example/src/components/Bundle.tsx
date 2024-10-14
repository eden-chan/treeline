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
    const descriptionRef = useRef<string>(bundle.description);


    const onRenderMarkdown = (markdown: string) => {
        descriptionRef.current = markdown;
        console.log('%c preserved markdown onRenderMarkdown', 'color: blue', markdown);
        console.log('%c SAVE descriptionRef.current', 'color: red', descriptionRef.current);
    };

    // useEffect(() => {
    //     descriptionRef.current = bundle.description;
    //     console.log('%c SAVE descriptionRef.current', 'color: red', descriptionRef.current);
    // }, [bundle.description]);

    const handleDescriptionChange = (editorState: EditorState, isEditable: boolean = false) => {

        if (!isEditable) {
            console.log('%c not editable', 'color: red');
            return;
        }
        // Todo preserve markdown state on save from 
        const textContent = editorState.read(() => $getRoot().getTextContent());
        // const markdown = editorState.read(() => $convertToMarkdownString(CUSTOM_TRANSFORMERS, $getRoot(), true));

        // console.log('%chandleDescriptionChange root textContent', 'color: red', textContent);
        // console.log('description', description);


        handleBundleChange(bundle.id, bundle.name, textContent);
        // descriptionRef.current = markdown;
    };

    const handleNameChange = (editorState: EditorState) => {
        // const name = editorState.read(() => $convertToMarkdownString(CUSTOM_TRANSFORMERS, $getRoot(), true));
        const name = editorState.read(() => $getRoot().getTextContent());
        handleBundleChange(bundle.id, name, bundle.description);
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

                <Editor value={bundle.name} onChange={handleNameChange} className={styles.bundleName} />
                <button
                    ref={settingsButtonRef}
                    onClick={toggleSettings}
                    className={styles.settingsButton}
                    type="button"
                    aria-label="Bundle settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <title>Settings</title>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0 .33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>
            </div>
            {isExpanded && (
                <div className={styles.bundleContent}>
                    <Editor isEditable={false} value={descriptionRef.current} onRenderMarkdown={onRenderMarkdown} onChange={handleDescriptionChange} className={styles.bundleDescription} />
                    <div className={styles.linkedDocumentsHeader}>
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
                                    <li key={doc.id} className={styles.documentItem}>
                                        <button
                                            className={`${styles.documentButton} ${selectedDocument && selectedDocument.id === doc.id ? styles.selectedDocument : ''}`}
                                            onClick={() => toggleDocument(doc)}
                                        >
                                            {doc.name}
                                        </button>
                                        <div className={styles.documentActions}>
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
                                        </div>
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
