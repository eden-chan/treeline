import { useState } from 'react';
import { Modal } from '../Modal';
import type { Document } from '../utils/dbUtils';
import styles from './BundleSection.module.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onAddExistingDocument: (documentId: string) => void;
    onCreateDocument: (name: string, url: string) => void;
    documents: Document[];
};

export function AddDocumentToBundleModal({ isOpen, onClose, onAddExistingDocument, onCreateDocument, documents }: Props) {
    const [newDocumentName, setNewDocumentName] = useState('');
    const [newDocumentUrl, setNewDocumentUrl] = useState('');

    const handleCreateDocument = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDocumentName && newDocumentUrl) {
            onCreateDocument(newDocumentName, newDocumentUrl);
            setNewDocumentName('');
            setNewDocumentUrl('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Document to Bundle">
            <h3>Choose Existing Document</h3>
            <ul className={styles.documentList}>
                {documents.map((doc) => (
                    <li key={doc.id} className={styles.documentItem}>
                        <button
                            type="button"
                            onClick={() => onAddExistingDocument(doc.id)}
                            className={styles.documentButton}
                        >
                            {doc.name}
                        </button>
                    </li>
                ))}
            </ul>
            <h3>Or Create New Document</h3>
            <form onSubmit={handleCreateDocument} className={styles.createDocumentForm}>
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
                    <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
}