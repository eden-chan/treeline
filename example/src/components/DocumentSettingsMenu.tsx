import React from 'react';
import styles from './DocumentSettingsMenu.module.css';
import { Document } from '../utils/dbUtils';

interface Props {
    document: Document;
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: () => void;
    onRemove: () => void;
}

export const DocumentSettingsMenu: React.FC<Props> = ({ document, position, onClose, onEdit, onRemove }) => {
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove();
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.menu} style={{ top: `${position.top}px`, left: `${position.left}px` }}>
                <button className={styles.menuItem} onClick={handleEdit} type="button">Edit</button>
                <button className={styles.menuItem} onClick={handleRemove} type="button">Remove</button>
            </div>
        </>
    );
};
