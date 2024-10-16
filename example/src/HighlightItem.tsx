import {
  deleteHighlight,
  type HighlightResponseTypeWithComments,
} from "./utils/dbUtils";
import styles from "./HighlightItem.module.css";
import { useToast } from "./context/ToastContext";
import { Editor } from "./editor/Editor";

type Props = {
  highlight: HighlightResponseTypeWithComments;
  updateHash: (highlight: HighlightResponseTypeWithComments) => void;
};

export const HighlightItem: React.FC<Props> = ({ highlight, updateHash }) => {
  const { addToast } = useToast();

  const copyToClipboard = () => {
    if (highlight.content.text) {
      navigator.clipboard
        .writeText(highlight.content.text)
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

  const handleDelete = async () => {
    try {
      await deleteHighlight(highlight.id);
      addToast({
        message: "Highlight deleted successfully",
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to delete highlight:", error);
      addToast({
        message: "Failed to delete highlight",
        type: "error",
        duration: 2000,
      });
    }
  };

  return (
    <li className={styles.highlightItem}>
      <div className={styles.highlightHeader}>
        <span
          onClick={() => updateHash(highlight)}
          className={styles.highlightContent}
        >
          {highlight.content.text && (
            <blockquote className={styles.highlightQuote}>
              {`${highlight.content.text.slice(0, 90).trim()}…`}
            </blockquote>
          )}
        </span>
        <div className={styles.buttonGroup}>
          <button
            onClick={copyToClipboard}
            className={styles.copyButton}
            aria-label="Copy highlight"
            type="button"
          >
            📋
          </button>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            aria-label="Delete highlight"
            type="button"
          >
            ×
          </button>
        </div>
      </div>
      {highlight.content.image && (
        <div className={styles.highlightImage}>
          <img src={highlight.content.image} alt="Screenshot" />
        </div>
      )}
      <div>
        {highlight.comments?.map((comment) => (
          <Editor key={comment.id} value={comment.text} />
        ))}
      </div>
      <div className={styles.highlightInfo}>
        Author: {highlight.userName} | Page: {highlight.position.pageNumber}
      </div>
    </li>
  );
};
