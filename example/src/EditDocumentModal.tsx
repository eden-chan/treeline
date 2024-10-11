import { useState } from 'react';
import styles from './EditDocumentModal.module.css';
import type { Document } from './utils/dbUtils';
import { Modal } from './Modal';

interface Props {
    document: Document;
    onClose: () => void;
    onSave: (updatedDoc: Partial<Document>) => void;
    isOpen: boolean;
}

export const EditDocumentModal: React.FC<Props> = ({ document, onClose, onSave, isOpen }) => {
    const [name, setName] = useState(document.name);
    const [sourceUrl, setSourceUrl] = useState(document.sourceUrl);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave({ name, sourceUrl });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Document">
            <form onSubmit={handleSubmit} className={styles.editDocumentForm}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Document Name"
                    className={styles.inputField}
                />
                <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="PDF URL"
                    className={styles.inputField}
                />
                <div className={styles.modalButtons}>
                    <button type="submit" className={styles.submitButton}>Save Changes</button>
                    <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};