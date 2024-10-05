import styles from './HighlightsView.module.css';
import { HighlightLegend } from './HighlightLegend';
import { HighlightsList } from './HighlightsList';
import type { HighlightType } from './utils/highlightTypes';
import type { HighlightResponseTypeWithComments } from './utils/dbUtils';

type Props = {
    highlights: HighlightResponseTypeWithComments[];
    selectedHighlightTypes: HighlightType[];
    setSelectedHighlightTypes: React.Dispatch<React.SetStateAction<HighlightType[]>>;
    resetHighlights: () => void;
}

export function HighlightsView({
    highlights,
    selectedHighlightTypes,
    setSelectedHighlightTypes,
    resetHighlights,
}: Props) {

    const handleFilterChange = (type: HighlightType) => {
        setSelectedHighlightTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    return (
        <div className={styles.highlightsView}>
            <HighlightLegend
                selectedHighlightTypes={selectedHighlightTypes}
                handleFilterChange={handleFilterChange}
            />
            <HighlightsList highlights={highlights} />
            {highlights && highlights.length > 0 && (
                <button type="button" className={styles.resetButton} onClick={resetHighlights}>
                    Reset highlights
                </button>
            )}
        </div>
    );
}