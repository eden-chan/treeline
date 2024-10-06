// DocumentList.tsx
import { useState } from 'react';
import type { Document } from './utils/dbUtils';
import styles from './DocumentList.module.css';

type Props = {
    documents: Document[];
    toggleDocument: (doc: Document) => void;
    onAddNew: () => void;
    selectedDocument?: Document;
}

export const DocumentList: React.FC<Props> = ({ documents, toggleDocument, onAddNew, selectedDocument }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.documentListContainer}>
            <div className={styles.documentListHeader}>
                <button
                    onClick={toggleExpand}
                    className={styles.toggleButton}
                    type="button"
                    aria-label={isExpanded ? "Collapse document list" : "Expand document list"}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>
                <h3>
                    Documents
                    {selectedDocument && (
                        <span className={styles.selectedDocumentName}>
                            : {selectedDocument.name.length > 20 ? `${selectedDocument.name.slice(0, 20)}...` : selectedDocument.name}
                        </span>
                    )}
                </h3>
            </div>
            {isExpanded && (
                <ul className={styles.documentList}>
                    {documents.map((doc: Document) => (
                        <li key={doc.id} className={styles.documentItem}>
                            <div
                                onClick={() => toggleDocument(doc)}
                                className={`${styles.documentButton} ${selectedDocument && selectedDocument.id === doc.id ? styles.selectedDocument : ''}`}
                            >
                                {doc.name.length > 20 ? `${doc.name.slice(0, 20)}...` : doc.name}
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
                            </div>
                        </li>
                    ))}
                    <li className={styles.documentItem}>
                        <button
                            onClick={onAddNew}
                            className={styles.addNewButton}
                            type="button"
                        >
                            Add new document
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
};