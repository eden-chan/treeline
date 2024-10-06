// HighlightLegend.tsx
import { HighlightType } from "./utils/highlightTypes";
import styles from './Sidebar.module.css';

type Props = {
    selectedHighlightTypes: HighlightType[];
    handleFilterChange: (type: HighlightType) => void;
}

export const HighlightLegend: React.FC<Props> = ({ selectedHighlightTypes, handleFilterChange }) => (
    <div className={styles.legend}>
        <h3>Filter highlights by user</h3>
        {Object.values(HighlightType).map(type => (
            <div key={type} className={styles.legendItem}>
                <input
                    type="checkbox"
                    id={`filter-${type}`}
                    checked={selectedHighlightTypes.includes(type)}
                    onChange={() => handleFilterChange(type)}
                />
                <div className={`${styles.legendColor} ${styles[type]}`} />
                <label htmlFor={`filter-${type}`} className={styles.legendText}>
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                </label>
            </div>
        ))}
    </div>
);