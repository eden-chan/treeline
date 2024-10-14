import { useState } from "react";
import { Modal } from "../Modal";
import type { Document } from "../utils/dbUtils";
import styles from "./BundleSection.module.css";
import { fetchPDF, uploadLocalFiles } from "./UploadDocumentForm";
import type { CreateDocumentDraft } from "../react-pdf-highlighter";
import FileDropzone from "./FileDropzone";
import { FileList } from "./FileList";
import { useToast } from "../context/ToastContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, documentIds: string[]) => void;
  documents: Document[];
};

export function CreateBundleModal({
  isOpen,
  onClose,
  onSubmit,
  documents,
}: Props) {
  const [newBundleName, setNewBundleName] = useState("");
  const [newBundleDescription, setNewBundleDescription] = useState("");
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const { addToast } = useToast();

  const onSuccess = () => {
    addToast({
      message: `Bundle ${newBundleName} successfully created!`,
      type: "success",
      duration: 2000,
    });
  };

  const onError = (error: string) => {
    addToast({
      message: `Unable to create bundle ${newBundleName} due to error ${error}`,
      type: "error",
      duration: 2000,
    });
  };

  // File Upload Stato
  const [name, setName] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [resourceLinks, setResourceLinks] = useState<CreateDocumentDraft[]>([]);

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

  // get the ids from the state ?
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    const fetchPDFPromises = resourceLinks.map(fetchPDF);
    const uploadFilesPromise = uploadLocalFiles(files);

    let resultingUploadedIds: string[] = [];
    let allIds: string[] = [];
    try {
      const results = await Promise.all([
        ...fetchPDFPromises,
        uploadFilesPromise,
      ]);
      resultingUploadedIds = results
        .flat()
        .filter(Boolean)
        .map((result) => result.documentId);

      console.log(
        "createdBundleModal resultingUploadedIds",
        resultingUploadedIds,
      );
    } catch (error) {
      console.error("Error in upload process:", error);
      onError(`${error}`);
    }

    if (newBundleName.trim()) {
      allIds = [...selectedDocumentIds, ...resultingUploadedIds];
      console.log("createdBundleModal allIds", allIds);

      onSubmit(newBundleName.trim(), newBundleDescription.trim(), allIds);
      setNewBundleName("");
      setNewBundleDescription("");
      setSelectedDocumentIds([]);
    }
    // Reset form state
    setName("");
    setUrlInput("");
    setResourceLinks([]);
    setFiles([]);

    if (allIds.length > 0) {
      onSuccess();
    } else {
      onError("No documents added");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Bundle">
      <form onSubmit={handleSubmit} className={styles.createBundleForm}>
        <input
          type="text"
          value={newBundleName}
          onChange={(e) => setNewBundleName(e.target.value)}
          placeholder="Bundle Name"
          className={styles.inputField}
          required
        />
        <input
          type="text"
          value={newBundleDescription}
          onChange={(e) => setNewBundleDescription(e.target.value)}
          placeholder="Bundle Description"
          className={styles.inputField}
        />
        <div className={styles.checkboxContainer}>
          {documents.map((doc) => (
            <label key={doc.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={doc.id}
                checked={selectedDocumentIds.includes(doc.id)}
                onChange={(e) => {
                  const docId = e.target.value;
                  setSelectedDocumentIds((prev) =>
                    e.target.checked
                      ? [...prev, docId]
                      : prev.filter((id) => id !== docId),
                  );
                }}
                className={styles.checkboxInput}
              />
              {doc.name}
            </label>
          ))}
        </div>

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

        <div className={styles.modalButtons}>
          <button type="submit" className={styles.submitButton}>
            Add Bundle
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
