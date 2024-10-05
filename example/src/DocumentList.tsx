// DocumentList.tsx
import type { Document } from './utils/dbUtils';
import styles from './DocumentList.module.css';

type Props = {
    documents: Document[];
    toggleDocument: (doc: Document) => void;
    onAddNew: () => void;
}

export const DocumentList: React.FC<Props> = ({ documents, toggleDocument, onAddNew }) => (
    <div>
        <div className={styles.documentListHeader}>
            <h3>Documents</h3>
            <button onClick={onAddNew} className={styles.addButton} type="button">+</button>
        </div>
        <ul className={styles.documentList}>
            {documents.map((doc: Document) => (
                <li key={doc.id} className={styles.documentItem}>
                    <div
                        onClick={() => toggleDocument(doc)}
                        className={styles.documentButton}
                    >
                        {doc.name.length > 20 ? `${doc.name.slice(0, 20)}...` : doc.name}
                    </div>
                    <a
                        href={doc.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.documentLink}
                        aria-label={`Open ${doc.name} in new tab`}
                    >
                        <title>Open in new tab</title>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </li>
            ))}
        </ul>
    </div>
);