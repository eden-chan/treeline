import React from 'react';
import { deleteHighlight, type HighlightResponseTypeWithComments } from './utils/dbUtils';
import styles from './HighlightItem.module.css';

interface HighlightItemProps {
    highlight: HighlightResponseTypeWithComments;

    updateHash: (highlight: HighlightResponseTypeWithComments) => void;
}

export const HighlightItem: React.FC<HighlightItemProps> = ({ highlight, updateHash }) => {
    return (
        <li className={styles.highlightItem}>
            <div className={styles.highlightHeader}>
                <span onClick={() => updateHash(highlight)} className={styles.highlightContent}>
                    {highlight.content.text && (
                        <blockquote className={styles.highlightQuote}>
                            {`${highlight.content.text.slice(0, 90).trim()}…`}
                        </blockquote>
                    )}
                </span>
                <button
                    onClick={() => deleteHighlight(highlight.id)}
                    className={styles.deleteButton}
                    aria-label="Delete highlight"
                >
                    ×
                </button>
            </div>
            {highlight.content.image && (
                <div className={styles.highlightImage}>
                    <img src={highlight.content.image} alt="Screenshot" />
                </div>
            )}
            <div>
                {highlight.comments?.map((comment) => (
                    <div key={comment.id}>{comment.text}</div>
                ))}
            </div>
            <div className={styles.highlightInfo}>
                Author: {highlight.userName} | Page: {highlight.position.pageNumber}
            </div>
        </li>
    );
};
