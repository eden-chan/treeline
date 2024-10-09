import { useRef, useCallback } from 'react';
import { deleteBundle, unlinkDocumentFromBundle, updateBundle, type BundleWithDocuments } from '../utils/dbUtils';

// @ts-ignore
import debounce from '../utils/debounce';
import styles from './BundleList.module.css';

type Props = {
    bundlesWithDocuments: BundleWithDocuments[];
};

const DEBOUNCE_TIME = 1000; // ms
export function BundleList({ bundlesWithDocuments }: Props) {
    const nameRefs = useRef<{ [key: string]: HTMLInputElement }>({});
    const descriptionRefs = useRef<{ [key: string]: HTMLInputElement }>({});

    const debouncedUpdateBundle = useCallback(
        debounce((bundleId: string, name: string, description: string) => {
            console.log("debounced Updating bundle", bundleId, { name, description });
            updateBundle(bundleId, { name, description });
        }, DEBOUNCE_TIME),
        []
    );

    const handleBundleChange = (bundleId: string) => {
        const name = nameRefs.current[bundleId]?.value ?? '';
        const description = descriptionRefs.current[bundleId]?.value ?? '';
        debouncedUpdateBundle(bundleId, name, description);
    };

    return (
        <div className={styles.bundleListContainer}>
            <div className={styles.bundleListHeader}>
                <h3>Bundles</h3>
            </div>
            <ul className={styles.bundleList}>
                {bundlesWithDocuments.map((bundle) => (
                    <li key={bundle.id} className={styles.bundleItem}>
                        <div className={styles.bundleContent}>
                            <input
                                type="text"
                                defaultValue={bundle.name}
                                ref={(el) => {
                                    if (el) {
                                        nameRefs.current[bundle.id] = el;
                                    }
                                }}
                                onChange={() => handleBundleChange(bundle.id)}
                                placeholder="Bundle name"
                                className={`${styles.input} ${styles.bundleName}`}
                            />
                            <input
                                type="text"
                                defaultValue={bundle.description}
                                ref={(el) => {
                                    if (el) {
                                        descriptionRefs.current[bundle.id] = el;
                                    }
                                }}
                                onChange={() => handleBundleChange(bundle.id)}
                                placeholder="Bundle description"
                                className={`${styles.input} ${styles.bundleDescription}`}
                            />
                            {bundle.documents && bundle.documents.length > 0 && (
                                <div>
                                    <span>Linked documents:</span>
                                    <ul className={styles.documentList}>
                                        {bundle.documents.map((doc) => (
                                            doc ? (
                                                <li key={doc.id} className={styles.documentItem}>
                                                    {doc.name}
                                                    <button
                                                        type="button"
                                                        onClick={() => unlinkDocumentFromBundle(bundle.id, doc.id)}
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
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => deleteBundle(bundle.id)}
                                className={styles.deleteButton}
                            >
                                Delete Bundle
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}