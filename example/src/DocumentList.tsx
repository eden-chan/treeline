// DocumentList.tsx
import { useState } from 'react';
import { editDocument, removeDocument, type Document } from './utils/dbUtils';
import styles from './DocumentList.module.css';
import { Trash2, Edit } from 'lucide-react';
import { EditDocumentModal } from './EditDocumentModal';

type Props = {
    documents: Document[];
    toggleDocument: (doc: Document) => void;
    onAddNew: () => void;
    selectedDocument?: Document;

}

export const DocumentList: React.FC<Props> = ({ documents, toggleDocument, onAddNew, selectedDocument }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const openEditModal = (doc: Document) => {
        setEditingDocument(doc);
    };



    const closeEditModal = () => {
        setEditingDocument(null);
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
                                {doc?.name?.length > 20 ? `${doc.name.slice(0, 20)}...` : doc?.name}
                                <div className={styles.documentActions}>
                                    <a
                                        href={doc?.sourceUrl}
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
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(doc);
                                        }}
                                        className={styles.editButton}
                                        aria-label={`Edit ${doc.name}`}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeDocument(doc.id);
                                        }}
                                        className={styles.removeButton}
                                        aria-label={`Remove ${doc.name}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
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
            {editingDocument && (
                <EditDocumentModal
                    isOpen={true}
                    document={editingDocument}
                    onClose={closeEditModal}
                    onSave={(updatedDoc) => {
                        editDocument(editingDocument.id, updatedDoc);
                        closeEditModal();
                    }}
                />
            )}
        </div>
    );
};