import { useCallback, useState } from "react";
import { $getRoot, type EditorState } from "lexical";

import {
  updateComment,
  type User,
  type Comment,
  ANONYMOUS_USER_ID,
  addCommentToHighlight,
  type CreateCommentDraft,
  deleteHighlight,
} from "../utils/dbUtils";
// @ts-ignore
import debounce, { DEBOUNCE_TIME } from "../utils/debounce";
import { Editor } from "../editor/Editor";
import styles from "./HighlightPopup.module.css";
import { TrashIcon } from "./Icons"; // Import the ArrowDownIcon

type Props = {
  comment: Comment;
  user?: User;
  highlightId: string;
  onClose: () => void; // Add this prop for closing the popup
};

export const HighlightPopup = ({
  comment,
  user,
  highlightId,
  onClose,
}: Props) => {
  const debouncedUpdateComment = useCallback(
    debounce((commentId: string, text: string) => {
      updateComment(commentId, text);
    }, DEBOUNCE_TIME),
    [],
  );

  const [existingCommentId, setCommentId] = useState(comment.id);

  const handleEdit = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      if (existingCommentId) {
        debouncedUpdateComment(existingCommentId, textContent);
      }
    });
  };

  const handleSubmitFirstComment = (editorState: EditorState) => {
    if (comment.text) {
      console.log("[handleSubmitFirstComment] already exists", comment.text);
      debouncedUpdateComment(comment.id, comment.text);
      return;
    }
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();

      if (existingCommentId) {
        console.log(
          "[handleSubmitFirstComment] already exists",
          existingCommentId,
        );
        return;
      }

      const userId = user?.id ?? ANONYMOUS_USER_ID;
      const userName = user?.email ?? ANONYMOUS_USER_ID;

      const commentDraft: CreateCommentDraft = {
        text: textContent,
        emoji: "",
        userId,
        userName,
      };

      const { commentId } = addCommentToHighlight(commentDraft, highlightId);
      setCommentId(commentId);
    });
  };

  const handleDelete = () => {
    deleteHighlight(highlightId);
    onClose(); // Close the popup after deleting
  };

  return (
    <div className={styles.highlightPopupContainer}>
      <button
        onClick={handleDelete}
        className={styles.deleteButton}
        aria-label="Delete highlight"
        type="button"
      >
        <TrashIcon className={styles.trashIcon} />
      </button>
      <Editor
        key={highlightId}
        className={styles.popup}
        value={comment.text ?? ""}
        onEnter={(editorState) => handleSubmitFirstComment(editorState)}
        onChange={(editorState) => handleEdit(editorState)}
      />
    </div>
  );
};
