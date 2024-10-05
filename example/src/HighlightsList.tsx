// HighlightsList.tsx
import type { HighlightResponseTypeWithComments } from './utils/dbUtils';
import styles from './HighlightsList.module.css';

type HighlightsListProps = {
    highlights: HighlightResponseTypeWithComments[] | undefined;
}

const updateHash = (highlight: HighlightResponseTypeWithComments) => {
    document.location.hash = `highlight-${highlight.id}`;
    const element = document.getElementById(`highlight-${highlight.id}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

export const HighlightsList: React.FC<HighlightsListProps> = ({ highlights }) => (
    <ul className={styles.highlightsList}>
        {highlights?.map((highlight) => (
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
);