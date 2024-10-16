// HighlightsList.tsx
import { useState, useMemo } from "react";
import type { HighlightResponseTypeWithComments } from "./utils/dbUtils";
import { HighlightType } from "./utils/highlightTypes";
import styles from "./HighlightsList.module.css";
import { HighlightItem } from "./HighlightItem";
import { useToast } from "./context/ToastContext";

type Props = {
  highlights: HighlightResponseTypeWithComments[] | undefined;
  selectedHighlightTypes: HighlightType[];
  handleFilterChange: (type: HighlightType) => void;
};

const updateHash = (highlight: HighlightResponseTypeWithComments) => {
  document.location.hash = `highlight-${highlight.id}`;
  const element = document.getElementById(`highlight-${highlight.id}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const HighlightsList: React.FC<Props> = ({
  highlights,
  selectedHighlightTypes,
  handleFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { addToast } = useToast();

  const highlightCounts = useMemo(() => {
    const counts = {
      [HighlightType.CURRENT_USER]: 0,
      [HighlightType.OTHER_REGISTERED_USER]: 0,
      [HighlightType.ANONYMOUS_USER]: 0,
    };

    for (const highlight of highlights ?? []) {
      if (highlight.userId === "current_user_id") {
        counts[HighlightType.CURRENT_USER]++;
      } else if (highlight.userId === "anonymous") {
        counts[HighlightType.ANONYMOUS_USER]++;
      } else {
        counts[HighlightType.OTHER_REGISTERED_USER]++;
      }
    }

    return counts;
  }, [highlights]);

  const filteredHighlights = highlights?.filter(
    (highlight) =>
      highlight.content.text
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      highlight.comments?.some((comment) =>
        comment.text.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const copyToClipboard = () => {
    if (filteredHighlights) {
      navigator.clipboard
        .writeText(
          filteredHighlights
            .map((highlight) => highlight.content.text)
            .join("\n"),
        )
        .then(() => {
          addToast({
            message: "Copied to clipboard",
            type: "success",
            duration: 2000,
          });
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          addToast({
            message: "Failed to copy to clipboard",
            type: "error",
            duration: 2000,
          });
        });
    }
  };

  return (
    <div className={styles.highlightsListContainer}>
      <div className={styles.highlightsHeader}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Search for annotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={styles.filterButton}
            aria-label="Filter highlights"
            type="button"
          >
            🔽
          </button>
          <button
            onClick={copyToClipboard}
            className={styles.copyButton}
            aria-label="Copy highlights"
            type="button"
          >
            📋
          </button>
        </div>
        {isFilterOpen && (
          <div className={styles.filterDropdown}>
            {Object.values(HighlightType).map((type) => (
              <label key={type} className={styles.filterItem}>
                <input
                  type="checkbox"
                  checked={selectedHighlightTypes.includes(type)}
                  onChange={() => handleFilterChange(type)}
                />
                {type.replace(/([A-Z])/g, " $1").trim()} (
                {highlightCounts[type]})
              </label>
            ))}
          </div>
        )}
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
