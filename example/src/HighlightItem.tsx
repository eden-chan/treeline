import {
  deleteComment,
  deleteHighlight,
  updateComment,
  type HighlightResponseTypeWithComments,
} from "./utils/dbUtils";
import styles from "./HighlightItem.module.css";
import { useToast } from "./context/ToastContext";
import { Editor } from "./editor/Editor";
import { $getRoot, type EditorState } from "lexical";
import { useCallback } from "react";
// @ts-ignore
import debounce, { DEBOUNCE_TIME } from "./utils/debounce";
import { TrashIcon } from "./components/Icons";

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

  const handleDeleteHighlight = async () => {
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

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      addToast({
        message: "Comment deleted successfully",
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      addToast({
        message: "Failed to delete comment",
        type: "error",
        duration: 2000,
      });
    }
  };

  const debouncedUpdateComment = useCallback(
    debounce((commentId: string, text: string) => {
      updateComment(commentId, text);
    }, DEBOUNCE_TIME),
    [],
  );

  const handleEdit = (editorState: EditorState, commentId: string) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      debouncedUpdateComment(commentId, textContent);
    });
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
            onClick={handleDeleteHighlight}
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
          <div key={comment.id} className={styles.commentContainer}>
            <div className={styles.editorWrapper}>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className={styles.deleteCommentButton}
                aria-label="Delete comment"
                type="button"
              >
                <TrashIcon className={styles.trashIcon} />
              </button>
              <Editor
                key={comment.id}
                value={comment.text}
                onChange={(editorState) => handleEdit(editorState, comment.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.highlightInfo}>
        Author: {highlight.userName} | Page: {highlight.position.pageNumber}
      </div>
    </li>
  );
};
