import ReactDOM from "react-dom";
import styles from "./BundleSection.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: () => void;
  onDeleteBundle: () => void;
  position: { top: number; left: number };
};

export function BundleSettingsMenu({
  isOpen,
  onClose,
  onAddDocument,
  onDeleteBundle,
  position,
}: Props) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.settingsMenuOverlay} onClick={onClose}>
      <div
        className={styles.settingsMenu}
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onAddDocument}
          className={styles.settingsMenuItem}
          type="button"
        >
          Add Document
        </button>
        <button
          onClick={onDeleteBundle}
          className={styles.settingsMenuItem}
          type="button"
        >
          Delete Bundle
        </button>
      </div>
    </div>,
    document.body,
  );
}
