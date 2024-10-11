import styles from './FileList.module.css';
import type { CreateDocumentDraft } from '../react-pdf-highlighter';

interface Props {
    localFiles: File[];
    resourceLinks: CreateDocumentDraft[];
    setLocalFiles: (files: File[]) => void;
    setResourceLinks: (links: CreateDocumentDraft[]) => void;

}

export const FileList: React.FC<Props> = ({ localFiles, resourceLinks, setLocalFiles, setResourceLinks }) => {
    return (
        <ul className={styles.fileList}>
            {localFiles.map((file, index) => (
                <li key={file.name} className={styles.fileItem}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>({(file.size / 1024).toFixed(2)} KB)</span>
                    <button type="button" onClick={() => setLocalFiles(localFiles.filter((_, i) => i !== index))} className={styles.removeButton}>Remove</button>
                </li>
            ))}
            {resourceLinks.map((link, index) => (
                <li key={link.name} className={styles.fileItem}>
                    <span className={styles.fileName}>{link.name}</span>
                    <span className={styles.fileUrl}>{link.sourceUrl}</span>
                    <button type="button" onClick={() => setResourceLinks(resourceLinks.filter((_, i) => i !== index))} className={styles.removeButton}>Remove</button>
                </li>
            ))}
        </ul>
    );
};
