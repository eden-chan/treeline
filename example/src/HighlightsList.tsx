// HighlightsList.tsx
import { useState } from 'react';
import type { HighlightResponseTypeWithComments } from './utils/dbUtils';
import type { HighlightType } from './utils/highlightTypes';
import styles from './HighlightsList.module.css';
import { HighlightLegend } from './HighlightLegend';
import { HighlightItem } from './HighlightItem';

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
                    <HighlightItem
                        key={highlight.id}
                        highlight={highlight}
                        updateHash={updateHash}
                    />
                ))}
            </ul>
        </div>
    );
};
