// HighlightsList.tsx
import { useState } from 'react';
import type { HighlightResponseTypeWithComments } from './utils/dbUtils';
import type { HighlightType } from './utils/highlightTypes';
import styles from './HighlightsList.module.css';
import { HighlightLegend } from './HighlightLegend';

type Props = {
    highlights: HighlightResponseTypeWithComments[] | undefined;
    selectedHighlightTypes: HighlightType[];
    handleFilterChange: (type: HighlightType) => void;
}

const updateHash = (highlight: HighlightResponseTypeWithComments) => {
    document.location.hash = `highlight-${highlight.id}`;
    const element = document.getElementById(`highlight-${highlight.id}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

export const HighlightsList: React.FC<Props> = ({ highlights, selectedHighlightTypes, handleFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHighlights = highlights?.filter(highlight =>
        highlight.content.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        highlight.comments?.some(comment => comment.text.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className={styles.highlightsListContainer}>
            <div className={styles.highlightsHeader}>
                <HighlightLegend
                    selectedHighlightTypes={selectedHighlightTypes}
                    handleFilterChange={handleFilterChange}
                />
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search for annotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <ul className={styles.highlightsList}>
                {filteredHighlights?.map((highlight) => (
                    <li
                        key={highlight.id}
                        className={styles.highlightItem}
                        onClick={() => updateHash(highlight)}
                    >
                        <div>
                            {highlight.content.text && (
                                <blockquote className={styles.highlightQuote}>
                                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                                </blockquote>
                            )}
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
                        </div>
                        <div className={styles.highlightInfo}>
                            Author: {highlight.userName} | Page: {highlight.position.pageNumber}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};