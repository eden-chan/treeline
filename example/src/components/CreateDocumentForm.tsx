import React, { useState } from "react";
import styles from "./CreateDocumentModal.module.css";
import FileDropzone from "./FileDropzone";
import { FileList } from "./FileList";
import type { CreateDocumentDraft } from "../react-pdf-highlighter";

interface CreateDocumentFormProps {
  onSubmit: (files: File[], resourceLinks: CreateDocumentDraft[]) => void;
}

export const CreateDocumentForm: React.FC<CreateDocumentFormProps> = ({
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [resourceLinks, setResourceLinks] = useState<CreateDocumentDraft[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(files, resourceLinks);
    setName("");
    setUrlInput("");
    setFiles([]);
    setResourceLinks([]);
  };

  const addLocalFileToBatch = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const uniqueNewFiles = newFiles.filter(
        (newFile) =>
          !prevFiles.some(
            (prevFile) =>
              prevFile.name === newFile.name && prevFile.size === newFile.size,
          ),
      );
      return [...prevFiles, ...uniqueNewFiles];
    });
  };

  const addUrlToBatch = () => {
    if (urlInput) {
      setResourceLinks([...resourceLinks, { name, sourceUrl: urlInput }]);
      setUrlInput("");
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.createDocumentForm}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Document Name"
        className={styles.inputField}
      />
      <div className={styles.urlInputContainer}>
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter URL"
          className={styles.inputField}
        />
        <button
          type="button"
          onClick={addUrlToBatch}
          className={styles.addUrlButton}
        >
          Add URL
        </button>
      </div>
      <FileDropzone onFilesAdded={addLocalFileToBatch} setFiles={setFiles} />

      {(files.length > 0 || resourceLinks.length > 0) && (
        <div className={styles.fileListContainer}>
          <h3 className={styles.fileListTitle}>Selected Files:</h3>
          <FileList
            localFiles={files}
            resourceLinks={resourceLinks}
            setLocalFiles={setFiles}
            setResourceLinks={setResourceLinks}
          />
        </div>
      )}

      <button type="submit" className={styles.submitButton}>
        Upload
      </button>
    </form>
  );
};
