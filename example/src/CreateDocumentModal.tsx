// CreateDocumentModal.tsx
import { useState } from 'react';
import styles from './CreateDocumentModal.module.css';
import { addDocument } from './utils/dbUtils';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && sourceUrl) {
      addDocument({ name, sourceUrl });
      setName('');
      setSourceUrl('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Add New Source</h2>
        <form onSubmit={handleSubmit} className={styles.createDocumentForm}>
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
            <button type="submit" className={styles.submitButton}>Add Document</button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};