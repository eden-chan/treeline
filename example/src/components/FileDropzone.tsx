import { useState, useRef, useCallback } from 'react';
import { Upload } from 'lucide-react';
import styles from './FileDropzone.module.css';

interface Props {
    onFilesAdded: (files: File[]) => void;
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function FileDropzone({ onFilesAdded, setFiles }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prevFiles => {
                const uniqueNewFiles = newFiles.filter(newFile =>
                    !prevFiles.some(prevFile => prevFile.name === newFile.name && prevFile.size === newFile.size)
                );
                return [...prevFiles, ...uniqueNewFiles];
            });
            onFilesAdded(newFiles);
            e.dataTransfer.clearData();
        }
    }, [onFilesAdded, setFiles]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        setFiles(prevFiles => {
            const uniqueNewFiles = newFiles.filter(newFile =>
                !prevFiles.some(prevFile => prevFile.name === newFile.name && prevFile.size === newFile.size)
            );
            return [...prevFiles, ...uniqueNewFiles];
        });
        onFilesAdded(newFiles);
    }, [onFilesAdded, setFiles]);

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={styles.container}>
            <div
                className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={fileInputRef}
                    className={styles.fileInput}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                />
                <div className={styles.dropzoneContent}>
                    <Upload size={48} className={styles.uploadIcon} />
                    <p className={styles.dropzoneText}>
                        <span className={styles.highlight}>Drop files here</span> or <span className={styles.highlight}>click to select</span>
                    </p>
                    <p className={styles.supportedFiles}>Supports any file type</p>
                </div>
            </div>
        </div>
    );
}


