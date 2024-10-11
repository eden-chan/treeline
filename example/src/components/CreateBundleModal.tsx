import { useState } from 'react';
import { Modal } from '../Modal';
import type { Document } from '../utils/dbUtils';
import styles from './BundleSection.module.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, description: string, documentIds: string[]) => void;
    documents: Document[];
};

export function CreateBundleModal({ isOpen, onClose, onSubmit, documents }: Props) {
    const [newBundleName, setNewBundleName] = useState('');
    const [newBundleDescription, setNewBundleDescription] = useState('');
    const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBundleName.trim()) {
            onSubmit(newBundleName.trim(), newBundleDescription.trim(), selectedDocumentIds);
            setNewBundleName('');
            setNewBundleDescription('');
            setSelectedDocumentIds([]);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Bundle">
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
                    <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
}