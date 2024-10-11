import ReactDOM from 'react-dom';
import styles from './BundleSection.module.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onEditName: () => void;
    onEditDescription: () => void;
    onAddDocument: () => void;
    onDeleteBundle: () => void;
    position: { top: number; left: number };
};

export function BundleSettingsMenu({ isOpen, onClose, onEditName, onEditDescription, onAddDocument, onDeleteBundle, position }: Props) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className={styles.settingsMenuOverlay}
            onClick={onClose}
        >
            <div
                className={styles.settingsMenu}
                style={{ top: `${position.top}px`, left: `${position.left}px` }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onEditName} className={styles.settingsMenuItem} type="button">
                    Edit Name
                </button>
                <button onClick={onEditDescription} className={styles.settingsMenuItem} type="button">
                    Edit Description
                </button>
                <button onClick={onAddDocument} className={styles.settingsMenuItem} type="button">
                    Add Document
                </button>
                <button onClick={onDeleteBundle} className={styles.settingsMenuItem} type="button">
                    Delete Bundle
                </button>
            </div>
        </div>,
        document.body
    );
}


type DocumentSettingsMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    position: { top: number; left: number };
};

export function DocumentSettingsMenu({ isOpen, onClose, position }: DocumentSettingsMenuProps) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className={styles.settingsMenuOverlay}
            onClick={onClose}
        >
            <div
                className={styles.settingsMenu}
                style={{ top: `${position.top}px`, left: `${position.left}px` }}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={() => { }} className={styles.settingsMenuItem} type="button">
                    Edit Name
                </button>
                {/* <button onClick={onEditDescription} className={styles.settingsMenuItem} type="button">
                    Edit Description
                </button>
                <button onClick={onAddDocument} className={styles.settingsMenuItem} type="button">
                    Add Document
                </button>
                <button onClick={onDeleteBundle} className={styles.settingsMenuItem} type="button">
                    Delete Bundle
                </button> */}
            </div>
        </div>,
        document.body
    );
}





